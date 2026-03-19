import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, X, CheckCheck } from "lucide-react";
import SubscriptionIcon from "./SubscriptionIcon";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DetectedSub {
  merchant: string;
  amount: number;
  count: number;
  cycle: "monthly" | "yearly" | "unknown";
  serviceName: string | null;
  category: string;
  selected: boolean;
}

interface ImportConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  detected: DetectedSub[];
  onToggle: (merchant: string) => void;
  onSelectAll: () => void;
  onUpdateCycle: (merchant: string, cycle: "monthly" | "yearly") => void;
  onConfirm: () => void;
  importing: boolean;
  transactionCount: number;
}

const ImportConfirmModal = ({
  open, onOpenChange, detected, onToggle, onSelectAll,
  onUpdateCycle, onConfirm, importing, transactionCount,
}: ImportConfirmModalProps) => {
  const selectedCount = detected.filter((d) => d.selected).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">Subscriptions Detected</DialogTitle>
          <DialogDescription>
            Found {transactionCount} transactions with {detected.length} recurring patterns.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {selectedCount} of {detected.length} selected
            </p>
            <Button variant="ghost" size="sm" className="h-7 text-xs text-primary" onClick={onSelectAll}>
              <CheckCheck className="mr-1 h-3 w-3" /> Select all
            </Button>
          </div>

          {detected.map((d) => (
            <div
              key={d.merchant}
              className={`flex w-full items-center gap-3 rounded-xl border p-3 transition-all ${
                d.selected ? "border-primary/30 bg-primary/5" : "border-border bg-muted/30 opacity-60"
              }`}
            >
              <button type="button" onClick={() => onToggle(d.merchant)} className="flex items-center gap-3 flex-1 min-w-0 text-left">
                <SubscriptionIcon name={d.merchant} category={d.category} size="md" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{d.merchant}</p>
                  <p className="text-xs text-muted-foreground">
                    €{d.amount.toFixed(2)} • {d.count} charges
                  </p>
                </div>
              </button>

              {/* Cycle selector for unknown */}
              <Select
                value={d.cycle === "unknown" ? undefined : d.cycle}
                onValueChange={(v) => onUpdateCycle(d.merchant, v as "monthly" | "yearly")}
              >
                <SelectTrigger className="w-24 h-8 text-xs">
                  <SelectValue placeholder={d.cycle === "unknown" ? "Cycle?" : d.cycle} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>

              <button
                type="button"
                onClick={() => onToggle(d.merchant)}
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
                  d.selected ? "border-primary bg-primary text-primary-foreground" : "border-border"
                }`}
              >
                {d.selected && <Check className="h-3 w-3" />}
              </button>
            </div>
          ))}
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="gap-2">
            <X className="h-4 w-4" /> Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={importing || selectedCount === 0}
            className="bg-gradient-primary hover:opacity-90 transition-opacity gap-2"
          >
            <Check className="h-4 w-4" />
            {importing ? "Importing..." : `Confirm & Add ${selectedCount}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportConfirmModal;
