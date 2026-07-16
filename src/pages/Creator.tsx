import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";

const Creator = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="bg-gradient-hero border-b border-border">
          <div className="container mx-auto px-4 py-16 md:py-20 max-w-3xl">
            <p className="text-sm font-medium text-primary mb-3">About the builder</p>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground tracking-tight">
              Built by Mikołaj Szczełkun
            </h1>
          </div>
        </section>
        <div className="container mx-auto px-4 py-12 md:py-16 max-w-3xl">
          <Card className="p-6 md:p-10 shadow-card">
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Paythra was designed and built from scratch by Mikołaj Szczełkun (Nico),
                an independent developer based in Barcelona.
              </p>
              <p>
                It's one of several digital products he's built solo — spanning
                subscription management, SaaS tools, and local service platforms.
              </p>
              <p>
                See more of his work at{' '}
                <a
                  href="https://nico-portfolio-gold.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4 hover:no-underline"
                >
                  nico-portfolio-gold.vercel.app
                </a>
                .
              </p>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Creator;
