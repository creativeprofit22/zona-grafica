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

      gsap.set(tiles, { opacity: 0, y: 60 });

      tiles.forEach((tile, i) => {
        gsap.to(tile, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: tile,
            start: "top 88%",
            toggleActions: "play none none none",
          },
          delay: i * 0.12,
        });
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
