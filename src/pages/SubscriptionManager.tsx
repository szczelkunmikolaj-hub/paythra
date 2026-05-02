import SeoLandingLayout from "@/components/landing/SeoLandingLayout";
import { useTranslation } from "react-i18next";

const SubscriptionManager = () => {
  const { t } = useTranslation();

  return (
    <SeoLandingLayout
      title={t("landingManagerTitle")}
      description={t("landingManagerDescription")}
      canonical="https://paythra.com/subscription-manager"
      h1={t("landingManagerH1")}
      intro={t("landingManagerIntro")}
      sections={[
        {
          heading: t("landingManagerSection1Heading"),
          body: t("landingManagerSection1Body"),
        },
        {
          heading: t("landingManagerSection2Heading"),
          body: t("landingManagerSection2Body"),
        },
        {
          heading: t("landingManagerSection3Heading"),
          body: t("landingManagerSection3Body"),
        },
        {
          heading: t("landingManagerSection4Heading"),
          body: t("landingManagerSection4Body"),
        },
      ]}
    />
  );
};

export default SubscriptionManager;
