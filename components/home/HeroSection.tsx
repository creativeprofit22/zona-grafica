"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import styles from "./HeroSection.module.css";

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = sectionRef.current;
      if (!el) return;

      const tl = gsap.timeline({ delay: 0.4 });

      // All animatable elements
      const items = el.querySelectorAll(`.${styles.animItem}`);
      const footnotes = el.querySelectorAll(`.${styles.footnote}`);
      const prompt = el.querySelector(`.${styles.prompt}`);
      const chevron = el.querySelector(`.${styles.chevron}`);

      // Set initial states
      gsap.set(items, { opacity: 0, y: 40 });
      gsap.set(footnotes, { opacity: 0, y: 20 });
      if (prompt) gsap.set(prompt, { opacity: 0 });

      // Stagger in each typographic element — like being typeset
      tl.to(items, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.15,
      });

      // Footnotes fade in together
      tl.to(
        footnotes,
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
          stagger: 0.1,
        },
        "-=0.3",
      );

      // Scroll prompt
      if (prompt) {
        tl.to(
          prompt,
          { opacity: 1, duration: 0.5, ease: "power2.out" },
          "-=0.2",
        );
      }

      // Chevron bounce
      if (chevron) {
        gsap.to(chevron, {
          y: 6,
          duration: 1,
          ease: "power1.inOut",
          yoyo: true,
          repeat: -1,
          delay: 2,
        });
      }
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className={styles.hero}>
      {/* Subtle grain */}
      <div className={styles.grain} aria-hidden="true" />

      <div className={styles.composition}>
        {/* Line 1: "zona" — medium, pushed right */}
        <div className={`${styles.line} ${styles.lineZona}`}>
          <span className={`${styles.zona} ${styles.animItem}`}>zona</span>
        </div>

        {/* Line 2: "GRÁFICA" — massive, dominant */}
        <div className={`${styles.line} ${styles.lineGrafica}`}>
          <span className={`${styles.grafica} ${styles.animItem}`}>
            GRÁFICA
          </span>
        </div>

        {/* Line 3: "(estudio creativo)" — small annotation, offset right */}
        <div className={`${styles.line} ${styles.lineAnnotation}`}>
          <span className={`${styles.annotation} ${styles.animItem}`}>
            (estudio creativo)
          </span>
        </div>

        {/* Line 4: "diseño que" — medium display */}
        <div className={`${styles.line} ${styles.lineDiseno}`}>
          <span className={`${styles.diseno} ${styles.animItem}`}>
            diseño que
          </span>
        </div>

        {/* Line 5: "habla →" — with arrow, offset */}
        <div className={`${styles.line} ${styles.lineHabla}`}>
          <span className={`${styles.habla} ${styles.animItem}`}>
            habla <span className={styles.arrow}>→</span>
          </span>
        </div>
      </div>

      {/* Footnotes — asterisk style */}
      <div className={styles.footnotes}>
        <p className={styles.footnote}>
          <span className={styles.asterisk}>*</span> San Miguel de Allende, GTO
        </p>
        <p className={styles.footnote}>
          <span className={styles.asterisk}>*</span> Desde 1993
        </p>
      </div>

      {/* Scroll prompt */}
      <div className={styles.prompt}>
        <span className={styles.promptText}>Scroll</span>
        <svg
          className={styles.chevron}
          width={14}
          height={14}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </section>
  );
}
