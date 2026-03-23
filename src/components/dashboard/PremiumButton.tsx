import { useState } from "react";
import { Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useUserPlan } from "@/hooks/useUserPlan";
import PlanSelectionModal from "./PlanSelectionModal";
import { motion } from "framer-motion";

const PremiumButton = () => {
  const { t } = useTranslation();
  const { hasValidDiscount, isTestMode } = useUserPlan();
  const [modalOpen, setModalOpen] = useState(false);

  const isActive = hasValidDiscount || isTestMode;

  return (
    <>
      <motion.button
        onClick={() => setModalOpen(true)}
        className="relative flex items-center gap-2 rounded-2xl px-5 py-2 text-sm font-semibold text-white shadow-lg transition-all duration-200"
        style={{
          background: isActive
            ? "linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)"
            : "linear-gradient(135deg, #0000cc 0%, #0044ff 40%, #0077dd 70%, #00aaff 100%)",
        }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        animate={{
          boxShadow: [
            "0 0 8px rgba(0,68,255,0.3)",
            "0 0 20px rgba(0,68,255,0.5)",
            "0 0 8px rgba(0,68,255,0.3)",
          ],
        }}
        transition={{
          boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <Star className="h-4 w-4 animate-pulse" />
        <span>{isActive ? t("premiumActive") : t("premium")}</span>
      </motion.button>
      <PlanSelectionModal open={modalOpen} onOpenChange={setModalOpen} />
    </>
  );
};

export default PremiumButton;
