import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden bg-gradient-hero pt-32 pb-20">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(220,100%,50%,0.03)_1px,transparent_1px),linear-gradient(to_bottom,hsl(220,100%,50%,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
      <div className="container relative mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm shadow-card">
            <span className="h-2 w-2 rounded-full bg-gradient-primary" />
            <span className="text-muted-foreground">{t("heroChip")}</span>
          </div>

          <h1 className="font-display text-5xl font-extrabold leading-tight tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            {t("heroTitle1")}{" "}
            <span className="text-gradient">{t("heroTitle2")}</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            {t("heroDescription")}
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link to="/signup">
              <Button size="lg" className="bg-gradient-primary px-8 text-base shadow-glow hover:opacity-90 transition-opacity">
                {t("getStartedFree")}
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mx-auto mt-16 max-w-4xl"
        >
          <div className="rounded-2xl border border-border overflow-hidden shadow-elevated">
            <div className="relative aspect-video">
              <iframe
                src="https://www.youtube.com/embed/TL07Nw0V6Ls"
                title="Paythra demo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
