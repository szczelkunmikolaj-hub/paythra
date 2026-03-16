import { useState, useEffect, useRef, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { Subscription, SubscriptionInsert } from "@/hooks/useSubscriptions";
import { useUserCategories } from "@/hooks/useUserCategories";
import { SERVICE_REGISTRY, searchServices, findService } from "@/lib/serviceRegistry";
import { addMonths, addYears, format } from "date-fns";
import { Plus, Search } from "lucide-react";

interface SubscriptionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: SubscriptionInsert) => Promise<any>;
  onUpdate?: (data: Partial<Subscription> & { id: string }) => Promise<any>;
  editing?: Subscription | null;
}

const SubscriptionForm = ({ open, onOpenChange, onSubmit, onUpdate, editing }: SubscriptionFormProps) => {
  const { categories, addCategory } = useUserCategories();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [category, setCategory] = useState("other");
  const [startDate, setStartDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [isTrial, setIsTrial] = useState(false);
  const [trialEndDate, setTrialEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const searchResults = useMemo(() => searchServices(searchQuery), [searchQuery]);

  useEffect(() => {
    if (editing) {
      setName(editing.name);
      setPrice(editing.price.toString());
      setBillingCycle(editing.billing_cycle as "monthly" | "yearly");
      setCategory(editing.category);
      setStartDate(editing.start_date);
      setIsTrial(editing.is_trial);
      setTrialEndDate(editing.trial_end_date ?? "");
      setSearchQuery(editing.name);
    } else {
      setName("");
      setPrice("");
      setBillingCycle("monthly");
      setCategory("other");
      setStartDate(format(new Date(), "yyyy-MM-dd"));
      setIsTrial(false);
      setTrialEndDate("");
      setSearchQuery("");
    }
    setShowNewCategory(false);
    setNewCategory("");
    setShowDropdown(false);
  }, [editing, open]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectService = (service: typeof SERVICE_REGISTRY[0]) => {
    setName(service.name);
    setSearchQuery(service.name);
    setCategory(service.category);
    setShowDropdown(false);
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      await addCategory(newCategory);
      setCategory(newCategory.toLowerCase().trim());
      setNewCategory("");
      setShowNewCategory(false);
    } catch {
      // Error handled by hook
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const start = new Date(startDate);
    const nextBilling = billingCycle === "monthly" ? addMonths(start, 1) : addYears(start, 1);

    const match = findService(name);
    const logoUrl = match ? match.logo : null;

    const data: SubscriptionInsert = {
      name,
      price: parseFloat(price),
      billing_cycle: billingCycle,
      category,
      start_date: startDate,
      next_billing_date: format(nextBilling, "yyyy-MM-dd"),
      is_trial: isTrial,
      trial_end_date: isTrial && trialEndDate ? trialEndDate : null,
      logo_url: logoUrl,
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
          {/* Service search with autocomplete */}
          <div className="space-y-2 relative" ref={dropdownRef}>
            <Label htmlFor="service">Service</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="service"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setName(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                placeholder="Search services (e.g. Spotify, Netflix...)"
                className="pl-9"
                required
                autoComplete="off"
              />
            </div>
            {showDropdown && searchResults.length > 0 && (
              <div className="absolute z-50 mt-1 w-full rounded-lg border border-border bg-popover shadow-elevated max-h-48 overflow-y-auto">
                {searchResults.slice(0, 8).map((s) => (
                  <button
                    key={s.name}
                    type="button"
                    className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-accent/50 first:rounded-t-lg last:rounded-b-lg"
                    onClick={() => selectService(s)}
                  >
                    <img
                      src={s.logo}
                      alt={s.name}
                      className="h-6 w-6 rounded object-contain"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{s.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{s.category}</p>
                    </div>
                    <div
                      className="h-3 w-3 rounded-full shrink-0"
                      style={{ backgroundColor: s.color }}
                    />
                  </button>
                ))}
              </div>
            )}
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
              {showNewCategory ? (
                <div className="flex gap-2">
                  <Input
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Category name"
                    className="flex-1"
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddCategory())}
                  />
                  <Button type="button" size="sm" variant="outline" onClick={handleAddCategory}>
                    Add
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="flex-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-10 w-10 shrink-0"
                    onClick={() => setShowNewCategory(true)}
                    title="Add custom category"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              )}
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
