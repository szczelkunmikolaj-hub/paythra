import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import paythraLogo from "@/assets/paythra-logo.jpeg";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-border bg-muted/30 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <img src={paythraLogo} alt="Paythra" className="h-7 w-7 rounded-lg object-cover" />
            <span className="font-display text-lg font-bold text-foreground">Paythra</span>
          </div>
          <div className="flex gap-8 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">{t("home")}</Link>
            <a href="#features" className="hover:text-foreground transition-colors">{t("features")}</a>
            <Link to="/login" className="hover:text-foreground transition-colors">{t("logIn")}</Link>
            <Link to="/signup" className="hover:text-foreground transition-colors">{t("signUp")}</Link>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Paythra. {t("allRightsReserved")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
