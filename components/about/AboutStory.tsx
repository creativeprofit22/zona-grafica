"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import MotionSection from "@/components/animations/MotionSection";
import type { ManifestoSegment } from "@/types/content";
import styles from "./AboutStory.module.css";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  segments: ManifestoSegment[];
}

export default function AboutStory({ segments }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const milestonesRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Plain text for SSR / pre-mount fallback
  const plainText = segments.map((s) => s.text).join(" ");

  // Split segments into two paragraphs at roughly the midpoint
  const allWords: { word: string; style?: string }[] = [];
  for (const seg of segments) {
    for (const w of seg.text.split(" ")) {
      if (w) allWords.push({ word: w, style: seg.style });
    }
  }
  const mid = Math.ceil(allWords.length / 2);
  const para1Words = allWords.slice(0, mid);
  const para2Words = allWords.slice(mid);

  // Word-by-word illuminate on scroll
  useGSAP(
    () => {
      if (!isMounted) return;
      const el = textRef.current;
      if (!el) return;

      const words = el.querySelectorAll<HTMLElement>(`.${styles.storyWord}`);
      if (!words.length) return;

      gsap.set(words, { color: "var(--muted-light)" });

      for (const word of words) {
        const finalColor = word.classList.contains(styles.accent)
          ? "var(--accent)"
          : word.classList.contains(styles.ochre)
            ? "var(--ochre)"
            : "var(--fg-dark)";

        gsap.to(word, {
          color: finalColor,
          ease: "power2.out",
          scrollTrigger: {
            trigger: word,
            start: "top 85%",
            end: "top 60%",
            scrub: 0.3,
          },
        });
      }
    },
    { scope: textRef, dependencies: [isMounted] },
  );

  // Milestone counter animation
  useGSAP(
    () => {
      const container = milestonesRef.current;
      if (!container) return;

      const values = container.querySelectorAll<HTMLElement>(
        `.${styles.milestoneValue}`,
      );

      values.forEach((el, i) => {
        const target = Number.parseInt(el.textContent || "0", 10);
        const obj = { val: 0 };

        gsap.to(obj, {
          val: target,
          duration: 1.2,
          ease: "power2.out",
          delay: i * 0.1,
          snap: { val: 1 },
          scrollTrigger: {
            trigger: container,
            start: "top 80%",
            toggleActions: "play none none none",
          },
          onUpdate() {
            el.textContent = String(Math.round(obj.val));
          },
        });
      });
    },
    { scope: milestonesRef },
  );

  const renderWords = (words: { word: string; style?: string }[]) =>
    words.map((w, i) => (
      <span
        // biome-ignore lint/suspicious/noArrayIndexKey: stable word order
        key={i}
        className={`${styles.storyWord}${w.style === "accent" ? ` ${styles.accent}` : ""}${w.style === "ochre" ? ` ${styles.ochre}` : ""}`}
      >
        {w.word}{" "}
      </span>
    ));

  return (
    <MotionSection className={styles.section} data-theme="cream">
      <div className={styles.inner} ref={sectionRef}>
        <div className={styles.labelRow}>
          <span className={styles.number}>(01)</span>
          <span className={styles.label}>La historia</span>
        </div>

        <div className={styles.content}>
          <div className={styles.pullQuote}>
            <span className={styles.quoteMarks}>"</span>
            <blockquote className={styles.quote}>
              El buen diseño no es un lujo — es la forma más honesta de
              comunicar.
            </blockquote>
          </div>

          <div className={styles.text} ref={textRef}>
            {!isMounted ? (
              <p className={styles.body}>{plainText}</p>
            ) : (
              <>
                <p className={styles.body}>{renderWords(para1Words)}</p>
                <p className={styles.body}>{renderWords(para2Words)}</p>
              </>
            )}
          </div>
        </div>

        <div ref={milestonesRef} className={styles.milestones}>
          <div className={styles.milestone}>
            <span className={styles.milestoneValue}>22</span>
            <span className={styles.milestoneLabel}>
              años diseñando
              <br />
              la imagen del GIFF
            </span>
          </div>
          <div className={styles.milestone}>
            <span className={styles.milestoneValue}>33</span>
            <span className={styles.milestoneLabel}>
              edición del Cervantino
              <br />— nuestro cartel
            </span>
          </div>
          <div className={styles.milestone}>
            <span className={styles.milestoneValue}>475</span>
            <span className={styles.milestoneLabel}>
              aniversario de SMA
              <br />— libro conmemorativo
            </span>
          </div>
          <div className={styles.milestone}>
            <span className={styles.milestoneValue}>5</span>
            <span className={styles.milestoneLabel}>
              libros de arte
              <br />
              publicados
            </span>
          </div>
        </div>
      </div>
    </MotionSection>
  );
}
