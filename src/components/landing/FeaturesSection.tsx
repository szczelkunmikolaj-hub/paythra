import { motion } from "framer-motion";
import { Scan, LayoutDashboard, ShieldAlert, BarChart3, Lightbulb } from "lucide-react";

const features = [
  {
    icon: Scan,
    title: "Automatic Subscription Detection",
    description: "Connect your bank and instantly detect recurring payments without manual entry.",
  },
  {
    icon: LayoutDashboard,
    title: "Subscription Dashboard",
    description: "See all subscriptions in one simple, beautiful view with all the details you need.",
  },
  {
    icon: ShieldAlert,
    title: "Free Trial Guardian",
    description: "Get alerts before free trials convert to paid so you never get caught off guard.",
  },
  {
    icon: BarChart3,
    title: "Spending Insights",
    description: "Understand exactly how much you spend per month and per year on subscriptions.",
  },
  {
    icon: Lightbulb,
    title: "Optimization Suggestions",
    description: "Find cheaper plans, bundles, or alternatives to reduce your subscription costs.",
  },
];

const FeaturesSection = () => {
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
            Everything you need to{" "}
            <span className="text-gradient">take control</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Powerful features designed to save you money, automatically.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`group rounded-2xl border border-border bg-card p-8 shadow-card transition-all hover:shadow-elevated hover:-translate-y-1 ${
                i === 0 ? "sm:col-span-2 lg:col-span-1" : ""
              }`}
            >
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
                <feature.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
