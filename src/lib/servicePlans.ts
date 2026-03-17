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

const planData: ServicePlanData[] = [
  {
    serviceKey: "Netflix",
    countries: [
      {
        country: "United States", countryCode: "US", currency: "$",
        plans: [
          { name: "Standard with Ads", price: 6.99, currency: "$", billingCycle: "monthly" },
          { name: "Standard", price: 15.49, currency: "$", billingCycle: "monthly" },
          { name: "Premium", price: 22.99, currency: "$", billingCycle: "monthly" },
        ],
      },
      {
        country: "Spain", countryCode: "ES", currency: "€",
        plans: [
          { name: "Estándar con anuncios", price: 5.49, currency: "€", billingCycle: "monthly" },
          { name: "Estándar", price: 12.99, currency: "€", billingCycle: "monthly" },
          { name: "Premium", price: 17.99, currency: "€", billingCycle: "monthly" },
        ],
      },
      {
        country: "France", countryCode: "FR", currency: "€",
        plans: [
          { name: "Essentiel avec pub", price: 5.99, currency: "€", billingCycle: "monthly" },
          { name: "Standard", price: 13.49, currency: "€", billingCycle: "monthly" },
          { name: "Premium", price: 19.99, currency: "€", billingCycle: "monthly" },
        ],
      },
      {
        country: "Germany", countryCode: "DE", currency: "€",
        plans: [
          { name: "Standard mit Werbung", price: 4.99, currency: "€", billingCycle: "monthly" },
          { name: "Standard", price: 13.99, currency: "€", billingCycle: "monthly" },
          { name: "Premium", price: 19.99, currency: "€", billingCycle: "monthly" },
        ],
      },
      {
        country: "Italy", countryCode: "IT", currency: "€",
        plans: [
          { name: "Standard con pubblicità", price: 5.49, currency: "€", billingCycle: "monthly" },
          { name: "Standard", price: 12.99, currency: "€", billingCycle: "monthly" },
          { name: "Premium", price: 17.99, currency: "€", billingCycle: "monthly" },
        ],
      },
      {
        country: "United Kingdom", countryCode: "GB", currency: "£",
        plans: [
          { name: "Standard with Ads", price: 4.99, currency: "£", billingCycle: "monthly" },
          { name: "Standard", price: 10.99, currency: "£", billingCycle: "monthly" },
          { name: "Premium", price: 17.99, currency: "£", billingCycle: "monthly" },
        ],
      },
    ],
  },
  {
    serviceKey: "Spotify",
    countries: [
      {
        country: "United States", countryCode: "US", currency: "$",
        plans: [
          { name: "Individual", price: 11.99, currency: "$", billingCycle: "monthly" },
          { name: "Student", price: 5.99, currency: "$", billingCycle: "monthly" },
          { name: "Duo", price: 16.99, currency: "$", billingCycle: "monthly" },
          { name: "Family", price: 19.99, currency: "$", billingCycle: "monthly" },
        ],
      },
      {
        country: "Spain", countryCode: "ES", currency: "€",
        plans: [
          { name: "Individual", price: 10.99, currency: "€", billingCycle: "monthly" },
          { name: "Student", price: 5.99, currency: "€", billingCycle: "monthly" },
          { name: "Duo", price: 14.99, currency: "€", billingCycle: "monthly" },
          { name: "Family", price: 17.99, currency: "€", billingCycle: "monthly" },
        ],
      },
      {
        country: "France", countryCode: "FR", currency: "€",
        plans: [
          { name: "Individual", price: 10.99, currency: "€", billingCycle: "monthly" },
          { name: "Étudiant", price: 5.99, currency: "€", billingCycle: "monthly" },
          { name: "Duo", price: 14.99, currency: "€", billingCycle: "monthly" },
          { name: "Famille", price: 17.99, currency: "€", billingCycle: "monthly" },
        ],
      },
      {
        country: "Germany", countryCode: "DE", currency: "€",
        plans: [
          { name: "Individual", price: 10.99, currency: "€", billingCycle: "monthly" },
          { name: "Student", price: 5.99, currency: "€", billingCycle: "monthly" },
          { name: "Duo", price: 14.99, currency: "€", billingCycle: "monthly" },
          { name: "Family", price: 17.99, currency: "€", billingCycle: "monthly" },
        ],
      },
      {
        country: "Italy", countryCode: "IT", currency: "€",
        plans: [
          { name: "Individual", price: 10.99, currency: "€", billingCycle: "monthly" },
          { name: "Studenti", price: 5.99, currency: "€", billingCycle: "monthly" },
          { name: "Duo", price: 14.99, currency: "€", billingCycle: "monthly" },
          { name: "Famiglia", price: 17.99, currency: "€", billingCycle: "monthly" },
        ],
      },
      {
        country: "United Kingdom", countryCode: "GB", currency: "£",
        plans: [
          { name: "Individual", price: 10.99, currency: "£", billingCycle: "monthly" },
          { name: "Student", price: 5.99, currency: "£", billingCycle: "monthly" },
          { name: "Duo", price: 14.99, currency: "£", billingCycle: "monthly" },
          { name: "Family", price: 17.99, currency: "£", billingCycle: "monthly" },
        ],
      },
    ],
  },
  {
    serviceKey: "Apple Music",
    countries: [
      {
        country: "United States", countryCode: "US", currency: "$",
        plans: [
          { name: "Voice", price: 4.99, currency: "$", billingCycle: "monthly" },
          { name: "Individual", price: 10.99, currency: "$", billingCycle: "monthly" },
          { name: "Family", price: 16.99, currency: "$", billingCycle: "monthly" },
        ],
      },
      {
        country: "Spain", countryCode: "ES", currency: "€",
        plans: [
          { name: "Individual", price: 10.99, currency: "€", billingCycle: "monthly" },
          { name: "Familia", price: 16.99, currency: "€", billingCycle: "monthly" },
        ],
      },
      {
        country: "France", countryCode: "FR", currency: "€",
        plans: [
          { name: "Individuel", price: 10.99, currency: "€", billingCycle: "monthly" },
          { name: "Famille", price: 16.99, currency: "€", billingCycle: "monthly" },
        ],
      },
    ],
  },
  {
    serviceKey: "Disney+",
    countries: [
      {
        country: "United States", countryCode: "US", currency: "$",
        plans: [
          { name: "Basic (with Ads)", price: 7.99, currency: "$", billingCycle: "monthly" },
          { name: "Standard (no Ads)", price: 13.99, currency: "$", billingCycle: "monthly" },
          { name: "Premium", price: 13.99, currency: "$", billingCycle: "monthly" },
        ],
      },
      {
        country: "Spain", countryCode: "ES", currency: "€",
        plans: [
          { name: "Estándar con anuncios", price: 5.99, currency: "€", billingCycle: "monthly" },
          { name: "Estándar", price: 8.99, currency: "€", billingCycle: "monthly" },
          { name: "Premium", price: 11.99, currency: "€", billingCycle: "monthly" },
        ],
      },
      {
        country: "France", countryCode: "FR", currency: "€",
        plans: [
          { name: "Standard avec pub", price: 5.99, currency: "€", billingCycle: "monthly" },
          { name: "Standard", price: 8.99, currency: "€", billingCycle: "monthly" },
          { name: "Premium", price: 11.99, currency: "€", billingCycle: "monthly" },
        ],
      },
    ],
  },
  {
    serviceKey: "Amazon Prime",
    countries: [
      {
        country: "United States", countryCode: "US", currency: "$",
        plans: [
          { name: "Monthly", price: 14.99, currency: "$", billingCycle: "monthly" },
          { name: "Annual", price: 139, currency: "$", billingCycle: "yearly" },
        ],
      },
      {
        country: "Spain", countryCode: "ES", currency: "€",
        plans: [
          { name: "Mensual", price: 4.99, currency: "€", billingCycle: "monthly" },
          { name: "Anual", price: 49.90, currency: "€", billingCycle: "yearly" },
        ],
      },
      {
        country: "France", countryCode: "FR", currency: "€",
        plans: [
          { name: "Mensuel", price: 6.99, currency: "€", billingCycle: "monthly" },
          { name: "Annuel", price: 69.90, currency: "€", billingCycle: "yearly" },
        ],
      },
      {
        country: "Germany", countryCode: "DE", currency: "€",
        plans: [
          { name: "Monatlich", price: 8.99, currency: "€", billingCycle: "monthly" },
          { name: "Jährlich", price: 89.90, currency: "€", billingCycle: "yearly" },
        ],
      },
      {
        country: "Italy", countryCode: "IT", currency: "€",
        plans: [
          { name: "Mensile", price: 4.99, currency: "€", billingCycle: "monthly" },
          { name: "Annuale", price: 49.90, currency: "€", billingCycle: "yearly" },
        ],
      },
    ],
  },
  {
    serviceKey: "YouTube Premium",
    countries: [
      {
        country: "United States", countryCode: "US", currency: "$",
        plans: [
          { name: "Individual", price: 13.99, currency: "$", billingCycle: "monthly" },
          { name: "Student", price: 7.99, currency: "$", billingCycle: "monthly" },
          { name: "Family", price: 22.99, currency: "$", billingCycle: "monthly" },
        ],
      },
      {
        country: "Spain", countryCode: "ES", currency: "€",
        plans: [
          { name: "Individual", price: 12.99, currency: "€", billingCycle: "monthly" },
          { name: "Familia", price: 22.99, currency: "€", billingCycle: "monthly" },
        ],
      },
    ],
  },
  {
    serviceKey: "ChatGPT Plus",
    countries: [
      {
        country: "United States", countryCode: "US", currency: "$",
        plans: [{ name: "Plus", price: 20, currency: "$", billingCycle: "monthly" }],
      },
      {
        country: "Spain", countryCode: "ES", currency: "€",
        plans: [{ name: "Plus", price: 20, currency: "€", billingCycle: "monthly" }],
      },
      {
        country: "France", countryCode: "FR", currency: "€",
        plans: [{ name: "Plus", price: 20, currency: "€", billingCycle: "monthly" }],
      },
    ],
  },
  {
    serviceKey: "HBO Max",
    countries: [
      {
        country: "Spain", countryCode: "ES", currency: "€",
        plans: [
          { name: "Estándar", price: 5.99, currency: "€", billingCycle: "monthly" },
          { name: "Premium", price: 9.99, currency: "€", billingCycle: "monthly" },
        ],
      },
    ],
  },
  {
    serviceKey: "Notion",
    countries: [
      {
        country: "United States", countryCode: "US", currency: "$",
        plans: [
          { name: "Plus", price: 10, currency: "$", billingCycle: "monthly" },
          { name: "Business", price: 18, currency: "$", billingCycle: "monthly" },
        ],
      },
      {
        country: "Spain", countryCode: "ES", currency: "€",
        plans: [
          { name: "Plus", price: 10, currency: "€", billingCycle: "monthly" },
          { name: "Business", price: 18, currency: "€", billingCycle: "monthly" },
        ],
      },
    ],
  },
  {
    serviceKey: "Canva",
    countries: [
      {
        country: "United States", countryCode: "US", currency: "$",
        plans: [
          { name: "Pro", price: 14.99, currency: "$", billingCycle: "monthly" },
          { name: "Teams", price: 29.99, currency: "$", billingCycle: "monthly" },
        ],
      },
      {
        country: "Spain", countryCode: "ES", currency: "€",
        plans: [
          { name: "Pro", price: 11.99, currency: "€", billingCycle: "monthly" },
          { name: "Equipos", price: 23.99, currency: "€", billingCycle: "monthly" },
        ],
      },
    ],
  },
  {
    serviceKey: "Adobe Creative Cloud",
    countries: [
      {
        country: "United States", countryCode: "US", currency: "$",
        plans: [
          { name: "Photography (20GB)", price: 9.99, currency: "$", billingCycle: "monthly" },
          { name: "Single App", price: 22.99, currency: "$", billingCycle: "monthly" },
          { name: "All Apps", price: 59.99, currency: "$", billingCycle: "monthly" },
        ],
      },
      {
        country: "Spain", countryCode: "ES", currency: "€",
        plans: [
          { name: "Fotografía (20GB)", price: 12.09, currency: "€", billingCycle: "monthly" },
          { name: "App individual", price: 26.43, currency: "€", billingCycle: "monthly" },
          { name: "Todas las apps", price: 62.99, currency: "€", billingCycle: "monthly" },
        ],
      },
    ],
  },
  {
    serviceKey: "Xbox Game Pass",
    countries: [
      {
        country: "United States", countryCode: "US", currency: "$",
        plans: [
          { name: "Core", price: 9.99, currency: "$", billingCycle: "monthly" },
          { name: "Standard", price: 14.99, currency: "$", billingCycle: "monthly" },
          { name: "Ultimate", price: 19.99, currency: "$", billingCycle: "monthly" },
        ],
      },
      {
        country: "Spain", countryCode: "ES", currency: "€",
        plans: [
          { name: "Core", price: 6.99, currency: "€", billingCycle: "monthly" },
          { name: "Standard", price: 12.99, currency: "€", billingCycle: "monthly" },
          { name: "Ultimate", price: 17.99, currency: "€", billingCycle: "monthly" },
        ],
      },
    ],
  },
  {
    serviceKey: "PlayStation Plus",
    countries: [
      {
        country: "United States", countryCode: "US", currency: "$",
        plans: [
          { name: "Essential", price: 9.99, currency: "$", billingCycle: "monthly" },
          { name: "Extra", price: 17.99, currency: "$", billingCycle: "monthly" },
          { name: "Premium", price: 21.99, currency: "$", billingCycle: "monthly" },
        ],
      },
      {
        country: "Spain", countryCode: "ES", currency: "€",
        plans: [
          { name: "Essential", price: 8.99, currency: "€", billingCycle: "monthly" },
          { name: "Extra", price: 16.99, currency: "€", billingCycle: "monthly" },
          { name: "Premium", price: 19.99, currency: "€", billingCycle: "monthly" },
        ],
      },
    ],
  },
  {
    serviceKey: "DAZN",
    countries: [
      {
        country: "Spain", countryCode: "ES", currency: "€",
        plans: [
          { name: "Start", price: 9.99, currency: "€", billingCycle: "monthly" },
          { name: "Standard", price: 24.99, currency: "€", billingCycle: "monthly" },
          { name: "Total", price: 34.99, currency: "€", billingCycle: "monthly" },
        ],
      },
      {
        country: "Italy", countryCode: "IT", currency: "€",
        plans: [
          { name: "Start", price: 14.99, currency: "€", billingCycle: "monthly" },
          { name: "Standard", price: 40.99, currency: "€", billingCycle: "monthly" },
          { name: "Plus", price: 59.99, currency: "€", billingCycle: "monthly" },
        ],
      },
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
