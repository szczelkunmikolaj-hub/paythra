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

const m = "monthly" as const;
const y = "yearly" as const;

const planData: ServicePlanData[] = [
  {
    serviceKey: "Netflix",
    countries: [
      USD([{ name: "Standard with Ads", price: 6.99, billingCycle: m }, { name: "Standard", price: 15.49, billingCycle: m }, { name: "Premium", price: 22.99, billingCycle: m }]),
      GBP([{ name: "Standard with Ads", price: 4.99, billingCycle: m }, { name: "Standard", price: 10.99, billingCycle: m }, { name: "Premium", price: 17.99, billingCycle: m }]),
      EUR("Spain", "ES", [{ name: "Estándar con anuncios", price: 5.49, billingCycle: m }, { name: "Estándar", price: 12.99, billingCycle: m }, { name: "Premium", price: 17.99, billingCycle: m }]),
      EUR("France", "FR", [{ name: "Essentiel avec pub", price: 5.99, billingCycle: m }, { name: "Standard", price: 13.49, billingCycle: m }, { name: "Premium", price: 19.99, billingCycle: m }]),
      EUR("Germany", "DE", [{ name: "Standard mit Werbung", price: 4.99, billingCycle: m }, { name: "Standard", price: 13.99, billingCycle: m }, { name: "Premium", price: 19.99, billingCycle: m }]),
      EUR("Italy", "IT", [{ name: "Standard con pubblicità", price: 5.49, billingCycle: m }, { name: "Standard", price: 12.99, billingCycle: m }, { name: "Premium", price: 17.99, billingCycle: m }]),
      EUR("Netherlands", "NL", [{ name: "Standaard met reclame", price: 5.49, billingCycle: m }, { name: "Standaard", price: 13.49, billingCycle: m }, { name: "Premium", price: 18.99, billingCycle: m }]),
      EUR("Portugal", "PT", [{ name: "Standard com anúncios", price: 5.49, billingCycle: m }, { name: "Standard", price: 12.99, billingCycle: m }, { name: "Premium", price: 17.99, billingCycle: m }]),
      EUR("Ireland", "IE", [{ name: "Standard with Ads", price: 5.49, billingCycle: m }, { name: "Standard", price: 13.99, billingCycle: m }, { name: "Premium", price: 20.99, billingCycle: m }]),
      EUR("Finland", "FI", [{ name: "Standard with Ads", price: 5.49, billingCycle: m }, { name: "Standard", price: 13.49, billingCycle: m }, { name: "Premium", price: 18.99, billingCycle: m }]),
      PLN([{ name: "Podstawowy z reklamami", price: 24, billingCycle: m }, { name: "Standardowy", price: 49, billingCycle: m }, { name: "Premium", price: 65, billingCycle: m }]),
      SEK([{ name: "Standard med reklam", price: 59, billingCycle: m }, { name: "Standard", price: 139, billingCycle: m }, { name: "Premium", price: 199, billingCycle: m }]),
      NOK([{ name: "Standard med reklame", price: 59, billingCycle: m }, { name: "Standard", price: 139, billingCycle: m }, { name: "Premium", price: 199, billingCycle: m }]),
      DKK([{ name: "Standard med reklamer", price: 45, billingCycle: m }, { name: "Standard", price: 99, billingCycle: m }, { name: "Premium", price: 149, billingCycle: m }]),
      CAD([{ name: "Standard with Ads", price: 5.99, billingCycle: m }, { name: "Standard", price: 16.49, billingCycle: m }, { name: "Premium", price: 22.99, billingCycle: m }]),
      AUD([{ name: "Standard with Ads", price: 7.99, billingCycle: m }, { name: "Standard", price: 18.99, billingCycle: m }, { name: "Premium", price: 25.99, billingCycle: m }]),
      INR([{ name: "Mobile", price: 149, billingCycle: m }, { name: "Basic", price: 199, billingCycle: m }, { name: "Standard", price: 499, billingCycle: m }, { name: "Premium", price: 649, billingCycle: m }]),
      BRL([{ name: "Básico com anúncios", price: 18.90, billingCycle: m }, { name: "Padrão", price: 39.90, billingCycle: m }, { name: "Premium", price: 55.90, billingCycle: m }]),
    ],
  },
  {
    serviceKey: "Spotify",
    countries: [
      USD([{ name: "Individual", price: 11.99, billingCycle: m }, { name: "Student", price: 5.99, billingCycle: m }, { name: "Duo", price: 16.99, billingCycle: m }, { name: "Family", price: 19.99, billingCycle: m }]),
      GBP([{ name: "Individual", price: 10.99, billingCycle: m }, { name: "Student", price: 5.99, billingCycle: m }, { name: "Duo", price: 14.99, billingCycle: m }, { name: "Family", price: 17.99, billingCycle: m }]),
      EUR("Spain", "ES", [{ name: "Individual", price: 10.99, billingCycle: m }, { name: "Estudiante", price: 5.99, billingCycle: m }, { name: "Duo", price: 14.99, billingCycle: m }, { name: "Familia", price: 17.99, billingCycle: m }]),
      EUR("France", "FR", [{ name: "Individual", price: 10.99, billingCycle: m }, { name: "Étudiant", price: 5.99, billingCycle: m }, { name: "Duo", price: 14.99, billingCycle: m }, { name: "Famille", price: 17.99, billingCycle: m }]),
      EUR("Germany", "DE", [{ name: "Individual", price: 10.99, billingCycle: m }, { name: "Student", price: 5.99, billingCycle: m }, { name: "Duo", price: 14.99, billingCycle: m }, { name: "Family", price: 17.99, billingCycle: m }]),
      EUR("Italy", "IT", [{ name: "Individual", price: 10.99, billingCycle: m }, { name: "Studenti", price: 5.99, billingCycle: m }, { name: "Duo", price: 14.99, billingCycle: m }, { name: "Famiglia", price: 17.99, billingCycle: m }]),
      EUR("Netherlands", "NL", [{ name: "Individual", price: 10.99, billingCycle: m }, { name: "Student", price: 5.99, billingCycle: m }, { name: "Duo", price: 14.99, billingCycle: m }, { name: "Family", price: 17.99, billingCycle: m }]),
      EUR("Portugal", "PT", [{ name: "Individual", price: 10.99, billingCycle: m }, { name: "Estudante", price: 5.99, billingCycle: m }, { name: "Duo", price: 14.99, billingCycle: m }, { name: "Família", price: 17.99, billingCycle: m }]),
      EUR("Ireland", "IE", [{ name: "Individual", price: 10.99, billingCycle: m }, { name: "Student", price: 5.99, billingCycle: m }, { name: "Duo", price: 14.99, billingCycle: m }, { name: "Family", price: 17.99, billingCycle: m }]),
      EUR("Finland", "FI", [{ name: "Individual", price: 10.99, billingCycle: m }, { name: "Student", price: 5.99, billingCycle: m }, { name: "Duo", price: 14.99, billingCycle: m }, { name: "Family", price: 17.99, billingCycle: m }]),
      PLN([{ name: "Individual", price: 23.99, billingCycle: m }, { name: "Student", price: 11.99, billingCycle: m }, { name: "Duo", price: 30.99, billingCycle: m }, { name: "Family", price: 37.99, billingCycle: m }]),
      SEK([{ name: "Individual", price: 119, billingCycle: m }, { name: "Student", price: 65, billingCycle: m }, { name: "Duo", price: 159, billingCycle: m }, { name: "Family", price: 189, billingCycle: m }]),
      NOK([{ name: "Individual", price: 119, billingCycle: m }, { name: "Student", price: 65, billingCycle: m }, { name: "Duo", price: 159, billingCycle: m }, { name: "Family", price: 189, billingCycle: m }]),
      DKK([{ name: "Individual", price: 79, billingCycle: m }, { name: "Student", price: 39, billingCycle: m }, { name: "Duo", price: 109, billingCycle: m }, { name: "Family", price: 129, billingCycle: m }]),
      CAD([{ name: "Individual", price: 11.99, billingCycle: m }, { name: "Student", price: 5.99, billingCycle: m }, { name: "Duo", price: 16.99, billingCycle: m }, { name: "Family", price: 19.99, billingCycle: m }]),
      AUD([{ name: "Individual", price: 13.99, billingCycle: m }, { name: "Student", price: 6.99, billingCycle: m }, { name: "Duo", price: 18.99, billingCycle: m }, { name: "Family", price: 22.99, billingCycle: m }]),
      INR([{ name: "Individual", price: 119, billingCycle: m }, { name: "Student", price: 59, billingCycle: m }, { name: "Duo", price: 149, billingCycle: m }, { name: "Family", price: 179, billingCycle: m }]),
      BRL([{ name: "Individual", price: 21.90, billingCycle: m }, { name: "Estudante", price: 11.90, billingCycle: m }, { name: "Duo", price: 27.90, billingCycle: m }, { name: "Família", price: 34.90, billingCycle: m }]),
    ],
  },
  {
    serviceKey: "Apple Music",
    countries: [
      USD([{ name: "Voice", price: 4.99, billingCycle: m }, { name: "Individual", price: 10.99, billingCycle: m }, { name: "Family", price: 16.99, billingCycle: m }]),
      GBP([{ name: "Individual", price: 10.99, billingCycle: m }, { name: "Family", price: 16.99, billingCycle: m }]),
      EUR("Spain", "ES", [{ name: "Individual", price: 10.99, billingCycle: m }, { name: "Familia", price: 16.99, billingCycle: m }]),
      EUR("France", "FR", [{ name: "Individuel", price: 10.99, billingCycle: m }, { name: "Famille", price: 16.99, billingCycle: m }]),
      EUR("Germany", "DE", [{ name: "Einzelperson", price: 10.99, billingCycle: m }, { name: "Familie", price: 16.99, billingCycle: m }]),
      EUR("Italy", "IT", [{ name: "Individuale", price: 10.99, billingCycle: m }, { name: "Famiglia", price: 16.99, billingCycle: m }]),
      CAD([{ name: "Individual", price: 10.99, billingCycle: m }, { name: "Family", price: 16.99, billingCycle: m }]),
      AUD([{ name: "Individual", price: 13.99, billingCycle: m }, { name: "Family", price: 22.99, billingCycle: m }]),
      INR([{ name: "Individual", price: 99, billingCycle: m }, { name: "Family", price: 149, billingCycle: m }]),
      BRL([{ name: "Individual", price: 21.90, billingCycle: m }, { name: "Família", price: 34.90, billingCycle: m }]),
    ],
  },
  {
    serviceKey: "Disney+",
    countries: [
      USD([{ name: "Basic (with Ads)", price: 7.99, billingCycle: m }, { name: "Standard", price: 13.99, billingCycle: m }, { name: "Premium", price: 13.99, billingCycle: m }]),
      GBP([{ name: "Standard with Ads", price: 4.99, billingCycle: m }, { name: "Standard", price: 7.99, billingCycle: m }, { name: "Premium", price: 10.99, billingCycle: m }]),
      EUR("Spain", "ES", [{ name: "Estándar con anuncios", price: 5.99, billingCycle: m }, { name: "Estándar", price: 8.99, billingCycle: m }, { name: "Premium", price: 11.99, billingCycle: m }]),
      EUR("France", "FR", [{ name: "Standard avec pub", price: 5.99, billingCycle: m }, { name: "Standard", price: 8.99, billingCycle: m }, { name: "Premium", price: 11.99, billingCycle: m }]),
      EUR("Germany", "DE", [{ name: "Standard mit Werbung", price: 5.99, billingCycle: m }, { name: "Standard", price: 8.99, billingCycle: m }, { name: "Premium", price: 11.99, billingCycle: m }]),
      EUR("Italy", "IT", [{ name: "Standard con pubblicità", price: 5.99, billingCycle: m }, { name: "Standard", price: 8.99, billingCycle: m }, { name: "Premium", price: 11.99, billingCycle: m }]),
      EUR("Netherlands", "NL", [{ name: "Standaard met reclame", price: 5.99, billingCycle: m }, { name: "Standaard", price: 8.99, billingCycle: m }, { name: "Premium", price: 11.99, billingCycle: m }]),
      CAD([{ name: "Basic (with Ads)", price: 7.99, billingCycle: m }, { name: "Standard", price: 11.99, billingCycle: m }, { name: "Premium", price: 14.99, billingCycle: m }]),
      AUD([{ name: "Standard with Ads", price: 6.99, billingCycle: m }, { name: "Standard", price: 13.99, billingCycle: m }, { name: "Premium", price: 17.99, billingCycle: m }]),
      BRL([{ name: "Básico com anúncios", price: 27.90, billingCycle: m }, { name: "Padrão", price: 33.90, billingCycle: m }, { name: "Premium", price: 43.90, billingCycle: m }]),
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
      EUR("Netherlands", "NL", [{ name: "Maandelijks", price: 4.99, billingCycle: m }, { name: "Jaarlijks", price: 49.90, billingCycle: y }]),
      CAD([{ name: "Monthly", price: 9.99, billingCycle: m }, { name: "Annual", price: 99, billingCycle: y }]),
      AUD([{ name: "Monthly", price: 9.99, billingCycle: m }, { name: "Annual", price: 79, billingCycle: y }]),
      INR([{ name: "Monthly", price: 299, billingCycle: m }, { name: "Annual", price: 1499, billingCycle: y }]),
      BRL([{ name: "Mensal", price: 14.90, billingCycle: m }, { name: "Anual", price: 119.90, billingCycle: y }]),
    ],
  },
  {
    serviceKey: "YouTube Premium",
    countries: [
      USD([{ name: "Individual", price: 13.99, billingCycle: m }, { name: "Student", price: 7.99, billingCycle: m }, { name: "Family", price: 22.99, billingCycle: m }]),
      GBP([{ name: "Individual", price: 12.99, billingCycle: m }, { name: "Student", price: 6.99, billingCycle: m }, { name: "Family", price: 19.99, billingCycle: m }]),
      EUR("Spain", "ES", [{ name: "Individual", price: 12.99, billingCycle: m }, { name: "Familia", price: 22.99, billingCycle: m }]),
      EUR("Germany", "DE", [{ name: "Individual", price: 12.99, billingCycle: m }, { name: "Familie", price: 22.99, billingCycle: m }]),
      EUR("France", "FR", [{ name: "Individuel", price: 12.99, billingCycle: m }, { name: "Famille", price: 22.99, billingCycle: m }]),
      INR([{ name: "Individual", price: 129, billingCycle: m }, { name: "Family", price: 189, billingCycle: m }]),
      BRL([{ name: "Individual", price: 24.90, billingCycle: m }, { name: "Família", price: 41.90, billingCycle: m }]),
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
      INR([{ name: "Plus", price: 2000, billingCycle: m }]),
      BRL([{ name: "Plus", price: 104, billingCycle: m }]),
    ],
  },
  {
    serviceKey: "HBO Max",
    countries: [
      EUR("Spain", "ES", [{ name: "Estándar", price: 5.99, billingCycle: m }, { name: "Premium", price: 9.99, billingCycle: m }]),
      EUR("Portugal", "PT", [{ name: "Standard", price: 5.99, billingCycle: m }, { name: "Premium", price: 9.99, billingCycle: m }]),
      EUR("Netherlands", "NL", [{ name: "Standaard", price: 5.99, billingCycle: m }, { name: "Premium", price: 9.99, billingCycle: m }]),
      PLN([{ name: "Standard", price: 24.99, billingCycle: m }, { name: "Premium", price: 39.99, billingCycle: m }]),
      SEK([{ name: "Standard", price: 69, billingCycle: m }, { name: "Premium", price: 109, billingCycle: m }]),
      DKK([{ name: "Standard", price: 49, billingCycle: m }, { name: "Premium", price: 79, billingCycle: m }]),
      NOK([{ name: "Standard", price: 69, billingCycle: m }, { name: "Premium", price: 109, billingCycle: m }]),
    ],
  },
  {
    serviceKey: "Notion",
    countries: [
      USD([{ name: "Plus", price: 10, billingCycle: m }, { name: "Business", price: 18, billingCycle: m }]),
      EUR("Spain", "ES", [{ name: "Plus", price: 10, billingCycle: m }, { name: "Business", price: 18, billingCycle: m }]),
      EUR("Germany", "DE", [{ name: "Plus", price: 10, billingCycle: m }, { name: "Business", price: 18, billingCycle: m }]),
      GBP([{ name: "Plus", price: 8, billingCycle: m }, { name: "Business", price: 15, billingCycle: m }]),
    ],
  },
  {
    serviceKey: "Canva",
    countries: [
      USD([{ name: "Pro", price: 14.99, billingCycle: m }, { name: "Teams", price: 29.99, billingCycle: m }]),
      EUR("Spain", "ES", [{ name: "Pro", price: 11.99, billingCycle: m }, { name: "Equipos", price: 23.99, billingCycle: m }]),
      EUR("Germany", "DE", [{ name: "Pro", price: 11.99, billingCycle: m }, { name: "Teams", price: 23.99, billingCycle: m }]),
      GBP([{ name: "Pro", price: 10.99, billingCycle: m }, { name: "Teams", price: 21.99, billingCycle: m }]),
      AUD([{ name: "Pro", price: 17.99, billingCycle: m }, { name: "Teams", price: 39.99, billingCycle: m }]),
      BRL([{ name: "Pro", price: 34.90, billingCycle: m }, { name: "Equipes", price: 69.90, billingCycle: m }]),
      INR([{ name: "Pro", price: 499, billingCycle: m }, { name: "Teams", price: 999, billingCycle: m }]),
    ],
  },
  {
    serviceKey: "Adobe Creative Cloud",
    countries: [
      USD([{ name: "Photography (20GB)", price: 9.99, billingCycle: m }, { name: "Single App", price: 22.99, billingCycle: m }, { name: "All Apps", price: 59.99, billingCycle: m }]),
      GBP([{ name: "Photography (20GB)", price: 9.98, billingCycle: m }, { name: "Single App", price: 22.98, billingCycle: m }, { name: "All Apps", price: 54.98, billingCycle: m }]),
      EUR("Spain", "ES", [{ name: "Fotografía (20GB)", price: 12.09, billingCycle: m }, { name: "App individual", price: 26.43, billingCycle: m }, { name: "Todas las apps", price: 62.99, billingCycle: m }]),
      EUR("Germany", "DE", [{ name: "Foto (20GB)", price: 11.89, billingCycle: m }, { name: "Einzelprodukt-Abo", price: 23.79, billingCycle: m }, { name: "Alle Applikationen", price: 61.95, billingCycle: m }]),
      EUR("France", "FR", [{ name: "Photo (20 Go)", price: 11.99, billingCycle: m }, { name: "Application unique", price: 24.99, billingCycle: m }, { name: "Toutes les apps", price: 62.99, billingCycle: m }]),
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
      CAD([{ name: "Essential", price: 11.99, billingCycle: m }, { name: "Extra", price: 22.99, billingCycle: m }, { name: "Premium", price: 27.99, billingCycle: m }]),
      AUD([{ name: "Essential", price: 10.95, billingCycle: m }, { name: "Extra", price: 21.95, billingCycle: m }, { name: "Premium", price: 25.95, billingCycle: m }]),
      BRL([{ name: "Essential", price: 34.90, billingCycle: m }, { name: "Extra", price: 52.90, billingCycle: m }, { name: "Premium", price: 59.90, billingCycle: m }]),
    ],
  },
  {
    serviceKey: "DAZN",
    countries: [
      EUR("Spain", "ES", [{ name: "Start", price: 9.99, billingCycle: m }, { name: "Standard", price: 24.99, billingCycle: m }, { name: "Total", price: 34.99, billingCycle: m }]),
      EUR("Italy", "IT", [{ name: "Start", price: 14.99, billingCycle: m }, { name: "Standard", price: 40.99, billingCycle: m }, { name: "Plus", price: 59.99, billingCycle: m }]),
      EUR("Germany", "DE", [{ name: "Unlimited", price: 44.99, billingCycle: m }]),
      EUR("Portugal", "PT", [{ name: "Start", price: 9.99, billingCycle: m }, { name: "Standard", price: 18.99, billingCycle: m }]),
      CAD([{ name: "Monthly", price: 24.99, billingCycle: m }, { name: "Annual", price: 199.99, billingCycle: y }]),
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
      AUD([{ name: "Monthly", price: 8.99, billingCycle: m }, { name: "Annual", price: 89.99, billingCycle: y }]),
      CAD([{ name: "Monthly", price: 6.99, billingCycle: m }, { name: "Annual", price: 69.99, billingCycle: y }]),
      BRL([{ name: "Mensal", price: 14.90, billingCycle: m }, { name: "Anual", price: 149.90, billingCycle: y }]),
    ],
  },
  {
    serviceKey: "Crunchyroll",
    countries: [
      USD([{ name: "Fan", price: 7.99, billingCycle: m }, { name: "Mega Fan", price: 11.99, billingCycle: m }, { name: "Ultimate Fan", price: 15.99, billingCycle: m }]),
      EUR("Spain", "ES", [{ name: "Fan", price: 5.99, billingCycle: m }, { name: "Mega Fan", price: 8.99, billingCycle: m }]),
      EUR("Germany", "DE", [{ name: "Fan", price: 5.99, billingCycle: m }, { name: "Mega Fan", price: 8.99, billingCycle: m }]),
      EUR("France", "FR", [{ name: "Fan", price: 5.99, billingCycle: m }, { name: "Mega Fan", price: 8.99, billingCycle: m }]),
      GBP([{ name: "Fan", price: 4.99, billingCycle: m }, { name: "Mega Fan", price: 7.99, billingCycle: m }]),
      BRL([{ name: "Fan", price: 14.99, billingCycle: m }, { name: "Mega Fan", price: 22.99, billingCycle: m }]),
      INR([{ name: "Fan", price: 79, billingCycle: m }, { name: "Mega Fan", price: 139, billingCycle: m }]),
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
      CAD([{ name: "Personal", price: 8.25, billingCycle: m }, { name: "Family", price: 11, billingCycle: m }]),
      AUD([{ name: "Personal", price: 9, billingCycle: m }, { name: "Family", price: 12.50, billingCycle: m }]),
      INR([{ name: "Personal", price: 489, billingCycle: m }, { name: "Family", price: 649, billingCycle: m }]),
      BRL([{ name: "Personal", price: 36, billingCycle: m }, { name: "Família", price: 45, billingCycle: m }]),
    ],
  },
  {
    serviceKey: "NordVPN",
    countries: [
      USD([{ name: "Basic", price: 12.99, billingCycle: m }, { name: "Plus", price: 13.99, billingCycle: m }, { name: "Complete", price: 14.99, billingCycle: m }]),
      EUR("Spain", "ES", [{ name: "Básico", price: 12.99, billingCycle: m }, { name: "Plus", price: 13.99, billingCycle: m }, { name: "Completo", price: 14.99, billingCycle: m }]),
      EUR("Germany", "DE", [{ name: "Basis", price: 12.99, billingCycle: m }, { name: "Plus", price: 13.99, billingCycle: m }, { name: "Komplett", price: 14.99, billingCycle: m }]),
      GBP([{ name: "Basic", price: 10.59, billingCycle: m }, { name: "Plus", price: 11.49, billingCycle: m }, { name: "Complete", price: 12.39, billingCycle: m }]),
    ],
  },
  {
    serviceKey: "LinkedIn Premium",
    countries: [
      USD([{ name: "Career", price: 29.99, billingCycle: m }, { name: "Business", price: 59.99, billingCycle: m }]),
      EUR("Spain", "ES", [{ name: "Profesional", price: 29.99, billingCycle: m }, { name: "Business", price: 54.99, billingCycle: m }]),
      GBP([{ name: "Career", price: 24.99, billingCycle: m }, { name: "Business", price: 49.99, billingCycle: m }]),
    ],
  },
];

export const SERVICE_PLANS = planData;

export const getPlansForService = (serviceName: string): ServicePlanData | undefined => {
  return planData.find((s) => s.serviceKey.toLowerCase() === serviceName.toLowerCase());
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
