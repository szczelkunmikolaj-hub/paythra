import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useSubscriptions, type Subscription } from "@/hooks/useSubscriptions";
import SubscriptionIcon from "@/components/dashboard/SubscriptionIcon";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { formatCurrency } from "@/lib/currency";
import {
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  addDays, addMonths, subMonths, isSameMonth, isToday, differenceInDays,
} from "date-fns";

function billingDatesInRange(sub: Subscription, rangeStart: Date, rangeEnd: Date): Date[] {
  const dates: Date[] = [];
  let cursor = new Date(sub.next_billing_date);
  const stepMonths = sub.billing_cycle === "yearly" ? 12 : 1;
  while (cursor > rangeStart) cursor = addMonths(cursor, -stepMonths);
  while (cursor <= rangeEnd) {
    if (cursor >= rangeStart) dates.push(new Date(cursor));
    cursor = addMonths(cursor, stepMonths);
  }
  return dates;
}

interface DayEntry { subscription: Subscription; date: Date; }

const Calendar = () => {
  const { subscriptions, isLoading } = useSubscriptions();
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const dayMap = useMemo(() => {
    const map = new Map<string, DayEntry[]>();
    for (const sub of subscriptions) {
      if (sub.status === "cancelled") continue;
      for (const d of billingDatesInRange(sub, calStart, calEnd)) {
        const key = format(d, "yyyy-MM-dd");
        const arr = map.get(key) ?? [];
        arr.push({ subscription: sub, date: d });
        map.set(key, arr);
      }
    }
    return map;
  }, [subscriptions, calStart, calEnd]);

  const upcoming = useMemo(() => {
    const today = new Date();
    const entries: DayEntry[] = [];
    for (let i = 0; i <= 7; i++) {
      const key = format(addDays(today, i), "yyyy-MM-dd");
      const dayEntries = dayMap.get(key);
      if (dayEntries) entries.push(...dayEntries);
    }
    return entries;
  }, [dayMap]);

  const weekTotal = upcoming.reduce((s, e) => s + e.subscription.price, 0);

  const calendarDays: Date[] = [];
  let day = calStart;
  while (day <= calEnd) { calendarDays.push(day); day = addDays(day, 1); }

  const selectedEntries = selectedDate ? dayMap.get(format(selectedDate, "yyyy-MM-dd")) ?? [] : [];
  const selectedTotal = selectedEntries.reduce((s, e) => s + e.subscription.price, 0);

  const weekDays = [t("mon"), t("tue"), t("wed"), t("thu"), t("fri"), t("sat"), t("sun")];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="font-display text-2xl font-bold text-foreground">{t("paymentCalendar")}</h1>

        {upcoming.length > 0 && (
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-sm font-semibold text-foreground">{t("upcomingPayments")}</h2>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                💸 {formatCurrency(weekTotal, lang)} {t("thisWeek")}
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              {upcoming.slice(0, 6).map((entry, i) => {
                const daysAway = differenceInDays(entry.date, new Date());
                const label = daysAway === 0 ? t("today") : daysAway === 1 ? t("tomorrow") : t("inDays", { count: daysAway });
                return (
                  <div key={i} className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2">
                    <SubscriptionIcon name={entry.subscription.name} category={entry.subscription.category} size="sm" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{entry.subscription.name}</p>
                      <p className="text-xs text-muted-foreground">{formatCurrency(entry.subscription.price, lang)} · {label}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <Button variant="outline" size="icon" className="rounded-xl" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="font-display text-lg font-semibold text-foreground">{format(currentMonth, "MMMM yyyy")}</h2>
          <Button variant="outline" size="icon" className="rounded-xl" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden">
            <div className="grid grid-cols-7 border-b border-border">
              {weekDays.map((d) => (
                <div key={d} className="py-3 text-center text-xs font-medium text-muted-foreground">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {calendarDays.map((date, idx) => {
                const key = format(date, "yyyy-MM-dd");
                const entries = dayMap.get(key) ?? [];
                const inMonth = isSameMonth(date, currentMonth);
                const todayCheck = isToday(date);
                const total = entries.reduce((s, e) => s + e.subscription.price, 0);
                return (
                  <button
                    key={idx}
                    onClick={() => entries.length > 0 && setSelectedDate(date)}
                    className={`relative flex min-h-[88px] flex-col border-b border-r border-border p-2 text-left transition-all duration-200 hover:bg-accent/30 ${
                      !inMonth ? "opacity-30" : ""
                    } ${todayCheck ? "bg-primary/5" : ""} ${entries.length > 0 ? "cursor-pointer" : "cursor-default"}`}
                  >
                    <span className={`mb-1 inline-flex h-7 w-7 items-center justify-center rounded-lg text-xs font-semibold ${
                      todayCheck ? "bg-primary text-primary-foreground" : "text-foreground"
                    }`}>
                      {format(date, "d")}
                    </span>
                    {entries.length > 0 && (
                      <>
                        <div className="flex flex-wrap gap-0.5">
                          {entries.slice(0, 3).map((e, j) => (
                            <SubscriptionIcon key={j} name={e.subscription.name} category={e.subscription.category} size="sm" />
                          ))}
                          {entries.length > 3 && (
                            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-muted text-[10px] font-medium text-muted-foreground">
                              +{entries.length - 3}
                            </span>
                          )}
                        </div>
                        <span className="mt-auto text-[10px] font-bold text-primary">{formatCurrency(total, lang)}</span>
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {!isLoading && subscriptions.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-12 text-center">
            <CalendarDays className="mb-3 h-10 w-10 text-muted-foreground" />
            <p className="font-medium text-foreground">{t("noUpcomingPayments")}</p>
            <p className="mt-1 text-sm text-muted-foreground">{t("addFirstSubCalendar")}</p>
          </div>
        )}

        <Dialog open={!!selectedDate} onOpenChange={() => setSelectedDate(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-display">
                {selectedDate && format(selectedDate, "MMMM d, yyyy")}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              {selectedEntries.map((entry, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl border border-border bg-background p-3">
                  <div className="flex items-center gap-3">
                    <SubscriptionIcon name={entry.subscription.name} category={entry.subscription.category} size="md" />
                    <span className="font-medium text-foreground">{entry.subscription.name}</span>
                  </div>
                  <span className="font-semibold text-foreground">{formatCurrency(entry.subscription.price, lang)}</span>
                </div>
              ))}
              {selectedEntries.length > 0 && (
                <div className="flex items-center justify-between border-t border-border pt-3">
                  <span className="text-sm font-medium text-muted-foreground">{t("total")}</span>
                  <span className="text-lg font-bold text-primary">{formatCurrency(selectedTotal, lang)}</span>
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
