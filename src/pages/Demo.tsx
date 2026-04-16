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
  Plus,
  Sparkles,
} from "lucide-react";

const SLIDE_DURATION = 4500;

/* ───── tiny helper components ───── */

const MockCard = ({ label, value, delay = 0 }: { label: string; value: string; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="rounded-2xl border border-border bg-card p-5 text-center shadow-card"
  >
    <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground mb-2">{label}</p>
    <p className="font-display text-xl font-bold text-foreground">{value}</p>
  </motion.div>
);

const SubRow = ({
  name,
  price,
  color,
  icon,
  delay = 0,
}: {
  name: string;
  price: string;
  color: string;
  icon: React.ReactNode;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, x: -16 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.4, delay }}
    className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3.5 shadow-card transition-all hover:shadow-elevated hover:-translate-y-0.5"
  >
    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>{icon}</div>
    <span className="flex-1 text-sm font-medium text-foreground">{name}</span>
    <span className="text-sm font-bold text-foreground">{price}</span>
  </motion.div>
);

/* ───── main component ───── */

const Demo = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [addClicked, setAddClicked] = useState(false);

  interface DemoSlide {
    icon: React.ReactNode;
    title: string;
    subtitle: string;
    visual: React.ReactNode;
  }

  const slides: DemoSlide[] = [
    /* 0 – Intro */
    {
      icon: <Rocket className="h-7 w-7" />,
      title: t("demoIntroTitle"),
      subtitle: t("demoIntroSubtitle"),
      visual: (
        <div className="flex flex-col items-center gap-8">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-primary shadow-glow"
          >
            <LayoutDashboard className="h-12 w-12 text-primary-foreground" />
          </motion.div>
          <div className="flex gap-3">
            {[Tv, Music, Gamepad2, Briefcase].map((Icon, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
                className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-card shadow-card"
              >
                <Icon className="h-5 w-5 text-muted-foreground" />
              </motion.div>
            ))}
          </div>
        </div>
      ),
    },
    /* 1 – Dashboard */
    {
      icon: <LayoutDashboard className="h-7 w-7" />,
      title: t("demoDashboardTitle"),
      subtitle: t("demoDashboardSubtitle"),
      visual: (
        <div className="w-full max-w-md mx-auto space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <MockCard label={t("monthlySpend")} value="€47.94" delay={0.1} />
            <MockCard label={t("activeSubscriptions")} value="6" delay={0.2} />
            <MockCard label={t("potentialSavings")} value="€8.50" delay={0.3} />
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="rounded-2xl border border-border bg-card p-5 shadow-card"
          >
            <div className="flex h-28 items-end gap-1.5">
              {[40, 55, 35, 70, 50, 65, 45, 80, 60, 75, 55, 70].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: 0.5 + i * 0.04, duration: 0.6, ease: "easeOut" }}
                  className="flex-1 rounded-t-md bg-gradient-primary opacity-75"
                />
              ))}
            </div>
          </motion.div>
        </div>
      ),
    },
    /* 2 – Tracking */
    {
      icon: <CreditCard className="h-7 w-7" />,
      title: t("demoTrackingTitle"),
      subtitle: t("demoTrackingSubtitle"),
      visual: (
        <div className="w-full max-w-sm mx-auto space-y-3">
          <SubRow name="Netflix" price="€13.99" color="bg-red-500/15 text-red-500" icon={<Tv className="h-4 w-4" />} delay={0.1} />
          <SubRow name="Spotify" price="€9.99" color="bg-green-500/15 text-green-500" icon={<Music className="h-4 w-4" />} delay={0.2} />
          <SubRow name="Xbox Game Pass" price="€12.99" color="bg-indigo-500/15 text-indigo-500" icon={<Gamepad2 className="h-4 w-4" />} delay={0.3} />
          <AnimatePresence>
            {addClicked && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <SubRow name="Adobe CC" price="€54.99" color="bg-purple-500/15 text-purple-500" icon={<Briefcase className="h-4 w-4" />} delay={0} />
              </motion.div>
            )}
          </AnimatePresence>
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setAddClicked(true)}
            className={`flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 p-3.5 text-sm font-medium text-primary transition-all hover:bg-primary/10 hover:border-primary/50 ${addClicked ? "opacity-40 pointer-events-none" : ""}`}
          >
            <Plus className="h-4 w-4" />
            {t("addSubscription")}
          </motion.button>
        </div>
      ),
    },
    /* 3 – Smart Import */
    {
      icon: <Upload className="h-7 w-7" />,
      title: t("demoImportTitle"),
      subtitle: t("demoImportSubtitle"),
      visual: (
        <div className="w-full max-w-sm mx-auto space-y-5">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-col items-center gap-4 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 p-10"
          >
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}>
              <Upload className="h-10 w-10 text-primary/60" />
            </motion.div>
            <p className="text-sm text-muted-foreground">{t("dropBankStatement")}</p>
          </motion.div>
          <div className="flex gap-2.5 justify-center">
            {["CSV", "XLSX", "OFX"].map((f, i) => (
              <motion.span
                key={f}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="rounded-full border border-border bg-card px-5 py-2 text-xs font-medium text-muted-foreground shadow-card"
              >
                {f}
              </motion.span>
            ))}
          </div>
        </div>
      ),
    },
    /* 4 – Auto Detect */
    {
      icon: <Mail className="h-7 w-7" />,
      title: t("demoAutoDetectTitle"),
      subtitle: t("demoAutoDetectSubtitle"),
      visual: (
        <div className="w-full max-w-sm mx-auto space-y-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-card"
          >
            <div className="relative">
              <Mail className="h-8 w-8 text-primary" />
              <motion.div
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-primary shadow-glow"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{t("connectGmail")}</p>
              <p className="text-xs text-muted-foreground">{t("comingSoon")}</p>
            </div>
            <span className="flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground shrink-0">
              <Sparkles className="h-3 w-3" />
              {t("comingSoon")}
            </span>
          </motion.div>
          <div className="space-y-2">
            {["receipt@netflix.com", "noreply@spotify.com", "billing@adobe.com"].map((e, i) => (
              <motion.div
                key={e}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 0.6, x: 0 }}
                transition={{ delay: 0.5 + i * 0.15 }}
                className="flex items-center gap-3 rounded-xl border border-border/50 bg-card/40 px-4 py-2.5"
              >
                <motion.div
                  animate={{ scale: [1, 1.4, 1] }}
                  transition={{ duration: 1.5, delay: 0.8 + i * 0.2, repeat: Infinity }}
                  className="h-2 w-2 rounded-full bg-green-400 shrink-0"
                />
                <span className="text-xs text-muted-foreground">{e}</span>
              </motion.div>
            ))}
          </div>
        </div>
      ),
    },
    /* 5 – Currency */
    {
      icon: <Globe className="h-7 w-7" />,
      title: t("demoCurrencyTitle"),
      subtitle: t("demoCurrencySubtitle"),
      visual: (
        <div className="grid grid-cols-2 gap-3 w-full max-w-sm mx-auto">
          {[
            { flag: "🇪🇺", currency: "EUR", price: "€9.99" },
            { flag: "🇬🇧", currency: "GBP", price: "£8.99" },
            { flag: "🇵🇱", currency: "PLN", price: "42,50 zł" },
            { flag: "🇺🇸", currency: "USD", price: "$10.99" },
          ].map((c, i) => (
            <motion.div
              key={c.currency}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 + i * 0.1, duration: 0.4 }}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-5 shadow-card transition-all hover:shadow-elevated hover:-translate-y-0.5"
            >
              <span className="text-3xl">{c.flag}</span>
              <div>
                <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">{c.currency}</p>
                <p className="text-base font-bold text-foreground">{c.price}</p>
              </div>
            </motion.div>
          ))}
        </div>
      ),
    },
    /* 6 – Languages */
    {
      icon: <Languages className="h-7 w-7" />,
      title: t("demoLanguageTitle"),
      subtitle: t("demoLanguageSubtitle"),
      visual: (
        <div className="flex flex-wrap justify-center gap-3 max-w-md mx-auto">
          {[
            { flag: "🇬🇧", label: "English" },
            { flag: "🇪🇸", label: "Español" },
            { flag: "🇵🇱", label: "Polski" },
            { flag: "🇩🇪", label: "Deutsch" },
            { flag: "🇫🇷", label: "Français" },
          ].map((l, i) => (
            <motion.div
              key={l.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.08, duration: 0.4 }}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card px-6 py-3.5 shadow-card transition-all hover:shadow-elevated hover:-translate-y-0.5"
            >
              <span className="text-2xl">{l.flag}</span>
              <span className="text-sm font-medium text-foreground">{l.label}</span>
            </motion.div>
          ))}
        </div>
      ),
    },
    /* 7 – Insights */
    {
      icon: <TrendingUp className="h-7 w-7" />,
      title: t("demoInsightsTitle"),
      subtitle: t("demoInsightsSubtitle"),
      visual: (
        <div className="w-full max-w-md mx-auto space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <MockCard label={t("yearlyTotal")} value="€575" delay={0.1} />
            <MockCard label={t("potentialSavings")} value="€102" delay={0.2} />
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="rounded-2xl border border-border bg-card p-5 shadow-card"
          >
            <div className="space-y-3.5">
              {[
                { cat: t("streaming"), pct: 45, color: "bg-primary" },
                { cat: t("music"), pct: 20, color: "bg-green-500" },
                { cat: t("gaming"), pct: 25, color: "bg-indigo-500" },
                { cat: t("other"), pct: 10, color: "bg-muted-foreground/50" },
              ].map((c, i) => (
                <div key={c.cat} className="flex items-center gap-3">
                  <span className="w-20 text-xs font-medium text-muted-foreground text-right">{c.cat}</span>
                  <div className="flex-1 h-2.5 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${c.pct}%` }}
                      transition={{ delay: 0.5 + i * 0.12, duration: 0.8, ease: "easeOut" }}
                      className={`h-full rounded-full ${c.color}`}
                    />
                  </div>
                  <span className="text-xs font-bold text-foreground w-10 text-right">{c.pct}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      ),
    },
    /* 8 – CTA */
    {
      icon: <Rocket className="h-7 w-7" />,
      title: t("demoCTATitle"),
      subtitle: t("demoCTASubtitle"),
      visual: null,
    },
  ];

  const totalSlides = slides.length;

  const goTo = useCallback((idx: number) => {
    setCurrent(idx);
    setProgress(0);
    setAddClicked(false);
  }, []);

  const next = useCallback(() => {
    if (current < totalSlides - 1) goTo(current + 1);
  }, [current, totalSlides, goTo]);

  const prev = useCallback(() => {
    if (current > 0) goTo(current - 1);
  }, [current, goTo]);

  // Auto-advance
  useEffect(() => {
    if (paused || current === totalSlides - 1) return;
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          next();
          return 0;
        }
        return p + 100 / (SLIDE_DURATION / 50);
      });
    }, 50);
    return () => clearInterval(interval);
  }, [current, paused, totalSlides, next]);

  // Keyboard
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
      {/* Subtle background texture */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(220,100%,50%,0.02)_1px,transparent_1px),linear-gradient(to_bottom,hsl(220,100%,50%,0.02)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

      {/* ── Progress bars ── */}
      <div className="relative z-10 flex gap-1.5 px-6 pt-5">
        {slides.map((_, i) => (
          <div key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-muted/60">
            <motion.div
              className="h-full rounded-full bg-gradient-primary"
              initial={false}
              animate={{
                width: i < current ? "100%" : i === current ? `${progress}%` : "0%",
              }}
              transition={{ duration: 0.1, ease: "linear" }}
            />
          </div>
        ))}
      </div>

      {/* ── Close ── */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => navigate("/")}
        className="absolute right-6 top-12 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-card transition-colors hover:text-foreground hover:bg-accent"
      >
        <X className="h-4 w-4" />
      </motion.button>

      {/* ── Slide content ── */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="flex w-full max-w-lg flex-col items-center text-center gap-6"
          >
            {/* Icon */}
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.05, duration: 0.4, type: "spring", stiffness: 200 }}
              className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary"
            >
              {slide.icon}
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="font-display text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl leading-tight max-w-md"
            >
              {slide.title}
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.4 }}
              className="text-muted-foreground text-base sm:text-lg max-w-sm leading-relaxed"
            >
              {slide.subtitle}
            </motion.p>

            {/* Visual */}
            {slide.visual && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.5 }}
                className="mt-2 w-full flex justify-center"
              >
                <div className="w-full">{slide.visual}</div>
              </motion.div>
            )}

            {/* CTA on last slide */}
            {isLast && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.5 }}
                className="flex flex-col gap-3 sm:flex-row mt-4"
              >
                <Button
                  size="lg"
                  className="bg-gradient-primary px-10 text-base shadow-glow hover:opacity-90 transition-opacity"
                  onClick={() => navigate("/signup")}
                >
                  {t("getStartedFree")}
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-border px-8"
                  onClick={() => navigate("/")}
                >
                  {t("demoExitDemo")}
                </Button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Bottom navigation ── */}
      <div className="relative z-10 flex items-center justify-between px-6 pb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={prev}
          disabled={current === 0}
          className="gap-1.5 text-muted-foreground hover:text-foreground min-w-[80px]"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("back")}
        </Button>

        <div className="flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? "h-2 w-7 bg-primary"
                  : i < current
                  ? "h-2 w-2 bg-primary/40"
                  : "h-2 w-2 bg-muted-foreground/20"
              }`}
            />
          ))}
        </div>

        {!isLast ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={next}
            className="gap-1.5 text-muted-foreground hover:text-foreground min-w-[80px]"
          >
            {t("next")}
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="gap-1.5 text-muted-foreground hover:text-foreground min-w-[80px]"
          >
            {t("close")}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Demo;
