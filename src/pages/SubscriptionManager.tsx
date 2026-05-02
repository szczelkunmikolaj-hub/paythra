import SeoLandingLayout from "@/components/landing/SeoLandingLayout";

const SubscriptionManager = () => (
  <SeoLandingLayout
    title="Personal Subscription Manager | Paythra"
    description="Paythra is your personal subscription manager — a manage subscriptions app that organizes all your recurring payments in one elegant dashboard."
    canonical="https://paythra.com/subscription-manager"
    h1="Your Personal Subscription Manager"
    intro="Paythra is the personal subscription manager that brings order to your recurring payments — streaming, software, gym, cloud storage and everything in between."
    sections={[
      {
        heading: "All your recurring payments, organized",
        body: "From Netflix to iCloud to your favorite app, Paythra is a manage subscriptions app that categorizes everything automatically and shows you a clear monthly total.",
      },
      {
        heading: "A complete personal finance view",
        body: "Subscriptions are quietly the biggest leak in modern budgets. Paythra brings them into the open so you can budget with confidence.",
      },
      {
        heading: "Smart alerts that actually help",
        body: "Get notified about price increases, upcoming charges, and trials ending soon. Your personal subscription manager works in the background so you don't have to.",
      },
      {
        heading: "Private, secure, beautifully designed",
        body: "Your data is encrypted and protected. Paythra is built to be the manage subscriptions app you actually want to open.",
      },
    ]}
  />
);

export default SubscriptionManager;
