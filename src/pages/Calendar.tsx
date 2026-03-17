import { useState, useMemo } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useSubscriptions, type Subscription } from "@/hooks/useSubscriptions";
import { findService } from "@/lib/serviceRegistry";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, CreditCard, CalendarDays } from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
  differenceInDays,
} from "date-fns";

/** Given a subscription, generate all billing dates that fall within [rangeStart, rangeEnd]. */
function billingDatesInRange(sub: Subscription, rangeStart: Date, rangeEnd: Date): Date[] {
  const dates: Date[] = [];
  let cursor = new Date(sub.next_billing_date);

  // Walk backwards to find first occurrence before rangeStart
  const stepMonths = sub.billing_cycle === "yearly" ? 12 : 1;
  while (cursor > rangeStart) {
    cursor = addMonths(cursor, -stepMonths);
  }
  // Now walk forward
  while (cursor <= rangeEnd) {
    if (cursor >= rangeStart) dates.push(new Date(cursor));
    cursor = addMonths(cursor, stepMonths);
  }
  return dates;
}

interface DayEntry {
  subscription: Subscription;
  date: Date;
}

const Calendar = () => {
  const { subscriptions, isLoading } = useSubscriptions();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  // Build a map: dateKey → DayEntry[]
  const dayMap = useMemo(() => {
    const map = new Map<string, DayEntry[]>();
    for (const sub of subscriptions) {
      if (sub.status === "cancelled") continue;
      const dates = billingDatesInRange(sub, calStart, calEnd);
      for (const d of dates) {
        const key = format(d, "yyyy-MM-dd");
        const arr = map.get(key) ?? [];
        arr.push({ subscription: sub, date: d });
        map.set(key, arr);
      }
    }
    return map;
  }, [subscriptions, calStart, calEnd]);

  // Upcoming payments (next 7 days)
  const upcoming = useMemo(() => {
    const today = new Date();
    const entries: DayEntry[] = [];
    for (let i = 0; i <= 7; i++) {
      const d = addDays(today, i);
      const key = format(d, "yyyy-MM-dd");
      const dayEntries = dayMap.get(key);
      if (dayEntries) entries.push(...dayEntries);
    }
    return entries;
  }, [dayMap]);

  const weekTotal = upcoming.reduce((s, e) => s + e.subscription.price, 0);

  // Build calendar grid days
  const calendarDays: Date[] = [];
  let day = calStart;
  while (day <= calEnd) {
    calendarDays.push(day);
    day = addDays(day, 1);
  }

  const selectedEntries = selectedDate ? dayMap.get(format(selectedDate, "yyyy-MM-dd")) ?? [] : [];
  const selectedTotal = selectedEntries.reduce((s, e) => s + e.subscription.price, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Payment Calendar</h1>

        {/* Upcoming Payments Banner */}
        {upcoming.length > 0 && (
          <div className="rounded-xl border border-border bg-card p-5 shadow-card">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-sm font-semibold text-foreground">Upcoming Payments</h2>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                💸 €{weekTotal.toFixed(2)} this week
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              {upcoming.slice(0, 6).map((entry, i) => {
                const service = findService(entry.subscription.name);
                const daysAway = differenceInDays(entry.date, new Date());
                const label = daysAway === 0 ? "Today" : daysAway === 1 ? "Tomorrow" : `In ${daysAway} days`;
                return (
                  <div key={i} className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
                    {service?.logo ? (
                      <img src={service.logo} alt="" className="h-6 w-6 rounded" />
                    ) : (
                      <CreditCard className="h-5 w-5 text-muted-foreground" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-foreground">{entry.subscription.name}</p>
                      <p className="text-xs text-muted-foreground">
                        €{entry.subscription.price.toFixed(2)} · {label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Month Navigation */}
        <div className="flex items-center justify-between">
          <Button variant="outline" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="font-display text-lg font-semibold text-foreground">
            {format(currentMonth, "MMMM yyyy")}
          </h2>
          <Button variant="outline" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Calendar Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
            {/* Day headers */}
            <div className="grid grid-cols-7 border-b border-border">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                <div key={d} className="py-2 text-center text-xs font-medium text-muted-foreground">
                  {d}
                </div>
              ))}
            </div>
            {/* Day cells */}
            <div className="grid grid-cols-7">
              {calendarDays.map((date, idx) => {
                const key = format(date, "yyyy-MM-dd");
                const entries = dayMap.get(key) ?? [];
                const inMonth = isSameMonth(date, currentMonth);
                const today = isToday(date);
                const total = entries.reduce((s, e) => s + e.subscription.price, 0);
                return (
                  <button
                    key={idx}
                    onClick={() => entries.length > 0 && setSelectedDate(date)}
                    className={`relative flex min-h-[90px] flex-col border-b border-r border-border p-2 text-left transition-colors hover:bg-accent/40 ${
                      !inMonth ? "opacity-40" : ""
                    } ${today ? "bg-accent/20" : ""} ${entries.length > 0 ? "cursor-pointer" : "cursor-default"}`}
                  >
                    <span
                      className={`mb-1 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                        today ? "bg-primary text-primary-foreground" : "text-foreground"
                      }`}
                    >
                      {format(date, "d")}
                    </span>
                    {entries.length > 0 && (
                      <>
                        <div className="flex flex-wrap gap-0.5">
                          {entries.slice(0, 3).map((e, j) => {
                            const svc = findService(e.subscription.name);
                            return svc?.logo ? (
                              <img key={j} src={svc.logo} alt="" className="h-5 w-5 rounded" />
                            ) : (
                              <CreditCard key={j} className="h-4 w-4 text-muted-foreground" />
                            );
                          })}
                          {entries.length > 3 && (
                            <span className="text-[10px] text-muted-foreground">+{entries.length - 3}</span>
                          )}
                        </div>
                        <span className="mt-auto text-[10px] font-semibold text-primary">€{total.toFixed(2)}</span>
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && subscriptions.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-12 text-center">
            <CalendarDays className="mb-3 h-10 w-10 text-muted-foreground" />
            <p className="font-medium text-foreground">No upcoming payments</p>
            <p className="mt-1 text-sm text-muted-foreground">Add your first subscription to see payment dates here.</p>
          </div>
        )}

        {/* Day Detail Modal */}
        <Dialog open={!!selectedDate} onOpenChange={() => setSelectedDate(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-display">
                {selectedDate && format(selectedDate, "MMMM d, yyyy")}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              {selectedEntries.map((entry, i) => {
                const svc = findService(entry.subscription.name);
                return (
                  <div key={i} className="flex items-center justify-between rounded-lg border border-border bg-background p-3">
                    <div className="flex items-center gap-3">
                      {svc?.logo ? (
                        <img src={svc.logo} alt="" className="h-8 w-8 rounded" />
                      ) : (
                        <CreditCard className="h-6 w-6 text-muted-foreground" />
                      )}
                      <span className="font-medium text-foreground">{entry.subscription.name}</span>
                    </div>
                    <span className="font-semibold text-foreground">€{entry.subscription.price.toFixed(2)}</span>
                  </div>
                );
              })}
              {selectedEntries.length > 0 && (
                <div className="flex items-center justify-between border-t border-border pt-3">
                  <span className="text-sm font-medium text-muted-foreground">Total</span>
                  <span className="text-lg font-bold text-primary">€{selectedTotal.toFixed(2)}</span>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Calendar;
