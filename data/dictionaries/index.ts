import type { routing } from "@/i18n/routing";

type Locale = (typeof routing)["locales"][number];

export async function getDictionary(locale: Locale) {
  switch (locale) {
    case "en":
      return import("./en");
    default:
      return import("./es");
  }
}
