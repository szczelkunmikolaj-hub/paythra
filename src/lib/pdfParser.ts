// PDF bank statement parser — uses pdfjs-dist to extract text, then applies
// date/amount regex patterns. Bank-specific heuristics improve accuracy;
// a generic fallback handles everything else.

import * as pdfjsLib from "pdfjs-dist";

// Vite resolves this via its asset pipeline; the worker runs in a Web Worker.
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).href;

export interface PdfTransaction {
  date: string;    // ISO YYYY-MM-DD
  merchant: string;
  amount: number;  // absolute value (expense)
}

// ─── TEXT EXTRACTION ──────────────────────────────────────────────────────────

/** Returns all text items from a PDF, grouped into visual lines by Y position. */
async function extractLines(file: File): Promise<string[]> {
  const buf = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
  const allLines: string[] = [];

  for (let p = 1; p <= pdf.numPages; p++) {
    const page = await pdf.getPage(p);
    const content = await page.getTextContent();

    // Bucket text items by rounded Y coordinate → one visual line per bucket
    const byY = new Map<number, Array<{ x: number; str: string }>>();
    for (const item of content.items) {
      if (!("str" in item) || !item.str.trim()) continue;
      const y = Math.round((item as any).transform[5] / 2) * 2; // 2-pt tolerance
      const x = (item as any).transform[4] as number;
      if (!byY.has(y)) byY.set(y, []);
      byY.get(y)!.push({ x, str: item.str });
    }

    // Top of page first (descending Y in PDF coordinates)
    const sortedYs = [...byY.keys()].sort((a, b) => b - a);
    for (const y of sortedYs) {
      const tokens = byY.get(y)!.sort((a, b) => a.x - b.x);
      const line = tokens.map((t) => t.str).join(" ").trim();
      if (line) allLines.push(line);
    }
  }

  return allLines;
}

// ─── DATE PARSING ─────────────────────────────────────────────────────────────

const MONTH_MAP: Record<string, string> = {
  jan: "01", feb: "02", mar: "03", apr: "04", may: "05", jun: "06",
  jul: "07", aug: "08", sep: "09", oct: "10", nov: "11", dec: "12",
  ene: "01", // es
  fev: "02", avr: "04", mai: "05", jui: "06", aoû: "08", // fr
  sty: "01", lut: "02", mar_pl: "03", kwi: "04", maj: "05", cze: "06", // pl
  lip: "07", sie: "08", wrz: "09", paź: "10", lis: "11", gru: "12",
};

function monthNum(s: string): string {
  return MONTH_MAP[s.toLowerCase().slice(0, 3)] ?? "01";
}

const DATE_RE_LIST: Array<{ re: RegExp; toIso: (m: RegExpExecArray) => string }> = [
  // ISO: 2024-01-15
  {
    re: /\b(\d{4})-(\d{2})-(\d{2})\b/,
    toIso: (m) => `${m[1]}-${m[2]}-${m[3]}`,
  },
  // DD.MM.YYYY or DD.MM.YY
  {
    re: /\b(\d{1,2})\.(\d{1,2})\.(\d{2,4})\b/,
    toIso: (m) => {
      const y = m[3].length === 2 ? `20${m[3]}` : m[3];
      return `${y}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}`;
    },
  },
  // DD/MM/YYYY or MM/DD/YYYY — detect by month field > 12 → must be day
  {
    re: /\b(\d{1,2})\/(\d{1,2})\/(\d{2,4})\b/,
    toIso: (m) => {
      const y = m[3].length === 2 ? `20${m[3]}` : m[3];
      const a = parseInt(m[1]), b = parseInt(m[2]);
      // If first part > 12 it must be day (EU DD/MM)
      if (a > 12) return `${y}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}`;
      // If second part > 12 it must be day (US MM/DD)
      if (b > 12) return `${y}-${m[1].padStart(2, "0")}-${m[2].padStart(2, "0")}`;
      // Default: EU order (day first) — more common for bank statements
      return `${y}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}`;
    },
  },
  // DD-MM-YYYY
  {
    re: /\b(\d{1,2})-(\d{2})-(\d{4})\b/,
    toIso: (m) => `${m[3]}-${m[2]}-${m[1].padStart(2, "0")}`,
  },
  // "15 Jan 2024" or "15 January 2024"
  {
    re: /\b(\d{1,2})\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|ene|fev|avr|mai|aoû|sty|lut|kwi|maj|cze|lip|sie|wrz|paź|lis|gru)\w*\s+(\d{4})\b/i,
    toIso: (m) => `${m[3]}-${monthNum(m[2])}-${m[1].padStart(2, "0")}`,
  },
  // "Jan 15, 2024" or "Jan 15 2024"
  {
    re: /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\w*\s+(\d{1,2}),?\s+(\d{4})\b/i,
    toIso: (m) => `${m[3]}-${monthNum(m[1])}-${m[2].padStart(2, "0")}`,
  },
];

function extractDate(line: string): { iso: string; index: number; length: number } | null {
  for (const { re, toIso } of DATE_RE_LIST) {
    const m = re.exec(line);
    if (!m) continue;
    try {
      const iso = toIso(m);
      const d = new Date(iso);
      if (isNaN(d.getTime())) continue;
      // Sanity: year between 2000 and 2030
      const year = parseInt(iso.slice(0, 4));
      if (year < 2000 || year > 2030) continue;
      return { iso, index: m.index, length: m[0].length };
    } catch {
      continue;
    }
  }
  return null;
}

// ─── AMOUNT PARSING ───────────────────────────────────────────────────────────

// Matches: 1,234.56  1.234,56  1 234,56  1234.56  -15.99  (15.99)
const AMOUNT_RE =
  /(?:^|[\s\-+(])(\d{1,3}(?:[.,\s]\d{3})*(?:[.,]\d{1,2})|\d+[.,]\d{1,2}|\d{2,})(?:[\s),]|$)/g;

function parseAmount(raw: string): number {
  // Remove currency symbols and spaces
  let s = raw.replace(/[€$£¥₹zł\s]/g, "");
  // European: 1.234,56 → swap separators
  if (/\d\.\d{3},\d{2}$/.test(s) || /^\d{1,3}(?:\.\d{3})+,\d{2}$/.test(s)) {
    s = s.replace(/\./g, "").replace(",", ".");
  } else {
    // US or plain: remove commas used as thousands separators
    s = s.replace(/,(?=\d{3})/g, "").replace(",", ".");
  }
  return Math.abs(parseFloat(s));
}

function extractAmount(line: string): number | null {
  AMOUNT_RE.lastIndex = 0;
  const candidates: number[] = [];
  let m: RegExpExecArray | null;
  while ((m = AMOUNT_RE.exec(line)) !== null) {
    const n = parseAmount(m[1]);
    if (!isNaN(n) && n > 0 && n < 100_000) candidates.push(n);
  }
  if (candidates.length === 0) return null;
  // Prefer the last amount on the line (typically the transaction amount)
  return candidates[candidates.length - 1];
}

// ─── BANK DETECTION ───────────────────────────────────────────────────────────

type BankId =
  | "chase" | "bofa" | "hsbc" | "barclays" | "santander"
  | "ing" | "revolut" | "n26" | "monzo" | "mbank" | "pko"
  | "bnp" | "deutsche" | "commerzbank" | "generic";

const BANK_SIGNATURES: Array<{ id: BankId; re: RegExp }> = [
  { id: "chase",       re: /jpmorgan\s*chase|chase\s*bank/i },
  { id: "bofa",        re: /bank\s*of\s*america/i },
  { id: "hsbc",        re: /\bhsbc\b/i },
  { id: "barclays",    re: /\bbarclays\b/i },
  { id: "santander",   re: /\bsantander\b/i },
  { id: "ing",         re: /\bing\s*(bank|direct|group)?\b/i },
  { id: "revolut",     re: /\brevolut\b/i },
  { id: "n26",         re: /\bn26\b/i },
  { id: "monzo",       re: /\bmonzo\b/i },
  { id: "mbank",       re: /\bmbank\b/i },
  { id: "pko",         re: /\bpko\b|powszechna\s*kasa/i },
  { id: "bnp",         re: /\bbnp\s*paribas\b/i },
  { id: "deutsche",    re: /\bdeutsche\s*bank\b/i },
  { id: "commerzbank", re: /\bcommerzbank\b/i },
];

function detectBank(lines: string[]): BankId {
  // Check first 30 lines (header area)
  const header = lines.slice(0, 30).join(" ");
  for (const { id, re } of BANK_SIGNATURES) {
    if (re.test(header)) return id;
  }
  return "generic";
}

// ─── SKIP LINE HEURISTICS ─────────────────────────────────────────────────────

const SKIP_PATTERNS = [
  /^\s*$/, // blank
  /^page\s+\d+/i,
  /^statement\s+(date|period|from|to)/i,
  /opening\s*balance|closing\s*balance|beginning\s*balance/i,
  /^account\s+(number|holder|summary)/i,
  /^sort\s*code|^iban|^bic|^swift/i,
  /^date\s+(description|details|particulars|narration)/i,
  /debit\s+credit\s+balance/i,
  /^balance\s*brought\s*forward/i,
  /^total\s+(debits|credits|charges)/i,
];

function shouldSkip(line: string): boolean {
  return SKIP_PATTERNS.some((re) => re.test(line));
}

// ─── GENERIC PARSER (core algorithm used by all banks) ────────────────────────

function parseLines(lines: string[]): PdfTransaction[] {
  const transactions: PdfTransaction[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    i++;

    if (shouldSkip(line)) continue;

    const dateMatch = extractDate(line);
    if (!dateMatch) continue;

    // Remove the date from the line to isolate description + amount
    const withoutDate =
      line.slice(0, dateMatch.index).trim() +
      " " +
      line.slice(dateMatch.index + dateMatch.length).trim();

    let amount = extractAmount(withoutDate);
    let descriptionPart = withoutDate;

    // If no amount on this line, peek at the next 1-2 lines
    if (amount === null) {
      for (let j = 0; j < 2 && i + j < lines.length; j++) {
        const next = lines[i + j];
        if (extractDate(next)) break; // next transaction started
        const a = extractAmount(next);
        if (a !== null) {
          amount = a;
          break;
        }
        descriptionPart += " " + next;
      }
    }

    if (amount === null || amount <= 0) continue;

    // Strip amounts from description
    const merchant = descriptionPart
      .replace(AMOUNT_RE, " ")
      .replace(/\s+/g, " ")
      .replace(/[^\w\s.&+\-']/g, " ")
      .trim()
      .replace(/\s+/g, " ");

    if (!merchant || merchant.length < 2) continue;

    transactions.push({ date: dateMatch.iso, merchant, amount });
  }

  return transactions;
}

// ─── BANK-SPECIFIC PREPROCESSING ──────────────────────────────────────────────

// Some banks split description across continuation lines (no date on them).
// We merge those into the transaction line before generic parsing.

function mergeING(lines: string[]): string[] {
  const merged: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    if (extractDate(lines[i])) {
      // Collect continuation lines (those not starting with a date or amount-only)
      let combined = lines[i];
      while (
        i + 1 < lines.length &&
        !extractDate(lines[i + 1]) &&
        !/^[\d.,\s€$£]+$/.test(lines[i + 1]) &&
        !shouldSkip(lines[i + 1])
      ) {
        i++;
        combined += " " + lines[i];
      }
      merged.push(combined);
    } else {
      merged.push(lines[i]);
    }
  }
  return merged;
}

function preprocess(lines: string[], bank: BankId): string[] {
  switch (bank) {
    case "ing":
    case "mbank":
    case "pko":
      return mergeING(lines);
    default:
      return lines;
  }
}

// ─── PUBLIC API ───────────────────────────────────────────────────────────────

export interface PdfParseResult {
  transactions: PdfTransaction[];
  bankId: BankId;
  pageCount: number;
}

export async function parsePdfBankStatement(file: File): Promise<PdfParseResult> {
  const lines = await extractLines(file);
  const bankId = detectBank(lines);
  const prepared = preprocess(lines, bankId);
  const transactions = parseLines(prepared);

  // Deduplicate (same date + merchant + amount within same file)
  const seen = new Set<string>();
  const unique = transactions.filter((t) => {
    const key = `${t.date}|${t.merchant.toLowerCase()}|${t.amount}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return { transactions: unique, bankId, pageCount: lines.length };
}
