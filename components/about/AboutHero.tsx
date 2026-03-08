"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import styles from "./AboutHero.module.css";

interface Props {
  headline: string;
  intro: string;
  sectors: string[];
}

export default function AboutHero({ headline, intro, sectors }: Props) {
  const sectionRef = useRef<HTMLElement>(null);

  // Split headline for editorial treatment
  // "30 años haciendo diseño desde San Miguel de Allende"
  const parts = headline.split("desde");
  const mainLine = parts[0]?.trim() ?? headline;
  const locationLine = parts[1] ? `desde ${parts[1].trim()}` : null;

  useGSAP(
    () => {
      const el = sectionRef.current;
      if (!el) return;

      const tl = gsap.timeline({ delay: 0.3 });

      const annotation = el.querySelector(`.${styles.annotation}`);
      const since = el.querySelector(`.${styles.since}`);
      const main = el.querySelector(`.${styles.mainLine}`);
      const location = el.querySelector(`.${styles.locationLine}`);
      const introEl = el.querySelector(`.${styles.intro}`);
      const sectorsLabel = el.querySelector(`.${styles.sectorsLabel}`);
      const sectors = el.querySelectorAll(`.${styles.sector}`);
      const sectorDots = el.querySelectorAll(`.${styles.sectorDot}`);

      // Set initial states
      const topItems = [annotation, since].filter(Boolean);
      gsap.set(topItems, { opacity: 0, y: 20 });
      if (main) gsap.set(main, { opacity: 0, y: 60 });
      if (location) gsap.set(location, { opacity: 0, y: 40 });
      if (introEl) gsap.set(introEl, { opacity: 0, y: 30 });
      if (sectorsLabel) gsap.set(sectorsLabel, { opacity: 0, y: 20 });
      gsap.set(sectors, { opacity: 0, y: 20 });
      gsap.set(sectorDots, { opacity: 0 });

      // Annotations first
      tl.to(topItems, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.1,
      });

      // Main headline — heaviest entrance
      if (main) {
        tl.to(
          main,
          { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" },
          "-=0.3",
        );
      }

      // Location line — lighter
      if (location) {
        tl.to(
          location,
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
          "-=0.5",
        );
      }

      // Intro paragraph
      if (introEl) {
        tl.to(
          introEl,
          { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
          "-=0.3",
        );
      }

      // Sectors label
      if (sectorsLabel) {
        tl.to(
          sectorsLabel,
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
          "-=0.2",
        );
      }

      // Sector pills cascade
      tl.to(
        sectors,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
          stagger: 0.08,
        },
        "-=0.2",
      );

      // Dots fade in with sectors
      tl.to(
        sectorDots,
        {
          opacity: 1,
          duration: 0.3,
          ease: "power2.out",
          stagger: 0.08,
        },
        "<",
      );
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className={styles.hero}>
      <div className={styles.inner}>
        <div className={styles.topRow}>
          <span className={styles.annotation}>(nosotros)</span>
          <span className={styles.since}>Desde 1993</span>
        </div>

        <h1 className={styles.title}>
          <span className={styles.mainLine}>{mainLine}</span>
          {locationLine && (
            <span className={styles.locationLine}>{locationLine}</span>
          )}
        </h1>

        <div className={styles.introWrap}>
          <p className={styles.intro}>{intro}</p>
          <div className={styles.sectors}>
            <span className={styles.sectorsLabel}>Nuestros sectores</span>
            <div className={styles.sectorList}>
              {sectors.map((sector, i) => (
                <span key={sector}>
                  <span className={styles.sector}>{sector}</span>
                  {i < sectors.length - 1 && (
                    <span className={styles.sectorDot}>·</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
