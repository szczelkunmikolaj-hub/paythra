import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import CSVImport from "@/components/dashboard/CSVImport";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { CURRENCIES, getCurrencyOverride, setCurrencyOverride, getActiveCurrencyCode } from "@/lib/currency";
import { isGmailConnected, disconnectGmail, getConnectedEmail } from "@/lib/gmailPKCE";
import { Mail, Unplug } from "lucide-react";

const Settings = () => {
  const { user } = useAuth();
  const { profile, updateProfile } = useProfile();
  const { t, i18n } = useTranslation();

  const [income, setIncome] = useState(profile?.monthly_income?.toString() ?? "");
  const [isStudent, setIsStudent] = useState(profile?.is_student ?? false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [currencyCode, setCurrencyCode] = useState(getActiveCurrencyCode(i18n.language));
  const [gmailConnected, setGmailConnected] = useState(isGmailConnected());
  const [gmailEmail, setGmailEmail] = useState(getConnectedEmail());

  const handleGmailDisconnect = () => {
    disconnectGmail();
    setGmailConnected(false);
    setGmailEmail(null);
    toast({ title: t("gmailDisconnected") });
  };

  useEffect(() => {
    if (profile) {
      setIncome(profile.monthly_income?.toString() ?? "");
      setIsStudent(profile.is_student);
    }
  }, [profile]);

  useEffect(() => {
    setCurrencyCode(getActiveCurrencyCode(i18n.language));
  }, [i18n.language]);

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      await updateProfile({
        monthly_income: income ? parseFloat(income) : null,
        is_student: isStudent,
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleCurrencyChange = (code: string) => {
    if (code === "auto") {
      setCurrencyOverride(null);
    } else {
      setCurrencyOverride(code);
    }
    setCurrencyCode(code === "auto" ? getActiveCurrencyCode(i18n.language) : code);
    toast({ title: t("currencyUpdated") });
    // Force re-render across app
    window.dispatchEvent(new Event("currency-changed"));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="font-display text-2xl font-bold text-foreground">{t("settings")}</h1>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="font-display text-lg">{t("account")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <Label className="w-20 text-muted-foreground">{t("email")}</Label>
              <span className="text-foreground">{user?.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Label className="w-20 text-muted-foreground">{t("joined")}</Label>
              <span className="text-foreground">{user?.created_at ? new Date(user.created_at).toLocaleDateString() : "—"}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="font-display text-lg">{t("currencySettings")}</CardTitle>
            <p className="text-sm text-muted-foreground">{t("currencySettingsDesc")}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>{t("currency")}</Label>
              <Select value={getCurrencyOverride() || "auto"} onValueChange={handleCurrencyChange}>
                <SelectTrigger className="w-full sm:w-60">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">{t("automaticCurrency")}</SelectItem>
                  {Object.entries(CURRENCIES).map(([code, cfg]) => (
                    <SelectItem key={code} value={code}>
                      {cfg.symbol} {code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">{t("currencyHelp")}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="font-display text-lg">{t("intelligenceSettings")}</CardTitle>
            <p className="text-sm text-muted-foreground">{t("intelligenceDesc")}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="income">{t("monthlyIncome")}</Label>
              <Input id="income" type="number" step="0.01" min="0" value={income} onChange={(e) => setIncome(e.target.value)} placeholder="3000" />
              <p className="text-xs text-muted-foreground">{t("incomeHelp")}</p>
            </div>
            <div className="flex items-center gap-3">
              <Switch id="student" checked={isStudent} onCheckedChange={setIsStudent} />
              <Label htmlFor="student">{t("imStudent")}</Label>
            </div>
            <p className="text-xs text-muted-foreground">{t("studentHelp")}</p>
            <Button onClick={handleSaveProfile} className="bg-gradient-primary hover:opacity-90 transition-opacity" disabled={savingProfile}>
              {savingProfile ? t("saving") : t("saveSettings")}
            </Button>
          </CardContent>
        </Card>

        <CSVImport />

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" /> {t("settingsConnectedAccountsTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {gmailConnected ? (
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-sm font-medium">{t("settingsGmailConnected")}</p>
                  {gmailEmail && (
                    <p className="text-xs text-muted-foreground">{gmailEmail}</p>
                  )}
                </div>
                <Button
                  variant="outline"
                  onClick={handleGmailDisconnect}
                  className="gap-2 text-destructive hover:text-destructive"
                >
                  <Unplug className="h-4 w-4" /> {t("settingsDisconnectGmail")}
                </Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                {t("settingsGmailNotConnected")}
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="font-display text-lg">{t("legal")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
              <Link to="/privacy-policy" className="text-primary hover:underline">{t("privacyPolicy")}</Link>
              <span className="text-muted-foreground" aria-hidden="true">·</span>
              <Link to="/terms-of-service" className="text-primary hover:underline">{t("termsOfService")}</Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
