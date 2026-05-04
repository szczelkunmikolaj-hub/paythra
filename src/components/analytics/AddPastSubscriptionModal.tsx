import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { searchSubscription, type SubscriptionDatabaseEntry } from "@/data/subscriptionDatabase";
import { useSubscriptionHistory } from "@/hooks/useSubscriptionHistory";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 25 }, (_, i) => currentYear - i);

const AddPastSubscriptionModal = ({ open, onOpenChange }: Props) => {
  const { addHistory, isAdding } = useSubscriptionHistory();
  const [name, setName] = useState("");
  const [selected, setSelected] = useState<SubscriptionDatabaseEntry | null>(null);
  const [price, setPrice] = useState("");
  const [startMonth, setStartMonth] = useState(0);
  const [startYear, setStartYear] = useState(currentYear);
  const [endMonth, setEndMonth] = useState<number | "">("");
  const [endYear, setEndYear] = useState<number | "">("");

  const suggestions = useMemo(() => (name && !selected ? searchSubscription(name).slice(0, 6) : []), [name, selected]);

  const reset = () => {
    setName(""); setSelected(null); setPrice("");
    setStartMonth(0); setStartYear(currentYear);
    setEndMonth(""); setEndYear("");
  };

  const handleSelect = (e: SubscriptionDatabaseEntry) => {
    setSelected(e);
    setName(e.names[0]);
    const p = e.pricing.monthly?.EUR ?? e.pricing.monthly?.USD ?? e.pricing.monthly?.GBP ?? 0;
    if (p) setPrice(String(p));
  };

  const submit = async () => {
    if (!name || !price) return;
    const startDate = `${startYear}-${String(startMonth + 1).padStart(2, "0")}-01`;
    let endDate: string | null = null;
    if (endMonth !== "" && endYear !== "") {
      endDate = `${endYear}-${String((endMonth as number) + 1).padStart(2, "0")}-01`;
    }
    await addHistory({
      service_name: name,
      service_color: selected?.color ?? null,
      service_domain: selected?.domain ?? null,
      monthly_price: parseFloat(price),
      started_at: startDate,
      ended_at: endDate,
    });
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) reset(); onOpenChange(o); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add past subscription</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Label>Service name</Label>
            <Input
              value={name}
              onChange={(e) => { setName(e.target.value); setSelected(null); }}
              placeholder="e.g. Netflix"
            />
            {suggestions.length > 0 && (
              <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md max-h-60 overflow-auto">
                {suggestions.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleSelect(s)}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-accent"
                  >
                    <img src={`https://logo.clearbit.com/${s.domain}`} alt="" className="h-5 w-5 rounded" onError={(e) => ((e.target as HTMLImageElement).style.display = "none")} />
                    <span className="text-sm">{s.names[0]}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Start month</Label>
              <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={startMonth} onChange={(e) => setStartMonth(Number(e.target.value))}>
                {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
              </select>
            </div>
            <div>
              <Label>Start year</Label>
              <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={startYear} onChange={(e) => setStartYear(Number(e.target.value))}>
                {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div>
              <Label>End month (optional)</Label>
              <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={endMonth} onChange={(e) => setEndMonth(e.target.value === "" ? "" : Number(e.target.value))}>
                <option value="">— still active —</option>
                {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
              </select>
            </div>
            <div>
              <Label>End year</Label>
              <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={endYear} onChange={(e) => setEndYear(e.target.value === "" ? "" : Number(e.target.value))}>
                <option value="">—</option>
                {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>

          <div>
            <Label>Monthly price at the time</Label>
            <Input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="9.99" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={!name || !price || isAdding}>{isAdding ? "Saving…" : "Add"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddPastSubscriptionModal;
