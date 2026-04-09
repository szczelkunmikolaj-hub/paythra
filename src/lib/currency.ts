// Currency system with real conversion

export interface CurrencyConfig {
  code: string;
  symbol: string;
  position: "before" | "after";
  separator: string;
  decimal: string;
}

export const CURRENCIES: Record<string, CurrencyConfig> = {
  EUR: { code: "EUR", symbol: "€", position: "before", separator: ".", decimal: "," },
  GBP: { code: "GBP", symbol: "£", position: "before", separator: ",", decimal: "." },
  USD: { code: "USD", symbol: "$", position: "before", separator: ",", decimal: "." },
  PLN: { code: "PLN", symbol: "zł", position: "after", separator: " ", decimal: "," },
};

// All subscriptions are stored in EUR. These are fixed rates from EUR.
const EXCHANGE_RATES: Record<string, number> = {
  EUR: 1,
  PLN: 4.3,
  GBP: 0.85,
  USD: 1.1,
};

const LANGUAGE_CURRENCY_MAP: Record<string, string> = {
  en: "GBP",
  es: "EUR",
  pl: "PLN",
  de: "EUR",
  fr: "EUR",
};

const CURRENCY_STORAGE_KEY = "paythra-currency-override";

export const getCurrencyOverride = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(CURRENCY_STORAGE_KEY);
};

export const setCurrencyOverride = (code: string | null) => {
  if (code) {
    localStorage.setItem(CURRENCY_STORAGE_KEY, code);
  } else {
    localStorage.removeItem(CURRENCY_STORAGE_KEY);
  }
};

export const getActiveCurrencyCode = (lang: string): string => {
  const override = getCurrencyOverride();
  if (override && CURRENCIES[override]) return override;
  return LANGUAGE_CURRENCY_MAP[lang] || "EUR";
};

export const getCurrencyForLanguage = (lang: string): CurrencyConfig => {
  const code = getActiveCurrencyCode(lang);
  return CURRENCIES[code];
};

/** Convert an amount stored in EUR to the user's active currency */
export const convertFromEUR = (amountEUR: number, lang: string): number => {
  const code = getActiveCurrencyCode(lang);
  return amountEUR * (EXCHANGE_RATES[code] || 1);
};

/** Convert from user's active currency back to EUR (for storage) */
export const convertToEUR = (amount: number, lang: string): number => {
  const code = getActiveCurrencyCode(lang);
  return amount / (EXCHANGE_RATES[code] || 1);
};

export const formatCurrency = (amountEUR: number, lang: string): string => {
  const config = getCurrencyForLanguage(lang);
  const converted = convertFromEUR(amountEUR, lang);
  const parts = converted.toFixed(2).split(".");
  const intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, config.separator);
  const formatted = `${intPart}${config.decimal}${parts[1]}`;

  if (config.position === "after") {
    return `${formatted} ${config.symbol}`;
  }
  return `${config.symbol}${formatted}`;
};

/** Format without conversion (amount already in target currency) */
export const formatCurrencyRaw = (amount: number, lang: string): string => {
  const config = getCurrencyForLanguage(lang);
  const parts = amount.toFixed(2).split(".");
  const intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, config.separator);
  const formatted = `${intPart}${config.decimal}${parts[1]}`;

  if (config.position === "after") {
    return `${formatted} ${config.symbol}`;
  }
  return `${config.symbol}${formatted}`;
};
