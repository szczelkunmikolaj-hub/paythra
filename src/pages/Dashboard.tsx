import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatsCards from "@/components/dashboard/StatsCards";
import SpendingChart from "@/components/dashboard/SpendingChart";
import CategoryChart from "@/components/dashboard/CategoryChart";
import SubscriptionCard from "@/components/dashboard/SubscriptionCard";
import SubscriptionForm from "@/components/dashboard/SubscriptionForm";
import DetectedSubscriptions from "@/components/dashboard/DetectedSubscriptions";
import { useSubscriptions, type Subscription } from "@/hooks/useSubscriptions";
import { useTransactions, type DetectedSubscription } from "@/hooks/useTransactions";
import { useTrialGuardian } from "@/hooks/useTrialGuardian";
import { Button } from "@/components/ui/button";
import { Plus, CreditCard } from "lucide-react";
import { format, addMonths } from "date-fns";

const Dashboard = () => {
  const { subscriptions, isLoading, addSubscription, updateSubscription, deleteSubscription } = useSubscriptions();
  const { detectSubscriptions } = useTransactions();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Subscription | null>(null);
  const [dismissed, setDismissed] = useState<string[]>([]);

  useTrialGuardian(subscriptions);

  const detected = detectSubscriptions().filter((d) => !dismissed.includes(d.merchant));

  const handleConfirmDetected = async (d: DetectedSubscription) => {
    await addSubscription({
      name: d.merchant,
      price: d.amount,
      billing_cycle: d.cycle,
      category: "other",
      start_date: format(new Date(), "yyyy-MM-dd"),
      next_billing_date: format(addMonths(new Date(), 1), "yyyy-MM-dd"),
    });
    setDismissed((prev) => [...prev, d.merchant]);
  };

  const handleEdit = (sub: Subscription) => {
    setEditing(sub);
    setFormOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold text-foreground">Dashboard</h1>
          <Button onClick={() => { setEditing(null); setFormOpen(true); }} className="bg-gradient-primary hover:opacity-90 transition-opacity">
            <Plus className="mr-2 h-4 w-4" /> Add Subscription
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <>
            <StatsCards subscriptions={subscriptions} />

            <DetectedSubscriptions
              detected={detected}
              onConfirm={handleConfirmDetected}
              onDismiss={(m) => setDismissed((prev) => [...prev, m])}
            />

            <div className="grid gap-6 lg:grid-cols-2">
              <SpendingChart subscriptions={subscriptions} />
              <CategoryChart subscriptions={subscriptions} />
            </div>

            <div>
              <h2 className="mb-4 font-display text-lg font-semibold text-foreground">Your Subscriptions</h2>
              {subscriptions.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-12 text-center">
                  <CreditCard className="mb-3 h-10 w-10 text-muted-foreground" />
                  <p className="text-muted-foreground">No subscriptions yet</p>
                  <Button variant="link" className="mt-2 text-primary" onClick={() => setFormOpen(true)}>
                    Add your first subscription
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {subscriptions.map((sub) => (
                    <SubscriptionCard key={sub.id} subscription={sub} onEdit={handleEdit} onDelete={deleteSubscription} />
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        <SubscriptionForm
          open={formOpen}
          onOpenChange={setFormOpen}
          onSubmit={addSubscription}
          onUpdate={updateSubscription}
          editing={editing}
        />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
