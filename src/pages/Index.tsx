import Navbar from "@/components/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import ProblemSection from "@/components/landing/ProblemSection";
import TargetUsersSection from "@/components/landing/TargetUsersSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import InternalLinksParagraph from "@/components/landing/InternalLinksParagraph";
import StatsSection from "@/components/landing/StatsSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { useTranslation } from "react-i18next";

const Index = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={t("homeSeoTitle")}
        description={t("homeSeoDescription")}
        canonical="https://paythra.com/"
      />
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <TargetUsersSection />
      <FeaturesSection />
      <InternalLinksParagraph />
      <StatsSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
