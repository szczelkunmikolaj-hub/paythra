import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { EyeOff, Clock, TrendingUp } from "lucide-react";

const ProblemSection = () => {
  const { t } = useTranslation();

  const problems = [
    { icon: EyeOff, title: t("blindSpots"), description: t("blindSpotsDesc") },
    { icon: Clock, title: t("silentFreeTrials"), description: t("silentFreeTrialsDesc") },
    { icon: TrendingUp, title: t("inflationFog"), description: t("inflationFogDesc") },
  ];

  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            {t("problemTitle1")}<span className="text-gradient">{t("problemTitle2")}</span>{t("problemTitle3")}
          </h2>
          <p className="mt-4 text-muted-foreground">{t("problemSubtitle")}</p>
        </motion.div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {problems.map((problem, i) => (
            <motion.div
              key={problem.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="group rounded-2xl border border-border bg-card p-8 shadow-card transition-all hover:shadow-elevated hover:-translate-y-1"
            >
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent">
                <problem.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground">{problem.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{problem.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
