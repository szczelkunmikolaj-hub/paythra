import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";

interface RelatedFeaturesProps {
  /** Optional path of the current page so we can hide its own card. */
  excludePath?: string;
}

const RelatedFeatures = ({ excludePath }: RelatedFeaturesProps) => {
  const { t } = useTranslation();

  const items = [
    { to: "/track-subscriptions", title: t("trackSubscriptionsNav"), desc: t("relatedTrackDesc") },
    { to: "/cancel-subscriptions", title: t("cancelSubscriptionsNav"), desc: t("relatedCancelDesc") },
    { to: "/subscription-manager", title: t("subscriptionManagerNav"), desc: t("relatedManagerDesc") },
    { to: "/reduce-subscription-costs", title: t("reduceCostsNav"), desc: t("relatedReduceDesc") },
    { to: "/subscription-tracker", title: t("subscriptionTrackerNav"), desc: t("relatedTrackerDesc") },
  ].filter((i) => i.to !== excludePath);

  return (
    <section className="container mx-auto px-4 pb-20">
      <div className="mx-auto max-w-4xl">
        <h2 className="font-display text-2xl font-semibold text-foreground">
          {t("relatedFeaturesTitle")}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("relatedFeaturesSubtitle")}
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {items.map((it) => (
            <Link
              key={it.to}
              to={it.to}
              className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-elevated hover:-translate-y-0.5 hover:border-primary/40"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                    {it.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">{it.desc}</p>
                </div>
                <ArrowRight className="mt-1 h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedFeatures;
