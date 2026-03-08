"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import styles from "./PortfolioHero.module.css";

interface Props {
  title: string;
  description: string;
  projectCount: number;
}

export default function PortfolioHero({
  title,
  description,
  projectCount,
}: Props) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = sectionRef.current;
      if (!el) return;

      const items = el.querySelectorAll(`.${styles.animItem}`);
      gsap.set(items, { opacity: 0, y: 40 });

      const tl = gsap.timeline({ delay: 0.4 });

      // Annotation first (y:40), title heavier (y:60), description lighter (y:30)
      const [annotation, titleEl, desc] = items;
      if (annotation) {
        tl.to(annotation, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
        });
      }
      if (titleEl) {
        gsap.set(titleEl, { y: 60 });
        tl.to(
          titleEl,
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
          },
          "-=0.75",
        );
      }
      if (desc) {
        gsap.set(desc, { y: 30 });
        tl.to(
          desc,
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
          },
          "-=0.75",
        );
      }
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className={styles.hero}>
      <div className={styles.inner}>
        <span className={`section-number ${styles.animItem}`}>
          {String(projectCount).padStart(2, "0")} proyectos
        </span>
        <h1 className={`${styles.title} ${styles.animItem}`}>{title}</h1>
        <p className={`${styles.description} ${styles.animItem}`}>
          {description}
        </p>
      </div>
    </section>
  );
}
