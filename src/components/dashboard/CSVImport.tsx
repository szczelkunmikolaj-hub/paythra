import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, FileText, AlertCircle, Check, X, Columns } from "lucide-react";
import { useTransactions } from "@/hooks/useTransactions";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { findService } from "@/lib/serviceRegistry";
import { detectCategory } from "@/lib/categoryIcons";
import { toast } from "@/hooks/use-toast";
import Papa from "papaparse";
import ImportConfirmModal from "./ImportConfirmModal";

interface ParsedTransaction {
  date: string;
  merchant: string;
  amount: number;
}

export interface DetectedFromCSV {
  merchant: string;
  amount: number;
  count: number;
  cycle: "monthly" | "yearly" | "unknown";
  serviceName: string | null;
  category: string;
  selected: boolean;
  confidence: "high" | "medium" | "low";
}

interface ColumnMapping {
  date: string;
  merchant: string;
  amount: string;
}

// Known subscription keywords for smart filtering
const SUBSCRIPTION_KEYWORDS = [
  "netflix", "spotify", "apple", "google", "amazon prime", "prime video",
  "adobe", "microsoft", "hbo", "disney", "youtube", "gym", "subscription",
  "premium", "recurring", "hulu", "paramount", "crunchyroll", "dazn",
  "espn", "xbox", "playstation", "psn", "game pass", "linkedin",
  "dropbox", "notion", "figma", "canva", "slack", "github", "openai",
  "chatgpt", "zoom", "icloud", "one drive", "onedrive", "office 365",
  "creative cloud", "f1 tv", "nba", "audible", "kindle", "tidal",
  "deezer", "apple music", "apple tv", "twitch", "patreon",
  "membership", "monthly fee", "annual fee", "plan", "pro plan",
];

const MERCHANT_PATTERNS = [
  { pattern: /spotify/i, name: "Spotify" },
  { pattern: /netflix/i, name: "Netflix" },
  { pattern: /apple\.com\/bill|itunes|apple\s/i, name: "Apple" },
  { pattern: /google\s*\*?\s*youtube/i, name: "YouTube Premium" },
  { pattern: /chatgpt|openai/i, name: "ChatGPT Plus" },
  { pattern: /notion/i, name: "Notion" },
  { pattern: /canva/i, name: "Canva" },
  { pattern: /adobe/i, name: "Adobe Creative Cloud" },
  { pattern: /disney/i, name: "Disney+" },
  { pattern: /amazon\s*prime/i, name: "Amazon Prime" },
  { pattern: /hbo|max\.com/i, name: "HBO Max" },
  { pattern: /xbox|game\s*pass/i, name: "Xbox Game Pass" },
  { pattern: /playstation|psn/i, name: "PlayStation Plus" },
  { pattern: /dazn/i, name: "DAZN" },
  { pattern: /dropbox/i, name: "Dropbox" },
  { pattern: /microsoft|office\s*365/i, name: "Microsoft 365" },
  { pattern: /github/i, name: "GitHub" },
  { pattern: /figma/i, name: "Figma" },
  { pattern: /slack/i, name: "Slack" },
  { pattern: /linkedin/i, name: "LinkedIn Premium" },
  { pattern: /crunchyroll/i, name: "Crunchyroll" },
  { pattern: /paramount/i, name: "Paramount+" },
  { pattern: /f1\s*tv|formula\s*1/i, name: "F1 TV" },
  { pattern: /nba/i, name: "NBA League Pass" },
  { pattern: /espn/i, name: "ESPN+" },
  { pattern: /hulu/i, name: "Hulu" },
  { pattern: /gym|fitness/i, name: "Gym" },
  { pattern: /zoom/i, name: "Zoom" },
  { pattern: /icloud/i, name: "iCloud" },
];

const normalizeMerchant = (raw: string): string => {
  for (const { pattern, name } of MERCHANT_PATTERNS) {
    if (pattern.test(raw)) return name;
  }
  return raw.replace(/[^a-zA-Z0-9\s]/g, "").trim();
};

const isKnownSubscription = (merchant: string): boolean => {
  const lower = merchant.toLowerCase();
  return SUBSCRIPTION_KEYWORDS.some((kw) => lower.includes(kw));
};

const DATE_KEYS = ["date", "fecha", "datum", "transaction date", "booking date", "data", "date de valeur", "valuta", "buchungstag"];
const MERCHANT_KEYS = ["merchant", "description", "payee", "name", "concepto", "beschreibung", "merchant name", "libellé", "descrizione", "bezeichnung", "empfänger"];
const AMOUNT_KEYS = ["amount", "value", "sum", "importe", "betrag", "monto", "montant", "importo", "umsatz"];

function autoDetectColumns(headers: string[]): ColumnMapping | null {
  const lowerHeaders = headers.map((h) => h.toLowerCase().trim());
  const findCol = (keys: string[]) => {
    for (const key of keys) {
      const idx = lowerHeaders.findIndex((h) => h.includes(key));
      if (idx >= 0) return headers[idx];
    }
    return null;
  };
  const date = findCol(DATE_KEYS);
  const merchant = findCol(MERCHANT_KEYS);
  const amount = findCol(AMOUNT_KEYS);
  if (date && merchant && amount) return { date, merchant, amount };
  return null;
}

const ACCEPTED_TYPES = ".csv,.txt,.xlsx,.ofx,.qif";

const CSVImport = () => {
  const { t } = useTranslation();
  const { addTransaction } = useTransactions();
  const { addSubscription } = useSubscriptions();
  const [importing, setImporting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [parsed, setParsed] = useState<ParsedTransaction[]>([]);
  const [detected, setDetected] = useState<DetectedFromCSV[]>([]);
  const [otherTransactions, setOtherTransactions] = useState<ParsedTransaction[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [rawRows, setRawRows] = useState<Record<string, string>[]>([]);
  const [rawHeaders, setRawHeaders] = useState<string[]>([]);
  const [showColumnMapper, setShowColumnMapper] = useState(false);
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({ date: "", merchant: "", amount: "" });

  const detectSubscriptions = useCallback((txs: ParsedTransaction[]): { subs: DetectedFromCSV[]; other: ParsedTransaction[] } => {
    const grouped: Record<string, ParsedTransaction[]> = {};
    txs.forEach((tx) => {
      const key = normalizeMerchant(tx.merchant).toLowerCase();
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(tx);
    });

    const subs: DetectedFromCSV[] = [];
    const matchedKeys = new Set<string>();

    Object.entries(grouped).forEach(([key, txGroup]) => {
      const merchantName = normalizeMerchant(txGroup[0].merchant);
      const isKnown = isKnownSubscription(txGroup[0].merchant) || isKnownSubscription(merchantName);
      const service = findService(merchantName);

      // Check for amount similarity (within ±10%)
      const amounts = txGroup.map((t) => t.amount);
      const avgAmount = amounts.reduce((a, b) => a + b, 0) / amounts.length;
      const amountConsistent = amounts.every((a) => Math.abs(a - avgAmount) / avgAmount <= 0.1);

      // Check periodicity
      let cycle: "monthly" | "yearly" | "unknown" = "unknown";
      if (txGroup.length >= 2) {
        const sorted = [...txGroup].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        const gaps: number[] = [];
        for (let i = 1; i < sorted.length; i++) {
          gaps.push((new Date(sorted[i].date).getTime() - new Date(sorted[i - 1].date).getTime()) / (1000 * 60 * 60 * 24));
        }
        const avgGap = gaps.reduce((a, b) => a + b, 0) / gaps.length;
        if (avgGap >= 25 && avgGap <= 35) cycle = "monthly";
        else if (avgGap >= 340 && avgGap <= 395) cycle = "yearly";
      }

      // Determine confidence
      let confidence: "high" | "medium" | "low" = "low";

      if (isKnown || service) {
        // Known service → high if recurring, medium if single
        if (txGroup.length >= 2 && amountConsistent && cycle !== "unknown") {
          confidence = "high";
        } else if (txGroup.length >= 2 && amountConsistent) {
          confidence = "high";
        } else {
          confidence = "medium";
        }
      } else if (txGroup.length >= 2 && amountConsistent && cycle !== "unknown") {
        // Unknown service but recurring pattern
        confidence = "medium";
      } else if (txGroup.length >= 3 && amountConsistent) {
        // Many occurrences with same amount
        confidence = "medium";
      }

      // Only include as subscription if confidence > low
      if (confidence !== "low") {
        matchedKeys.add(key);
        subs.push({
          merchant: service?.name ?? merchantName,
          amount: Math.round(avgAmount * 100) / 100,
          count: txGroup.length,
          cycle,
          serviceName: service?.name ?? null,
          category: service?.category ?? detectCategory(merchantName),
          selected: confidence === "high",
          confidence,
        });
      }
    });

    // Everything else is "other transactions"
    const other = txs.filter((tx) => {
      const key = normalizeMerchant(tx.merchant).toLowerCase();
      return !matchedKeys.has(key);
    });

    // Sort: high confidence first, then medium
    subs.sort((a, b) => {
      const order = { high: 0, medium: 1, low: 2 };
      return order[a.confidence] - order[b.confidence] || b.count - a.count;
    });

    return { subs, other };
  }, []);

  const parseRows = useCallback((rows: Record<string, string>[], mapping: ColumnMapping): ParsedTransaction[] => {
    const transactions: ParsedTransaction[] = [];
    for (const row of rows) {
      const dateVal = row[mapping.date] || "";
      const merchantVal = row[mapping.merchant] || "";
      const amountVal = row[mapping.amount] || "";
      if (!dateVal || !merchantVal || !amountVal) continue;

      const rawAmount = amountVal.replace(/[€$£zł,\s]/g, "").replace(",", ".").trim();
      const amount = Math.abs(parseFloat(rawAmount));
      if (isNaN(amount) || amount === 0) continue;

      let parsedDate: Date | null = null;
      const isoDate = new Date(dateVal.replace(/"/g, "").trim());
      if (!isNaN(isoDate.getTime())) {
        parsedDate = isoDate;
      } else {
        const parts = dateVal.replace(/"/g, "").trim().split(/[/.\-]/);
        if (parts.length === 3) {
          const [d, m, y] = parts;
          const attempt = new Date(`${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`);
          if (!isNaN(attempt.getTime())) parsedDate = attempt;
        }
      }
      if (!parsedDate) continue;

      transactions.push({
        date: parsedDate.toISOString().split("T")[0],
        merchant: merchantVal.replace(/"/g, "").trim(),
        amount,
      });
    }
    return transactions;
  }, []);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.name.match(/\.(csv|txt|xlsx|ofx|qif)$/i)) {
        toast({ title: "Unsupported format", description: "Supported: CSV, TXT, XLSX, OFX, QIF", variant: "destructive" });
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast({ title: "File too large", description: "Maximum file size is 10MB.", variant: "destructive" });
        return;
      }

      const text = await file.text();
      // Try semicolon delimiter first (common in EU), then comma
      let result = Papa.parse(text, { header: true, skipEmptyLines: true, transformHeader: (h: string) => h.trim(), delimiter: ";" });
      if (!result.meta.fields || result.meta.fields.length <= 1) {
        result = Papa.parse(text, { header: true, skipEmptyLines: true, transformHeader: (h: string) => h.trim() });
      }

      if (result.data.length === 0) {
        toast({ title: "Empty file", description: "No data rows found in this file.", variant: "destructive" });
        return;
      }

      const rows = result.data as Record<string, string>[];
      const headers = result.meta.fields ?? Object.keys(rows[0]);
      const mapping = autoDetectColumns(headers);

      if (!mapping) {
        setRawRows(rows);
        setRawHeaders(headers);
        setColumnMapping({ date: headers[0] || "", merchant: headers[1] || "", amount: headers[2] || "" });
        setShowColumnMapper(true);
        return;
      }

      const transactions = parseRows(rows, mapping);
      if (transactions.length === 0) {
        setRawRows(rows);
        setRawHeaders(headers);
        setColumnMapping(mapping);
        setShowColumnMapper(true);
        toast({ title: "Auto-detection found 0 rows", description: "Please map columns manually.", variant: "default" });
        return;
      }

      setParsed(transactions);
      const { subs, other } = detectSubscriptions(transactions);
      setDetected(subs);
      setOtherTransactions(other);
      setShowModal(true);
    },
    [parseRows, detectSubscriptions]
  );

  const applyColumnMapping = () => {
    const transactions = parseRows(rawRows, columnMapping);
    if (transactions.length === 0) {
      toast({ title: "No valid rows", description: "Check your column mapping and try again.", variant: "destructive" });
      return;
    }
    setParsed(transactions);
    const { subs, other } = detectSubscriptions(transactions);
    setDetected(subs);
    setOtherTransactions(other);
    setShowColumnMapper(false);
    setShowModal(true);
  };

  const toggleDetected = (merchant: string) => {
    setDetected((prev) => prev.map((d) => (d.merchant === merchant ? { ...d, selected: !d.selected } : d)));
  };

  const updateCycle = (merchant: string, cycle: "monthly" | "yearly") => {
    setDetected((prev) => prev.map((d) => (d.merchant === merchant ? { ...d, cycle } : d)));
  };

  const selectAll = () => {
    setDetected((prev) => prev.map((d) => ({ ...d, selected: true })));
  };

  const handleConfirmImport = async () => {
    setImporting(true);
    try {
      // Import all transactions
      let imported = 0;
      for (const tx of parsed) {
        try { await addTransaction(tx); imported++; } catch { /* skip */ }
      }

      // Add selected detected subscriptions
      const selected = detected.filter((d) => d.selected && d.cycle !== "unknown");
      for (const sub of selected) {
        const today = new Date();
        const nextBilling = new Date(today);
        if (sub.cycle === "monthly") nextBilling.setMonth(nextBilling.getMonth() + 1);
        else nextBilling.setFullYear(nextBilling.getFullYear() + 1);

        try {
          await addSubscription({
            name: sub.merchant,
            price: sub.amount,
            billing_cycle: sub.cycle,
            category: sub.category,
            next_billing_date: nextBilling.toISOString().split("T")[0],
          });
        } catch { /* skip */ }
      }

      toast({
        title: `Imported ${imported} transactions`,
        description: selected.length > 0 ? `Added ${selected.length} subscriptions.` : undefined,
      });
      resetAll();
    } catch (err: any) {
      toast({ title: "Import failed", description: err.message, variant: "destructive" });
    } finally {
      setImporting(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const openFilePicker = () => {
    const input = document.createElement("input");
    input.type = "file"; input.accept = ACCEPTED_TYPES;
    input.onchange = (e) => { const file = (e.target as HTMLInputElement).files?.[0]; if (file) handleFile(file); };
    input.click();
  };

  const resetAll = () => {
    setShowModal(false); setShowColumnMapper(false);
    setParsed([]); setDetected([]); setOtherTransactions([]); setRawRows([]); setRawHeaders([]);
  };

  return (
    <>
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display text-lg">
            <Upload className="h-5 w-5 text-primary" />
            Import Bank Transactions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {showColumnMapper && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Columns className="h-4 w-4 text-primary" />
                  <p className="text-sm font-medium text-foreground">Map your columns</p>
                </div>
                <Button variant="ghost" size="sm" onClick={resetAll}><X className="mr-1 h-3.5 w-3.5" /> Cancel</Button>
              </div>

              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      {rawHeaders.slice(0, 6).map((h) => (
                        <th key={h} className="px-3 py-2 text-left font-medium text-muted-foreground">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rawRows.slice(0, 3).map((row, i) => (
                      <tr key={i} className="border-b border-border last:border-0">
                        {rawHeaders.slice(0, 6).map((h) => (
                          <td key={h} className="px-3 py-2 text-foreground truncate max-w-[150px]">{row[h]}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {(["date", "merchant", "amount"] as const).map((field) => (
                  <div key={field}>
                    <label className="mb-1 block text-xs font-medium text-muted-foreground capitalize">{field} Column</label>
                    <Select value={columnMapping[field]} onValueChange={(v) => setColumnMapping((prev) => ({ ...prev, [field]: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {rawHeaders.map((h) => <SelectItem key={h} value={h}>{h}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>

              <Button onClick={applyColumnMapping} className="w-full bg-gradient-primary hover:opacity-90 transition-opacity">
                <Check className="mr-2 h-4 w-4" /> Apply & Continue
              </Button>
            </div>
          )}

          {!showColumnMapper && (
            <>
              <div
                className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 transition-colors cursor-pointer ${
                  dragOver ? "border-primary bg-accent/50" : "border-border hover:border-primary/40"
                }`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={openFilePicker}
              >
                <FileText className="mb-3 h-10 w-10 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground">Drop your bank statement here</p>
                <p className="mt-1 text-xs text-muted-foreground">CSV, XLSX, OFX, QIF supported</p>
                <Button variant="outline" size="sm" className="mt-3" type="button" onClick={(e) => { e.stopPropagation(); openFilePicker(); }}>
                  Choose File
                </Button>
              </div>
              <div className="flex items-start gap-2 rounded-xl bg-muted/50 p-3">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">
                  Smart detection: only recurring payments are flagged as subscriptions. One-time purchases are kept as regular transactions.
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <ImportConfirmModal
        open={showModal}
        onOpenChange={(open) => { if (!open) resetAll(); setShowModal(open); }}
        detected={detected}
        otherTransactions={otherTransactions}
        onToggle={toggleDetected}
        onSelectAll={selectAll}
        onUpdateCycle={updateCycle}
        onConfirm={handleConfirmImport}
        importing={importing}
        transactionCount={parsed.length}
      />
    </>
  );
};

export default CSVImport;
