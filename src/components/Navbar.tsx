import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import paythraLogo from "@/assets/paythra-logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useTranslation();
  const seoLinks = [
    { to: "/track-subscriptions", label: t("trackSubscriptionsNav") },
    { to: "/cancel-subscriptions", label: t("cancelSubscriptionsNav") },
    { to: "/subscription-manager", label: t("subscriptionManagerNav") },
    { to: "/reduce-subscription-costs", label: t("reduceCostsNav") },
    { to: "/subscription-tracker", label: t("subscriptionTrackerNav") },
    { to: "/pricing", label: t("pricingNav") },
    { to: "/", label: t("home") },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <button
                aria-label={t("openMenu")}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md text-foreground hover:bg-accent"
              >
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <SheetHeader>
                <SheetTitle>
                  <span className="flex items-center gap-2">
                    <img src={paythraLogo} alt="Paythra" className="h-8 w-8 rounded-lg" />
                    Paythra
                  </span>
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-1">
                {seoLinks.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => setMenuOpen(false)}
                    className="rounded-md px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent"
                  >
                    {l.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <Link to="/" className="flex items-center">
            <img src={paythraLogo} alt="Paythra" className="h-10 w-10 rounded-lg" />
          </Link>
        </div>

        <div className="hidden items-center gap-8 md:flex">
          <a href="/#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            {t("features")}
          </a>
          <a href="/#stats" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            {t("stats")}
          </a>
          <LanguageSwitcher />
          <Link to="/login">
            <Button variant="ghost" size="sm">{t("logIn")}</Button>
          </Link>
          <Link to="/signup">
            <Button size="sm" className="bg-gradient-primary hover:opacity-90 transition-opacity">
              {t("getStartedFree")}
            </Button>
          </Link>
        </div>

        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)} aria-label={t("toggleMenu")}>
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-border bg-background px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            <a href="/#features" className="text-sm text-muted-foreground" onClick={() => setIsOpen(false)}>{t("features")}</a>
            <a href="/#stats" className="text-sm text-muted-foreground" onClick={() => setIsOpen(false)}>{t("stats")}</a>
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
            </div>
            <Link to="/login" onClick={() => setIsOpen(false)}>
              <Button variant="ghost" size="sm" className="w-full justify-start">{t("logIn")}</Button>
            </Link>
            <Link to="/signup" onClick={() => setIsOpen(false)}>
              <Button size="sm" className="w-full bg-gradient-primary">{t("getStartedFree")}</Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
