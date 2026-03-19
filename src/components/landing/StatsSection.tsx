import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const StatsSection = () => {
  const { t } = useTranslation();

  const stats = [
    { value: "€700", label: t("stat1Label"), suffix: "/year" },
    { value: "85%", label: t("stat2Label"), suffix: "" },
    { value: "€100+", label: t("stat3Label"), suffix: "/mo" },
  ];

  return (
    <section id="stats" className="bg-foreground py-24 text-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center mb-16"
        >
          <h2 className="font-display text-3xl font-bold sm:text-4xl">{t("statsTitle")}</h2>
          <p className="mt-4 opacity-60">{t("statsSubtitle")}</p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="text-center"
            >
              <div className="font-display text-5xl font-extrabold text-gradient sm:text-6xl">{stat.value}</div>
              <p className="mt-4 text-sm opacity-60 max-w-xs mx-auto">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
