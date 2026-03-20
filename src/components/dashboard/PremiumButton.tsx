import { useState } from "react";
import { Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const PremiumButton = () => {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const handleClick = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke("send-premium-email");
      if (error) throw error;
      toast({ title: t("premiumEmailSent"), description: t("premiumEmailDesc") });
    } catch {
      toast({ title: t("error"), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="relative flex items-center gap-2 rounded-2xl px-5 py-2 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:scale-[1.03] hover:shadow-xl active:scale-[0.97] disabled:opacity-60"
      style={{
        background: "linear-gradient(135deg, #0000cc 0%, #0044ff 40%, #0077dd 70%, #00aaff 100%)",
      }}
    >
      <Star className="h-4 w-4" />
      <span>{loading ? t("sending") : t("premium")}</span>
    </button>
  );
};

export default PremiumButton;
