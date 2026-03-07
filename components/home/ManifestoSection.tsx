"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import styles from "./ManifestoSection.module.css";

gsap.registerPlugin(ScrollTrigger);

interface ManifestoSegment {
  text: string;
  style?: "bold" | "italic" | "accent" | "ochre" | "bold-accent";
}

const manifesto: ManifestoSegment[] = [
  { text: "Fundé Zona Gráfica" },
  { text: "porque creo que", style: "italic" },
  { text: "el diseño no es decoración", style: "bold-accent" },
  { text: "— es" },
  { text: "comunicación.", style: "bold" },
  { text: "Llevamos más de" },
  { text: "30 años", style: "ochre" },
  { text: "haciendo carteles, libros, marcas e identidades desde" },
  { text: "San Miguel de Allende.", style: "bold" },
  { text: "Hemos retratado a" },
  { text: "Tim Burton,", style: "italic" },
  { text: "diseñado" },
  { text: "22 años", style: "ochre" },
  { text: "la imagen del" },
  { text: "GIFF,", style: "bold" },
  { text: "y creado el cartel de la" },
  { text: "edición 33", style: "ochre" },
  { text: "del Cervantino." },
  { text: "No seguimos tendencias." },
  { text: "Hacemos diseño con raíz.", style: "bold-accent" },
];

export default function ManifestoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const quoteRef = useRef<HTMLQuoteElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useGSAP(
    () => {
      if (!isMounted) return;
      const el = quoteRef.current;
      if (!el) return;

      const words = el.querySelectorAll<HTMLElement>(`.${styles.word}`);
      if (!words.length) return;

      gsap.set(words, { opacity: 0.12 });

      gsap.to(words, {
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.04,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          end: "bottom 50%",
          scrub: 0.5,
        },
      });
    },
    { scope: sectionRef, dependencies: [isMounted] },
  );

  const plainText = manifesto.map((s) => s.text).join(" ");

  if (!isMounted) {
    return (
      <section ref={sectionRef} className={styles.section} data-theme="cream">
        <div className={styles.inner}>
          <div className={styles.quoteMarkWrapper}>
            <span className={styles.quoteMark} aria-hidden="true">
              "
            </span>
          </div>
          <blockquote ref={quoteRef} className={styles.quote}>
            <p className={styles.text}>{plainText}</p>
          </blockquote>
          <cite className={styles.attribution}>— Jesús Herrera, fundador</cite>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className={styles.section} data-theme="cream">
      <div className={styles.inner}>
        <div className={styles.quoteMarkWrapper}>
          <span className={styles.quoteMark} aria-hidden="true">
            "
          </span>
        </div>
        <blockquote ref={quoteRef} className={styles.quote}>
          <p className={styles.text}>
            {manifesto.map((segment, si) =>
              segment.text.split(" ").map((word, wi) => (
                <span
                  // biome-ignore lint/suspicious/noArrayIndexKey: stable segment/word order
                  key={`${si}-${wi}`}
                  className={`${styles.word} ${segment.style ? styles[segment.style] : ""}`}
                >
                  {word}{" "}
                </span>
              )),
            )}
          </p>
        </blockquote>
        <cite className={styles.attribution}>— Jesús Herrera, fundador</cite>
      </div>
    </section>
  );
}
