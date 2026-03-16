import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatsCards from "@/components/dashboard/StatsCards";
import SpendingChart from "@/components/dashboard/SpendingChart";
import CategoryChart from "@/components/dashboard/CategoryChart";
import SubscriptionCard from "@/components/dashboard/SubscriptionCard";
import SubscriptionForm from "@/components/dashboard/SubscriptionForm";
import DetectedSubscriptions from "@/components/dashboard/DetectedSubscriptions";
import HealthScoreCard from "@/components/dashboard/HealthScoreCard";
import OverloadIndexCard from "@/components/dashboard/OverloadIndexCard";
import SavingsPanel from "@/components/dashboard/SavingsPanel";
import TrialCountdown from "@/components/dashboard/TrialCountdown";
import ConnectAccounts from "@/components/dashboard/ConnectAccounts";
import { useSubscriptions, type Subscription } from "@/hooks/useSubscriptions";
import { useTransactions, type DetectedSubscription } from "@/hooks/useTransactions";
import { useTrialGuardian } from "@/hooks/useTrialGuardian";
import { useUnusedDetection } from "@/hooks/useUnusedDetection";
import { useServicePricing } from "@/hooks/useServicePricing";
import { useProfile } from "@/hooks/useProfile";
import { useSubscriptionIntelligence } from "@/hooks/useSubscriptionIntelligence";
import { Button } from "@/components/ui/button";
import { Plus, CreditCard, Upload } from "lucide-react";
import { format, addMonths } from "date-fns";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { subscriptions, isLoading, addSubscription, updateSubscription, deleteSubscription } = useSubscriptions();
  const { detectSubscriptions, transactions } = useTransactions();
  const { services } = useServicePricing();
  const { profile } = useProfile();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Subscription | null>(null);
  const [dismissed, setDismissed] = useState<string[]>([]);
  const navigate = useNavigate();

  useTrialGuardian(subscriptions);
  useUnusedDetection(subscriptions, transactions);

  const { insights, totalSavings, healthScore, overloadIndex, activeCount, monthlySpend } =
    useSubscriptionIntelligence({
      subscriptions,
      services,
      isStudent: profile?.is_student ?? false,
      monthlyIncome: profile?.monthly_income ?? null,
    });

  const detected = detectSubscriptions().filter((d) => !dismissed.includes(d.merchant));
  const unusedCount = subscriptions.filter((s) => s.is_unused).length;

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
            {/* Financial Overview */}
            <StatsCards subscriptions={subscriptions} />

            {/* Subscription Intelligence */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <HealthScoreCard
                score={healthScore}
                monthlySpend={monthlySpend}
                monthlyIncome={profile?.monthly_income ?? null}
                activeCount={activeCount}
                unusedCount={unusedCount}
              />
              <OverloadIndexCard activeCount={activeCount} />
              {totalSavings > 0 && (
                <div className="flex items-center rounded-xl border border-primary/20 bg-accent/30 p-6 shadow-card">
                  <div>
                    <p className="text-sm text-muted-foreground">Potential Savings</p>
                    <p className="text-3xl font-bold text-primary">€{totalSavings.toFixed(0)}<span className="text-sm font-normal text-muted-foreground">/year</span></p>
                  </div>
                </div>
              )}
            </div>

            {/* Trial Protection */}
            <TrialCountdown subscriptions={subscriptions} />

            {/* Detected Subscriptions */}
            <DetectedSubscriptions
              detected={detected}
              onConfirm={handleConfirmDetected}
              onDismiss={(m) => setDismissed((prev) => [...prev, m])}
            />

            {/* Charts */}
            <div className="grid gap-6 lg:grid-cols-2">
              <SpendingChart subscriptions={subscriptions} />
              <CategoryChart subscriptions={subscriptions} />
            </div>

            {/* Savings Opportunities */}
            <SavingsPanel insights={insights} totalSavings={totalSavings} />

            {/* Active Subscriptions */}
            <div>
              <h2 className="mb-4 font-display text-lg font-semibold text-foreground">Active Subscriptions</h2>
              {subscriptions.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-12 text-center">
                  <CreditCard className="mb-3 h-10 w-10 text-muted-foreground" />
                  <p className="font-medium text-foreground">No subscriptions yet</p>
                  <p className="mt-1 text-sm text-muted-foreground">Add your first subscription or import from a bank statement</p>
                  <div className="mt-4 flex gap-3">
                    <Button onClick={() => setFormOpen(true)} className="bg-gradient-primary hover:opacity-90 transition-opacity">
                      <Plus className="mr-2 h-4 w-4" /> Add Subscription
                    </Button>
                    <Button variant="outline" onClick={() => navigate("/settings")}>
                      <Upload className="mr-2 h-4 w-4" /> Upload Statement
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {subscriptions.map((sub) => (
                    <SubscriptionCard key={sub.id} subscription={sub} onEdit={handleEdit} onDelete={deleteSubscription} />
                  ))}
                </div>
              )}
            </div>

            {/* Future Integrations */}
            <ConnectAccounts />
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
