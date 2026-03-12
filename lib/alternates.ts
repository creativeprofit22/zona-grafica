import { siteConfig } from "@/data/site";

/**
 * Generate hreflang alternates for a given path and locale.
 * Spanish (default locale) has no prefix; English uses /en/.
 */
export function localeAlternates(path: string, locale: string) {
  const base = siteConfig.url;
  const esPath = path ? `/${path}` : "";
  const enPath = path ? `/en/${path}` : "/en";

  return {
    canonical: locale === "es" ? `${base}${esPath}` : `${base}${enPath}`,
    languages: {
      es: `${base}${esPath}`,
      en: `${base}${enPath}`,
      "x-default": `${base}${esPath}`,
    },
  };
}
