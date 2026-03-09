"use client";

import type { ReactNode } from "react";
import MotionSection from "@/components/animations/MotionSection";
import styles from "./Stat.module.css";

export function Stat({
  value,
  children,
}: {
  value: string;
  children: ReactNode;
}) {
  return (
    <MotionSection as="div" variant="fade-up" className={styles.stat}>
      <span className={styles.value}>{value}</span>
      <span className={styles.label}>{children}</span>
    </MotionSection>
  );
}
