import { useEffect, useMemo, useRef, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    Chart?: any;
  }
}

const YEARS = Array.from({ length: 12 }, (_, i) => 2015 + i);

type Service = {
  name: string;
  color: string;
  dash: number[];
  prices: (number | null)[];
};

const SERVICES: Service[] = [
  {
    name: "Netflix Standard",
    color: "#E50914",
    dash: [],
    prices: [8.99, 9.99, 10.99, 10.99, 12.99, 13.99, 13.99, 15.49, 15.49, 15.49, 17.99, 17.99],
  },
  {
    name: "Spotify Premium",
    color: "#1DB954",
    dash: [6, 3],
    prices: [9.99, 9.99, 9.99, 9.99, 9.99, 9.99, 9.99, 9.99, 10.99, 11.99, 12.99, 12.99],
  },
  {
    name: "Adobe Creative Cloud",
    color: "#FF0000",
    dash: [3, 3],
    prices: [49.99, 49.99, 49.99, 52.99, 52.99, 52.99, 54.99, 54.99, 59.99, 59.99, 59.99, 69.99],
  },
  {
    name: "Amazon Prime",
    color: "#FF9900",
    dash: [8, 3],
    prices: [10.83, 10.83, 12.99, 12.99, 12.99, 12.99, 12.99, 14.99, 14.99, 14.99, 14.99, 14.99],
  },
  {
    name: "Disney+",
    color: "#113CCF",
    dash: [4, 2, 2, 2],
    prices: [null, null, null, null, 6.99, 6.99, 7.99, 7.99, 10.99, 13.99, 13.99, 15.99],
  },
  {
    name: "Apple TV+",
    color: "#555555",
    dash: [2, 2],
    prices: [null, null, null, null, 4.99, 4.99, 4.99, 6.99, 9.99, 9.99, 12.99, 12.99],
  },
  {
    name: "ChatGPT Plus",
    color: "#10A37F",
    dash: [5, 2, 1, 2],
    prices: [null, null, null, null, null, null, null, null, 20, 20, 20, 20],
  },
];

const CDN = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js";

function loadChartJs(): Promise<any> {
  if (window.Chart) return Promise.resolve(window.Chart);
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${CDN}"]`) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", () => resolve(window.Chart));
      existing.addEventListener("error", reject);
      return;
    }
    const s = document.createElement("script");
    s.src = CDN;
    s.async = true;
    s.onload = () => resolve(window.Chart);
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

const PriceHistory = () => {
  const [mode, setMode] = useState<"usd" | "pct">("usd");
  const [hidden, setHidden] = useState<Record<string, boolean>>({});
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<any>(null);
  const [chartReady, setChartReady] = useState(false);

  const datasets = useMemo(() => {
    return SERVICES.map((s) => {
      let data: (number | null)[];
      if (mode === "usd") {
        data = s.prices;
      } else {
        const base = s.prices.find((p) => p !== null) ?? null;
        data = s.prices.map((p) => (p === null || base === null ? null : ((p - base) / base) * 100));
      }
      return {
        label: s.name,
        data,
        borderColor: s.color,
        backgroundColor: s.color,
        borderDash: s.dash,
        spanGaps: false,
        tension: 0.25,
        pointRadius: 2,
        pointHoverRadius: 5,
        borderWidth: 2,
        hidden: !!hidden[s.name],
      };
    });
  }, [mode, hidden]);

  useEffect(() => {
    let cancelled = false;
    loadChartJs().then((Chart) => {
      if (cancelled || !canvasRef.current) return;
      chartRef.current = new Chart(canvasRef.current, {
        type: "line",
        data: { labels: YEARS, datasets },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: "index", intersect: false },
          plugins: {
            legend: { display: false },
            tooltip: {
              mode: "index",
              intersect: false,
              callbacks: {
                label: (ctx: any) => {
                  if (ctx.parsed.y === null || ctx.parsed.y === undefined) return null;
                  const v = ctx.parsed.y;
                  return mode === "usd"
                    ? `${ctx.dataset.label}: $${v.toFixed(2)}`
                    : `${ctx.dataset.label}: ${v >= 0 ? "+" : ""}${v.toFixed(1)}%`;
                },
              },
            },
          },
          scales: {
            y: {
              ticks: {
                callback: (val: any) =>
                  mode === "usd" ? `$${val}` : `${val >= 0 ? "+" : ""}${val}%`,
              },
            },
          },
        },
      });
      setChartReady(true);
    });
    return () => {
      cancelled = true;
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!chartRef.current) return;
    chartRef.current.data.datasets = datasets;
    chartRef.current.options.scales.y.ticks.callback = (val: any) =>
      mode === "usd" ? `$${val}` : `${val >= 0 ? "+" : ""}${val}%`;
    chartRef.current.options.plugins.tooltip.callbacks.label = (ctx: any) => {
      if (ctx.parsed.y === null || ctx.parsed.y === undefined) return null;
      const v = ctx.parsed.y;
      return mode === "usd"
        ? `${ctx.dataset.label}: $${v.toFixed(2)}`
        : `${ctx.dataset.label}: ${v >= 0 ? "+" : ""}${v.toFixed(1)}%`;
    };
    chartRef.current.update();
  }, [datasets, mode, chartReady]);

  const visible = SERVICES.filter((s) => !hidden[s.name]);

  const stats = useMemo(() => {
    const items = visible.map((s) => {
      const first = s.prices.find((p) => p !== null) as number | undefined;
      const last = [...s.prices].reverse().find((p) => p !== null) as number | undefined;
      const pct = first && last ? ((last - first) / first) * 100 : 0;
      return { name: s.name, pct, current: last ?? 0 };
    });
    if (!items.length) return null;
    const sortedByPct = [...items].sort((a, b) => b.pct - a.pct);
    const biggest = sortedByPct[0];
    const smallest = sortedByPct[sortedByPct.length - 1];
    const avg = items.reduce((s, x) => s + x.pct, 0) / items.length;
    const mostExp = [...items].sort((a, b) => b.current - a.current)[0];
    return { biggest, smallest, avg, mostExp };
  }, [visible]);

  const toggle = (name: string) =>
    setHidden((h) => ({ ...h, [name]: !h[name] }));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Price History</h1>
          <p className="text-sm text-muted-foreground">
            Historical subscription prices across the world's most popular services.
          </p>
        </div>

        <Card>
          <CardContent className="space-y-4 p-6">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={mode === "usd" ? "default" : "outline"}
                onClick={() => setMode("usd")}
              >
                USD price
              </Button>
              <Button
                size="sm"
                variant={mode === "pct" ? "default" : "outline"}
                onClick={() => setMode("pct")}
              >
                % change
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {SERVICES.map((s) => {
                const isHidden = !!hidden[s.name];
                return (
                  <button
                    key={s.name}
                    onClick={() => toggle(s.name)}
                    className={`flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs transition-opacity ${
                      isHidden ? "opacity-40" : "opacity-100"
                    }`}
                  >
                    <span
                      className="inline-block h-2 w-4 rounded-sm"
                      style={{ backgroundColor: s.color }}
                    />
                    <span className="text-foreground">{s.name}</span>
                  </button>
                );
              })}
            </div>

            <div className="relative" style={{ height: 340 }}>
              <canvas ref={canvasRef} />
            </div>
          </CardContent>
        </Card>

        {stats && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-xs text-muted-foreground">Biggest increase</div>
                <div className="mt-1 font-display text-lg font-bold text-foreground">
                  {stats.biggest.name}
                </div>
                <div className="text-sm text-primary">+{stats.biggest.pct.toFixed(1)}%</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-xs text-muted-foreground">Smallest increase</div>
                <div className="mt-1 font-display text-lg font-bold text-foreground">
                  {stats.smallest.name}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stats.smallest.pct >= 0 ? "+" : ""}
                  {stats.smallest.pct.toFixed(1)}%
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-xs text-muted-foreground">Average increase</div>
                <div className="mt-1 font-display text-lg font-bold text-foreground">
                  {stats.avg >= 0 ? "+" : ""}
                  {stats.avg.toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">across visible services</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-xs text-muted-foreground">Most expensive now</div>
                <div className="mt-1 font-display text-lg font-bold text-foreground">
                  {stats.mostExp.name}
                </div>
                <div className="text-sm text-muted-foreground">
                  ${stats.mostExp.current.toFixed(2)}/mo
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          Prices shown are USD standard/individual monthly plans. Historical data sourced from
          public pricing records.
        </p>
      </div>
    </DashboardLayout>
  );
};

export default PriceHistory;
