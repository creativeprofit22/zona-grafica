"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import styles from "./Footer.module.css";

export default function NewsletterForm() {
  const t = useTranslations();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">(
    "idle",
  );
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || t("footer.newsletter.error"));
      }

      setStatus("ok");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error ? err.message : t("footer.newsletter.error"),
      );
    }
  }

  if (status === "ok") {
    return (
      <p className={styles.newsletterSuccess}>
        {t("footer.newsletter.success")}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.newsletterForm}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t("footer.newsletter.placeholder")}
        required
        className={styles.newsletterInput}
        aria-label={t("common.emailForNewsletter")}
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className={styles.newsletterButton}
      >
        {status === "loading" ? "..." : "→"}
      </button>
      {status === "error" && (
        <p className={styles.newsletterError}>{errorMsg}</p>
      )}
    </form>
  );
}
