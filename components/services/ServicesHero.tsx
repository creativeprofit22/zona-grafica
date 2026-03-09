"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import styles from "./ServicesHero.module.css";

interface Props {
  serviceCount: number;
}

export default function ServicesHero({ serviceCount }: Props) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = sectionRef.current;
      if (!el) return;

      const items = el.querySelectorAll(`.${styles.animItem}`);
      const accent = el.querySelector(`.${styles.accentAnim}`);

      gsap.set(items, { opacity: 0, y: 40 });
      if (accent) gsap.set(accent, { opacity: 0, y: 40, x: -20 });

      const tl = gsap.timeline({ delay: 0.15 });

      tl.to(items, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.12,
      });

      if (accent) {
        tl.to(
          accent,
          {
            opacity: 1,
            y: 0,
            x: 0,
            duration: 0.7,
            ease: "power3.out",
          },
          0.15 + 0.12 * 2,
        );
      }
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className={styles.hero}>
      <div className={styles.inner}>
        <div className={styles.topRow}>
          <span className={`${styles.count} ${styles.animItem}`}>
            ({String(serviceCount).padStart(2, "0")})
          </span>
          <span className={`${styles.annotation} ${styles.animItem}`}>
            servicios creativos
          </span>
        </div>
        <h1 className={styles.title}>
          <span className={styles.animItem}>Lo que</span>
          <br />
          <span className={`${styles.titleAccent} ${styles.accentAnim}`}>
            hacemos
          </span>
        </h1>
        <p className={`${styles.subtitle} ${styles.animItem}`}>
          Cada servicio es un proceso, no una lista de precios. Investigamos,
          diseñamos, iteramos y entregamos piezas que funcionan.
        </p>
      </div>
    </section>
  );
}
