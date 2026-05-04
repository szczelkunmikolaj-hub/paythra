import { useState, useEffect, useRef, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { Subscription, SubscriptionInsert } from "@/hooks/useSubscriptions";
import { useUserCategories } from "@/hooks/useUserCategories";
import { SERVICE_REGISTRY, searchServices, findService } from "@/lib/serviceRegistry";
import { getPlansForService, getCountriesForService, getPlansForCountry, getCurrencyForCountry, suggestPlanByPrice, type ServicePlan } from "@/lib/servicePlans";
import { addMonths, addYears, format } from "date-fns";
import { Plus, Search, Globe, Tag } from "lucide-react";
import { searchSubscription, getDatabasePriceEUR, type SubscriptionDatabaseEntry } from "@/data/subscriptionDatabase";

interface SubscriptionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: SubscriptionInsert) => Promise<any>;
  onUpdate?: (data: Partial<Subscription> & { id: string }) => Promise<any>;
  editing?: Subscription | null;
}

const SubscriptionForm = ({ open, onOpenChange, onSubmit, onUpdate, editing }: SubscriptionFormProps) => {
  const { t } = useTranslation();
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

  // Country + plan selection state
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");
  const [isCustomPrice, setIsCustomPrice] = useState(false);

  const searchResults = useMemo(() => searchServices(searchQuery), [searchQuery]);
  const dbResults = useMemo(() => searchSubscription(searchQuery), [searchQuery]);

  // Derived data for country/plan selection
  const availableCountries = useMemo(() => getCountriesForService(name), [name]);
  const availablePlans = useMemo(() => {
    if (!selectedCountry || !name) return [];
    return getPlansForCountry(name, selectedCountry);
  }, [name, selectedCountry]);
  const hasPlanData = availableCountries.length > 0;
  const currency = useMemo(() => {
    if (!selectedCountry || !name) return "€";
    return getCurrencyForCountry(name, selectedCountry);
  }, [name, selectedCountry]);

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
      setIsCustomPrice(true);
    } else {
      setName("");
      setPrice("");
      setBillingCycle("monthly");
      setCategory("other");
      setStartDate(format(new Date(), "yyyy-MM-dd"));
      setIsTrial(false);
      setTrialEndDate("");
      setSearchQuery("");
      setIsCustomPrice(false);
    }
    setSelectedCountry("");
    setSelectedPlan("");
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
    // Reset country/plan when service changes
    setSelectedCountry("");
    setSelectedPlan("");
    setPrice("");
    setIsCustomPrice(false);
  };

  const selectPlan = (plan: ServicePlan) => {
    setPrice(plan.price.toString());
    setBillingCycle(plan.billingCycle);
    setSelectedPlan(plan.name);
    setIsCustomPrice(false);
  };

  const selectDbEntry = (entry: SubscriptionDatabaseEntry) => {
    const displayName = entry.names[0];
    setName(displayName);
    setSearchQuery(displayName);
    setCategory(entry.category);
    const monthlyPrice = getDatabasePriceEUR(entry, "monthly");
    if (monthlyPrice != null) {
      setPrice(monthlyPrice.toFixed(2));
      setBillingCycle("monthly");
    }
    setIsCustomPrice(true);
    setShowDropdown(false);
    setSelectedCountry("");
    setSelectedPlan("");
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
    const { getDatabaseEntryByName } = await import("@/data/subscriptionDatabase");
    const dbEntry = getDatabaseEntryByName(name);
    const logoUrl = match ? match.logo : (dbEntry ? `https://logo.clearbit.com/${dbEntry.domain}` : null);

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
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">{editing ? t("editSubscription") : t("addSubscription")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Service search with autocomplete */}
          <div className="space-y-2 relative" ref={dropdownRef}>
            <Label htmlFor="service">{t("service")}</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="service"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setName(e.target.value);
                  setShowDropdown(true);
                  setSelectedCountry("");
                  setSelectedPlan("");
                  setIsCustomPrice(false);
                }}
                onFocus={() => setShowDropdown(true)}
                placeholder={t("searchServicesPlaceholder")}
                className="pl-9"
                required
                autoComplete="off"
              />
            </div>
            {showDropdown && (searchResults.length > 0 || dbResults.length > 0) && (
              <div className="absolute z-50 mt-1 w-full rounded-lg border border-border bg-popover shadow-elevated max-h-64 overflow-y-auto">
                {dbResults.map((entry) => {
                  const displayName = entry.names[0];
                  const monthly = getDatabasePriceEUR(entry, "monthly");
                  return (
                    <button
                      key={`db-${entry.id}`}
                      type="button"
                      className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-accent/50"
                      onClick={() => selectDbEntry(entry)}
                    >
                      <img
                        src={`https://logo.clearbit.com/${entry.domain}`}
                        alt={displayName}
                        className="h-6 w-6 rounded object-contain"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{displayName}</p>
                        <p className="text-xs text-muted-foreground capitalize">{entry.category.replace(/_/g, " ")}</p>
                      </div>
                      {monthly != null && (
                        <span className="text-xs font-semibold text-foreground shrink-0">€{monthly.toFixed(2)}/mo</span>
                      )}
                    </button>
                  );
                })}
                {searchResults.slice(0, 8).map((s) => (
                  <button
                    key={s.name}
                    type="button"
                    className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-accent/50"
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
                    <div className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Country + Plan selection (shown only when plan data exists for this service) */}
          {hasPlanData && !editing && (
            <>
              <div className="space-y-2">
                <Label className="flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                   {t("country")}
                </Label>
                <Select value={selectedCountry} onValueChange={(v) => { setSelectedCountry(v); setSelectedPlan(""); setPrice(""); }}>
                  <SelectTrigger><SelectValue placeholder={t("selectCountry")} /></SelectTrigger>
                  <SelectContent>
                    {availableCountries.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {availablePlans.length > 0 && (
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5">
                    <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                    {t("plan")}
                  </Label>
                  <div className="grid gap-2">
                    {availablePlans.map((plan) => (
                      <button
                        key={plan.name}
                        type="button"
                        onClick={() => selectPlan(plan)}
                        className={`flex items-center justify-between rounded-lg border p-3 text-left transition-all ${
                          selectedPlan === plan.name
                            ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                            : "border-border hover:border-primary/40 hover:bg-accent/30"
                        }`}
                      >
                        <span className="text-sm font-medium text-foreground">{plan.name}</span>
                        <span className="text-sm font-semibold text-foreground">
                          {currency}{plan.price.toFixed(2)}<span className="text-xs font-normal text-muted-foreground">/{plan.billingCycle === "monthly" ? "mo" : "yr"}</span>
                        </span>
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => { setIsCustomPrice(true); setSelectedPlan("custom"); setPrice(""); }}
                      className={`flex items-center justify-center rounded-lg border border-dashed p-2.5 text-xs transition-colors ${
                        isCustomPrice ? "border-primary text-primary" : "border-border text-muted-foreground hover:border-primary/40"
                      }`}
                    >
                      {t("enterCustomPrice")}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Price + Billing (manual entry when no plan data or custom price) */}
          {(isCustomPrice || !hasPlanData || editing) && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">{t("price")} ({currency})</Label>
                <Input id="price" type="number" step="0.01" min="0" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="9.99" required />
              </div>
              <div className="space-y-2">
                <Label>{t("billingCycle")}</Label>
                <Select value={billingCycle} onValueChange={(v) => setBillingCycle(v as "monthly" | "yearly")}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">{t("monthly")}</SelectItem>
                    <SelectItem value="yearly">{t("yearly")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("categoryLabel")}</Label>
              {showNewCategory ? (
                <div className="flex gap-2">
                  <Input
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder={t("categoryNamePlaceholder")}
                    className="flex-1"
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddCategory())}
                  />
                  <Button type="button" size="sm" variant="outline" onClick={handleAddCategory}>
                    {t("addCategory")}
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
                    title={t("addCustomCategory")}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="startDate">{t("startDate")}</Label>
              <Input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Switch id="trial" checked={isTrial} onCheckedChange={setIsTrial} />
            <Label htmlFor="trial">{t("freeTrial")}</Label>
          </div>

          {isTrial && (
            <div className="space-y-2">
              <Label htmlFor="trialEnd">{t("trialEndDate")}</Label>
              <Input id="trialEnd" type="date" value={trialEndDate} onChange={(e) => setTrialEndDate(e.target.value)} required />
            </div>
          )}

          <Button type="submit" className="w-full bg-gradient-primary hover:opacity-90 transition-opacity" disabled={loading || (!price && !selectedPlan)}>
            {loading ? t("saving") : editing ? t("update") : t("addSubscription")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionForm;
