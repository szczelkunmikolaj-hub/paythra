import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useUserPlan, PlanType } from "@/hooks/useUserPlan";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, Sparkles, Building2, Zap, ShieldCheck, Infinity as InfinityIcon, Heart } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const PRICE_ONE_TIME = "€19.99";

const Pricing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { plan: currentPlan, upgradePlan, isUpgrading } = useUserPlan();

  const [contactOpen, setContactOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    users: "",
    message: "",
  });

  const handleBuy = async () => {
    if (!user) {
      navigate("/signup");
      return;
    }
    try {
      await upgradePlan("premium" as PlanType);
      toast({
        title: "Welcome to Premium",
        description: "You now own Paythra Premium — forever.",
      });
    } catch {
      toast({ title: "Something went wrong", variant: "destructive" });
    }
  };

  const handleTrial = async () => {
    if (!user) {
      navigate("/signup");
      return;
    }
    try {
      await upgradePlan("premium" as PlanType);
      toast({
        title: "30-day trial started",
        description: "Full access unlocked. You won't be charged until day 30.",
      });
    } catch {
      toast({ title: "Something went wrong", variant: "destructive" });
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.users) {
      toast({ title: "Please fill in name, email and team size", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    // Simulate submission — wire to backend later
    await new Promise((r) => setTimeout(r, 600));
    setSubmitting(false);
    setContactOpen(false);
    setForm({ name: "", company: "", email: "", users: "", message: "" });
    toast({
      title: "Request received",
      description: "Our team will get back to you within 24 hours.",
    });
  };

  const tiers = [
    {
      id: "free" as const,
      icon: Zap,
      name: "Free",
      tagline: "Free, forever.",
      price: null,
      features: [
        "Track up to 5 subscriptions",
        "Manual entry & basic dashboard",
        "Spending overview",
        "Multi-currency display",
      ],
      cta: { label: "Get started", action: () => (user ? navigate("/dashboard") : navigate("/signup")) },
    },
    {
      id: "premium" as const,
      icon: Sparkles,
      name: "Premium",
      tagline: "One-time payment — not a subscription.",
      price: PRICE_ONE_TIME,
      popular: true,
      features: [
        "Unlimited subscriptions",
        "AI auto-detection from bank & email",
        "Smart savings suggestions",
        "Duplicate & overlap finder",
        "Advanced analytics & forecasts",
        "Renewal & price-change alerts",
        "Multi-currency conversion",
      ],
    },
    {
      id: "business" as const,
      icon: Building2,
      name: "Business",
      tagline: "Enterprise.",
      price: null,
      features: [
        "White-label dashboard",
        "API detection engine",
        "Embedded savings tools",
        "Multi-user management",
        "Custom integrations",
        "Priority support",
        "Dedicated account manager",
        "Custom reporting",
        "SLA guarantee",
      ],
    },
  ];

  const content = (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
          Pricing
        </Badge>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground tracking-tight">
          Pay once. Save forever.
        </h1>
        <p className="mt-3 text-muted-foreground text-lg">
          Three simple tiers. No monthly fees. No surprises.
        </p>
      </div>

      {/* Tier cards */}
      <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3 items-stretch">
        {tiers.map((t, i) => {
          const Icon = t.icon;
          const isPremium = t.id === "premium";
          const isCurrent = currentPlan === t.id;

          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="flex"
            >
              <Card
                className={`relative flex w-full flex-col transition-all ${
                  isPremium
                    ? "border-2 border-primary shadow-glow ring-4 ring-primary/10 md:-translate-y-2"
                    : "border-border shadow-card hover:shadow-elevated"
                }`}
              >
                {isPremium && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-primary text-white shadow-md px-3 py-1">
                    <Sparkles className="h-3 w-3 mr-1" /> Most Popular
                  </Badge>
                )}

                <CardHeader className="text-center pb-4">
                  <div
                    className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl ${
                      isPremium ? "bg-gradient-primary text-white" : "bg-primary/10 text-primary"
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="font-display text-2xl">{t.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{t.tagline}</p>

                  <div className="mt-5 min-h-[72px] flex flex-col items-center justify-center">
                    {t.price ? (
                      <>
                        <div className="flex items-baseline justify-center gap-1">
                          <span className="text-5xl font-extrabold text-foreground">{t.price}</span>
                        </div>
                        <span className="text-xs uppercase tracking-wider text-muted-foreground mt-1">
                          one-time
                        </span>
                      </>
                    ) : t.id === "free" ? (
                      <div className="flex items-center gap-2 text-foreground">
                        <Heart className="h-5 w-5 text-primary" />
                        <span className="text-2xl font-bold">Always free</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-foreground">
                        <InfinityIcon className="h-5 w-5 text-primary" />
                        <span className="text-2xl font-bold">Custom</span>
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="flex flex-1 flex-col gap-6">
                  <ul className="space-y-3 flex-1">
                    {t.features.map((f, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-foreground/80">
                        <Check
                          className={`mt-0.5 h-4 w-4 shrink-0 ${
                            isPremium ? "text-primary" : "text-primary/70"
                          }`}
                        />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTAs */}
                  <div className="space-y-2">
                    {t.id === "premium" ? (
                      <>
                        <Button
                          className="w-full bg-gradient-primary hover:opacity-90 text-white font-semibold shadow-md"
                          size="lg"
                          disabled={isUpgrading || isCurrent}
                          onClick={handleBuy}
                        >
                          {isCurrent ? "You own Premium" : "Buy once, own forever"}
                        </Button>
                        <button
                          onClick={handleTrial}
                          disabled={isUpgrading}
                          className="w-full text-xs text-primary hover:underline font-medium"
                        >
                          Try Premium free for 30 days
                        </button>
                        <p className="text-[11px] text-center text-muted-foreground flex items-center justify-center gap-1 pt-1">
                          <ShieldCheck className="h-3 w-3" /> No recurring charges. Ever.
                        </p>
                      </>
                    ) : t.id === "business" ? (
                      <>
                        <Button
                          variant="outline"
                          className="w-full border-foreground/20 hover:bg-foreground hover:text-background"
                          size="lg"
                          onClick={() => setContactOpen(true)}
                        >
                          Get a quote
                        </Button>
                        <p className="text-[11px] text-center text-muted-foreground pt-1">
                          We'll get back to you within 24 hours.
                        </p>
                      </>
                    ) : (
                      <Button
                        variant="outline"
                        className="w-full"
                        size="lg"
                        disabled={isCurrent}
                        onClick={t.cta?.action}
                      >
                        {isCurrent ? "Current plan" : t.cta?.label}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Why no subscription */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mx-auto max-w-3xl"
      >
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-background to-accent/30 shadow-card">
          <CardContent className="p-8 text-center space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Heart className="h-6 w-6 text-primary" />
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground">
              Why no subscription?
            </h2>
            <p className="text-muted-foreground leading-relaxed max-w-xl mx-auto">
              Paythra exists to reduce your recurring costs. Charging you every month would
              contradict everything we stand for. So we don't. You pay once, and Paythra
              works for you — for as long as you need it.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Contact modal */}
      <Dialog open={contactOpen} onOpenChange={setContactOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Talk to our team</DialogTitle>
            <DialogDescription>
              Tell us about your organization and we'll tailor a plan for you.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="c-name">Name *</Label>
              <Input
                id="c-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                maxLength={100}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="c-company">Company</Label>
              <Input
                id="c-company"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                maxLength={100}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="c-email">Email *</Label>
              <Input
                id="c-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                maxLength={255}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="c-users">Number of users *</Label>
              <Select value={form.users} onValueChange={(v) => setForm({ ...form, users: v })}>
                <SelectTrigger id="c-users">
                  <SelectValue placeholder="Select team size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-50">1–50</SelectItem>
                  <SelectItem value="51-200">51–200</SelectItem>
                  <SelectItem value="200+">200+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="c-message">Message</Label>
              <Textarea
                id="c-message"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                maxLength={1000}
                rows={4}
                placeholder="Tell us what you're looking for…"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setContactOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting} className="bg-gradient-primary text-white hover:opacity-90">
                {submitting ? "Sending…" : "Send request"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );

  return user ? (
    <DashboardLayout>{content}</DashboardLayout>
  ) : (
    <div className="min-h-screen bg-background px-4 py-16">{content}</div>
  );
};

export default Pricing;
