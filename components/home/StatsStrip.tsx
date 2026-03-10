"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import type { Stat } from "@/types/content";
import styles from "./StatsStrip.module.css";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  stats: Stat[];
}

export default function StatsStrip({ stats }: Props) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = sectionRef.current;
      if (!el) return;

      const tiles = el.querySelectorAll<HTMLElement>(`.${styles.tile}`);
      const values = el.querySelectorAll<HTMLElement>(`.${styles.value}`);
      const contexts = el.querySelectorAll<HTMLElement>(`.${styles.context}`);

      gsap.set(tiles, { opacity: 0, y: 80, scale: 0.9 });
      gsap.set(contexts, { opacity: 0, y: 20 });

      tiles.forEach((tile, i) => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: tile,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        });

        // Tile slides up with scale
        tl.to(tile, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          delay: i * 0.1,
        });

        // Context text fades in after value
        if (contexts[i]) {
          tl.to(
            contexts[i],
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out",
            },
            "-=0.4",
          );
        }

        // Counter animation for numeric values
        const valEl = values[i];
        if (valEl) {
          const text = valEl.textContent ?? "";
          const numMatch = text.match(/^(\d+)/);
          if (numMatch) {
            const target = Number.parseInt(numMatch[1], 10);
            const suffix = text.replace(numMatch[1], "");
            const obj = { val: 0 };
            tl.fromTo(
              obj,
              { val: 0 },
              {
                val: target,
                duration: 1.5,
                ease: "power2.out",
                snap: { val: 1 },
                onUpdate: () => {
                  valEl.textContent = `${obj.val}${suffix}`;
                },
              },
              "<",
            );
          }
        }
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className={styles.section} data-theme="cream">
      <div className={styles.scattered}>
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className={`${styles.tile} ${styles[`pos${i}`] ?? ""}`}
          >
            <span className={styles.value}>{stat.value}</span>
            <p className={styles.context}>{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
