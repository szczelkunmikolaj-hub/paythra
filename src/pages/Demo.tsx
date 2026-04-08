import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ArrowLeft,
  X,
  LayoutDashboard,
  CreditCard,
  Upload,
  Mail,
  Globe,
  Languages,
  TrendingUp,
  Rocket,
  Tv,
  Music,
  Gamepad2,
  Briefcase,
} from "lucide-react";

const SLIDE_DURATION = 4000;

interface DemoSlide {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  visual: React.ReactNode;
}

const MockCard = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-xl border border-border bg-card/80 p-4 text-center backdrop-blur-sm">
    <p className="text-xs text-muted-foreground mb-1">{label}</p>
    <p className="font-display text-xl font-bold text-foreground">{value}</p>
  </div>
);

const SubRow = ({ name, price, color, icon }: { name: string; price: string; color: string; icon: React.ReactNode }) => (
  <div className="flex items-center gap-3 rounded-lg border border-border bg-card/60 p-3">
    <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${color}`}>{icon}</div>
    <span className="flex-1 text-sm font-medium text-foreground">{name}</span>
    <span className="text-sm font-semibold text-foreground">{price}</span>
  </div>
);

const Demo = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const slides: DemoSlide[] = [
    {
      icon: <Rocket className="h-10 w-10" />,
      title: t("demoIntroTitle"),
      subtitle: t("demoIntroSubtitle"),
      visual: (
        <div className="flex flex-col items-center gap-6">
          <div className="relative flex h-28 w-28 items-center justify-center rounded-2xl bg-gradient-primary shadow-glow">
            <LayoutDashboard className="h-14 w-14 text-white" />
          </div>
          <div className="flex gap-3">
            {[Tv, Music, Gamepad2, Briefcase].map((Icon, i) => (
              <div key={i} className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-card shadow-card">
                <Icon className="h-5 w-5 text-muted-foreground" />
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      icon: <LayoutDashboard className="h-10 w-10" />,
      title: t("demoDashboardTitle"),
      subtitle: t("demoDashboardSubtitle"),
      visual: (
        <div className="w-full max-w-md space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <MockCard label={t("monthlySpend")} value="€47.94" />
            <MockCard label={t("activeSubscriptions")} value="6" />
            <MockCard label={t("potentialSavings")} value="€8.50" />
          </div>
          <div className="rounded-xl border border-border bg-card/60 p-4">
            <div className="flex h-24 items-end gap-1.5">
              {[40, 55, 35, 70, 50, 65, 45, 80, 60, 75, 55, 70].map((h, i) => (
                <div key={i} className="flex-1 rounded-t bg-gradient-primary opacity-70" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      icon: <CreditCard className="h-10 w-10" />,
      title: t("demoTrackingTitle"),
      subtitle: t("demoTrackingSubtitle"),
      visual: (
        <div className="w-full max-w-sm space-y-2">
          <SubRow name="Netflix" price="€13.99" color="bg-red-500/15 text-red-500" icon={<Tv className="h-4 w-4" />} />
          <SubRow name="Spotify" price="€9.99" color="bg-green-500/15 text-green-500" icon={<Music className="h-4 w-4" />} />
          <SubRow name="Xbox Game Pass" price="€12.99" color="bg-indigo-500/15 text-indigo-500" icon={<Gamepad2 className="h-4 w-4" />} />
          <SubRow name="Adobe CC" price="€54.99" color="bg-purple-500/15 text-purple-500" icon={<Briefcase className="h-4 w-4" />} />
        </div>
      ),
    },
    {
      icon: <Upload className="h-10 w-10" />,
      title: t("demoImportTitle"),
      subtitle: t("demoImportSubtitle"),
      visual: (
        <div className="w-full max-w-sm space-y-3">
          <div className="flex flex-col items-center gap-3 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-8">
            <Upload className="h-10 w-10 text-primary/60" />
            <p className="text-sm text-muted-foreground">{t("dropBankStatement")}</p>
          </div>
          <div className="flex gap-2 justify-center">
            {["CSV", "XLSX", "OFX"].map((f) => (
              <span key={f} className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">{f}</span>
            ))}
          </div>
        </div>
      ),
    },
    {
      icon: <Mail className="h-10 w-10" />,
      title: t("demoAutoDetectTitle"),
      subtitle: t("demoAutoDetectSubtitle"),
      visual: (
        <div className="w-full max-w-sm space-y-3">
          <div className="flex items-center gap-3 rounded-xl border border-border bg-card/60 p-4">
            <Mail className="h-8 w-8 text-primary" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{t("connectGmail")}</p>
              <p className="text-xs text-muted-foreground">{t("comingSoon")}</p>
            </div>
            <span className="rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-medium text-amber-600">{t("comingSoon")}</span>
          </div>
          <div className="space-y-1.5 opacity-50">
            {["receipt@netflix.com", "noreply@spotify.com", "billing@adobe.com"].map((e) => (
              <div key={e} className="flex items-center gap-2 rounded-lg border border-border/50 bg-card/30 px-3 py-2">
                <div className="h-2 w-2 rounded-full bg-green-400" />
                <span className="text-xs text-muted-foreground">{e}</span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      icon: <Globe className="h-10 w-10" />,
      title: t("demoCurrencyTitle"),
      subtitle: t("demoCurrencySubtitle"),
      visual: (
        <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
          {[
            { flag: "🇪🇺", currency: "EUR", price: "€9.99" },
            { flag: "🇬🇧", currency: "GBP", price: "£8.99" },
            { flag: "🇵🇱", currency: "PLN", price: "42,50 zł" },
            { flag: "🇺🇸", currency: "USD", price: "$10.99" },
          ].map((c) => (
            <div key={c.currency} className="flex items-center gap-3 rounded-xl border border-border bg-card/60 p-4">
              <span className="text-2xl">{c.flag}</span>
              <div>
                <p className="text-xs text-muted-foreground">{c.currency}</p>
                <p className="text-sm font-bold text-foreground">{c.price}</p>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      icon: <Languages className="h-10 w-10" />,
      title: t("demoLanguageTitle"),
      subtitle: t("demoLanguageSubtitle"),
      visual: (
        <div className="flex flex-wrap justify-center gap-3">
          {[
            { flag: "🇬🇧", label: "English" },
            { flag: "🇪🇸", label: "Español" },
            { flag: "🇵🇱", label: "Polski" },
            { flag: "🇩🇪", label: "Deutsch" },
            { flag: "🇫🇷", label: "Français" },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-2 rounded-xl border border-border bg-card/60 px-5 py-3 shadow-card">
              <span className="text-xl">{l.flag}</span>
              <span className="text-sm font-medium text-foreground">{l.label}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      icon: <TrendingUp className="h-10 w-10" />,
      title: t("demoInsightsTitle"),
      subtitle: t("demoInsightsSubtitle"),
      visual: (
        <div className="w-full max-w-md space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <MockCard label={t("yearlyTotal")} value="€575" />
            <MockCard label={t("potentialSavings")} value="€102" />
          </div>
          <div className="rounded-xl border border-border bg-card/60 p-4">
            <div className="space-y-2">
              {[
                { cat: t("streaming"), pct: 45, color: "bg-blue-500" },
                { cat: t("music"), pct: 20, color: "bg-green-500" },
                { cat: t("gaming"), pct: 25, color: "bg-indigo-500" },
                { cat: t("other"), pct: 10, color: "bg-gray-400" },
              ].map((c) => (
                <div key={c.cat} className="flex items-center gap-3">
                  <span className="w-20 text-xs text-muted-foreground">{c.cat}</span>
                  <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                    <div className={`h-full rounded-full ${c.color}`} style={{ width: `${c.pct}%` }} />
                  </div>
                  <span className="text-xs font-medium text-foreground w-8 text-right">{c.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      icon: <Rocket className="h-10 w-10" />,
      title: t("demoCTATitle"),
      subtitle: t("demoCTASubtitle"),
      visual: null, // CTA buttons rendered separately
    },
  ];

  const totalSlides = slides.length;

  const goTo = useCallback((idx: number) => {
    setCurrent(idx);
    setProgress(0);
  }, []);

  const next = useCallback(() => {
    if (current < totalSlides - 1) goTo(current + 1);
  }, [current, totalSlides, goTo]);

  const prev = useCallback(() => {
    if (current > 0) goTo(current - 1);
  }, [current, goTo]);

  // Auto-advance timer
  useEffect(() => {
    if (paused || current === totalSlides - 1) return;
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          next();
          return 0;
        }
        return p + (100 / (SLIDE_DURATION / 50));
      });
    }, 50);
    return () => clearInterval(interval);
  }, [current, paused, totalSlides, next]);

  // Keyboard nav
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); next(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
      if (e.key === "Escape") navigate("/");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev, navigate]);

  const slide = slides[current];
  const isLast = current === totalSlides - 1;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-background"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Progress bars */}
      <div className="flex gap-1 px-4 pt-4">
        {slides.map((_, i) => (
          <div key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-gradient-primary transition-all duration-100"
              style={{
                width: i < current ? "100%" : i === current ? `${progress}%` : "0%",
              }}
            />
          </div>
        ))}
      </div>

      {/* Close button */}
      <button
        onClick={() => navigate("/")}
        className="absolute right-4 top-4 z-10 rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Slide content */}
      <div className="flex flex-1 flex-col items-center justify-center px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="flex max-w-lg flex-col items-center text-center gap-6"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              {slide.icon}
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl leading-tight">
              {slide.title}
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-md">
              {slide.subtitle}
            </p>
            {slide.visual && <div className="mt-2 w-full">{slide.visual}</div>}
            {isLast && (
              <div className="flex flex-col gap-3 sm:flex-row mt-4">
                <Button
                  size="lg"
                  className="bg-gradient-primary px-8 shadow-glow hover:opacity-90"
                  onClick={() => navigate("/signup")}
                >
                  {t("getStartedFree")}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg" onClick={() => navigate("/")}>
                  {t("demoExitDemo")}
                </Button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between px-6 pb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={prev}
          disabled={current === 0}
          className="gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("back")}
        </Button>
        <span className="text-xs text-muted-foreground">
          {current + 1} / {totalSlides}
        </span>
        {!isLast ? (
          <Button variant="ghost" size="sm" onClick={next} className="gap-1">
            {t("next")}
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="gap-1">
            {t("close")}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Demo;
