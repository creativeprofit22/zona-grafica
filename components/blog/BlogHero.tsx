"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import styles from "./BlogHero.module.css";

interface Props {
  postCount: number;
}

export default function BlogHero({ postCount }: Props) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = sectionRef.current;
      if (!el) return;

      const tl = gsap.timeline({ delay: 0.4 });

      const items = el.querySelectorAll(`.${styles.animItem}`);
      const rule = el.querySelector(`.${styles.rule}`);

      gsap.set(items, { opacity: 0, y: 40 });

      tl.to(items, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.15,
      });

      if (rule) {
        tl.to(
          rule,
          {
            scaleX: 1,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.3",
        );
      }
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className={styles.hero}>
      <div className={styles.inner}>
        <span className={`${styles.annotation} ${styles.animItem}`}>
          ({String(postCount).padStart(2, "0")} artículos)
        </span>
        <h1 className={`${styles.title} ${styles.animItem}`}>Blog</h1>
        <p className={`${styles.subtitle} ${styles.animItem}`}>
          Ideas, proceso y reflexiones sobre diseño, branding y creatividad
          desde San Miguel de Allende.
        </p>
        <div className={styles.rule} />
      </div>
    </section>
  );
}
