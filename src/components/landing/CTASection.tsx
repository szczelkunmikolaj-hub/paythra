import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const CTASection = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            Take control of your subscriptions{" "}
            <span className="text-gradient">today</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Start saving money with Paythra. No credit card required.
          </p>
          <Link to="/signup" className="mt-8 inline-block">
            <Button size="lg" className="bg-gradient-primary px-10 text-base shadow-glow hover:opacity-90 transition-opacity">
              Create Free Account
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
