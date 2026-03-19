import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const TargetUsersSection = () => {
  const { t } = useTranslation();

  const items = [
    { label: t("streaming"), count: "3–4 services", emoji: "🎬" },
    { label: t("gaming"), count: "1–2 services", emoji: "🎮" },
    { label: t("productivity"), count: "2–3 tools", emoji: "⚡" },
    { label: t("music"), count: "1–2 platforms", emoji: "🎵" },
  ];

  return (
    <section className="bg-muted/30 py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl grid gap-12 md:grid-cols-2 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              {t("targetTitle1")}
              <span className="text-gradient">{t("targetTitle2")}</span>
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">{t("targetDesc1")}</p>
            <p className="mt-4 text-muted-foreground leading-relaxed">{t("targetDesc2")}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 gap-3"
          >
            {items.map((item) => (
              <div key={item.label} className="rounded-xl border border-border bg-card p-5 shadow-card">
                <span className="text-2xl">{item.emoji}</span>
                <h4 className="mt-2 font-display font-semibold text-foreground text-sm">{item.label}</h4>
                <p className="text-xs text-muted-foreground">{item.count}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TargetUsersSection;
