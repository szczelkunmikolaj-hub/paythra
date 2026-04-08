// Currency system tied to language selection

export interface CurrencyConfig {
  code: string;
  symbol: string;
  position: "before" | "after";
  separator: string;
  decimal: string;
}

const CURRENCY_MAP: Record<string, CurrencyConfig> = {
  en: { code: "GBP", symbol: "£", position: "before", separator: ",", decimal: "." },
  es: { code: "EUR", symbol: "€", position: "before", separator: ".", decimal: "," },
  pl: { code: "PLN", symbol: "zł", position: "after", separator: " ", decimal: "," },
  de: { code: "EUR", symbol: "€", position: "before", separator: ".", decimal: "," },
  fr: { code: "EUR", symbol: "€", position: "before", separator: " ", decimal: "," },
};

export const getCurrencyForLanguage = (lang: string): CurrencyConfig => {
  return CURRENCY_MAP[lang] || CURRENCY_MAP.en;
};

export const formatCurrency = (amount: number, lang: string): string => {
  const config = getCurrencyForLanguage(lang);
  const parts = amount.toFixed(2).split(".");
  const intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, config.separator);
  const formatted = `${intPart}${config.decimal}${parts[1]}`;

  if (config.position === "after") {
    return `${formatted} ${config.symbol}`;
  }
  return `${config.symbol}${formatted}`;
};
