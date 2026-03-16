import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, AlertCircle, Check, X } from "lucide-react";
import { useTransactions } from "@/hooks/useTransactions";
import { findService } from "@/lib/serviceRegistry";
import { toast } from "@/hooks/use-toast";
import Papa from "papaparse";

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
  logo: string | null;
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
];

const normalizeMerchant = (raw: string): string => {
  for (const { pattern, name } of MERCHANT_PATTERNS) {
    if (pattern.test(raw)) return name;
  }
  return raw.replace(/[^a-zA-Z0-9\s]/g, "").trim();
};

const CSVImport = () => {
  const { addTransaction } = useTransactions();
  const [importing, setImporting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [parsed, setParsed] = useState<ParsedTransaction[]>([]);
  const [detected, setDetected] = useState<DetectedFromCSV[]>([]);
  const [showPreview, setShowPreview] = useState(false);

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
          gaps.push(
            (new Date(sorted[i].date).getTime() - new Date(sorted[i - 1].date).getTime()) / (1000 * 60 * 60 * 24)
          );
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
        logo: service?.logo ?? null,
      });
    });

    return results.sort((a, b) => b.count - a.count);
  }, []);

  const parseFile = useCallback(
    (text: string) => {
      const result = Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (h: string) => h.toLowerCase().trim(),
      });

      if (result.errors.length > 0 && result.data.length === 0) return null;

      const rows = result.data as Record<string, string>[];
      const transactions: ParsedTransaction[] = [];

      for (const row of rows) {
        const dateVal = row.date || row.fecha || row.datum || row["transaction date"] || row["booking date"] || "";
        const merchantVal = row.merchant || row.description || row.payee || row.name || row.concepto || row.beschreibung || row["merchant name"] || "";
        const amountVal = row.amount || row.value || row.sum || row.importe || row.betrag || row.monto || "";

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
    },
    []
  );

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.name.match(/\.(csv|txt)$/i)) {
        toast({ title: "Invalid file", description: "Please upload a CSV file.", variant: "destructive" });
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        toast({ title: "File too large", description: "Maximum file size is 10MB.", variant: "destructive" });
        return;
      }

      const text = await file.text();
      const transactions = parseFile(text);

      if (!transactions || transactions.length === 0) {
        toast({
          title: "Could not parse CSV",
          description: "CSV must contain columns: date, merchant/description, amount.",
          variant: "destructive",
        });
        return;
      }

      setParsed(transactions);
      const recurring = detectRecurring(transactions);
      setDetected(recurring);
      setShowPreview(true);
    },
    [parseFile, detectRecurring]
  );

  const handleImportAll = async () => {
    setImporting(true);
    try {
      let imported = 0;
      for (const tx of parsed) {
        try {
          await addTransaction(tx);
          imported++;
        } catch {
          // skip
        }
      }
      toast({ title: `Imported ${imported} transactions`, description: `${parsed.length - imported} rows skipped.` });
      setParsed([]);
      setDetected([]);
      setShowPreview(false);
    } catch (err: any) {
      toast({ title: "Import failed", description: err.message, variant: "destructive" });
    } finally {
      setImporting(false);
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-display text-lg">
          <Upload className="h-5 w-5 text-primary" />
          Import Bank Transactions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!showPreview ? (
          <>
            <div
              className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors ${
                dragOver ? "border-primary bg-accent/50" : "border-border"
              }`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              <FileText className="mb-3 h-10 w-10 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">
                Drop your CSV bank statement here
              </p>
              <p className="mt-1 text-xs text-muted-foreground">or click to browse</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = ".csv,.txt";
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (file) handleFile(file);
                  };
                  input.click();
                }}
              >
                Choose File
              </Button>
            </div>

            <div className="flex items-start gap-2 rounded-lg bg-muted/50 p-3">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">
                CSV should contain columns: <strong>date</strong>, <strong>merchant</strong> (or description), and <strong>amount</strong>.
                Supports European bank formats. We auto-detect recurring subscriptions.
              </p>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">
                Found {parsed.length} transactions
              </p>
              <Button variant="ghost" size="sm" onClick={() => { setShowPreview(false); setParsed([]); setDetected([]); }}>
                <X className="mr-1 h-3.5 w-3.5" /> Cancel
              </Button>
            </div>

            {detected.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Detected Subscriptions</p>
                {detected.slice(0, 10).map((d) => (
                  <div key={d.merchant} className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-3">
                    {d.logo ? (
                      <img src={d.logo} alt={d.merchant} className="h-8 w-8 rounded object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{d.merchant}</p>
                      <p className="text-xs text-muted-foreground">
                        €{d.amount.toFixed(2)} • {d.cycle !== "unknown" ? d.cycle : "irregular"} • {d.count} charges
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Button
              onClick={handleImportAll}
              className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
              disabled={importing}
            >
              <Check className="mr-2 h-4 w-4" />
              {importing ? "Importing..." : `Import ${parsed.length} Transactions`}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CSVImport;
