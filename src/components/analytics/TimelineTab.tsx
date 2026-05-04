import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { useSubscriptionHistory, type SubscriptionHistoryRow } from "@/hooks/useSubscriptionHistory";
import { getDatabaseEntryByName } from "@/data/subscriptionDatabase";
import AddPastSubscriptionModal from "./AddPastSubscriptionModal";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "@/lib/currency";

type TimelineItem = {
  id: string;
  name: string;
  color: string;
  domain: string | null;
  category: string;
  monthlyPrice: number;
  start: Date;
  end: Date | null;
  cancelled: boolean;
};

const MONTH_LABELS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

function buildItems(
  subs: ReturnType<typeof useSubscriptions>["subscriptions"],
  history: SubscriptionHistoryRow[],
): TimelineItem[] {
  const fromSubs: TimelineItem[] = subs.map((s) => {
    const entry = getDatabaseEntryByName(s.name);
    const start = s.start_date ? new Date(s.start_date) : new Date(s.created_at);
    const cancelled = s.status !== "active";
    return {
      id: `sub-${s.id}`,
      name: s.name,
      color: entry?.color || "#3b82f6",
      domain: entry?.domain || null,
      category: s.category || "other",
      monthlyPrice: s.billing_cycle === "monthly" ? Number(s.price) : Number(s.price) / 12,
      start,
      end: cancelled ? new Date(s.next_billing_date || s.created_at) : null,
      cancelled,
    };
  });

  const fromHistory: TimelineItem[] = history.map((h) => {
    const entry = h.service_name ? getDatabaseEntryByName(h.service_name) : undefined;
    return {
      id: `hist-${h.id}`,
      name: h.service_name,
      color: h.service_color || entry?.color || "#3b82f6",
      domain: h.service_domain || entry?.domain || null,
      category: entry?.category || "other",
      monthlyPrice: Number(h.monthly_price),
      start: new Date(h.started_at),
      end: h.ended_at ? new Date(h.ended_at) : null,
      cancelled: !!h.ended_at,
    };
  });

  return [...fromSubs, ...fromHistory];
}

const TimelineTab = () => {
  const { subscriptions } = useSubscriptions();
  const { history } = useSubscriptionHistory();
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const [view, setView] = useState<"timeline" | "all" | "category">("timeline");
  const [open, setOpen] = useState(false);

  const items = useMemo(() => buildItems(subscriptions, history), [subscriptions, history]);

  const stats = useMemo(() => {
    if (items.length === 0) {
      return { earliestYear: null as number | null, totalSpent: 0, count: 0, cancelled: 0 };
    }
    const earliestYear = Math.min(...items.map((i) => i.start.getFullYear()));
    const now = new Date();
    let totalSpent = 0;
    for (const it of items) {
      const end = it.end ?? now;
      const months = Math.max(
        0,
        (end.getFullYear() - it.start.getFullYear()) * 12 + (end.getMonth() - it.start.getMonth()) + 1,
      );
      totalSpent += months * it.monthlyPrice;
    }
    return {
      earliestYear,
      totalSpent,
      count: items.length,
      cancelled: items.filter((i) => i.cancelled).length,
    };
  }, [items]);

  const years = useMemo(() => {
    if (items.length === 0) return [] as number[];
    const minY = Math.min(...items.map((i) => i.start.getFullYear()));
    const maxY = new Date().getFullYear();
    return Array.from({ length: maxY - minY + 1 }, (_, i) => minY + i);
  }, [items]);

  const renderBars = (list: TimelineItem[]) => (
    <div className="space-y-6">
      {years.map((year) => (
        <div key={year}>
          <div className="mb-2 flex items-center gap-3">
            <div className="font-display text-lg font-bold text-foreground">{year}</div>
            <div className="h-px flex-1 bg-border" />
          </div>
          <div className="mb-1 grid grid-cols-12 gap-1 text-[10px] text-muted-foreground">
            {MONTH_LABELS.map((m, i) => (
              <div key={i} className="text-center">{m}</div>
            ))}
          </div>
          <div className="space-y-2">
            {list
              .filter((it) => {
                const startY = it.start.getFullYear();
                const endY = (it.end ?? new Date()).getFullYear();
                return year >= startY && year <= endY;
              })
              .map((it) => {
                const startMonth = it.start.getFullYear() === year ? it.start.getMonth() : 0;
                const endMonth = it.end && it.end.getFullYear() === year
                  ? it.end.getMonth()
                  : it.end && it.end.getFullYear() < year
                    ? -1
                    : (it.end ? 11 : (year === new Date().getFullYear() ? new Date().getMonth() : 11));
                if (endMonth < startMonth) return null;
                const span = endMonth - startMonth + 1;
                return (
                  <div key={`${it.id}-${year}`} className="grid grid-cols-12 items-center gap-1">
                    <div
                      className="relative col-span-12 grid grid-cols-12 gap-1"
                    >
                      <div
                        className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-xs font-medium text-white shadow-sm ${
                          it.cancelled ? "opacity-50 grayscale" : ""
                        }`}
                        style={{
                          gridColumnStart: startMonth + 1,
                          gridColumnEnd: `span ${span}`,
                          backgroundColor: it.cancelled ? "#94a3b8" : it.color,
                        }}
                      >
                        {it.domain && (
                          <img
                            src={`https://logo.clearbit.com/${it.domain}`}
                            alt=""
                            className="h-4 w-4 rounded-sm bg-white/90 p-0.5"
                            onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
                          />
                        )}
                        <span className="truncate">{it.name}</span>
                        {it.cancelled && it.end?.getFullYear() === year && (
                          <span className="ml-auto rounded bg-destructive/20 px-1.5 py-0.5 text-[10px] font-semibold text-destructive line-through">
                            cancelled {it.end.toLocaleDateString(undefined, { month: "short" })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      ))}
      {years.length === 0 && (
        <div className="py-12 text-center text-sm text-muted-foreground">
          No subscriptions yet. Add a past subscription to start your timeline.
        </div>
      )}
    </div>
  );

  const grouped = useMemo(() => {
    const g: Record<string, TimelineItem[]> = {};
    for (const it of items) {
      (g[it.category] ||= []).push(it);
    }
    return g;
  }, [items]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Tracking since</div>
            <div className="mt-1 font-display text-2xl font-bold text-foreground">
              {stats.earliestYear ?? "—"}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Total spent estimate</div>
            <div className="mt-1 font-display text-2xl font-bold text-foreground">
              {formatCurrency(stats.totalSpent, lang)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Services tracked</div>
            <div className="mt-1 font-display text-2xl font-bold text-foreground">{stats.count}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Cancelled</div>
            <div className="mt-1 font-display text-2xl font-bold text-destructive">{stats.cancelled}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <Button size="sm" variant={view === "timeline" ? "default" : "outline"} onClick={() => setView("timeline")}>My timeline</Button>
          <Button size="sm" variant={view === "all" ? "default" : "outline"} onClick={() => setView("all")}>All services</Button>
          <Button size="sm" variant={view === "category" ? "default" : "outline"} onClick={() => setView("category")}>By category</Button>
        </div>
        <Button size="sm" onClick={() => setOpen(true)}>
          <Plus className="mr-1 h-4 w-4" /> Add past subscription
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          {view === "timeline" && renderBars(items)}
          {view === "category" && (
            <div className="space-y-8">
              {Object.entries(grouped).map(([cat, list]) => (
                <div key={cat}>
                  <div className="mb-3 text-sm font-semibold uppercase text-muted-foreground">{cat.replace(/_/g, " ")}</div>
                  {renderBars(list)}
                </div>
              ))}
            </div>
          )}
          {view === "all" && (
            <div className="text-sm text-muted-foreground">
              See the global market price history on the{" "}
              <a href="/price-history" className="font-medium text-primary underline">Price History</a> page.
            </div>
          )}
        </CardContent>
      </Card>

      <AddPastSubscriptionModal open={open} onOpenChange={setOpen} />
    </div>
  );
};

export default TimelineTab;
