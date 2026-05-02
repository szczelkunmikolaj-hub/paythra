import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import paythraLogo from "@/assets/paythra-logo.png";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-border bg-muted/30 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center">
            <img src={paythraLogo} alt="Paythra" className="h-9 w-9 rounded-lg" />
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">{t("home")}</Link>
            <Link to="/track-subscriptions" className="hover:text-foreground transition-colors">Track Subscriptions</Link>
            <Link to="/cancel-subscriptions" className="hover:text-foreground transition-colors">Cancel Subscriptions</Link>
            <Link to="/subscription-manager" className="hover:text-foreground transition-colors">Subscription Manager</Link>
            <Link to="/reduce-subscription-costs" className="hover:text-foreground transition-colors">Reduce Costs</Link>
            <Link to="/subscription-tracker" className="hover:text-foreground transition-colors">Subscription Tracker</Link>
            <Link to="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
            <Link to="/login" className="hover:text-foreground transition-colors">{t("logIn")}</Link>
            <Link to="/signup" className="hover:text-foreground transition-colors">{t("signUp")}</Link>
          </div>
          <div className="flex flex-col items-center gap-2 md:items-end">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link to="/privacy-policy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
              <span aria-hidden="true">·</span>
              <Link to="/terms-of-service" className="hover:text-foreground transition-colors">Terms of Service</Link>
            </div>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Paythra. {t("allRightsReserved")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
