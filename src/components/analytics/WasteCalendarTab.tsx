import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, AlertTriangle, TrendingUp } from "lucide-react";
import { useSubscriptions, type Subscription } from "@/hooks/useSubscriptions";
import { getDatabaseEntryByName } from "@/data/subscriptionDatabase";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "@/lib/currency";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function monthlyAmount(s: Subscription) {
  return s.billing_cycle === "monthly" ? Number(s.price) : Number(s.price) / 12;
}

function expandToMonthCharges(subs: Subscription[], year: number, month: number) {
  const map = new Map<number, Subscription[]>();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (const s of subs) {
    if (s.status !== "active") continue;
    if (!s.next_billing_date) continue;
    const nb = new Date(s.next_billing_date);
    let day = nb.getDate();
    if (day > daysInMonth) day = daysInMonth;
    if (s.billing_cycle === "monthly") {
      (map.get(day) || map.set(day, []).get(day)!).push(s);
    } else {
      if (nb.getFullYear() === year && nb.getMonth() === month) {
        (map.get(day) || map.set(day, []).get(day)!).push(s);
      }
    }
  }
  return map;
}

function getWasteIds(subs: Subscription[]): Set<string> {
  const byCat: Record<string, Subscription[]> = {};
  for (const s of subs) {
    if (s.status !== "active") continue;
    (byCat[s.category || "other"] ||= []).push(s);
  }
  const waste = new Set<string>();
  for (const list of Object.values(byCat)) {
    if (list.length >= 2) {
      const sorted = [...list].sort((a, b) => monthlyAmount(a) - monthlyAmount(b));
      sorted.slice(1).forEach((s) => waste.add(s.id));
    }
  }
  for (const s of subs) {
    if (s.is_unused) waste.add(s.id);
  }
  return waste;
}

const WasteCalendarTab = () => {
  const { subscriptions } = useSubscriptions();
  const qc = useQueryClient();
  const { i18n } = useTranslation();
  const lang = i18n.language;

  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });
  const [popoverDay, setPopoverDay] = useState<number | null>(null);

  const wasteIds = useMemo(() => getWasteIds(subscriptions), [subscriptions]);
  const charges = useMemo(
    () => expandToMonthCharges(subscriptions, cursor.year, cursor.month),
    [subscriptions, cursor],
  );

  const { totalSpend, totalWaste, chargeDays, biggestDay } = useMemo(() => {
    let spend = 0;
    let waste = 0;
    let biggest = { day: 0, amount: 0 };
    for (const [day, list] of charges.entries()) {
      let dayTotal = 0;
      for (const s of list) {
        const amt = Number(s.price);
        spend += amt;
        dayTotal += amt;
        if (wasteIds.has(s.id)) waste += amt;
      }
      if (dayTotal > biggest.amount) biggest = { day, amount: dayTotal };
    }
    return {
      totalSpend: spend,
      totalWaste: waste,
      chargeDays: charges.size,
      biggestDay: biggest,
    };
  }, [charges, wasteIds]);

  const wastePct = totalSpend > 0 ? Math.round((totalWaste / totalSpend) * 100) : 0;

  const monthLabel = new Date(cursor.year, cursor.month).toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

  const firstDayOffset = (new Date(cursor.year, cursor.month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(cursor.year, cursor.month + 1, 0).getDate();
  const cells = Array.from({ length: firstDayOffset + daysInMonth }, (_, i) =>
    i < firstDayOffset ? null : i - firstDayOffset + 1,
  );

  const navigate = (delta: number) => {
    const d = new Date(cursor.year, cursor.month + delta, 1);
    setCursor({ year: d.getFullYear(), month: d.getMonth() });
  };

  const toggleUnused = async (sub: Subscription) => {
    await supabase.from("subscriptions").update({ is_unused: !sub.is_unused }).eq("id", sub.id);
    qc.invalidateQueries({ queryKey: ["subscriptions"] });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Total spend this month</div>
            <div className="mt-1 font-display text-2xl font-bold text-foreground">{formatCurrency(totalSpend, lang)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Estimated waste</div>
            <div className="mt-1 font-display text-2xl font-bold text-destructive">{formatCurrency(totalWaste, lang)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Charge days</div>
            <div className="mt-1 font-display text-2xl font-bold text-foreground">{chargeDays}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Biggest charge day</div>
            <div className="mt-1 font-display text-2xl font-bold text-foreground">
              {biggestDay.day > 0 ? `${formatCurrency(biggestDay.amount, lang)} · day ${biggestDay.day}` : "—"}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="space-y-2 p-5">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 font-medium text-foreground">
              <AlertTriangle className="h-4 w-4 text-destructive" /> Waste this month
            </span>
            <span className="text-muted-foreground">{wastePct}% of spend</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-destructive transition-all"
              style={{ width: `${Math.min(100, wastePct)}%` }}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <Button size="icon" variant="outline" onClick={() => navigate(-1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="font-display text-lg font-bold text-foreground flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-primary" />
              {monthLabel}
            </div>
            <Button size="icon" variant="outline" onClick={() => navigate(1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[11px] font-medium uppercase text-muted-foreground">
            {WEEKDAYS.map((w) => <div key={w}>{w}</div>)}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {cells.map((day, i) => {
              if (day === null) return <div key={i} className="aspect-square" />;
              const list = charges.get(day) || [];
              const dayAmount = list.reduce((acc, s) => acc + Number(s.price), 0);
              const dayWaste = list.reduce((acc, s) => acc + (wasteIds.has(s.id) ? Number(s.price) : 0), 0);
              const hasWaste = dayWaste > 0;
              const isToday =
                cursor.year === new Date().getFullYear() &&
                cursor.month === new Date().getMonth() &&
                day === new Date().getDate();
              return (
                <Popover
                  key={i}
                  open={popoverDay === day}
                  onOpenChange={(o) => setPopoverDay(o ? day : null)}
                >
                  <PopoverTrigger asChild>
                    <button
                      className={`aspect-square rounded-md border p-1.5 text-left text-xs transition-colors hover:bg-accent ${
                        hasWaste ? "border-destructive/30 bg-destructive/10" : "border-border"
                      } ${isToday ? "ring-2 ring-primary" : ""}`}
                    >
                      <div className="flex items-start justify-between">
                        <span className="font-semibold text-foreground">{day}</span>
                      </div>
                      {list.length > 0 && (
                        <>
                          <div className="mt-1 flex flex-wrap gap-0.5">
                            {list.slice(0, 4).map((s) => {
                              const e = getDatabaseEntryByName(s.name);
                              return (
                                <span
                                  key={s.id}
                                  className="h-1.5 w-1.5 rounded-full"
                                  style={{ backgroundColor: e?.color || "#3b82f6" }}
                                />
                              );
                            })}
                          </div>
                          <div className={`mt-1 truncate text-[10px] ${hasWaste ? "font-semibold text-destructive" : "text-muted-foreground"}`}>
                            {formatCurrency(dayAmount, lang)}
                            {hasWaste && <span className="ml-1">waste</span>}
                          </div>
                        </>
                      )}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent align="center" className="w-72 p-3">
                    <div className="mb-2 text-sm font-semibold text-foreground">
                      {monthLabel.split(" ")[0]} {day} · {formatCurrency(dayAmount, lang)}
                    </div>
                    {list.length === 0 ? (
                      <div className="text-xs text-muted-foreground">No renewals this day.</div>
                    ) : (
                      <div className="space-y-2">
                        {list.map((s) => {
                          const e = getDatabaseEntryByName(s.name);
                          const isWaste = wasteIds.has(s.id);
                          return (
                            <div key={s.id} className={`flex items-center gap-2 rounded-md p-1.5 ${isWaste ? "bg-destructive/10" : ""}`}>
                              {e?.domain ? (
                                <img src={`https://logo.clearbit.com/${e.domain}`} alt="" className="h-6 w-6 rounded" onError={(ev) => ((ev.target as HTMLImageElement).style.display = "none")} />
                              ) : (
                                <span className="h-6 w-6 rounded" style={{ backgroundColor: e?.color || "#3b82f6" }} />
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="truncate text-xs font-medium text-foreground">{s.name}</div>
                                <div className="text-[11px] text-muted-foreground">{formatCurrency(Number(s.price), lang)}</div>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-[10px] text-muted-foreground">unused</span>
                                <Switch checked={!!s.is_unused} onCheckedChange={() => toggleUnused(s)} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </PopoverContent>
                </Popover>
              );
            })}
          </div>

          <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded bg-destructive/20 border border-destructive/30" /> Waste day
            </span>
            <span className="flex items-center gap-1.5">
              <TrendingUp className="h-3 w-3" /> Dots = services renewing that day
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WasteCalendarTab;
