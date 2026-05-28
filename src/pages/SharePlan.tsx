import { useState } from "react";
import { useTranslation } from "react-i18next";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useSharedPlans } from "@/hooks/useSharedPlans";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { useAuth } from "@/contexts/AuthContext";
import { formatCurrency } from "@/lib/currency";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Plus, LogIn, Trash2, Share2 } from "lucide-react";

const CATEGORIES = [
  "streaming",
  "music",
  "gaming",
  "software",
  "productivity",
  "sports",
  "news",
  "cloud",
  "other",
];

const SharePlan = () => {
  const { user } = useAuth();
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const { subscriptions } = useSubscriptions();
  const {
    openPlans,
    myPlans,
    joinedPlanIds,
    isLoading,
    createPlan,
    joinPlan,
    leavePlan,
    deletePlan,
    isCreating,
    isJoining,
  } = useSharedPlans();

  const [selectedSubId, setSelectedSubId] = useState<string>("");
  const [customName, setCustomName] = useState("");
  const [category, setCategory] = useState("other");
  const [maxMembers, setMaxMembers] = useState(4);
  const [costPerPerson, setCostPerPerson] = useState("");

  const activeSubs = subscriptions.filter((s) => s.status === "active");

  const selectedSub = activeSubs.find((s) => s.id === selectedSubId);

  const handleSubSelect = (id: string) => {
    setSelectedSubId(id);
    const sub = activeSubs.find((s) => s.id === id);
    if (sub) {
      setCustomName(sub.name);
      setCategory(sub.category ?? "other");
      const monthly = sub.billing_cycle === "monthly" ? sub.price : sub.price / 12;
      setCostPerPerson((monthly / maxMembers).toFixed(2));
    }
  };

  const handleMaxMembersChange = (val: number) => {
    setMaxMembers(val);
    if (selectedSub) {
      const monthly = selectedSub.billing_cycle === "monthly" ? selectedSub.price : selectedSub.price / 12;
      setCostPerPerson((monthly / val).toFixed(2));
    }
  };

  const handleCreate = async () => {
    const name = customName.trim() || selectedSub?.name;
    if (!name) return;
    const cost = parseFloat(costPerPerson);
    if (!cost || cost <= 0) return;
    await createPlan({
      subscription_name: name,
      subscription_category: category,
      max_members: maxMembers,
      monthly_cost_per_person: cost,
    });
    setSelectedSubId("");
    setCustomName("");
    setCategory("other");
    setMaxMembers(4);
    setCostPerPerson("");
  };

  const browsePlans = openPlans.filter((p) => p.user_id !== user?.id);

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-3xl space-y-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Share a Plan</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Split the cost of a subscription with others — each person pays only their share.
          </p>
        </div>

        {/* Start a shared plan */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Share2 className="h-4 w-4 text-primary" />
              Start a shared plan
            </CardTitle>
            <CardDescription>
              Create a listing so others can join your subscription.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeSubs.length > 0 && (
              <div className="space-y-1.5">
                <Label>Pick from your subscriptions</Label>
                <Select value={selectedSubId} onValueChange={handleSubSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subscription…" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeSubs.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="plan-name">Subscription name</Label>
              <Input
                id="plan-name"
                placeholder="e.g. Netflix, Spotify…"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="max-members">Max members (2–10)</Label>
                <Input
                  id="max-members"
                  type="number"
                  min={2}
                  max={10}
                  value={maxMembers}
                  onChange={(e) => handleMaxMembersChange(Number(e.target.value))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cost-per-person">Cost per person / month (€)</Label>
                <Input
                  id="cost-per-person"
                  type="number"
                  min={0.01}
                  step={0.01}
                  placeholder="e.g. 3.99"
                  value={costPerPerson}
                  onChange={(e) => setCostPerPerson(e.target.value)}
                />
              </div>
            </div>

            <Button
              className="w-full bg-gradient-primary hover:opacity-90"
              onClick={handleCreate}
              disabled={isCreating || !customName.trim() || !costPerPerson || parseFloat(costPerPerson) <= 0}
            >
              <Plus className="mr-2 h-4 w-4" />
              {isCreating ? "Creating…" : "Create shared plan"}
            </Button>
          </CardContent>
        </Card>

        {/* My plans */}
        {myPlans.length > 0 && (
          <section className="space-y-3">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Your plans
            </h2>
            <div className="space-y-3">
              {myPlans.map((plan) => (
                <Card key={plan.id} className="shadow-card">
                  <CardContent className="flex items-center justify-between gap-4 p-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium text-foreground">{plan.subscription_name}</span>
                        <Badge variant="secondary" className="capitalize">{plan.subscription_category}</Badge>
                        <Badge variant={plan.status === "full" ? "default" : "outline"} className="capitalize">
                          {plan.status}
                        </Badge>
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {plan.current_members}/{plan.max_members} members ·{" "}
                        {formatCurrency(plan.monthly_cost_per_person, lang)}/mo per person
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0 text-muted-foreground hover:text-destructive"
                      onClick={() => deletePlan(plan.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Browse open plans */}
        <section className="space-y-3">
          <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Join a shared plan
          </h2>

          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading plans…</p>
          ) : browsePlans.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center gap-2 py-10 text-center">
                <Users className="h-8 w-8 text-muted-foreground/50" />
                <p className="text-sm font-medium text-foreground">No open plans yet</p>
                <p className="text-xs text-muted-foreground">
                  Be the first to create one — or check back soon.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {browsePlans.map((plan) => {
                const joined = joinedPlanIds.has(plan.id);
                return (
                  <Card key={plan.id} className="shadow-card">
                    <CardContent className="flex items-center justify-between gap-4 p-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium text-foreground">{plan.subscription_name}</span>
                          <Badge variant="secondary" className="capitalize">{plan.subscription_category}</Badge>
                        </div>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {plan.current_members}/{plan.max_members} members ·{" "}
                          {formatCurrency(plan.monthly_cost_per_person, lang)}/mo per person
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          Hosted by {plan.user_email}
                        </p>
                      </div>
                      {joined ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="shrink-0"
                          onClick={() => leavePlan(plan.id)}
                        >
                          Leave
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          className="shrink-0 bg-gradient-primary hover:opacity-90"
                          onClick={() => joinPlan(plan.id)}
                          disabled={isJoining}
                        >
                          <LogIn className="mr-1.5 h-3.5 w-3.5" />
                          Join
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
};

export default SharePlan;
