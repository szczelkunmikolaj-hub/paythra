import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { useDarkMode } from "@/hooks/useDarkMode";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, CreditCard, BarChart3, Bell, Settings, LogOut, Menu, CalendarDays, Moon, Sun } from "lucide-react";
import NotificationBell from "./NotificationBell";
import PremiumButton from "./PremiumButton";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import paythraLogo from "@/assets/paythra-logo.png";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const { signOut, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isDark, toggle: toggleDark } = useDarkMode();
  const [logoClicks, setLogoClicks] = useState(0);

  const navItems = [
    { to: "/dashboard", icon: LayoutDashboard, label: t("dashboard") },
    { to: "/subscriptions", icon: CreditCard, label: t("subscriptions") },
    { to: "/calendar", icon: CalendarDays, label: t("calendar") },
    { to: "/analytics", icon: BarChart3, label: t("analytics") },
    { to: "/notifications", icon: Bell, label: t("notifications") },
    { to: "/settings", icon: Settings, label: t("settings") },
  ];

  const handleLogoClick = useCallback(() => {
    const next = logoClicks + 1;
    setLogoClicks(next);
    if (next >= 10) {
      setLogoClicks(0);
      navigate("/secret");
    }
  }, [logoClicks, navigate]);

  return (
    <div className="flex min-h-screen bg-background transition-colors duration-300">
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-border bg-card transition-all duration-300 md:static md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center gap-2 border-b border-border px-6">
          <button onClick={handleLogoClick} className="flex items-center select-none">
            <img src={paythraLogo} alt="Paythra" className="h-10 w-10 rounded-lg object-[center_35%] object-cover" />
          </button>
        </div>

        <nav className="flex flex-col gap-1 p-4">
          {navItems.map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                location.pathname === to
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 border-t border-border p-4">
          <div className="mb-3 truncate px-3 text-sm text-muted-foreground">{user?.email}</div>
          <Button variant="ghost" size="sm" className="w-full justify-start gap-3 text-muted-foreground" onClick={signOut}>
            <LogOut className="h-4 w-4" />
            {t("logOut")}
          </Button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border px-4 md:px-6">
          <button className="md:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5 text-foreground" />
          </button>
          <div />
          <div className="flex items-center gap-2">
            <PremiumButton />
            <LanguageSwitcher />
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDark}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <NotificationBell />
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
