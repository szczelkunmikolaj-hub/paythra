import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

/**
 * Inline-text internal-link paragraph for the homepage.
 * Uses real <a href> anchors (via React Router <Link>) with varied anchor text
 * to maximise crawlability and SEO link density.
 */
const InternalLinksParagraph = () => {
  const { t } = useTranslation();

  const linkClass =
    "text-primary underline-offset-4 hover:underline transition-colors";

  return (
    <section className="py-16 bg-muted/20 border-y border-border">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
            {t("internalLinksHeading")}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            {t("internalLinksIntro")}{" "}
            <Link to="/track-subscriptions" className={linkClass}>
              {t("anchorTrackSubscriptions")}
            </Link>
            , {t("internalLinksConnector1")}{" "}
            <Link to="/cancel-subscriptions" className={linkClass}>
              {t("anchorCancelUnused")}
            </Link>
            , {t("internalLinksConnector2")}{" "}
            <Link to="/reduce-subscription-costs" className={linkClass}>
              {t("anchorReduceCosts")}
            </Link>
            .
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            {t("internalLinksPara2Start")}{" "}
            <Link to="/subscription-manager" className={linkClass}>
              {t("anchorManageRecurring")}
            </Link>{" "}
            {t("internalLinksPara2Mid")}{" "}
            <Link to="/subscription-tracker" className={linkClass}>
              {t("anchorSubscriptionTracker")}
            </Link>{" "}
            {t("internalLinksPara2End")}{" "}
            <Link to="/pricing" className={linkClass}>
              {t("anchorPricingPlans")}
            </Link>
            .
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            {t("internalLinksPara3Start")}{" "}
            <Link to="/track-subscriptions" className={linkClass}>
              {t("anchorMonthlyTracker")}
            </Link>
            ,{" "}
            <Link to="/cancel-subscriptions" className={linkClass}>
              {t("anchorStopUnwanted")}
            </Link>
            ,{" "}
            <Link to="/subscription-manager" className={linkClass}>
              {t("anchorAllInOneManager")}
            </Link>
            ,{" "}
            <Link to="/reduce-subscription-costs" className={linkClass}>
              {t("anchorSaveMoney")}
            </Link>
            ,{" "}
            {t("internalLinksAnd")}{" "}
            <Link to="/subscription-tracker" className={linkClass}>
              {t("anchorAutomaticTracking")}
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
};

export default InternalLinksParagraph;
