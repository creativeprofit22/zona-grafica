"use client";

import { useEffect, useRef } from "react";
import styles from "./ClientMarquee.module.css";

const FEATURED_CLIENTS = [
  "Festival Cervantino",
  "GIFF",
  "Cardo Café",
  "Duncan Galería",
  "Lobby",
  "Zeferino Mezcal",
];

export default function ClientMarquee() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add(styles.visible);
          obs.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const lastIndex = FEATURED_CLIENTS.length - 1;

  return (
    <section ref={ref} className={styles.wrapper}>
      <div className={styles.inner}>
        <p className={styles.tagline}>Buenos clientes hacen buenas historias.</p>
        <p className={styles.sentence}>
          <span className={styles.prefix}>Hemos trabajado con </span>
          {FEATURED_CLIENTS.map((name, i) => (
            <span key={name}>
              <span className={styles.client}>
                <span className={styles.paren}>(</span>
                {" "}
                <span className={styles.name}>{name}</span>
                {" "}
                <span className={styles.paren}>)</span>
              </span>
              {i < lastIndex - 1 && <span className={styles.separator}>, </span>}
              {i === lastIndex - 1 && <span className={styles.separator}> y </span>}
            </span>
          ))}
          <span className={styles.suffix}> y muchos más.</span>
        </p>
      </div>
    </section>
  );
}
