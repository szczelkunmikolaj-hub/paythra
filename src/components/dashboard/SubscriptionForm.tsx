import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { Subscription, SubscriptionInsert } from "@/hooks/useSubscriptions";
import { addMonths, addYears, format } from "date-fns";

interface SubscriptionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: SubscriptionInsert) => Promise<void>;
  onUpdate?: (data: Partial<Subscription> & { id: string }) => Promise<void>;
  editing?: Subscription | null;
}

const SubscriptionForm = ({ open, onOpenChange, onSubmit, onUpdate, editing }: SubscriptionFormProps) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [category, setCategory] = useState("other");
  const [startDate, setStartDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [isTrial, setIsTrial] = useState(false);
  const [trialEndDate, setTrialEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editing) {
      setName(editing.name);
      setPrice(editing.price.toString());
      setBillingCycle(editing.billing_cycle as "monthly" | "yearly");
      setCategory(editing.category);
      setStartDate(editing.start_date);
      setIsTrial(editing.is_trial);
      setTrialEndDate(editing.trial_end_date ?? "");
    } else {
      setName("");
      setPrice("");
      setBillingCycle("monthly");
      setCategory("other");
      setStartDate(format(new Date(), "yyyy-MM-dd"));
      setIsTrial(false);
      setTrialEndDate("");
    }
  }, [editing, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const start = new Date(startDate);
    const nextBilling = billingCycle === "monthly" ? addMonths(start, 1) : addYears(start, 1);

    const data: SubscriptionInsert = {
      name,
      price: parseFloat(price),
      billing_cycle: billingCycle,
      category,
      start_date: startDate,
      next_billing_date: format(nextBilling, "yyyy-MM-dd"),
      is_trial: isTrial,
      trial_end_date: isTrial && trialEndDate ? trialEndDate : null,
    };

    try {
      if (editing && onUpdate) {
        await onUpdate({ id: editing.id, ...data });
      } else {
        await onSubmit(data);
      }
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">{editing ? "Edit Subscription" : "Add Subscription"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Service Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Netflix" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (€)</Label>
              <Input id="price" type="number" step="0.01" min="0" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="9.99" required />
            </div>
            <div className="space-y-2">
              <Label>Billing Cycle</Label>
              <Select value={billingCycle} onValueChange={(v) => setBillingCycle(v as "monthly" | "yearly")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="streaming">Streaming</SelectItem>
                  <SelectItem value="gaming">Gaming</SelectItem>
                  <SelectItem value="software">Software</SelectItem>
                  <SelectItem value="productivity">Productivity</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Switch id="trial" checked={isTrial} onCheckedChange={setIsTrial} />
            <Label htmlFor="trial">Free Trial</Label>
          </div>

          {isTrial && (
            <div className="space-y-2">
              <Label htmlFor="trialEnd">Trial End Date</Label>
              <Input id="trialEnd" type="date" value={trialEndDate} onChange={(e) => setTrialEndDate(e.target.value)} required />
            </div>
          )}

          <Button type="submit" className="w-full bg-gradient-primary hover:opacity-90 transition-opacity" disabled={loading}>
            {loading ? "Saving..." : editing ? "Update" : "Add Subscription"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionForm;
