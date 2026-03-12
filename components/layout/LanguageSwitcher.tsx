"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import styles from "./LanguageSwitcher.module.css";

interface LanguageSwitcherProps {
  variant?: "desktop" | "mobile";
}

export default function LanguageSwitcher({
  variant = "desktop",
}: LanguageSwitcherProps) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const otherLocale = locale === "es" ? "en" : "es";
  const label = locale === "es" ? "EN" : "ES";

  function switchLocale() {
    router.replace(pathname, { locale: otherLocale });
  }

  return (
    <button
      type="button"
      onClick={switchLocale}
      className={`${variant === "mobile" ? styles.switcherMobile : styles.switcher} langSwitcher`}
      aria-label={
        otherLocale === "en" ? "Switch to English" : "Cambiar a Español"
      }
    >
      {label}
    </button>
  );
}
