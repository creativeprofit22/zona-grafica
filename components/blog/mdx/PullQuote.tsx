"use client";

import type { ReactNode } from "react";
import MotionSection from "@/components/animations/MotionSection";
import styles from "./PullQuote.module.css";

export function PullQuote({
  children,
  attribution,
}: {
  children: ReactNode;
  attribution?: string;
}) {
  return (
    <MotionSection as="div" variant="clip-up" className={styles.pullQuote}>
      <blockquote className={styles.quote}>{children}</blockquote>
      {attribution && <cite className={styles.attribution}>{attribution}</cite>}
    </MotionSection>
  );
}
