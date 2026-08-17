export type SupportedLocale = {
  code: string;
  label: string;
};

export type SupportedMarket = {
  countryCode: string;
  countryName: string;
  currency: string;
  defaultLocale: string;
  locales: SupportedLocale[];
  defaultLocation: string;
  defaultBudget: number;
  fixturePhones: [string, string, string];
};

export const SUPPORTED_MARKETS: readonly SupportedMarket[] = [
  { countryCode: "US", countryName: "United States", currency: "USD", defaultLocale: "en-US", locales: [{ code: "en-US", label: "English" }], defaultLocation: "Chicago, IL", defaultBudget: 180, fixturePhones: ["+12025550101", "+12025550102", "+12025550103"] },
  { countryCode: "SG", countryName: "Singapore", currency: "SGD", defaultLocale: "en-SG", locales: [{ code: "en-SG", label: "English" }], defaultLocation: "Singapore", defaultBudget: 240, fixturePhones: ["+6590000101", "+6590000102", "+6590000103"] },
  { countryCode: "MY", countryName: "Malaysia", currency: "MYR", defaultLocale: "en-MY", locales: [{ code: "en-MY", label: "English" }], defaultLocation: "Kuala Lumpur", defaultBudget: 650, fixturePhones: ["+601100000101", "+601100000102", "+601100000103"] },
  { countryCode: "IN", countryName: "India", currency: "INR", defaultLocale: "en-IN", locales: [{ code: "en-IN", label: "English" }, { code: "hi-IN", label: "Hindi" }], defaultLocation: "Bengaluru", defaultBudget: 12000, fixturePhones: ["+919000000101", "+919000000102", "+919000000103"] },
  { countryCode: "AE", countryName: "United Arab Emirates", currency: "AED", defaultLocale: "en-AE", locales: [{ code: "en-AE", label: "English" }, { code: "ar-AE", label: "Arabic" }], defaultLocation: "Dubai", defaultBudget: 650, fixturePhones: ["+971500000101", "+971500000102", "+971500000103"] },
  { countryCode: "AU", countryName: "Australia", currency: "AUD", defaultLocale: "en-AU", locales: [{ code: "en-AU", label: "English" }], defaultLocation: "Melbourne, VIC", defaultBudget: 280, fixturePhones: ["+61400000101", "+61400000102", "+61400000103"] },
  { countryCode: "CA", countryName: "Canada", currency: "CAD", defaultLocale: "en-CA", locales: [{ code: "en-CA", label: "English" }], defaultLocation: "Toronto, ON", defaultBudget: 250, fixturePhones: ["+14165550101", "+14165550102", "+14165550103"] },
  { countryCode: "GB", countryName: "United Kingdom", currency: "GBP", defaultLocale: "en-GB", locales: [{ code: "en-GB", label: "English" }], defaultLocation: "Birmingham", defaultBudget: 160, fixturePhones: ["+447700900101", "+447700900102", "+447700900103"] },
  { countryCode: "VN", countryName: "Vietnam", currency: "VND", defaultLocale: "vi-VN", locales: [{ code: "vi-VN", label: "Vietnamese" }], defaultLocation: "Ho Chi Minh City", defaultBudget: 4500000, fixturePhones: ["+84900000101", "+84900000102", "+84900000103"] },
  { countryCode: "DE", countryName: "Germany", currency: "EUR", defaultLocale: "de-DE", locales: [{ code: "de-DE", label: "German" }, { code: "en-DE", label: "English" }], defaultLocation: "Berlin", defaultBudget: 170, fixturePhones: ["+4915110000101", "+4915110000102", "+4915110000103"] },
  { countryCode: "JP", countryName: "Japan", currency: "JPY", defaultLocale: "ja-JP", locales: [{ code: "ja-JP", label: "Japanese" }], defaultLocation: "Tokyo", defaultBudget: 28000, fixturePhones: ["+819000000101", "+819000000102", "+819000000103"] },
  { countryCode: "FR", countryName: "France", currency: "EUR", defaultLocale: "fr-FR", locales: [{ code: "fr-FR", label: "French" }], defaultLocation: "Lyon", defaultBudget: 170, fixturePhones: ["+33600000101", "+33600000102", "+33600000103"] },
  { countryCode: "MX", countryName: "Mexico", currency: "MXN", defaultLocale: "es-MX", locales: [{ code: "es-MX", label: "Spanish" }], defaultLocation: "Mexico City", defaultBudget: 3200, fixturePhones: ["+525500000101", "+525500000102", "+525500000103"] },
  { countryCode: "BR", countryName: "Brazil", currency: "BRL", defaultLocale: "pt-BR", locales: [{ code: "pt-BR", label: "Portuguese" }], defaultLocation: "São Paulo", defaultBudget: 850, fixturePhones: ["+5511900000101", "+5511900000102", "+5511900000103"] },
  { countryCode: "ID", countryName: "Indonesia", currency: "IDR", defaultLocale: "en-ID", locales: [{ code: "en-ID", label: "English" }], defaultLocation: "Jakarta", defaultBudget: 2800000, fixturePhones: ["+6281200000101", "+6281200000102", "+6281200000103"] },
  { countryCode: "PH", countryName: "Philippines", currency: "PHP", defaultLocale: "en-PH", locales: [{ code: "en-PH", label: "English" }], defaultLocation: "Metro Manila", defaultBudget: 10000, fixturePhones: ["+639000000101", "+639000000102", "+639000000103"] },
  { countryCode: "KE", countryName: "Kenya", currency: "KES", defaultLocale: "en-KE", locales: [{ code: "en-KE", label: "English" }], defaultLocation: "Nairobi CBD", defaultBudget: 8000, fixturePhones: ["+254700000101", "+254700000102", "+254700000103"] },
] as const;

export function getSupportedMarket(countryCode: string): SupportedMarket | undefined {
  return SUPPORTED_MARKETS.find((market) => market.countryCode === countryCode);
}

export function supportsMarketLocale(countryCode: string, locale: string): boolean {
  return getSupportedMarket(countryCode)?.locales.some((candidate) => candidate.code === locale) ?? false;
}
