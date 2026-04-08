import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, CheckCheck, ChevronDown, ChevronUp, ShieldCheck, AlertTriangle, Package } from "lucide-react";
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
  confidence: "high" | "medium" | "low";
}

interface ParsedTransaction {
  date: string;
  merchant: string;
  amount: number;
}

interface ImportConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  detected: DetectedSub[];
  otherTransactions?: ParsedTransaction[];
  onToggle: (merchant: string) => void;
  onSelectAll: () => void;
  onUpdateCycle: (merchant: string, cycle: "monthly" | "yearly") => void;
  onConfirm: () => void;
  importing: boolean;
  transactionCount: number;
}

const ImportConfirmModal = ({
  open, onOpenChange, detected, otherTransactions = [], onToggle, onSelectAll,
  onUpdateCycle, onConfirm, importing, transactionCount,
}: ImportConfirmModalProps) => {
  const selectedCount = detected.filter((d) => d.selected).length;
  const highConfidence = detected.filter((d) => d.confidence === "high");
  const mediumConfidence = detected.filter((d) => d.confidence === "medium");
  const [showOther, setShowOther] = useState(false);

  const renderSubItem = (d: DetectedSub) => (
    <div
      key={d.merchant}
      className={`flex w-full items-center gap-3 rounded-xl border p-3 transition-all ${
        d.selected ? "border-primary/30 bg-primary/5" : "border-border bg-muted/30 opacity-60"
      }`}
    >
      <button type="button" onClick={() => onToggle(d.merchant)} className="flex items-center gap-3 flex-1 min-w-0 text-left">
        <SubscriptionIcon name={d.merchant} category={d.category} size="md" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-medium text-foreground truncate">{d.merchant}</p>
            {d.confidence === "high" && <Badge variant="outline" className="border-green-500/30 text-green-600 text-[10px] px-1.5">confirmed</Badge>}
            {d.confidence === "medium" && <Badge variant="outline" className="border-yellow-500/30 text-yellow-600 text-[10px] px-1.5">uncertain</Badge>}
          </div>
          <p className="text-xs text-muted-foreground">
            €{d.amount.toFixed(2)} • {d.count} charges
          </p>
        </div>
      </button>

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
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">Import Results</DialogTitle>
          <DialogDescription>
            Found {transactionCount} transactions. {detected.length > 0 ? `${detected.length} look like subscriptions.` : "No subscriptions detected."} {otherTransactions.length > 0 ? `${otherTransactions.length} are regular transactions.` : ""}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Confirmed subscriptions */}
          {highConfidence.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-green-500" />
                <p className="text-xs font-semibold uppercase tracking-wide text-green-600">
                  ✅ Detected Subscriptions ({highConfidence.length})
                </p>
              </div>
              {highConfidence.map(renderSubItem)}
            </div>
          )}

          {/* Uncertain */}
          {mediumConfidence.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <p className="text-xs font-semibold uppercase tracking-wide text-yellow-600">
                  ⚠️ Uncertain — Confirm with toggle ({mediumConfidence.length})
                </p>
              </div>
              {mediumConfidence.map(renderSubItem)}
            </div>
          )}

          {detected.length === 0 && (
            <div className="rounded-xl bg-muted/50 p-6 text-center">
              <Package className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No recurring subscriptions detected in this file.</p>
              <p className="text-xs text-muted-foreground mt-1">All {transactionCount} transactions will be imported as regular transactions.</p>
            </div>
          )}

          {/* Other transactions (collapsed) */}
          {otherTransactions.length > 0 && (
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setShowOther(!showOther)}
                className="flex w-full items-center justify-between rounded-lg bg-muted/40 px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted/60 transition-colors"
              >
                <span>❌ Other transactions ({otherTransactions.length}) — not subscriptions</span>
                {showOther ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              </button>
              {showOther && (
                <div className="max-h-40 overflow-y-auto rounded-lg border border-border bg-muted/20 p-2 space-y-1">
                  {otherTransactions.slice(0, 50).map((tx, i) => (
                    <div key={i} className="flex items-center justify-between px-2 py-1 text-xs text-muted-foreground">
                      <span className="truncate flex-1">{tx.merchant}</span>
                      <span className="shrink-0 ml-2">€{tx.amount.toFixed(2)}</span>
                      <span className="shrink-0 ml-2 text-[10px]">{tx.date}</span>
                    </div>
                  ))}
                  {otherTransactions.length > 50 && (
                    <p className="text-center text-[10px] text-muted-foreground py-1">...and {otherTransactions.length - 50} more</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {detected.length > 0 && (
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground">
              {selectedCount} of {detected.length} selected
            </p>
            <Button variant="ghost" size="sm" className="h-7 text-xs text-primary" onClick={onSelectAll}>
              <CheckCheck className="mr-1 h-3 w-3" /> Select all
            </Button>
          </div>
        )}

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="gap-2">
            <X className="h-4 w-4" /> Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={importing}
            className="bg-gradient-primary hover:opacity-90 transition-opacity gap-2"
          >
            <Check className="h-4 w-4" />
            {importing ? "Importing..." : selectedCount > 0 ? `Import ${transactionCount} txns + ${selectedCount} subs` : `Import ${transactionCount} transactions`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportConfirmModal;
