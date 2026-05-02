import SeoLandingLayout from "@/components/landing/SeoLandingLayout";

const SubscriptionTracker = () => (
  <SeoLandingLayout
    title="Best Subscription Tracking App | Paythra"
    description="Paythra is the subscription tracking app that tracks subscriptions automatically — simple, beautiful and built to save you money every month."
    canonical="https://paythra.com/subscription-tracker"
    h1="The Best Subscription Tracking App"
    intro="Track subscriptions automatically with Paythra — the subscription tracking app trusted by people who want a simple, modern way to manage recurring payments."
    sections={[
      {
        heading: "Track subscriptions automatically",
        body: "Paythra detects recurring payments from your transactions or email receipts. There's nothing to enter manually — the subscription tracking app does the work for you.",
      },
      {
        heading: "Simple, modern, beautifully designed",
        body: "A clean dashboard, dark mode, and mobile-first design. Paythra is the subscription tracking app you'll actually want to open every week.",
      },
      {
        heading: "Built for real life",
        body: "Multi-currency support, custom categories, and a payment calendar make it easy to track subscriptions whether you're in Europe, the UK or the US.",
      },
      {
        heading: "Free to start, premium when you need more",
        body: "Start tracking subscriptions for free, upgrade only if you want advanced insights and unlimited tracking. No surprises — that's the whole point.",
      },
    ]}
  />
);

export default SubscriptionTracker;
