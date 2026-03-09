"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useRef } from "react";
import { homeData } from "@/data/home";
import styles from "./HeroSection.module.css";

gsap.registerPlugin(SplitText);

const { hero } = homeData;

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = sectionRef.current;
      if (!el) return;

      const tl = gsap.timeline({ delay: 0.4 });

      // All animatable elements (excluding .grafica which gets SplitText)
      const graficaEl = el.querySelector(`.${styles.grafica}`);
      const items = el.querySelectorAll(
        `.${styles.animItem}:not(.${styles.grafica})`,
      );
      const footnotes = el.querySelectorAll(`.${styles.footnote}`);
      const prompt = el.querySelector(`.${styles.prompt}`);
      const chevron = el.querySelector(`.${styles.chevron}`);

      // Set initial states
      gsap.set(items, { opacity: 0, y: 40 });
      gsap.set(footnotes, { opacity: 0, y: 20 });
      if (prompt) gsap.set(prompt, { opacity: 0 });

      // SplitText for GRÁFICA — per-character kinetic entrance
      let split: SplitText | undefined;
      if (graficaEl) {
        gsap.set(graficaEl, { opacity: 1 });
        split = new SplitText(graficaEl, { type: "chars" });
        gsap.set(split.chars, { opacity: 0, y: 40, rotationX: 90 });
      }

      // Stagger in each typographic element — like being typeset
      tl.to(items, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.15,
      });

      // GRÁFICA chars enter with 3D rotation + color wave
      if (split) {
        const colors = [
          "var(--accent)",
          "var(--ochre)",
          "var(--purple, #8B5CF6)",
        ];

        // Entrance animation
        tl.to(
          split.chars,
          {
            opacity: 1,
            y: 0,
            rotationX: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.05,
          },
          "-=0.6",
        );

        // Staggered color wave — each letter gets its color one by one
        for (let i = 0; i < split.chars.length; i++) {
          tl.to(
            split.chars[i],
            {
              color: colors[i % colors.length],
              duration: 0.4,
              ease: "power2.out",
            },
            `-=${i === 0 ? 0 : 0.3}`,
          );
        }

        // Continuous slow color shift — chameleon effect
        let colorInterval: ReturnType<typeof setInterval>;
        tl.call(() => {
          let offset = 0;
          colorInterval = setInterval(() => {
            offset++;
            if (!split) return;
            for (let i = 0; i < split.chars.length; i++) {
              gsap.to(split.chars[i], {
                color: colors[(i + offset) % colors.length],
                duration: 1.2,
                ease: "power1.inOut",
              });
            }
          }, 4000);
        });

        // Cleanup interval on revert
        return () => {
          clearInterval(colorInterval);
        };
      }

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
          <span className={`${styles.zona} ${styles.animItem}`}>
            {hero.headline[0]}
          </span>
        </div>

        {/* Line 2: "GRÁFICA" — massive, dominant */}
        <div className={`${styles.line} ${styles.lineGrafica}`}>
          <span className={`${styles.grafica} ${styles.animItem}`}>
            {hero.headline[1]}
          </span>
        </div>

        {/* Line 3: "(estudio creativo)" — small annotation, offset right */}
        <div className={`${styles.line} ${styles.lineAnnotation}`}>
          <span className={`${styles.annotation} ${styles.animItem}`}>
            {hero.subtitle}
          </span>
        </div>

        {/* Line 4: "diseño que" — medium display */}
        <div className={`${styles.line} ${styles.lineDiseno}`}>
          <span className={`${styles.diseno} ${styles.animItem}`}>
            {hero.headline[2]}
          </span>
        </div>

        {/* Line 5: "habla" — with blinking caret (design that speaks) */}
        <div className={`${styles.line} ${styles.lineHabla}`}>
          <span className={`${styles.habla} ${styles.animItem}`}>
            {hero.headline[3]}
            <span className={styles.caret} aria-hidden="true" />
          </span>
        </div>
      </div>

      {/* Footnotes — asterisk style */}
      <div className={styles.footnotes}>
        {hero.location.split(" · ").map((note) => (
          <p key={note} className={styles.footnote}>
            <span className={styles.asterisk}>*</span> {note}
          </p>
        ))}
      </div>

      {/* Scroll prompt */}
      <div className={styles.prompt}>
        <span className={styles.promptText}>{hero.scrollPrompt}</span>
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
