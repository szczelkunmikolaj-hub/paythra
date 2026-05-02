import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import HowItWorks from "@/components/landing/HowItWorks";
import RelatedFeatures from "@/components/landing/RelatedFeatures";
import { linkifyText } from "@/lib/linkify";

interface Section {
  heading: string;
  body: ReactNode;
}

interface SeoLandingLayoutProps {
  title: string;
  description: string;
  canonical: string;
  h1: string;
  intro: string;
  /** Heading + body for an opening "What is the problem?" block. */
  problemHeading?: string;
  problemBody?: string;
  sections: Section[];
  ctaText?: string;
}

const SeoLandingLayout = ({
  title,
  description,
  canonical,
  h1,
  intro,
  problemHeading,
  problemBody,
  sections,
  ctaText,
}: SeoLandingLayoutProps) => {
  const { t } = useTranslation();
  const primaryCta = ctaText ?? t("startUsingPaythra");

  // Determine current path for excluding the same card from related features.
  const excludePath = (() => {
    try {
      const u = new URL(canonical);
      return u.pathname.replace(/\/$/, "");
    } catch {
      return undefined;
    }
  })();

  const benefits = [
    { title: t("benefit1Title"), body: t("benefit1Body") },
    { title: t("benefit2Title"), body: t("benefit2Body") },
    { title: t("benefit3Title"), body: t("benefit3Body") },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO title={title} description={description} canonical={canonical} />
      <Navbar />
      <main className="pt-24">
        {/* Hero */}
        <section className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-display text-4xl font-bold text-foreground sm:text-5xl">
              {h1}
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">{linkifyText(intro)}</p>
            <Link to="/signup" className="mt-8 inline-block">
              <Button size="lg" className="bg-gradient-primary px-10 text-base shadow-glow hover:opacity-90 transition-opacity">
                {primaryCta}
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Optional problem framing */}
        {problemHeading && problemBody && (
          <section className="container mx-auto px-4 pb-8">
            <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-muted/40 p-8">
              <h2 className="font-display text-xl font-semibold text-foreground">
                {problemHeading}
              </h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                {linkifyText(problemBody)}
              </p>
            </div>
          </section>
        )}

        {/* Existing detail sections (now with auto-linkified text) */}
        <section className="container mx-auto px-4 pb-12">
          <div className="mx-auto grid max-w-4xl gap-8">
            {sections.map((s) => (
              <article key={s.heading} className="rounded-2xl border border-border bg-card p-8 shadow-sm">
                <h2 className="font-display text-2xl font-semibold text-foreground">{s.heading}</h2>
                <div className="mt-3 text-muted-foreground leading-relaxed">
                  {typeof s.body === "string" ? linkifyText(s.body) : s.body}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* How it works micro-flow with internal links */}
        <HowItWorks />

        {/* Benefits */}
        <section className="container mx-auto px-4 pb-16">
          <div className="mx-auto max-w-4xl">
            <h2 className="font-display text-2xl font-semibold text-foreground">
              {t("benefitsTitle")}
            </h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-3">
              {benefits.map((b) => (
                <li key={b.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <h3 className="font-display text-base font-semibold text-foreground">{b.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{b.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Final CTA */}
        <section className="container mx-auto px-4 pb-16">
          <div className="mx-auto max-w-2xl rounded-2xl bg-gradient-primary p-10 text-center shadow-glow">
            <h2 className="font-display text-2xl font-bold text-primary-foreground sm:text-3xl">
              {t("readyToTakeControl")}
            </h2>
            <p className="mt-3 text-primary-foreground/90">{t("joinThousandsSaving")}</p>
            <Link to="/signup" className="mt-6 inline-block">
              <Button size="lg" variant="secondary" className="px-10 text-base">
                {primaryCta}
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Related features (excludes current page) */}
        <RelatedFeatures excludePath={excludePath} />
      </main>
      <Footer />
    </div>
  );
};

export default SeoLandingLayout;
