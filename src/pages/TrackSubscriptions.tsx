import SeoLandingLayout from "@/components/landing/SeoLandingLayout";

const TrackSubscriptions = () => (
  <SeoLandingLayout
    title="Track Monthly Subscriptions Easily | Paythra"
    description="Track all your monthly subscriptions in one place with Paythra, the simple subscription tracker app that helps you save money every month."
    canonical="https://paythra.com/track-subscriptions"
    h1="Track Monthly Subscriptions Easily"
    intro="Paythra is the subscription tracker app that puts every recurring payment in one clean dashboard — so nothing slips through the cracks."
    sections={[
      {
        heading: "See every subscription in one place",
        body: "Stop juggling bank statements and email receipts. Paythra automatically detects recurring charges and shows you exactly what you pay, when, and to whom — all in one organized view.",
      },
      {
        heading: "Track monthly subscriptions automatically",
        body: "Connect your accounts or import a statement and Paythra identifies the recurring patterns for you. New subscriptions are spotted within days, so you always know where your money goes.",
      },
      {
        heading: "Save money with smart insights",
        body: "Track monthly subscriptions over time, spot price increases, and get alerted before free trials convert. The result: fewer surprises and real savings every month.",
      },
      {
        heading: "Built for everyday people",
        body: "No spreadsheets, no complex setup. Paythra is a subscription tracker app designed to be opened daily — fast, mobile-friendly, and beautifully simple.",
      },
    ]}
  />
);

export default TrackSubscriptions;
