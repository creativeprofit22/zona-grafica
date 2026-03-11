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

      gsap.from(items, {
        opacity: 0,
        y: 30,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.15,
        delay: 0.3,
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className={styles.hero}>
      <div className={styles.inner}>
        <div className={`${styles.topRow} ${styles.animItem}`}>
          <span className={styles.count}>
            ({String(serviceCount).padStart(2, "0")})
          </span>
          <span className={styles.annotation}>servicios creativos</span>
        </div>
        <h1 className={`${styles.title} ${styles.animItem}`}>
          Lo que
          <br />
          <span className={styles.titleAccent}>hacemos</span>
        </h1>
        <p className={`${styles.subtitle} ${styles.animItem}`}>
          Cada servicio es un proceso, no una lista de precios. Investigamos,
          diseñamos, iteramos y entregamos piezas que funcionan.
        </p>
      </div>
    </section>
  );
}
