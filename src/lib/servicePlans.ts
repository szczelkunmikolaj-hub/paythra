export interface ServicePlan {
  name: string;
  price: number;
  currency: string;
  billingCycle: "monthly" | "yearly";
}

export interface CountryPlans {
  country: string;
  countryCode: string;
  currency: string;
  plans: ServicePlan[];
}

export interface ServicePlanData {
  serviceKey: string;
  countries: CountryPlans[];
}

const m = "monthly" as const;
const y = "yearly" as const;

const EUR = (country: string, cc: string, plans: Omit<ServicePlan, "currency">[]) => ({
  country, countryCode: cc, currency: "€",
  plans: plans.map(p => ({ ...p, currency: "€" })),
});
const USD = (plans: Omit<ServicePlan, "currency">[]) => ({
  country: "United States", countryCode: "US", currency: "$",
  plans: plans.map(p => ({ ...p, currency: "$" })),
});
const GBP = (plans: Omit<ServicePlan, "currency">[]) => ({
  country: "United Kingdom", countryCode: "GB", currency: "£",
  plans: plans.map(p => ({ ...p, currency: "£" })),
});
const CAD = (plans: Omit<ServicePlan, "currency">[]) => ({
  country: "Canada", countryCode: "CA", currency: "C$",
  plans: plans.map(p => ({ ...p, currency: "C$" })),
});
const AUD = (plans: Omit<ServicePlan, "currency">[]) => ({
  country: "Australia", countryCode: "AU", currency: "A$",
  plans: plans.map(p => ({ ...p, currency: "A$" })),
});
const BRL = (plans: Omit<ServicePlan, "currency">[]) => ({
  country: "Brazil", countryCode: "BR", currency: "R$",
  plans: plans.map(p => ({ ...p, currency: "R$" })),
});
const INR = (plans: Omit<ServicePlan, "currency">[]) => ({
  country: "India", countryCode: "IN", currency: "₹",
  plans: plans.map(p => ({ ...p, currency: "₹" })),
});
const SEK = (plans: Omit<ServicePlan, "currency">[]) => ({
  country: "Sweden", countryCode: "SE", currency: "kr",
  plans: plans.map(p => ({ ...p, currency: "kr" })),
});
const NOK = (plans: Omit<ServicePlan, "currency">[]) => ({
  country: "Norway", countryCode: "NO", currency: "kr",
  plans: plans.map(p => ({ ...p, currency: "kr" })),
});
const DKK = (plans: Omit<ServicePlan, "currency">[]) => ({
  country: "Denmark", countryCode: "DK", currency: "kr",
  plans: plans.map(p => ({ ...p, currency: "kr" })),
});
const PLN = (plans: Omit<ServicePlan, "currency">[]) => ({
  country: "Poland", countryCode: "PL", currency: "zł",
  plans: plans.map(p => ({ ...p, currency: "zł" })),
});
const MXN = (plans: Omit<ServicePlan, "currency">[]) => ({
  country: "Mexico", countryCode: "MX", currency: "MX$",
  plans: plans.map(p => ({ ...p, currency: "MX$" })),
});
const JPY = (plans: Omit<ServicePlan, "currency">[]) => ({
  country: "Japan", countryCode: "JP", currency: "¥",
  plans: plans.map(p => ({ ...p, currency: "¥" })),
});
const KRW = (plans: Omit<ServicePlan, "currency">[]) => ({
  country: "South Korea", countryCode: "KR", currency: "₩",
  plans: plans.map(p => ({ ...p, currency: "₩" })),
});
const CHF = (plans: Omit<ServicePlan, "currency">[]) => ({
  country: "Switzerland", countryCode: "CH", currency: "CHF",
  plans: plans.map(p => ({ ...p, currency: "CHF" })),
});
const TRY = (plans: Omit<ServicePlan, "currency">[]) => ({
  country: "Turkey", countryCode: "TR", currency: "₺",
  plans: plans.map(p => ({ ...p, currency: "₺" })),
});

const planData: ServicePlanData[] = [
  {
    serviceKey: "Netflix",
    countries: [
      USD([{ name: "Standard with Ads", price: 7.99, billingCycle: m }, { name: "Standard", price: 15.49, billingCycle: m }, { name: "Premium", price: 22.99, billingCycle: m }]),
      GBP([{ name: "Standard with Ads", price: 4.99, billingCycle: m }, { name: "Standard", price: 10.99, billingCycle: m }, { name: "Premium", price: 17.99, billingCycle: m }]),
      EUR("Spain", "ES", [{ name: "Estándar con anuncios", price: 5.99, billingCycle: m }, { name: "Estándar", price: 12.99, billingCycle: m }, { name: "Premium", price: 17.99, billingCycle: m }]),
      EUR("France", "FR", [{ name: "Essentiel avec pub", price: 5.99, billingCycle: m }, { name: "Standard", price: 13.49, billingCycle: m }, { name: "Premium", price: 19.99, billingCycle: m }]),
      EUR("Germany", "DE", [{ name: "Standard mit Werbung", price: 4.99, billingCycle: m }, { name: "Standard", price: 12.99, billingCycle: m }, { name: "Premium", price: 19.99, billingCycle: m }]),
      EUR("Italy", "IT", [{ name: "Standard con pubblicità", price: 5.99, billingCycle: m }, { name: "Standard", price: 12.99, billingCycle: m }, { name: "Premium", price: 19.99, billingCycle: m }]),
      EUR("Portugal", "PT", [{ name: "Standard c/ anúncios", price: 5.99, billingCycle: m }, { name: "Standard", price: 12.99, billingCycle: m }, { name: "Premium", price: 17.99, billingCycle: m }]),
      EUR("Netherlands", "NL", [{ name: "Standaard met reclame", price: 5.99, billingCycle: m }, { name: "Standaard", price: 12.99, billingCycle: m }, { name: "Premium", price: 19.99, billingCycle: m }]),
      EUR("Belgium", "BE", [{ name: "Standaard met reclame", price: 5.99, billingCycle: m }, { name: "Standaard", price: 12.99, billingCycle: m }, { name: "Premium", price: 19.99, billingCycle: m }]),
      EUR("Austria", "AT", [{ name: "Standard mit Werbung", price: 4.99, billingCycle: m }, { name: "Standard", price: 12.99, billingCycle: m }, { name: "Premium", price: 19.99, billingCycle: m }]),
      PLN([{ name: "Standard z reklamami", price: 29.99, billingCycle: m }, { name: "Standard", price: 56.99, billingCycle: m }, { name: "Premium", price: 74.99, billingCycle: m }]),
      CAD([{ name: "Standard with Ads", price: 5.99, billingCycle: m }, { name: "Standard", price: 16.49, billingCycle: m }, { name: "Premium", price: 20.99, billingCycle: m }]),
      AUD([{ name: "Standard with Ads", price: 7, billingCycle: m }, { name: "Standard", price: 18, billingCycle: m }, { name: "Premium", price: 22.99, billingCycle: m }]),
      BRL([{ name: "Padrão com anúncios", price: 20.90, billingCycle: m }, { name: "Padrão", price: 39.90, billingCycle: m }, { name: "Premium", price: 59.90, billingCycle: m }]),
      INR([{ name: "Mobile", price: 149, billingCycle: m }, { name: "Basic", price: 199, billingCycle: m }, { name: "Standard", price: 499, billingCycle: m }, { name: "Premium", price: 649, billingCycle: m }]),
      JPY([{ name: "広告つきスタンダード", price: 790, billingCycle: m }, { name: "スタンダード", price: 1590, billingCycle: m }, { name: "プレミアム", price: 1980, billingCycle: m }]),
      MXN([{ name: "Estándar con anuncios", price: 99, billingCycle: m }, { name: "Estándar", price: 219, billingCycle: m }, { name: "Premium", price: 299, billingCycle: m }]),
      TRY([{ name: "Temel", price: 79.99, billingCycle: m }, { name: "Standart", price: 139.99, billingCycle: m }, { name: "Premium", price: 199.99, billingCycle: m }]),
      SEK([{ name: "Standard", price: 89, billingCycle: m }, { name: "Premium", price: 179, billingCycle: m }]),
      CHF([{ name: "Standard", price: 12.90, billingCycle: m }, { name: "Premium", price: 20.90, billingCycle: m }]),
    ],
  },
  {
    serviceKey: "Spotify",
    countries: [
      USD([{ name: "Individual", price: 11.99, billingCycle: m }, { name: "Duo", price: 16.99, billingCycle: m }, { name: "Family", price: 19.99, billingCycle: m }, { name: "Student", price: 5.99, billingCycle: m }]),
      GBP([{ name: "Individual", price: 11.99, billingCycle: m }, { name: "Duo", price: 15.99, billingCycle: m }, { name: "Family", price: 19.99, billingCycle: m }, { name: "Student", price: 5.99, billingCycle: m }]),
      EUR("Spain", "ES", [{ name: "Individual", price: 11.99, billingCycle: m }, { name: "Duo", price: 15.99, billingCycle: m }, { name: "Familia", price: 19.99, billingCycle: m }, { name: "Estudiante", price: 5.99, billingCycle: m }]),
      EUR("France", "FR", [{ name: "Individuel", price: 11.99, billingCycle: m }, { name: "Duo", price: 15.99, billingCycle: m }, { name: "Famille", price: 19.99, billingCycle: m }, { name: "Étudiant", price: 5.99, billingCycle: m }]),
      EUR("Germany", "DE", [{ name: "Individual", price: 11.99, billingCycle: m }, { name: "Duo", price: 15.99, billingCycle: m }, { name: "Familie", price: 19.99, billingCycle: m }, { name: "Student", price: 5.99, billingCycle: m }]),
      EUR("Italy", "IT", [{ name: "Individual", price: 11.99, billingCycle: m }, { name: "Duo", price: 15.99, billingCycle: m }, { name: "Family", price: 19.99, billingCycle: m }]),
      EUR("Netherlands", "NL", [{ name: "Individueel", price: 11.99, billingCycle: m }, { name: "Duo", price: 15.99, billingCycle: m }, { name: "Gezin", price: 19.99, billingCycle: m }]),
      EUR("Portugal", "PT", [{ name: "Individual", price: 10.99, billingCycle: m }, { name: "Duo", price: 14.99, billingCycle: m }, { name: "Família", price: 17.99, billingCycle: m }]),
      PLN([{ name: "Individual", price: 23.99, billingCycle: m }, { name: "Duo", price: 31.99, billingCycle: m }, { name: "Rodzinny", price: 39.99, billingCycle: m }, { name: "Student", price: 11.99, billingCycle: m }]),
      CAD([{ name: "Individual", price: 11.99, billingCycle: m }, { name: "Duo", price: 16.99, billingCycle: m }, { name: "Family", price: 19.99, billingCycle: m }]),
      AUD([{ name: "Individual", price: 13.99, billingCycle: m }, { name: "Duo", price: 19.99, billingCycle: m }, { name: "Family", price: 22.99, billingCycle: m }]),
      BRL([{ name: "Individual", price: 24.90, billingCycle: m }, { name: "Duo", price: 34.90, billingCycle: m }, { name: "Família", price: 41.90, billingCycle: m }, { name: "Universitário", price: 14.90, billingCycle: m }]),
      INR([{ name: "Individual", price: 119, billingCycle: m }, { name: "Duo", price: 149, billingCycle: m }, { name: "Family", price: 179, billingCycle: m }, { name: "Student", price: 59, billingCycle: m }]),
      JPY([{ name: "Individual", price: 980, billingCycle: m }, { name: "Duo", price: 1280, billingCycle: m }, { name: "Family", price: 1580, billingCycle: m }, { name: "Student", price: 480, billingCycle: m }]),
      MXN([{ name: "Individual", price: 135, billingCycle: m }, { name: "Duo", price: 179, billingCycle: m }, { name: "Familiar", price: 219, billingCycle: m }]),
      SEK([{ name: "Individual", price: 129, billingCycle: m }, { name: "Duo", price: 169, billingCycle: m }, { name: "Familj", price: 209, billingCycle: m }]),
      TRY([{ name: "Bireysel", price: 44.99, billingCycle: m }, { name: "İkili", price: 59.99, billingCycle: m }, { name: "Aile", price: 74.99, billingCycle: m }]),
      CHF([{ name: "Individual", price: 12.95, billingCycle: m }, { name: "Duo", price: 17.95, billingCycle: m }, { name: "Family", price: 21.95, billingCycle: m }]),
      KRW([{ name: "Individual", price: 10900, billingCycle: m }, { name: "Duo", price: 14900, billingCycle: m }, { name: "Family", price: 17900, billingCycle: m }]),
    ],
  },
  {
    serviceKey: "Disney+",
    countries: [
      USD([{ name: "Basic (with Ads)", price: 7.99, billingCycle: m }, { name: "Premium", price: 13.99, billingCycle: m }]),
      GBP([{ name: "Standard", price: 4.99, billingCycle: m }, { name: "Premium", price: 11.99, billingCycle: m }]),
      EUR("Spain", "ES", [{ name: "Estándar", price: 5.99, billingCycle: m }, { name: "Premium", price: 11.99, billingCycle: m }]),
      EUR("France", "FR", [{ name: "Standard", price: 5.99, billingCycle: m }, { name: "Premium", price: 11.99, billingCycle: m }]),
      EUR("Germany", "DE", [{ name: "Standard", price: 5.99, billingCycle: m }, { name: "Premium", price: 11.99, billingCycle: m }]),
      EUR("Italy", "IT", [{ name: "Standard", price: 5.99, billingCycle: m }, { name: "Premium", price: 11.99, billingCycle: m }]),
      EUR("Netherlands", "NL", [{ name: "Standaard", price: 5.99, billingCycle: m }, { name: "Premium", price: 11.99, billingCycle: m }]),
      EUR("Portugal", "PT", [{ name: "Standard", price: 5.99, billingCycle: m }, { name: "Premium", price: 11.99, billingCycle: m }]),
      PLN([{ name: "Standard", price: 28.99, billingCycle: m }, { name: "Premium", price: 49.99, billingCycle: m }]),
      CAD([{ name: "Basic (with Ads)", price: 7.99, billingCycle: m }, { name: "Premium", price: 13.99, billingCycle: m }]),
      AUD([{ name: "Standard", price: 13.99, billingCycle: m }, { name: "Premium", price: 17.99, billingCycle: m }]),
      BRL([{ name: "Padrão", price: 27.90, billingCycle: m }, { name: "Premium", price: 43.90, billingCycle: m }]),
      INR([{ name: "Mobile", price: 149, billingCycle: m }, { name: "Super", price: 299, billingCycle: m }]),
      JPY([{ name: "スタンダード", price: 990, billingCycle: m }, { name: "プレミアム", price: 1320, billingCycle: m }]),
      MXN([{ name: "Estándar", price: 159, billingCycle: m }, { name: "Premium", price: 249, billingCycle: m }]),
    ],
  },
  {
    serviceKey: "Amazon Prime",
    countries: [
      USD([{ name: "Monthly", price: 14.99, billingCycle: m }, { name: "Annual", price: 139, billingCycle: y }]),
      GBP([{ name: "Monthly", price: 8.99, billingCycle: m }, { name: "Annual", price: 95, billingCycle: y }]),
      EUR("Spain", "ES", [{ name: "Mensual", price: 4.99, billingCycle: m }, { name: "Anual", price: 49.90, billingCycle: y }]),
      EUR("France", "FR", [{ name: "Mensuel", price: 6.99, billingCycle: m }, { name: "Annuel", price: 69.90, billingCycle: y }]),
      EUR("Germany", "DE", [{ name: "Monatlich", price: 8.99, billingCycle: m }, { name: "Jährlich", price: 89.90, billingCycle: y }]),
      EUR("Italy", "IT", [{ name: "Mensile", price: 4.99, billingCycle: m }, { name: "Annuale", price: 49.90, billingCycle: y }]),
      PLN([{ name: "Miesięcznie", price: 14.99, billingCycle: m }, { name: "Rocznie", price: 49, billingCycle: y }]),
      CAD([{ name: "Monthly", price: 9.99, billingCycle: m }, { name: "Annual", price: 99, billingCycle: y }]),
      AUD([{ name: "Monthly", price: 9.99, billingCycle: m }, { name: "Annual", price: 79, billingCycle: y }]),
      BRL([{ name: "Mensal", price: 14.90, billingCycle: m }, { name: "Anual", price: 119, billingCycle: y }]),
      INR([{ name: "Monthly", price: 299, billingCycle: m }, { name: "Annual", price: 1499, billingCycle: y }]),
      JPY([{ name: "月額", price: 600, billingCycle: m }, { name: "年額", price: 5900, billingCycle: y }]),
      MXN([{ name: "Mensual", price: 99, billingCycle: m }, { name: "Anual", price: 899, billingCycle: y }]),
    ],
  },
  {
    serviceKey: "Apple TV+",
    countries: [
      USD([{ name: "Monthly", price: 9.99, billingCycle: m }, { name: "Annual", price: 99, billingCycle: y }]),
      GBP([{ name: "Monthly", price: 8.99, billingCycle: m }, { name: "Annual", price: 89, billingCycle: y }]),
      EUR("Spain", "ES", [{ name: "Mensual", price: 9.99, billingCycle: m }]),
      EUR("France", "FR", [{ name: "Mensuel", price: 9.99, billingCycle: m }]),
      EUR("Germany", "DE", [{ name: "Monatlich", price: 9.99, billingCycle: m }]),
      EUR("Italy", "IT", [{ name: "Mensile", price: 9.99, billingCycle: m }]),
      CAD([{ name: "Monthly", price: 12.99, billingCycle: m }]),
      AUD([{ name: "Monthly", price: 12.99, billingCycle: m }]),
      BRL([{ name: "Mensal", price: 21.90, billingCycle: m }]),
      INR([{ name: "Monthly", price: 99, billingCycle: m }]),
      JPY([{ name: "月額", price: 900, billingCycle: m }]),
      MXN([{ name: "Mensual", price: 99, billingCycle: m }]),
    ],
  },
  {
    serviceKey: "YouTube Premium",
    countries: [
      USD([{ name: "Individual", price: 13.99, billingCycle: m }, { name: "Family", price: 22.99, billingCycle: m }, { name: "Student", price: 7.99, billingCycle: m }]),
      GBP([{ name: "Individual", price: 13.99, billingCycle: m }, { name: "Family", price: 22.99, billingCycle: m }, { name: "Student", price: 7.99, billingCycle: m }]),
      EUR("Spain", "ES", [{ name: "Individual", price: 13.99, billingCycle: m }, { name: "Familia", price: 22.99, billingCycle: m }, { name: "Estudiante", price: 7.99, billingCycle: m }]),
      EUR("France", "FR", [{ name: "Individuel", price: 13.99, billingCycle: m }, { name: "Famille", price: 22.99, billingCycle: m }]),
      EUR("Germany", "DE", [{ name: "Individual", price: 13.99, billingCycle: m }, { name: "Familie", price: 22.99, billingCycle: m }]),
      EUR("Italy", "IT", [{ name: "Individual", price: 13.99, billingCycle: m }, { name: "Family", price: 22.99, billingCycle: m }]),
      PLN([{ name: "Individual", price: 23.99, billingCycle: m }, { name: "Family", price: 37.99, billingCycle: m }]),
      BRL([{ name: "Individual", price: 23.90, billingCycle: m }, { name: "Família", price: 37.90, billingCycle: m }]),
      INR([{ name: "Individual", price: 129, billingCycle: m }, { name: "Family", price: 189, billingCycle: m }]),
      JPY([{ name: "個人", price: 1280, billingCycle: m }, { name: "ファミリー", price: 2280, billingCycle: m }]),
      MXN([{ name: "Individual", price: 139, billingCycle: m }, { name: "Familiar", price: 219, billingCycle: m }]),
      TRY([{ name: "Bireysel", price: 39.99, billingCycle: m }, { name: "Aile", price: 64.99, billingCycle: m }]),
      KRW([{ name: "Individual", price: 14900, billingCycle: m }, { name: "Family", price: 22900, billingCycle: m }]),
    ],
  },
  {
    serviceKey: "HBO Max",
    countries: [
      USD([{ name: "With Ads", price: 9.99, billingCycle: m }, { name: "Ad-Free", price: 15.99, billingCycle: m }, { name: "Ultimate", price: 19.99, billingCycle: m }]),
      EUR("Spain", "ES", [{ name: "Estándar", price: 5.99, billingCycle: m }, { name: "Premium", price: 9.99, billingCycle: m }]),
      EUR("Portugal", "PT", [{ name: "Standard", price: 5.99, billingCycle: m }, { name: "Premium", price: 9.99, billingCycle: m }]),
      EUR("Germany", "DE", [{ name: "Standard", price: 5.99, billingCycle: m }, { name: "Premium", price: 9.99, billingCycle: m }]),
      EUR("France", "FR", [{ name: "Standard", price: 5.99, billingCycle: m }, { name: "Premium", price: 9.99, billingCycle: m }]),
      EUR("Netherlands", "NL", [{ name: "Standaard", price: 5.99, billingCycle: m }, { name: "Premium", price: 9.99, billingCycle: m }]),
      PLN([{ name: "Standard", price: 24.99, billingCycle: m }, { name: "Premium", price: 39.99, billingCycle: m }]),
      SEK([{ name: "Standard", price: 69, billingCycle: m }, { name: "Premium", price: 109, billingCycle: m }]),
      DKK([{ name: "Standard", price: 49, billingCycle: m }, { name: "Premium", price: 79, billingCycle: m }]),
      NOK([{ name: "Standard", price: 69, billingCycle: m }, { name: "Premium", price: 109, billingCycle: m }]),
    ],
  },
  {
    serviceKey: "Apple Music",
    countries: [
      USD([{ name: "Individual", price: 10.99, billingCycle: m }, { name: "Family", price: 16.99, billingCycle: m }, { name: "Student", price: 5.99, billingCycle: m }]),
      GBP([{ name: "Individual", price: 10.99, billingCycle: m }, { name: "Family", price: 16.99, billingCycle: m }, { name: "Student", price: 5.99, billingCycle: m }]),
      EUR("Spain", "ES", [{ name: "Individual", price: 11.99, billingCycle: m }, { name: "Familia", price: 17.99, billingCycle: m }, { name: "Estudiante", price: 5.99, billingCycle: m }]),
      EUR("France", "FR", [{ name: "Individuel", price: 11.99, billingCycle: m }, { name: "Famille", price: 17.99, billingCycle: m }, { name: "Étudiant", price: 5.99, billingCycle: m }]),
      EUR("Germany", "DE", [{ name: "Individual", price: 11.99, billingCycle: m }, { name: "Familie", price: 17.99, billingCycle: m }, { name: "Student", price: 5.99, billingCycle: m }]),
      EUR("Italy", "IT", [{ name: "Individual", price: 11.99, billingCycle: m }, { name: "Family", price: 17.99, billingCycle: m }]),
      PLN([{ name: "Individual", price: 23.99, billingCycle: m }, { name: "Rodzinny", price: 37.99, billingCycle: m }]),
      BRL([{ name: "Individual", price: 21.90, billingCycle: m }, { name: "Família", price: 34.90, billingCycle: m }]),
      INR([{ name: "Individual", price: 99, billingCycle: m }, { name: "Family", price: 149, billingCycle: m }]),
      JPY([{ name: "個人", price: 1080, billingCycle: m }, { name: "ファミリー", price: 1680, billingCycle: m }]),
      MXN([{ name: "Individual", price: 129, billingCycle: m }, { name: "Familiar", price: 199, billingCycle: m }]),
      TRY([{ name: "Bireysel", price: 34.99, billingCycle: m }, { name: "Aile", price: 54.99, billingCycle: m }]),
      KRW([{ name: "Individual", price: 9900, billingCycle: m }, { name: "Family", price: 14900, billingCycle: m }]),
    ],
  },
  {
    serviceKey: "Deezer",
    countries: [
      USD([{ name: "Premium", price: 10.99, billingCycle: m }, { name: "Family", price: 17.99, billingCycle: m }]),
      GBP([{ name: "Premium", price: 10.99, billingCycle: m }, { name: "Family", price: 14.99, billingCycle: m }]),
      EUR("Spain", "ES", [{ name: "Premium", price: 10.99, billingCycle: m }, { name: "Familia", price: 17.99, billingCycle: m }, { name: "Estudiante", price: 5.49, billingCycle: m }]),
      EUR("France", "FR", [{ name: "Premium", price: 10.99, billingCycle: m }, { name: "Famille", price: 17.99, billingCycle: m }, { name: "Étudiant", price: 5.49, billingCycle: m }]),
      EUR("Germany", "DE", [{ name: "Premium", price: 10.99, billingCycle: m }, { name: "Family", price: 17.99, billingCycle: m }]),
      PLN([{ name: "Premium", price: 19.99, billingCycle: m }, { name: "Family", price: 29.99, billingCycle: m }]),
      BRL([{ name: "Premium", price: 21.90, billingCycle: m }, { name: "Família", price: 34.90, billingCycle: m }]),
    ],
  },
  {
    serviceKey: "Tidal",
    countries: [
      USD([{ name: "Individual", price: 10.99, billingCycle: m }, { name: "HiFi Plus", price: 19.99, billingCycle: m }, { name: "Family", price: 17.99, billingCycle: m }]),
      GBP([{ name: "Individual", price: 10.99, billingCycle: m }, { name: "HiFi Plus", price: 19.99, billingCycle: m }]),
      EUR("Spain", "ES", [{ name: "Individual", price: 10.99, billingCycle: m }, { name: "HiFi Plus", price: 19.99, billingCycle: m }]),
      EUR("Germany", "DE", [{ name: "Individual", price: 10.99, billingCycle: m }, { name: "HiFi Plus", price: 19.99, billingCycle: m }]),
      EUR("France", "FR", [{ name: "Individuel", price: 10.99, billingCycle: m }, { name: "HiFi Plus", price: 19.99, billingCycle: m }]),
      NOK([{ name: "Individual", price: 129, billingCycle: m }, { name: "HiFi Plus", price: 249, billingCycle: m }]),
    ],
  },
  {
    serviceKey: "ChatGPT Plus",
    countries: [
      USD([{ name: "Plus", price: 20, billingCycle: m }, { name: "Pro", price: 200, billingCycle: m }]),
      GBP([{ name: "Plus", price: 20, billingCycle: m }]),
      EUR("Spain", "ES", [{ name: "Plus", price: 20, billingCycle: m }]),
      EUR("France", "FR", [{ name: "Plus", price: 20, billingCycle: m }]),
      EUR("Germany", "DE", [{ name: "Plus", price: 20, billingCycle: m }]),
      EUR("Italy", "IT", [{ name: "Plus", price: 20, billingCycle: m }]),
      CAD([{ name: "Plus", price: 27, billingCycle: m }]),
      AUD([{ name: "Plus", price: 30, billingCycle: m }]),
      INR([{ name: "Plus", price: 1650, billingCycle: m }]),
      BRL([{ name: "Plus", price: 104, billingCycle: m }]),
      JPY([{ name: "Plus", price: 3000, billingCycle: m }]),
      TRY([{ name: "Plus", price: 649.99, billingCycle: m }]),
      KRW([{ name: "Plus", price: 27000, billingCycle: m }]),
    ],
  },
  {
    serviceKey: "Claude Pro",
    countries: [
      USD([{ name: "Pro", price: 20, billingCycle: m }]),
      GBP([{ name: "Pro", price: 18, billingCycle: m }]),
      EUR("Spain", "ES", [{ name: "Pro", price: 18, billingCycle: m }]),
      EUR("France", "FR", [{ name: "Pro", price: 18, billingCycle: m }]),
      EUR("Germany", "DE", [{ name: "Pro", price: 18, billingCycle: m }]),
      EUR("Italy", "IT", [{ name: "Pro", price: 18, billingCycle: m }]),
      CAD([{ name: "Pro", price: 25, billingCycle: m }]),
      AUD([{ name: "Pro", price: 30, billingCycle: m }]),
      JPY([{ name: "Pro", price: 3000, billingCycle: m }]),
    ],
  },
  {
    serviceKey: "Midjourney",
    countries: [
      USD([{ name: "Basic", price: 10, billingCycle: m }, { name: "Standard", price: 30, billingCycle: m }, { name: "Pro", price: 60, billingCycle: m }, { name: "Mega", price: 120, billingCycle: m }]),
      GBP([{ name: "Basic", price: 10, billingCycle: m }, { name: "Standard", price: 30, billingCycle: m }, { name: "Pro", price: 60, billingCycle: m }]),
      EUR("Spain", "ES", [{ name: "Basic", price: 10, billingCycle: m }, { name: "Standard", price: 30, billingCycle: m }, { name: "Pro", price: 60, billingCycle: m }]),
      EUR("Germany", "DE", [{ name: "Basic", price: 10, billingCycle: m }, { name: "Standard", price: 30, billingCycle: m }, { name: "Pro", price: 60, billingCycle: m }]),
    ],
  },
  {
    serviceKey: "Microsoft 365",
    countries: [
      USD([{ name: "Personal", price: 6.99, billingCycle: m }, { name: "Family", price: 9.99, billingCycle: m }]),
      GBP([{ name: "Personal", price: 5.99, billingCycle: m }, { name: "Family", price: 7.99, billingCycle: m }]),
      EUR("Spain", "ES", [{ name: "Personal", price: 7, billingCycle: m }, { name: "Familiar", price: 10, billingCycle: m }]),
      EUR("Germany", "DE", [{ name: "Single", price: 7, billingCycle: m }, { name: "Family", price: 10, billingCycle: m }]),
      EUR("France", "FR", [{ name: "Personnel", price: 7, billingCycle: m }, { name: "Famille", price: 10, billingCycle: m }]),
      EUR("Italy", "IT", [{ name: "Personal", price: 7, billingCycle: m }, { name: "Family", price: 10, billingCycle: m }]),
      EUR("Netherlands", "NL", [{ name: "Personal", price: 7, billingCycle: m }, { name: "Family", price: 10, billingCycle: m }]),
      PLN([{ name: "Personal", price: 37.99, billingCycle: m }, { name: "Rodzinny", price: 54.99, billingCycle: m }]),
      CAD([{ name: "Personal", price: 8.25, billingCycle: m }, { name: "Family", price: 11, billingCycle: m }]),
      AUD([{ name: "Personal", price: 9, billingCycle: m }, { name: "Family", price: 12.50, billingCycle: m }]),
      INR([{ name: "Personal", price: 489, billingCycle: m }, { name: "Family", price: 649, billingCycle: m }]),
      BRL([{ name: "Personal", price: 36, billingCycle: m }, { name: "Família", price: 45, billingCycle: m }]),
      JPY([{ name: "Personal", price: 1082, billingCycle: m }, { name: "Family", price: 1357, billingCycle: m }]),
      MXN([{ name: "Personal", price: 149, billingCycle: m }, { name: "Familiar", price: 199, billingCycle: m }]),
    ],
  },
  {
    serviceKey: "Notion",
    countries: [
      USD([{ name: "Plus", price: 10, billingCycle: m }, { name: "Business", price: 18, billingCycle: m }]),
      GBP([{ name: "Plus", price: 8, billingCycle: m }, { name: "Business", price: 15, billingCycle: m }]),
      EUR("Spain", "ES", [{ name: "Plus", price: 10, billingCycle: m }, { name: "Business", price: 18, billingCycle: m }]),
      EUR("Germany", "DE", [{ name: "Plus", price: 10, billingCycle: m }, { name: "Business", price: 18, billingCycle: m }]),
      EUR("France", "FR", [{ name: "Plus", price: 10, billingCycle: m }, { name: "Business", price: 18, billingCycle: m }]),
      EUR("Italy", "IT", [{ name: "Plus", price: 10, billingCycle: m }, { name: "Business", price: 18, billingCycle: m }]),
      BRL([{ name: "Plus", price: 54, billingCycle: m }, { name: "Business", price: 100, billingCycle: m }]),
      JPY([{ name: "Plus", price: 1650, billingCycle: m }, { name: "Business", price: 2500, billingCycle: m }]),
      KRW([{ name: "Plus", price: 16000, billingCycle: m }, { name: "Business", price: 25000, billingCycle: m }]),
    ],
  },
  {
    serviceKey: "Canva",
    countries: [
      USD([{ name: "Pro", price: 14.99, billingCycle: m }, { name: "Teams", price: 29.99, billingCycle: m }]),
      GBP([{ name: "Pro", price: 10.99, billingCycle: m }, { name: "Teams", price: 21.99, billingCycle: m }]),
      EUR("Spain", "ES", [{ name: "Pro", price: 11.99, billingCycle: m }, { name: "Equipos", price: 23.99, billingCycle: m }]),
      EUR("Germany", "DE", [{ name: "Pro", price: 11.99, billingCycle: m }, { name: "Teams", price: 23.99, billingCycle: m }]),
      EUR("France", "FR", [{ name: "Pro", price: 11.99, billingCycle: m }, { name: "Équipes", price: 23.99, billingCycle: m }]),
      EUR("Italy", "IT", [{ name: "Pro", price: 11.99, billingCycle: m }, { name: "Teams", price: 23.99, billingCycle: m }]),
      AUD([{ name: "Pro", price: 17.99, billingCycle: m }, { name: "Teams", price: 39.99, billingCycle: m }]),
      BRL([{ name: "Pro", price: 34.90, billingCycle: m }, { name: "Equipes", price: 69.90, billingCycle: m }]),
      INR([{ name: "Pro", price: 499, billingCycle: m }, { name: "Teams", price: 999, billingCycle: m }]),
      MXN([{ name: "Pro", price: 219, billingCycle: m }]),
    ],
  },
  {
    serviceKey: "Adobe Creative Cloud",
    countries: [
      USD([{ name: "Photography (20GB)", price: 9.99, billingCycle: m }, { name: "Single App", price: 22.99, billingCycle: m }, { name: "All Apps", price: 59.99, billingCycle: m }]),
      GBP([{ name: "Photography (20GB)", price: 9.98, billingCycle: m }, { name: "Single App", price: 22.98, billingCycle: m }, { name: "All Apps", price: 54.98, billingCycle: m }]),
      EUR("Spain", "ES", [{ name: "Fotografía (20GB)", price: 12.09, billingCycle: m }, { name: "App individual", price: 26.43, billingCycle: m }, { name: "Todas las apps", price: 62.99, billingCycle: m }]),
      EUR("Germany", "DE", [{ name: "Foto (20GB)", price: 11.89, billingCycle: m }, { name: "Einzelprodukt", price: 23.79, billingCycle: m }, { name: "Alle Applikationen", price: 61.95, billingCycle: m }]),
      EUR("France", "FR", [{ name: "Photo (20 Go)", price: 11.99, billingCycle: m }, { name: "Application unique", price: 24.99, billingCycle: m }, { name: "Toutes les apps", price: 62.99, billingCycle: m }]),
      EUR("Italy", "IT", [{ name: "Fotografia (20GB)", price: 12.09, billingCycle: m }, { name: "App singola", price: 26.43, billingCycle: m }, { name: "Tutte le app", price: 62.99, billingCycle: m }]),
      AUD([{ name: "Photography", price: 14.29, billingCycle: m }, { name: "Single App", price: 34.49, billingCycle: m }, { name: "All Apps", price: 89.99, billingCycle: m }]),
      JPY([{ name: "フォトプラン(20GB)", price: 1180, billingCycle: m }, { name: "単体プラン", price: 3280, billingCycle: m }, { name: "コンプリートプラン", price: 8778, billingCycle: m }]),
    ],
  },
  {
    serviceKey: "Dropbox",
    countries: [
      USD([{ name: "Plus", price: 11.99, billingCycle: m }, { name: "Essentials", price: 22, billingCycle: m }, { name: "Business", price: 20, billingCycle: m }]),
      GBP([{ name: "Plus", price: 9.99, billingCycle: m }, { name: "Essentials", price: 18, billingCycle: m }]),
      EUR("Spain", "ES", [{ name: "Plus", price: 11.99, billingCycle: m }, { name: "Essentials", price: 24, billingCycle: m }]),
      EUR("Germany", "DE", [{ name: "Plus", price: 11.99, billingCycle: m }, { name: "Essentials", price: 24, billingCycle: m }]),
      EUR("France", "FR", [{ name: "Plus", price: 11.99, billingCycle: m }, { name: "Essentials", price: 24, billingCycle: m }]),
      AUD([{ name: "Plus", price: 16.99, billingCycle: m }]),
      BRL([{ name: "Plus", price: 55.99, billingCycle: m }]),
    ],
  },
  {
    serviceKey: "NordVPN",
    countries: [
      USD([{ name: "Basic", price: 12.99, billingCycle: m }, { name: "Plus", price: 13.99, billingCycle: m }, { name: "Ultimate", price: 14.99, billingCycle: m }]),
      GBP([{ name: "Basic", price: 10.59, billingCycle: m }, { name: "Plus", price: 11.49, billingCycle: m }, { name: "Ultimate", price: 12.39, billingCycle: m }]),
      EUR("Spain", "ES", [{ name: "Básico", price: 12.99, billingCycle: m }, { name: "Plus", price: 13.99, billingCycle: m }, { name: "Completo", price: 14.99, billingCycle: m }]),
      EUR("Germany", "DE", [{ name: "Basis", price: 12.99, billingCycle: m }, { name: "Plus", price: 13.99, billingCycle: m }, { name: "Komplett", price: 14.99, billingCycle: m }]),
      EUR("France", "FR", [{ name: "Basique", price: 12.99, billingCycle: m }, { name: "Plus", price: 13.99, billingCycle: m }, { name: "Complet", price: 14.99, billingCycle: m }]),
      CAD([{ name: "Basic", price: 14.99, billingCycle: m }, { name: "Plus", price: 15.99, billingCycle: m }]),
      AUD([{ name: "Basic", price: 17.99, billingCycle: m }]),
      BRL([{ name: "Basic", price: 49.90, billingCycle: m }]),
    ],
  },
  {
    serviceKey: "ExpressVPN",
    countries: [
      USD([{ name: "Monthly", price: 12.95, billingCycle: m }]),
      GBP([{ name: "Monthly", price: 11.24, billingCycle: m }]),
      EUR("Spain", "ES", [{ name: "Mensual", price: 12.95, billingCycle: m }]),
      EUR("Germany", "DE", [{ name: "Monatlich", price: 12.95, billingCycle: m }]),
      EUR("France", "FR", [{ name: "Mensuel", price: 12.95, billingCycle: m }]),
      AUD([{ name: "Monthly", price: 16.99, billingCycle: m }]),
    ],
  },
  {
    serviceKey: "Xbox Game Pass",
    countries: [
      USD([{ name: "Core", price: 9.99, billingCycle: m }, { name: "Standard", price: 14.99, billingCycle: m }, { name: "Ultimate", price: 19.99, billingCycle: m }]),
      GBP([{ name: "Core", price: 6.99, billingCycle: m }, { name: "Standard", price: 10.99, billingCycle: m }, { name: "Ultimate", price: 14.99, billingCycle: m }]),
      EUR("Spain", "ES", [{ name: "Core", price: 6.99, billingCycle: m }, { name: "Standard", price: 12.99, billingCycle: m }, { name: "Ultimate", price: 17.99, billingCycle: m }]),
      EUR("Germany", "DE", [{ name: "Core", price: 6.99, billingCycle: m }, { name: "Standard", price: 12.99, billingCycle: m }, { name: "Ultimate", price: 17.99, billingCycle: m }]),
      EUR("France", "FR", [{ name: "Core", price: 6.99, billingCycle: m }, { name: "Standard", price: 12.99, billingCycle: m }, { name: "Ultimate", price: 17.99, billingCycle: m }]),
      CAD([{ name: "Core", price: 11.99, billingCycle: m }, { name: "Standard", price: 16.99, billingCycle: m }, { name: "Ultimate", price: 21.99, billingCycle: m }]),
      AUD([{ name: "Core", price: 10.95, billingCycle: m }, { name: "Standard", price: 15.95, billingCycle: m }, { name: "Ultimate", price: 22.95, billingCycle: m }]),
      BRL([{ name: "Core", price: 29.99, billingCycle: m }, { name: "Standard", price: 44.99, billingCycle: m }, { name: "Ultimate", price: 49.99, billingCycle: m }]),
      MXN([{ name: "Core", price: 119, billingCycle: m }, { name: "Standard", price: 199, billingCycle: m }, { name: "Ultimate", price: 249, billingCycle: m }]),
      JPY([{ name: "Core", price: 850, billingCycle: m }, { name: "Standard", price: 1100, billingCycle: m }, { name: "Ultimate", price: 1210, billingCycle: m }]),
    ],
  },
  {
    serviceKey: "PlayStation Plus",
    countries: [
      USD([{ name: "Essential", price: 9.99, billingCycle: m }, { name: "Extra", price: 17.99, billingCycle: m }, { name: "Premium", price: 21.99, billingCycle: m }]),
      GBP([{ name: "Essential", price: 6.99, billingCycle: m }, { name: "Extra", price: 13.49, billingCycle: m }, { name: "Premium", price: 16.99, billingCycle: m }]),
      EUR("Spain", "ES", [{ name: "Essential", price: 8.99, billingCycle: m }, { name: "Extra", price: 16.99, billingCycle: m }, { name: "Premium", price: 19.99, billingCycle: m }]),
      EUR("Germany", "DE", [{ name: "Essential", price: 8.99, billingCycle: m }, { name: "Extra", price: 16.99, billingCycle: m }, { name: "Premium", price: 19.99, billingCycle: m }]),
      EUR("France", "FR", [{ name: "Essential", price: 8.99, billingCycle: m }, { name: "Extra", price: 16.99, billingCycle: m }, { name: "Premium", price: 19.99, billingCycle: m }]),
      EUR("Italy", "IT", [{ name: "Essential", price: 8.99, billingCycle: m }, { name: "Extra", price: 16.99, billingCycle: m }, { name: "Premium", price: 19.99, billingCycle: m }]),
      CAD([{ name: "Essential", price: 11.99, billingCycle: m }, { name: "Extra", price: 22.99, billingCycle: m }, { name: "Premium", price: 27.99, billingCycle: m }]),
      AUD([{ name: "Essential", price: 10.95, billingCycle: m }, { name: "Extra", price: 21.95, billingCycle: m }, { name: "Premium", price: 25.95, billingCycle: m }]),
      BRL([{ name: "Essential", price: 34.90, billingCycle: m }, { name: "Extra", price: 52.90, billingCycle: m }, { name: "Premium", price: 59.90, billingCycle: m }]),
      JPY([{ name: "Essential", price: 850, billingCycle: m }, { name: "Extra", price: 1300, billingCycle: m }, { name: "Premium", price: 1550, billingCycle: m }]),
      MXN([{ name: "Essential", price: 159, billingCycle: m }, { name: "Extra", price: 309, billingCycle: m }, { name: "Premium", price: 389, billingCycle: m }]),
      KRW([{ name: "Essential", price: 5900, billingCycle: m }, { name: "Extra", price: 10900, billingCycle: m }, { name: "Premium", price: 14900, billingCycle: m }]),
    ],
  },
  {
    serviceKey: "Nintendo Switch Online",
    countries: [
      USD([{ name: "Individual (12 months)", price: 19.99, billingCycle: y }, { name: "Family (12 months)", price: 34.99, billingCycle: y }]),
      GBP([{ name: "Individual (12 months)", price: 17.99, billingCycle: y }, { name: "Family (12 months)", price: 31.49, billingCycle: y }]),
      EUR("Spain", "ES", [{ name: "Individual (12 meses)", price: 19.99, billingCycle: y }, { name: "Familiar (12 meses)", price: 34.99, billingCycle: y }]),
      EUR("Germany", "DE", [{ name: "Einzel (12 Monate)", price: 19.99, billingCycle: y }, { name: "Familie (12 Monate)", price: 34.99, billingCycle: y }]),
      EUR("France", "FR", [{ name: "Individuel (12 mois)", price: 19.99, billingCycle: y }, { name: "Famille (12 mois)", price: 34.99, billingCycle: y }]),
      JPY([{ name: "個人 (12ヶ月)", price: 2400, billingCycle: y }, { name: "ファミリー (12ヶ月)", price: 4500, billingCycle: y }]),
      AUD([{ name: "Individual (12 months)", price: 26.95, billingCycle: y }]),
      CAD([{ name: "Individual (12 months)", price: 24.99, billingCycle: y }]),
    ],
  },
  {
    serviceKey: "Headspace",
    countries: [
      USD([{ name: "Monthly", price: 12.99, billingCycle: m }, { name: "Annual", price: 69.99, billingCycle: y }]),
      GBP([{ name: "Monthly", price: 9.99, billingCycle: m }, { name: "Annual", price: 49.99, billingCycle: y }]),
      EUR("Spain", "ES", [{ name: "Mensual", price: 12.99, billingCycle: m }, { name: "Anual", price: 69.99, billingCycle: y }]),
      EUR("Germany", "DE", [{ name: "Monatlich", price: 12.99, billingCycle: m }, { name: "Jährlich", price: 69.99, billingCycle: y }]),
      EUR("France", "FR", [{ name: "Mensuel", price: 12.99, billingCycle: m }, { name: "Annuel", price: 69.99, billingCycle: y }]),
      AUD([{ name: "Monthly", price: 17.99, billingCycle: m }, { name: "Annual", price: 99.99, billingCycle: y }]),
    ],
  },
  {
    serviceKey: "Calm",
    countries: [
      USD([{ name: "Monthly", price: 14.99, billingCycle: m }, { name: "Annual", price: 69.99, billingCycle: y }]),
      GBP([{ name: "Monthly", price: 12.99, billingCycle: m }, { name: "Annual", price: 54.99, billingCycle: y }]),
      EUR("Spain", "ES", [{ name: "Mensual", price: 14.99, billingCycle: m }, { name: "Anual", price: 69.99, billingCycle: y }]),
      EUR("Germany", "DE", [{ name: "Monatlich", price: 14.99, billingCycle: m }, { name: "Jährlich", price: 69.99, billingCycle: y }]),
      EUR("France", "FR", [{ name: "Mensuel", price: 14.99, billingCycle: m }, { name: "Annuel", price: 69.99, billingCycle: y }]),
      AUD([{ name: "Monthly", price: 21.99, billingCycle: m }]),
      BRL([{ name: "Mensal", price: 64.90, billingCycle: m }]),
    ],
  },
  {
    serviceKey: "Strava",
    countries: [
      USD([{ name: "Monthly", price: 11.99, billingCycle: m }, { name: "Annual", price: 79.99, billingCycle: y }]),
      GBP([{ name: "Monthly", price: 9.99, billingCycle: m }, { name: "Annual", price: 59.99, billingCycle: y }]),
      EUR("Spain", "ES", [{ name: "Mensual", price: 9.99, billingCycle: m }, { name: "Anual", price: 59.99, billingCycle: y }]),
      EUR("Germany", "DE", [{ name: "Monatlich", price: 9.99, billingCycle: m }, { name: "Jährlich", price: 59.99, billingCycle: y }]),
      EUR("France", "FR", [{ name: "Mensuel", price: 9.99, billingCycle: m }, { name: "Annuel", price: 59.99, billingCycle: y }]),
      AUD([{ name: "Monthly", price: 14.99, billingCycle: m }]),
    ],
  },
  {
    serviceKey: "Duolingo",
    countries: [
      USD([{ name: "Super Duolingo", price: 6.99, billingCycle: m }, { name: "Duolingo Max", price: 13.99, billingCycle: m }]),
      GBP([{ name: "Super Duolingo", price: 6.99, billingCycle: m }, { name: "Duolingo Max", price: 13.99, billingCycle: m }]),
      EUR("Spain", "ES", [{ name: "Super Duolingo", price: 6.99, billingCycle: m }, { name: "Duolingo Max", price: 13.99, billingCycle: m }]),
      EUR("Germany", "DE", [{ name: "Super Duolingo", price: 6.99, billingCycle: m }, { name: "Duolingo Max", price: 13.99, billingCycle: m }]),
      EUR("France", "FR", [{ name: "Super Duolingo", price: 6.99, billingCycle: m }]),
      BRL([{ name: "Super Duolingo", price: 29.90, billingCycle: m }]),
      INR([{ name: "Super Duolingo", price: 299, billingCycle: m }]),
      MXN([{ name: "Super Duolingo", price: 149, billingCycle: m }]),
      JPY([{ name: "Super Duolingo", price: 980, billingCycle: m }]),
    ],
  },
  {
    serviceKey: "Grammarly",
    countries: [
      USD([{ name: "Premium", price: 12, billingCycle: m }, { name: "Business", price: 15, billingCycle: m }]),
      GBP([{ name: "Premium", price: 12, billingCycle: m }]),
      EUR("Spain", "ES", [{ name: "Premium", price: 12, billingCycle: m }]),
      EUR("Germany", "DE", [{ name: "Premium", price: 12, billingCycle: m }]),
      EUR("France", "FR", [{ name: "Premium", price: 12, billingCycle: m }]),
      AUD([{ name: "Premium", price: 16.67, billingCycle: m }]),
    ],
  },
  {
    serviceKey: "LinkedIn Premium",
    countries: [
      USD([{ name: "Career", price: 29.99, billingCycle: m }, { name: "Business", price: 59.99, billingCycle: m }]),
      GBP([{ name: "Career", price: 24.99, billingCycle: m }, { name: "Business", price: 49.99, billingCycle: m }]),
      EUR("Spain", "ES", [{ name: "Profesional", price: 29.99, billingCycle: m }, { name: "Business", price: 54.99, billingCycle: m }]),
      EUR("Germany", "DE", [{ name: "Karriere", price: 29.99, billingCycle: m }, { name: "Business", price: 54.99, billingCycle: m }]),
      EUR("France", "FR", [{ name: "Carrière", price: 29.99, billingCycle: m }, { name: "Business", price: 54.99, billingCycle: m }]),
      AUD([{ name: "Career", price: 39.99, billingCycle: m }]),
      INR([{ name: "Career", price: 1599, billingCycle: m }]),
    ],
  },
  {
    serviceKey: "DAZN",
    countries: [
      EUR("Spain", "ES", [{ name: "Start", price: 9.99, billingCycle: m }, { name: "Standard", price: 24.99, billingCycle: m }, { name: "Total", price: 34.99, billingCycle: m }]),
      EUR("Italy", "IT", [{ name: "Start", price: 14.99, billingCycle: m }, { name: "Standard", price: 40.99, billingCycle: m }, { name: "Plus", price: 59.99, billingCycle: m }]),
      EUR("Germany", "DE", [{ name: "Super Sports", price: 44.99, billingCycle: m }]),
      EUR("Portugal", "PT", [{ name: "Start", price: 9.99, billingCycle: m }, { name: "Standard", price: 18.99, billingCycle: m }]),
      CAD([{ name: "Monthly", price: 24.99, billingCycle: m }, { name: "Annual", price: 199.99, billingCycle: y }]),
      JPY([{ name: "Standard", price: 3700, billingCycle: m }]),
    ],
  },
  {
    serviceKey: "Hulu",
    countries: [
      USD([{ name: "Basic (with Ads)", price: 7.99, billingCycle: m }, { name: "No Ads", price: 17.99, billingCycle: m }, { name: "+ Live TV", price: 76.99, billingCycle: m }]),
    ],
  },
  {
    serviceKey: "Paramount+",
    countries: [
      USD([{ name: "Essential (with Ads)", price: 5.99, billingCycle: m }, { name: "With Showtime", price: 11.99, billingCycle: m }]),
      GBP([{ name: "Monthly", price: 6.99, billingCycle: m }, { name: "Annual", price: 69.90, billingCycle: y }]),
      EUR("Spain", "ES", [{ name: "Mensual", price: 7.99, billingCycle: m }, { name: "Anual", price: 79.90, billingCycle: y }]),
      EUR("Germany", "DE", [{ name: "Monatlich", price: 7.99, billingCycle: m }, { name: "Jährlich", price: 79.90, billingCycle: y }]),
      EUR("France", "FR", [{ name: "Mensuel", price: 7.99, billingCycle: m }, { name: "Annuel", price: 79.90, billingCycle: y }]),
      EUR("Italy", "IT", [{ name: "Mensile", price: 7.99, billingCycle: m }, { name: "Annuale", price: 79.90, billingCycle: y }]),
      AUD([{ name: "Monthly", price: 8.99, billingCycle: m }]),
      CAD([{ name: "Monthly", price: 6.99, billingCycle: m }]),
      BRL([{ name: "Mensal", price: 14.90, billingCycle: m }]),
    ],
  },
  {
    serviceKey: "Crunchyroll",
    countries: [
      USD([{ name: "Fan", price: 7.99, billingCycle: m }, { name: "Mega Fan", price: 11.99, billingCycle: m }, { name: "Ultimate Fan", price: 15.99, billingCycle: m }]),
      GBP([{ name: "Fan", price: 4.99, billingCycle: m }, { name: "Mega Fan", price: 7.99, billingCycle: m }]),
      EUR("Spain", "ES", [{ name: "Fan", price: 5.99, billingCycle: m }, { name: "Mega Fan", price: 8.99, billingCycle: m }]),
      EUR("Germany", "DE", [{ name: "Fan", price: 5.99, billingCycle: m }, { name: "Mega Fan", price: 8.99, billingCycle: m }]),
      EUR("France", "FR", [{ name: "Fan", price: 5.99, billingCycle: m }, { name: "Mega Fan", price: 8.99, billingCycle: m }]),
      BRL([{ name: "Fan", price: 14.99, billingCycle: m }, { name: "Mega Fan", price: 22.99, billingCycle: m }]),
      INR([{ name: "Fan", price: 79, billingCycle: m }, { name: "Mega Fan", price: 139, billingCycle: m }]),
      MXN([{ name: "Fan", price: 139, billingCycle: m }, { name: "Mega Fan", price: 209, billingCycle: m }]),
    ],
  },
  {
    serviceKey: "Revolut Premium",
    countries: [
      GBP([{ name: "Plus", price: 2.99, billingCycle: m }, { name: "Premium", price: 6.99, billingCycle: m }, { name: "Metal", price: 12.99, billingCycle: m }]),
      EUR("Spain", "ES", [{ name: "Plus", price: 3.99, billingCycle: m }, { name: "Premium", price: 7.99, billingCycle: m }, { name: "Metal", price: 13.99, billingCycle: m }]),
      EUR("France", "FR", [{ name: "Plus", price: 3.99, billingCycle: m }, { name: "Premium", price: 7.99, billingCycle: m }, { name: "Metal", price: 13.99, billingCycle: m }]),
      EUR("Germany", "DE", [{ name: "Plus", price: 3.99, billingCycle: m }, { name: "Premium", price: 7.99, billingCycle: m }, { name: "Metal", price: 13.99, billingCycle: m }]),
      PLN([{ name: "Plus", price: 17.99, billingCycle: m }, { name: "Premium", price: 39.99, billingCycle: m }, { name: "Metal", price: 59.99, billingCycle: m }]),
    ],
  },
  {
    serviceKey: "iCloud+",
    countries: [
      USD([{ name: "50GB", price: 0.99, billingCycle: m }, { name: "200GB", price: 2.99, billingCycle: m }, { name: "2TB", price: 9.99, billingCycle: m }]),
      GBP([{ name: "50GB", price: 0.99, billingCycle: m }, { name: "200GB", price: 2.99, billingCycle: m }, { name: "2TB", price: 8.99, billingCycle: m }]),
      EUR("Spain", "ES", [{ name: "50GB", price: 0.99, billingCycle: m }, { name: "200GB", price: 2.99, billingCycle: m }, { name: "2TB", price: 9.99, billingCycle: m }]),
      EUR("Germany", "DE", [{ name: "50GB", price: 0.99, billingCycle: m }, { name: "200GB", price: 2.99, billingCycle: m }, { name: "2TB", price: 9.99, billingCycle: m }]),
      EUR("France", "FR", [{ name: "50GB", price: 0.99, billingCycle: m }, { name: "200GB", price: 2.99, billingCycle: m }, { name: "2TB", price: 9.99, billingCycle: m }]),
      BRL([{ name: "50GB", price: 3.90, billingCycle: m }, { name: "200GB", price: 10.90, billingCycle: m }, { name: "2TB", price: 34.90, billingCycle: m }]),
      INR([{ name: "50GB", price: 75, billingCycle: m }, { name: "200GB", price: 219, billingCycle: m }, { name: "2TB", price: 749, billingCycle: m }]),
      JPY([{ name: "50GB", price: 130, billingCycle: m }, { name: "200GB", price: 400, billingCycle: m }, { name: "2TB", price: 1300, billingCycle: m }]),
    ],
  },
  {
    serviceKey: "Google One",
    countries: [
      USD([{ name: "100GB", price: 1.99, billingCycle: m }, { name: "200GB", price: 2.99, billingCycle: m }, { name: "2TB", price: 9.99, billingCycle: m }]),
      GBP([{ name: "100GB", price: 1.59, billingCycle: m }, { name: "200GB", price: 2.49, billingCycle: m }, { name: "2TB", price: 7.99, billingCycle: m }]),
      EUR("Spain", "ES", [{ name: "100GB", price: 1.99, billingCycle: m }, { name: "200GB", price: 2.99, billingCycle: m }, { name: "2TB", price: 9.99, billingCycle: m }]),
      EUR("Germany", "DE", [{ name: "100GB", price: 1.99, billingCycle: m }, { name: "200GB", price: 2.99, billingCycle: m }, { name: "2TB", price: 9.99, billingCycle: m }]),
      EUR("France", "FR", [{ name: "100GB", price: 1.99, billingCycle: m }, { name: "200GB", price: 2.99, billingCycle: m }, { name: "2TB", price: 9.99, billingCycle: m }]),
      BRL([{ name: "100GB", price: 6.99, billingCycle: m }, { name: "200GB", price: 9.99, billingCycle: m }, { name: "2TB", price: 34.99, billingCycle: m }]),
      INR([{ name: "100GB", price: 130, billingCycle: m }, { name: "200GB", price: 210, billingCycle: m }, { name: "2TB", price: 650, billingCycle: m }]),
    ],
  },
  {
    serviceKey: "Twitch",
    countries: [
      USD([{ name: "Tier 1 Sub", price: 4.99, billingCycle: m }, { name: "Tier 2 Sub", price: 9.99, billingCycle: m }, { name: "Tier 3 Sub", price: 24.99, billingCycle: m }]),
      EUR("Spain", "ES", [{ name: "Tier 1", price: 4.99, billingCycle: m }, { name: "Tier 2", price: 9.99, billingCycle: m }]),
      EUR("Germany", "DE", [{ name: "Tier 1", price: 4.99, billingCycle: m }, { name: "Tier 2", price: 9.99, billingCycle: m }]),
      GBP([{ name: "Tier 1", price: 3.99, billingCycle: m }, { name: "Tier 2", price: 7.99, billingCycle: m }]),
      BRL([{ name: "Tier 1", price: 12.90, billingCycle: m }]),
    ],
  },
  {
    serviceKey: "EA Play",
    countries: [
      USD([{ name: "EA Play", price: 4.99, billingCycle: m }, { name: "EA Play Pro", price: 14.99, billingCycle: m }]),
      GBP([{ name: "EA Play", price: 3.99, billingCycle: m }, { name: "EA Play Pro", price: 11.99, billingCycle: m }]),
      EUR("Spain", "ES", [{ name: "EA Play", price: 3.99, billingCycle: m }, { name: "EA Play Pro", price: 11.99, billingCycle: m }]),
      EUR("Germany", "DE", [{ name: "EA Play", price: 3.99, billingCycle: m }, { name: "EA Play Pro", price: 11.99, billingCycle: m }]),
      EUR("France", "FR", [{ name: "EA Play", price: 3.99, billingCycle: m }, { name: "EA Play Pro", price: 11.99, billingCycle: m }]),
    ],
  },
  {
    serviceKey: "Skillshare",
    countries: [
      USD([{ name: "Membership", price: 19, billingCycle: m }, { name: "Annual", price: 99, billingCycle: y }]),
      GBP([{ name: "Membership", price: 16, billingCycle: m }]),
      EUR("Spain", "ES", [{ name: "Membership", price: 16, billingCycle: m }]),
      EUR("Germany", "DE", [{ name: "Membership", price: 16, billingCycle: m }]),
    ],
  },
  {
    serviceKey: "Audible",
    countries: [
      USD([{ name: "Plus", price: 7.95, billingCycle: m }, { name: "Premium Plus", price: 14.95, billingCycle: m }]),
      GBP([{ name: "Plus", price: 7.99, billingCycle: m }, { name: "Premium Plus", price: 14.99, billingCycle: m }]),
      EUR("Germany", "DE", [{ name: "Audible Plus", price: 9.95, billingCycle: m }, { name: "Premium Plus", price: 9.95, billingCycle: m }]),
      EUR("France", "FR", [{ name: "Premium Plus", price: 9.95, billingCycle: m }]),
      EUR("Spain", "ES", [{ name: "Premium Plus", price: 9.99, billingCycle: m }]),
    ],
  },
  {
    serviceKey: "Peloton",
    countries: [
      USD([{ name: "App One", price: 12.99, billingCycle: m }, { name: "App+", price: 24, billingCycle: m }]),
      GBP([{ name: "App One", price: 12.99, billingCycle: m }, { name: "App+", price: 24, billingCycle: m }]),
      EUR("Germany", "DE", [{ name: "App One", price: 12.99, billingCycle: m }, { name: "App+", price: 24, billingCycle: m }]),
      CAD([{ name: "App One", price: 16.99, billingCycle: m }, { name: "App+", price: 32.99, billingCycle: m }]),
      AUD([{ name: "App One", price: 19.99, billingCycle: m }, { name: "App+", price: 36.99, billingCycle: m }]),
    ],
  },
  {
    serviceKey: "1Password",
    countries: [
      USD([{ name: "Individual", price: 2.99, billingCycle: m }, { name: "Families", price: 4.99, billingCycle: m }]),
      GBP([{ name: "Individual", price: 2.65, billingCycle: m }, { name: "Families", price: 4.49, billingCycle: m }]),
      EUR("Spain", "ES", [{ name: "Individual", price: 2.99, billingCycle: m }, { name: "Families", price: 4.99, billingCycle: m }]),
      EUR("Germany", "DE", [{ name: "Individual", price: 2.99, billingCycle: m }, { name: "Families", price: 4.99, billingCycle: m }]),
      CAD([{ name: "Individual", price: 3.99, billingCycle: m }, { name: "Families", price: 6.99, billingCycle: m }]),
      AUD([{ name: "Individual", price: 4.99, billingCycle: m }, { name: "Families", price: 7.99, billingCycle: m }]),
    ],
  },
  {
    serviceKey: "Dashlane",
    countries: [
      USD([{ name: "Premium", price: 4.99, billingCycle: m }, { name: "Friends & Family", price: 7.49, billingCycle: m }]),
      EUR("Spain", "ES", [{ name: "Premium", price: 4.99, billingCycle: m }]),
      EUR("France", "FR", [{ name: "Premium", price: 4.99, billingCycle: m }]),
      EUR("Germany", "DE", [{ name: "Premium", price: 4.99, billingCycle: m }]),
      GBP([{ name: "Premium", price: 4.49, billingCycle: m }]),
    ],
  },
  {
    serviceKey: "Zoom",
    countries: [
      USD([{ name: "Pro", price: 13.32, billingCycle: m }, { name: "Business", price: 18.32, billingCycle: m }]),
      GBP([{ name: "Pro", price: 11.99, billingCycle: m }, { name: "Business", price: 15.99, billingCycle: m }]),
      EUR("Spain", "ES", [{ name: "Pro", price: 13.32, billingCycle: m }, { name: "Business", price: 18.32, billingCycle: m }]),
      EUR("Germany", "DE", [{ name: "Pro", price: 13.32, billingCycle: m }, { name: "Business", price: 18.32, billingCycle: m }]),
      AUD([{ name: "Pro", price: 20.99, billingCycle: m }]),
    ],
  },
  {
    serviceKey: "Slack",
    countries: [
      USD([{ name: "Pro", price: 7.25, billingCycle: m }, { name: "Business+", price: 12.50, billingCycle: m }]),
      GBP([{ name: "Pro", price: 5.75, billingCycle: m }, { name: "Business+", price: 9.75, billingCycle: m }]),
      EUR("Spain", "ES", [{ name: "Pro", price: 6.75, billingCycle: m }, { name: "Business+", price: 11.75, billingCycle: m }]),
      EUR("Germany", "DE", [{ name: "Pro", price: 6.75, billingCycle: m }, { name: "Business+", price: 11.75, billingCycle: m }]),
      EUR("France", "FR", [{ name: "Pro", price: 6.75, billingCycle: m }, { name: "Business+", price: 11.75, billingCycle: m }]),
    ],
  },
];

export const SERVICE_PLANS = planData;

export const getPlansForService = (serviceName: string): ServicePlanData | undefined => {
  const q = serviceName.toLowerCase().trim();
  return planData.find((s) => s.serviceKey.toLowerCase() === q);
};

export const getCountriesForService = (serviceName: string): string[] => {
  const data = getPlansForService(serviceName);
  return data?.countries.map((c) => c.country) ?? [];
};

export const getPlansForCountry = (serviceName: string, country: string): ServicePlan[] => {
  const data = getPlansForService(serviceName);
  return data?.countries.find((c) => c.country === country)?.plans ?? [];
};

export const getCurrencyForCountry = (serviceName: string, country: string): string => {
  const data = getPlansForService(serviceName);
  return data?.countries.find((c) => c.country === country)?.currency ?? "€";
};

export const suggestPlanByPrice = (serviceName: string, country: string, inputPrice: number): ServicePlan | null => {
  const plans = getPlansForCountry(serviceName, country);
  if (plans.length === 0) return null;
  let closest = plans[0];
  let minDiff = Math.abs(plans[0].price - inputPrice);
  for (const plan of plans) {
    const diff = Math.abs(plan.price - inputPrice);
    if (diff < minDiff) {
      minDiff = diff;
      closest = plan;
    }
  }
  return minDiff <= inputPrice * 0.15 ? closest : null;
};
