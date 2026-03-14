import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, AlertCircle } from "lucide-react";
import { useTransactions } from "@/hooks/useTransactions";
import { toast } from "@/hooks/use-toast";

const CSVImport = () => {
  const { addTransaction } = useTransactions();
  const [importing, setImporting] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const parseCSV = useCallback((text: string) => {
    const lines = text.trim().split("\n");
    if (lines.length < 2) return [];

    const header = lines[0].toLowerCase();
    const cols = header.split(/[,;\t]/);

    // Find column indices
    const dateIdx = cols.findIndex((c) => c.includes("date"));
    const merchantIdx = cols.findIndex((c) => c.includes("merchant") || c.includes("description") || c.includes("payee") || c.includes("name"));
    const amountIdx = cols.findIndex((c) => c.includes("amount") || c.includes("value") || c.includes("sum"));

    if (dateIdx === -1 || merchantIdx === -1 || amountIdx === -1) {
      return null; // Can't parse
    }

    const transactions: { date: string; merchant: string; amount: number }[] = [];

    for (let i = 1; i < lines.length; i++) {
      const vals = lines[i].split(/[,;\t]/);
      if (vals.length <= Math.max(dateIdx, merchantIdx, amountIdx)) continue;

      const rawDate = vals[dateIdx].trim().replace(/"/g, "");
      const merchant = vals[merchantIdx].trim().replace(/"/g, "");
      const rawAmount = vals[amountIdx].trim().replace(/"/g, "").replace(",", ".");
      const amount = Math.abs(parseFloat(rawAmount));

      if (!merchant || isNaN(amount) || amount === 0) continue;

      // Parse date - try multiple formats
      let parsedDate: Date | null = null;
      const dateStr = rawDate;
      
      // Try ISO format
      const isoDate = new Date(dateStr);
      if (!isNaN(isoDate.getTime())) {
        parsedDate = isoDate;
      } else {
        // Try DD/MM/YYYY or DD.MM.YYYY
        const parts = dateStr.split(/[/.\-]/);
        if (parts.length === 3) {
          const [d, m, y] = parts;
          const attempt = new Date(`${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`);
          if (!isNaN(attempt.getTime())) parsedDate = attempt;
        }
      }

      if (!parsedDate) continue;

      transactions.push({
        date: parsedDate.toISOString().split("T")[0],
        merchant,
        amount,
      });
    }

    return transactions;
  }, []);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.name.endsWith(".csv")) {
        toast({ title: "Invalid file", description: "Please upload a CSV file.", variant: "destructive" });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast({ title: "File too large", description: "Maximum file size is 5MB.", variant: "destructive" });
        return;
      }

      setImporting(true);
      try {
        const text = await file.text();
        const transactions = parseCSV(text);

        if (transactions === null) {
          toast({
            title: "Could not parse CSV",
            description: "CSV must contain columns: date, merchant/description, amount.",
            variant: "destructive",
          });
          return;
        }

        if (transactions.length === 0) {
          toast({ title: "No transactions found", description: "The CSV file contained no valid transactions.", variant: "destructive" });
          return;
        }

        let imported = 0;
        for (const tx of transactions) {
          try {
            await addTransaction(tx);
            imported++;
          } catch {
            // Skip invalid rows
          }
        }

        toast({ title: `Imported ${imported} transactions`, description: `${transactions.length - imported} rows skipped.` });
      } catch (err: any) {
        toast({ title: "Import failed", description: err.message, variant: "destructive" });
      } finally {
        setImporting(false);
      }
    },
    [addTransaction, parseCSV]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
      e.target.value = "";
    },
    [handleFile]
  );

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-display text-lg">
          <Upload className="h-5 w-5 text-primary" />
          Import Transactions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
            {importing ? "Importing..." : "Drop your CSV file here"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">or click to browse</p>
          <input
            type="file"
            accept=".csv"
            onChange={handleInputChange}
            className="absolute inset-0 cursor-pointer opacity-0"
            disabled={importing}
          />
          <Button
            variant="outline"
            size="sm"
            className="mt-3 relative"
            disabled={importing}
            onClick={() => {
              const input = document.createElement("input");
              input.type = "file";
              input.accept = ".csv";
              input.onchange = (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) handleFile(file);
              };
              input.click();
            }}
          >
            {importing ? "Importing..." : "Choose File"}
          </Button>
        </div>

        <div className="flex items-start gap-2 rounded-lg bg-muted/50 p-3">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">
            CSV should contain columns: <strong>date</strong>, <strong>merchant</strong> (or description), and <strong>amount</strong>.
            Most bank exports work automatically.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CSVImport;
