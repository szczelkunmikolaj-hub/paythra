import SeoLandingLayout from "@/components/landing/SeoLandingLayout";

const CancelSubscriptions = () => (
  <SeoLandingLayout
    title="Cancel Subscriptions Easily | Paythra"
    description="Cancel subscriptions easily and stop unwanted subscriptions for good. Paythra finds the recurring charges you forgot about and helps you take action."
    canonical="https://paythra.com/cancel-subscriptions"
    h1="Cancel Subscriptions Easily"
    intro="Identify the subscriptions you no longer use and stop unwanted subscriptions in just a few taps with Paythra."
    sections={[
      {
        heading: "Find the subscriptions you forgot",
        body: "Paythra scans your transactions and surfaces every recurring charge — even the ones hiding under odd merchant names. If you don't recognize it, you probably don't need it.",
      },
      {
        heading: "Cancel subscriptions easily, one by one",
        body: "Each subscription includes a direct link to the provider's cancellation page along with the steps required. No more digging through settings menus or scary retention flows.",
      },
      {
        heading: "Stop unwanted subscriptions before renewal",
        body: "Get reminders before free trials end and before annual plans renew. Paythra makes sure you never get charged for something you meant to cancel.",
      },
      {
        heading: "Keep your money where it belongs",
        body: "On average, users find unused subscriptions worth dozens of euros every month. Cancel what you don't use — keep what you love.",
      },
    ]}
  />
);

export default CancelSubscriptions;
