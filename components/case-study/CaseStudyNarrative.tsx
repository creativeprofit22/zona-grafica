"use client";

import type { CaseStudyStat } from "@/types/content";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import styles from "./CaseStudyNarrative.module.css";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  brief: string;
  approach: string;
  result: string;
  stats?: CaseStudyStat[];
}

const blocks = [
  { number: "01", heading: "El reto" },
  { number: "02", heading: "El enfoque" },
  { number: "03", heading: "El resultado" },
] as const;

export default function CaseStudyNarrative({
  brief,
  approach,
  result,
  stats,
}: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const texts = [brief, approach, result];

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const blockEls = section.querySelectorAll(`.${styles.block}`);

      gsap.from(blockEls, {
        clipPath: "inset(0 0 100% 0)",
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          once: true,
        },
      });
    },
    { scope: sectionRef },
  );

  useGSAP(
    () => {
      const container = statsRef.current;
      if (!container) return;

      const values = container.querySelectorAll<HTMLElement>(
        `.${styles.statValue}`,
      );

      values.forEach((el, i) => {
        const raw = el.textContent || "";
        const match = raw.match(/^([^\d]*)(\d+)([^\d]*)$/);
        if (!match) return;

        const prefix = match[1];
        const target = Number.parseInt(match[2], 10);
        const suffix = match[3];
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
            el.textContent = `${prefix}${Math.round(obj.val)}${suffix}`;
          },
        });
      });
    },
    { scope: statsRef },
  );

  return (
    <>
      <section ref={sectionRef} className={styles.section} data-theme="light">
        <div className={styles.inner}>
          {blocks.map((block, i) => (
            <article key={block.number} className={styles.block}>
              <div className={styles.numberLine}>
                <span className={styles.number}>({block.number})</span>
                <span className={styles.rule} />
              </div>
              <h2 className={styles.heading}>{block.heading}</h2>
              <p className={styles.text}>{texts[i]}</p>
            </article>
          ))}
        </div>
      </section>

      {stats && stats.length > 0 && (
        <div ref={statsRef} className={styles.statsSection} data-theme="light">
          <div className={styles.statsInner}>
            {stats.map((stat) => (
              <div key={stat.label} className={styles.stat}>
                <span className={styles.statValue}>{stat.value}</span>
                <p className={styles.statLabel}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
