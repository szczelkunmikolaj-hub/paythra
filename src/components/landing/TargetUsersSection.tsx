import { motion } from "framer-motion";

const TargetUsersSection = () => {
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
              Built for the{" "}
              <span className="text-gradient">subscription generation</span>
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Students and young professionals typically have 5–15 active subscriptions, including streaming platforms, gaming services, productivity tools, and digital apps.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              SubSense helps them organize and control their digital spending — finally.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 gap-3"
          >
            {[
              { label: "Streaming", count: "3–4 services", emoji: "🎬" },
              { label: "Gaming", count: "1–2 services", emoji: "🎮" },
              { label: "Productivity", count: "2–3 tools", emoji: "⚡" },
              { label: "Music", count: "1–2 platforms", emoji: "🎵" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-border bg-card p-5 shadow-card"
              >
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
