import SeoLandingLayout from "@/components/landing/SeoLandingLayout";

const ReduceSubscriptionCosts = () => (
  <SeoLandingLayout
    title="How to Reduce Subscription Costs | Paythra"
    description="Learn how to reduce subscription costs and save money on subscriptions every month with Paythra's smart insights, alerts and recommendations."
    canonical="https://paythra.com/reduce-subscription-costs"
    h1="How to Reduce Subscription Costs"
    intro="Paythra turns your subscription chaos into clear, actionable insights so you can reduce subscription costs and save money on subscriptions month after month."
    sections={[
      {
        heading: "See where your money really goes",
        body: "Categorized spending, monthly totals, and 6 to 12 month forecasts make it easy to spot where you can save money on subscriptions immediately.",
      },
      {
        heading: "Spot duplicates and unused services",
        body: "Paying for two music apps? A streaming service you haven't used in months? Paythra flags duplicates and unused subscriptions so you can reduce subscription costs without thinking.",
      },
      {
        heading: "Get smart savings suggestions",
        body: "Paythra's intelligence engine recommends cheaper plans, family bundles, and annual discounts — practical ways to save money on subscriptions every month.",
      },
      {
        heading: "Watch your savings grow",
        body: "Track every cancellation and downgrade in your savings panel. Reduce subscription costs once, and Paythra keeps reminding you of the wins.",
      },
    ]}
  />
);

export default ReduceSubscriptionCosts;
