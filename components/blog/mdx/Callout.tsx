"use client";

import type { ReactNode } from "react";
import MotionSection from "@/components/animations/MotionSection";
import styles from "./Callout.module.css";

const icons: Record<string, string> = {
  note: "📌",
  tip: "💡",
  warning: "⚠️",
};

export function Callout({
  type = "note",
  children,
}: {
  type?: "note" | "tip" | "warning";
  children: ReactNode;
}) {
  return (
    <MotionSection
      as="div"
      variant="fade-up"
      className={styles.callout}
      data-type={type}
    >
      <div className={styles.icon}>{icons[type]}</div>
      <div className={styles.content}>{children}</div>
    </MotionSection>
  );
}
