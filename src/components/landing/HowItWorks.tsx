import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const HowItWorks = () => {
  const { t } = useTranslation();

  const steps = [
    {
      title: t("howItWorksStep1Title"),
      body: t("howItWorksStep1Body"),
      to: "/subscription-manager",
    },
    {
      title: t("howItWorksStep2Title"),
      body: t("howItWorksStep2Body"),
      to: "/track-subscriptions",
    },
    {
      title: t("howItWorksStep3Title"),
      body: t("howItWorksStep3Body"),
      to: "/cancel-subscriptions",
    },
  ];

  return (
    <section className="container mx-auto px-4 pb-16">
      <div className="mx-auto max-w-4xl">
        <h2 className="font-display text-2xl font-semibold text-foreground">
          {t("howItWorksTitle")}
        </h2>
        <ol className="mt-6 grid gap-4 sm:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-primary text-sm font-semibold text-primary-foreground">
                {i + 1}
              </div>
              <h3 className="font-display text-base font-semibold text-foreground">
                <Link to={s.to} className="hover:text-primary transition-colors">
                  {s.title}
                </Link>
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default HowItWorks;
