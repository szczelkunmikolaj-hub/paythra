import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { exchangeCodeForToken } from "@/lib/gmailPKCE";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState(t("connectingGmailDots"));

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const error = params.get("error");

    if (error) {
      setStatus("error");
      setMessage(`${t("googleErrorPrefix")} ${error}`);
      return;
    }
    if (!code) {
      setStatus("error");
      setMessage(t("noAuthCode"));
      return;
    }

    exchangeCodeForToken(code)
      .then(() => {
        setStatus("success");
        setMessage(t("gmailConnectedScanning"));
        setTimeout(() => navigate("/dashboard?tab=autodetect&scan=1", { replace: true }), 800);
      })
      .catch((e) => {
        setStatus("error");
        setMessage(e.message || t("failedToConnectGmail"));
      });
  }, [navigate, t]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-6">
      <div className="max-w-md w-full bg-card rounded-2xl shadow-card p-8 text-center space-y-4">
        {status === "loading" && <Loader2 className="h-12 w-12 mx-auto animate-spin text-primary" />}
        {status === "success" && <CheckCircle2 className="h-12 w-12 mx-auto text-green-500" />}
        {status === "error" && <AlertCircle className="h-12 w-12 mx-auto text-destructive" />}
        <h1 className="font-display text-2xl font-bold">
          {status === "loading" && t("connecting")}
          {status === "success" && t("connected")}
          {status === "error" && t("connectionFailed")}
        </h1>
        <p className="text-sm text-muted-foreground">{message}</p>
        {status === "error" && (
          <button
            onClick={() => navigate("/dashboard")}
            className="text-sm text-primary hover:underline"
          >
            {t("backToDashboard")}
          </button>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
