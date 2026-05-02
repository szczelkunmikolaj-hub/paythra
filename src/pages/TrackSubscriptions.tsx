import SeoLandingLayout from "@/components/landing/SeoLandingLayout";
import { useTranslation } from "react-i18next";

const TrackSubscriptions = () => {
  const { t } = useTranslation();

  return (
    <SeoLandingLayout
      title={t("landingTrackTitle")}
      description={t("landingTrackDescription")}
      canonical="https://paythra.com/track-subscriptions"
      h1={t("landingTrackH1")}
      intro={t("landingTrackIntro")}
      problemHeading={t("whatIsTheProblemTitle")}
      problemBody={t("landingTrackProblemBody")}
      sections={[
        {
          heading: t("landingTrackSection1Heading"),
          body: t("landingTrackSection1Body"),
        },
        {
          heading: t("landingTrackSection2Heading"),
          body: t("landingTrackSection2Body"),
        },
        {
          heading: t("landingTrackSection3Heading"),
          body: t("landingTrackSection3Body"),
        },
        {
          heading: t("landingTrackSection4Heading"),
          body: t("landingTrackSection4Body"),
        },
      ]}
    />
  );
};

export default TrackSubscriptions;
