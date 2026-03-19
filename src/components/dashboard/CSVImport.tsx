import { useState, useCallback } from "react";
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

interface DetectedFromCSV {
  merchant: string;
  amount: number;
  count: number;
  cycle: "monthly" | "yearly" | "unknown";
  serviceName: string | null;
  category: string;
  selected: boolean;
}

interface ColumnMapping {
  date: string;
  merchant: string;
  amount: string;
}

const MERCHANT_PATTERNS = [
  { pattern: /spotify/i, name: "Spotify" },
  { pattern: /netflix/i, name: "Netflix" },
  { pattern: /apple\.com\/bill|itunes/i, name: "Apple" },
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
];

const normalizeMerchant = (raw: string): string => {
  for (const { pattern, name } of MERCHANT_PATTERNS) {
    if (pattern.test(raw)) return name;
  }
  return raw.replace(/[^a-zA-Z0-9\s]/g, "").trim();
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
  const { addTransaction } = useTransactions();
  const { addSubscription } = useSubscriptions();
  const [importing, setImporting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [parsed, setParsed] = useState<ParsedTransaction[]>([]);
  const [detected, setDetected] = useState<DetectedFromCSV[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [rawRows, setRawRows] = useState<Record<string, string>[]>([]);
  const [rawHeaders, setRawHeaders] = useState<string[]>([]);
  const [showColumnMapper, setShowColumnMapper] = useState(false);
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({ date: "", merchant: "", amount: "" });

  const detectRecurring = useCallback((txs: ParsedTransaction[]): DetectedFromCSV[] => {
    const grouped: Record<string, ParsedTransaction[]> = {};
    txs.forEach((tx) => {
      const key = normalizeMerchant(tx.merchant).toLowerCase();
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(tx);
    });

    const results: DetectedFromCSV[] = [];
    Object.entries(grouped).forEach(([, txGroup]) => {
      if (txGroup.length < 2) return;
      const sorted = txGroup.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      const avgAmount = sorted.reduce((s, t) => s + t.amount, 0) / sorted.length;

      let cycle: "monthly" | "yearly" | "unknown" = "unknown";
      if (sorted.length >= 2) {
        const gaps: number[] = [];
        for (let i = 1; i < sorted.length; i++) {
          gaps.push((new Date(sorted[i].date).getTime() - new Date(sorted[i - 1].date).getTime()) / (1000 * 60 * 60 * 24));
        }
        const avgGap = gaps.reduce((a, b) => a + b, 0) / gaps.length;
        if (avgGap >= 25 && avgGap <= 35) cycle = "monthly";
        else if (avgGap >= 340 && avgGap <= 395) cycle = "yearly";
      }

      const merchantName = normalizeMerchant(txGroup[0].merchant);
      const service = findService(merchantName);

      results.push({
        merchant: service?.name ?? merchantName,
        amount: Math.round(avgAmount * 100) / 100,
        count: txGroup.length,
        cycle,
        serviceName: service?.name ?? null,
        category: service?.category ?? detectCategory(merchantName),
        selected: true,
      });
    });

    return results.sort((a, b) => b.count - a.count);
  }, []);

  const parseRows = useCallback((rows: Record<string, string>[], mapping: ColumnMapping): ParsedTransaction[] => {
    const transactions: ParsedTransaction[] = [];
    for (const row of rows) {
      const dateVal = row[mapping.date] || "";
      const merchantVal = row[mapping.merchant] || "";
      const amountVal = row[mapping.amount] || "";
      if (!dateVal || !merchantVal || !amountVal) continue;

      const rawAmount = amountVal.replace(/[€$£,]/g, "").replace(",", ".").trim();
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
      const result = Papa.parse(text, { header: true, skipEmptyLines: true, transformHeader: (h: string) => h.trim() });

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
      const det = detectRecurring(transactions);
      setDetected(det);
      setShowModal(true);
    },
    [parseRows, detectRecurring]
  );

  const applyColumnMapping = () => {
    const transactions = parseRows(rawRows, columnMapping);
    if (transactions.length === 0) {
      toast({ title: "No valid rows", description: "Check your column mapping and try again.", variant: "destructive" });
      return;
    }
    setParsed(transactions);
    const det = detectRecurring(transactions);
    setDetected(det);
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
    setParsed([]); setDetected([]); setRawRows([]); setRawHeaders([]);
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
          {/* Column Mapper */}
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

          {/* Upload Area */}
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
                  Supports European bank formats (ES, FR, IT, DE). We auto-detect recurring subscriptions. If columns aren't detected, you can map them manually.
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
