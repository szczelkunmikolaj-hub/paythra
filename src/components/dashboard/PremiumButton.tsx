import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import { useTranslation } from "react-i18next";

const PremiumButton = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/pricing")}
      className="relative flex items-center gap-2 rounded-2xl px-5 py-2 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:scale-[1.03] hover:shadow-xl active:scale-[0.97]"
      style={{
        background: "linear-gradient(135deg, #0000cc 0%, #0044ff 40%, #0077dd 70%, #00aaff 100%)",
      }}
    >
      <Star className="h-4 w-4" />
      <span>{t("premium")}</span>
    </button>
  );
};

export default PremiumButton;
