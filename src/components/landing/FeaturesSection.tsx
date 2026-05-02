import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Scan, LayoutDashboard, ShieldAlert, BarChart3, Lightbulb, ArrowRight } from "lucide-react";

const FeaturesSection = () => {
  const { t } = useTranslation();

  const features = [
    { icon: Scan, title: t("autoDetection"), description: t("autoDetectionDesc"), to: "/track-subscriptions" },
    { icon: LayoutDashboard, title: t("subscriptionDashboard"), description: t("subscriptionDashboardDesc"), to: "/subscription-manager" },
    { icon: ShieldAlert, title: t("trialGuardian"), description: t("trialGuardianDesc"), to: "/cancel-subscriptions" },
    { icon: BarChart3, title: t("spendingInsights"), description: t("spendingInsightsDesc"), to: "/subscription-tracker" },
    { icon: Lightbulb, title: t("optimizationSuggestions"), description: t("optimizationSuggestionsDesc"), to: "/reduce-subscription-costs" },
  ];

  return (
    <section id="features" className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            {t("featuresTitle1")}
            <span className="text-gradient">{t("featuresTitle2")}</span>
          </h2>
          <p className="mt-4 text-muted-foreground">{t("featuresSubtitle")}</p>
        </motion.div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={i === 0 ? "sm:col-span-2 lg:col-span-1" : ""}
            >
              <Link
                to={feature.to}
                className="group block h-full rounded-2xl border border-border bg-card p-8 shadow-card transition-all hover:shadow-elevated hover:-translate-y-1 hover:border-primary/40"
              >
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
                  <feature.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary opacity-80 group-hover:opacity-100 transition-opacity">
                  {t("learnMore")}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
