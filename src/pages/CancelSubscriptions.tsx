import SeoLandingLayout from "@/components/landing/SeoLandingLayout";
import { useTranslation } from "react-i18next";

const CancelSubscriptions = () => {
  const { t } = useTranslation();

  return (
    <SeoLandingLayout
      title={t("landingCancelTitle")}
      description={t("landingCancelDescription")}
      canonical="https://paythra.com/cancel-subscriptions"
      h1={t("landingCancelH1")}
      intro={t("landingCancelIntro")}
      problemHeading={t("whatIsTheProblemTitle")}
      problemBody={t("landingCancelProblemBody")}
      sections={[
        {
          heading: t("landingCancelSection1Heading"),
          body: t("landingCancelSection1Body"),
        },
        {
          heading: t("landingCancelSection2Heading"),
          body: t("landingCancelSection2Body"),
        },
        {
          heading: t("landingCancelSection3Heading"),
          body: t("landingCancelSection3Body"),
        },
        {
          heading: t("landingCancelSection4Heading"),
          body: t("landingCancelSection4Body"),
        },
      ]}
    />
  );
};

export default CancelSubscriptions;
