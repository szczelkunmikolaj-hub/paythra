import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";

const sections = [
  {
    title: "1. What we collect",
    body: "We collect subscription data you manually enter or that is detected via connected services like Gmail. We do not store email content.",
  },
  {
    title: "2. How we use your data",
    body: "Your data is used solely to detect and display your subscriptions within Paythra. We never sell or share your data with third parties.",
  },
  {
    title: "3. Gmail access",
    body: "If you connect Gmail, we only read emails to identify subscription receipts. We never read personal emails. You can disconnect Gmail at any time from settings.",
  },
  {
    title: "4. Data storage",
    body: "Your data is stored securely and encrypted, both in transit and at rest.",
  },
  {
    title: "5. Contact",
    body: "For any privacy questions, email privacy@paythra.com.",
  },
];

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="bg-gradient-hero border-b border-border">
          <div className="container mx-auto px-4 py-16 md:py-20 max-w-3xl">
            <p className="text-sm font-medium text-primary mb-3">Legal</p>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground tracking-tight">
              Privacy Policy
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
            <Link to="/terms-of-service" className="text-primary hover:underline">
              Terms of Service
            </Link>
            .
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
