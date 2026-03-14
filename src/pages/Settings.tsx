import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import CSVImport from "@/components/dashboard/CSVImport";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useTransactions } from "@/hooks/useTransactions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

const Settings = () => {
  const { user } = useAuth();
  const { profile, updateProfile } = useProfile();
  const { addTransaction } = useTransactions();

  const [merchant, setMerchant] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [loading, setLoading] = useState(false);

  const [income, setIncome] = useState(profile?.monthly_income?.toString() ?? "");
  const [isStudent, setIsStudent] = useState(profile?.is_student ?? false);
  const [savingProfile, setSavingProfile] = useState(false);

  // Sync when profile loads
  useEffect(() => {
    if (profile) {
      setIncome(profile.monthly_income?.toString() ?? "");
      setIsStudent(profile.is_student);
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      await updateProfile({
        monthly_income: income ? parseFloat(income) : null,
        is_student: isStudent,
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchant.trim() || !amount) return;
    setLoading(true);
    try {
      await addTransaction({ merchant: merchant.trim(), amount: parseFloat(amount), date });
      setMerchant("");
      setAmount("");
      setDate(format(new Date(), "yyyy-MM-dd"));
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Settings</h1>

        {/* Account */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="font-display text-lg">Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <Label className="w-20 text-muted-foreground">Email</Label>
              <span className="text-foreground">{user?.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Label className="w-20 text-muted-foreground">Joined</Label>
              <span className="text-foreground">{user?.created_at ? new Date(user.created_at).toLocaleDateString() : "—"}</span>
            </div>
          </CardContent>
        </Card>

        {/* Intelligence Settings */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="font-display text-lg">Intelligence Settings</CardTitle>
            <p className="text-sm text-muted-foreground">
              Configure your profile to unlock personalized insights and savings recommendations.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="income">Monthly Income (€) — optional</Label>
              <Input
                id="income"
                type="number"
                step="0.01"
                min="0"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                placeholder="3000"
              />
              <p className="text-xs text-muted-foreground">Used to calculate your subscription health score. Never shared.</p>
            </div>

            <div className="flex items-center gap-3">
              <Switch id="student" checked={isStudent} onCheckedChange={setIsStudent} />
              <Label htmlFor="student">I'm a student</Label>
            </div>
            <p className="text-xs text-muted-foreground">Enable to see student discount recommendations.</p>

            <Button
              onClick={handleSaveProfile}
              className="bg-gradient-primary hover:opacity-90 transition-opacity"
              disabled={savingProfile}
            >
              {savingProfile ? "Saving..." : "Save Settings"}
            </Button>
          </CardContent>
        </Card>

        {/* CSV Import */}
        <CSVImport />

        {/* Manual Transaction Entry */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="font-display text-lg">Add Transaction Manually</CardTitle>
            <p className="text-sm text-muted-foreground">
              Add transactions to enable automatic subscription detection.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddTransaction} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="merchant">Merchant</Label>
                  <Input id="merchant" value={merchant} onChange={(e) => setMerchant(e.target.value)} placeholder="Spotify" required maxLength={100} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (€)</Label>
                  <Input id="amount" type="number" step="0.01" min="0" max="99999" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="9.99" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="txDate">Date</Label>
                  <Input id="txDate" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                </div>
              </div>
              <Button type="submit" className="bg-gradient-primary hover:opacity-90 transition-opacity" disabled={loading}>
                {loading ? "Adding..." : "Add Transaction"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
