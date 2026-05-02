import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

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
  sections: Section[];
  ctaText?: string;
}

const SeoLandingLayout = ({
  title,
  description,
  canonical,
  h1,
  intro,
  sections,
  ctaText = "Start using Paythra",
}: SeoLandingLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <SEO title={title} description={description} canonical={canonical} />
      <Navbar />
      <main className="pt-24">
        <section className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-display text-4xl font-bold text-foreground sm:text-5xl">
              {h1}
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">{intro}</p>
            <Link to="/signup" className="mt-8 inline-block">
              <Button size="lg" className="bg-gradient-primary px-10 text-base shadow-glow hover:opacity-90 transition-opacity">
                {ctaText}
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

        <section className="container mx-auto px-4 pb-16">
          <div className="mx-auto grid max-w-4xl gap-8">
            {sections.map((s) => (
              <article key={s.heading} className="rounded-2xl border border-border bg-card p-8 shadow-sm">
                <h2 className="font-display text-2xl font-semibold text-foreground">{s.heading}</h2>
                <div className="mt-3 text-muted-foreground leading-relaxed">{s.body}</div>
              </article>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4 pb-24">
          <div className="mx-auto max-w-2xl rounded-2xl bg-gradient-primary p-10 text-center shadow-glow">
            <h2 className="font-display text-2xl font-bold text-primary-foreground sm:text-3xl">
              Ready to take control of your subscriptions?
            </h2>
            <p className="mt-3 text-primary-foreground/90">
              Join thousands of people saving money every month with Paythra.
            </p>
            <Link to="/signup" className="mt-6 inline-block">
              <Button size="lg" variant="secondary" className="px-10 text-base">
                {ctaText}
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

        <section className="container mx-auto px-4 pb-16">
          <div className="mx-auto max-w-4xl">
            <h2 className="font-display text-xl font-semibold text-foreground">Explore more</h2>
            <ul className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
              <li><Link to="/track-subscriptions" className="text-primary hover:underline">Track Monthly Subscriptions</Link></li>
              <li><Link to="/cancel-subscriptions" className="text-primary hover:underline">Cancel Subscriptions Easily</Link></li>
              <li><Link to="/subscription-manager" className="text-primary hover:underline">Personal Subscription Manager</Link></li>
              <li><Link to="/reduce-subscription-costs" className="text-primary hover:underline">Reduce Subscription Costs</Link></li>
              <li><Link to="/subscription-tracker" className="text-primary hover:underline">Best Subscription Tracking App</Link></li>
              <li><Link to="/pricing" className="text-primary hover:underline">Pricing</Link></li>
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default SeoLandingLayout;
