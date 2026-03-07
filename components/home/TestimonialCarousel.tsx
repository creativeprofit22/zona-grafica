"use client";

import { useCallback, useState } from "react";
import type { Testimonial } from "@/types/content";
import MotionSection from "@/components/animations/MotionSection";
import styles from "./TestimonialCarousel.module.css";

interface Props {
  testimonials: Testimonial[];
}

export default function TestimonialCarousel({ testimonials }: Props) {
  const [current, setCurrent] = useState(0);
  const total = testimonials.length;

  if (total === 0) return null;

  const prev = useCallback(
    () => setCurrent((c) => (c - 1 + total) % total),
    [total],
  );
  const next = useCallback(
    () => setCurrent((c) => (c + 1) % total),
    [total],
  );

  const t = testimonials[current];

  return (
    <MotionSection as="section" className={styles.section}>
      <div className={styles.inner}>
        <span className="section-number">Testimonios</span>

        <blockquote className={styles.quote} key={current}>
          <span className={styles.quoteMark} aria-hidden="true">
            "
          </span>
          <p className={styles.quoteText}>{t.quote}</p>
        </blockquote>

        <div className={styles.attribution}>
          <div className={styles.author}>
            <span className={styles.authorName}>{t.author}</span>
            <span className={styles.authorRole}>
              {t.role}, {t.company}
            </span>
          </div>

          <div className={styles.controls}>
            <button
              type="button"
              className={styles.arrow}
              onClick={prev}
              aria-label="Testimonio anterior"
            >
              ←
            </button>
            <span className={styles.counter}>
              {String(current + 1).padStart(2, "0")} /{" "}
              {String(total).padStart(2, "0")}
            </span>
            <button
              type="button"
              className={styles.arrow}
              onClick={next}
              aria-label="Siguiente testimonio"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </MotionSection>
  );
}
