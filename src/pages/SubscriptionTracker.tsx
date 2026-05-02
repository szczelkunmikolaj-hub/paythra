import SeoLandingLayout from "@/components/landing/SeoLandingLayout";
import { useTranslation } from "react-i18next";

const SubscriptionTracker = () => {
  const { t } = useTranslation();

  return (
    <SeoLandingLayout
      title={t("landingTrackerTitle")}
      description={t("landingTrackerDescription")}
      canonical="https://paythra.com/subscription-tracker"
      h1={t("landingTrackerH1")}
      intro={t("landingTrackerIntro")}
      problemHeading={t("whatIsTheProblemTitle")}
      problemBody={t("landingTrackerProblemBody")}
      sections={[
        {
          heading: t("landingTrackerSection1Heading"),
          body: t("landingTrackerSection1Body"),
        },
        {
          heading: t("landingTrackerSection2Heading"),
          body: t("landingTrackerSection2Body"),
        },
        {
          heading: t("landingTrackerSection3Heading"),
          body: t("landingTrackerSection3Body"),
        },
        {
          heading: t("landingTrackerSection4Heading"),
          body: t("landingTrackerSection4Body"),
        },
      ]}
    />
  );
};

export default SubscriptionTracker;
