import SeoLandingLayout from "@/components/landing/SeoLandingLayout";
import { useTranslation } from "react-i18next";

const ReduceSubscriptionCosts = () => {
  const { t } = useTranslation();

  return (
    <SeoLandingLayout
      title={t("landingReduceTitle")}
      description={t("landingReduceDescription")}
      canonical="https://paythra.com/reduce-subscription-costs"
      h1={t("landingReduceH1")}
      intro={t("landingReduceIntro")}
      problemHeading={t("whatIsTheProblemTitle")}
      problemBody={t("landingReduceProblemBody")}
      sections={[
        {
          heading: t("landingReduceSection1Heading"),
          body: t("landingReduceSection1Body"),
        },
        {
          heading: t("landingReduceSection2Heading"),
          body: t("landingReduceSection2Body"),
        },
        {
          heading: t("landingReduceSection3Heading"),
          body: t("landingReduceSection3Body"),
        },
        {
          heading: t("landingReduceSection4Heading"),
          body: t("landingReduceSection4Body"),
        },
      ]}
    />
  );
};

export default ReduceSubscriptionCosts;
