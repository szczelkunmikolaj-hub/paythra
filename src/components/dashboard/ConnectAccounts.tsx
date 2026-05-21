import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";

const ConnectAccounts = () => {
  const { t } = useTranslation();

  const handleOpenBanking = () => {
    // Open Banking integration - placeholder for real provider
    window.open("https://www.tink.com", "_blank");
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-display text-lg">
          <Building2 className="h-5 w-5 text-primary" />
          {t("connectYourBank")}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{t("connectBankDesc")}</p>
      </CardHeader>
      <CardContent>
        <Button
          onClick={handleOpenBanking}
          className="w-full gap-2 bg-gradient-primary hover:opacity-90 transition-opacity"
          size="lg"
        >
          <Building2 className="h-5 w-5" />
          {t("connectWithOpenBanking")}
        </Button>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          {t("openBankingSecure")}
        </p>
      </CardContent>
    </Card>
  );
};

export default ConnectAccounts;
