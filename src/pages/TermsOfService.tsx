import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";

const sections = [
  {
    title: "1. Acceptance",
    body: "By using Paythra you agree to these terms.",
  },
  {
    title: "2. Service",
    body: "Paythra is a subscription tracking and management tool. We do not guarantee detection accuracy.",
  },
  {
    title: "3. User responsibilities",
    body: "You are responsible for the accuracy of manually entered data.",
  },
  {
    title: "4. Payments",
    body: "The one-time premium fee of €19.99 is non-refundable after 30 days. The 30-day free trial requires no payment upfront.",
  },
  {
    title: "5. Termination",
    body: "We reserve the right to suspend accounts that violate these terms.",
  },
  {
    title: "6. Contact",
    body: "For legal enquiries, email legal@paythra.com.",
  },
];

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="bg-gradient-hero border-b border-border">
          <div className="container mx-auto px-4 py-16 md:py-20 max-w-3xl">
            <p className="text-sm font-medium text-primary mb-3">Legal</p>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground tracking-tight">
              Terms of Service
            </h1>
            <p className="mt-4 text-muted-foreground">Last updated: April 2026</p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12 md:py-16 max-w-3xl">
          <Card className="p-6 md:p-10 shadow-card">
            <div className="space-y-8">
              {sections.map((s) => (
                <section key={s.title}>
                  <h2 className="font-display text-xl md:text-2xl font-semibold text-foreground mb-3">
                    {s.title}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">{s.body}</p>
                </section>
              ))}
            </div>
          </Card>

          <div className="mt-8 text-sm text-muted-foreground">
            See also our{" "}
            <Link to="/privacy-policy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
            .
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService;
