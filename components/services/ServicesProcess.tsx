"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import styles from "./ServicesProcess.module.css";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: "01",
    title: "Escuchamos",
    description:
      "Entendemos tu negocio, tu audiencia y tus objetivos antes de tocar un solo pixel.",
  },
  {
    number: "02",
    title: "Investigamos",
    description:
      "Analizamos el mercado, la competencia y las oportunidades para definir la estrategia.",
  },
  {
    number: "03",
    title: "Creamos",
    description:
      "Diseñamos, iteramos y refinamos hasta que cada pieza comunique exactamente lo que debe.",
  },
  {
    number: "04",
    title: "Entregamos",
    description:
      "Archivos listos para producción, guías de uso y soporte post-entrega incluido.",
  },
];

export default function ServicesProcess() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const line = section.querySelector(`.${styles.list}`) as HTMLElement;
      const dots = section.querySelectorAll(`.${styles.step}`);

      // Animate the timeline line (scaleY 0→1) via CSS custom property
      gsap.fromTo(
        line,
        { "--line-scale": 0 },
        {
          "--line-scale": 1,
          ease: "none",
          scrollTrigger: {
            trigger: line,
            start: "top 80%",
            end: "bottom 60%",
            scrub: 0.5,
          },
        },
      );

      // Sequential dot reveals + content cascade
      dots.forEach((dot, i) => {
        const content = dot.querySelector(`.${styles.stepContent}`);

        // Dot bounce
        gsap.to(dot, {
          "--dot-opacity": 1,
          "--dot-scale": 1,
          duration: 0.4,
          ease: "back.out(2)",
          scrollTrigger: {
            trigger: dot,
            start: "top 75%",
            toggleActions: "play none none none",
          },
          delay: i * 0.2,
        });

        // Content reveal (tied to same trigger, extra delay)
        if (content) {
          gsap.from(content, {
            y: 20,
            opacity: 0,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: {
              trigger: dot,
              start: "top 75%",
              toggleActions: "play none none none",
            },
            delay: i * 0.2 + 0.15,
          });
        }
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className={styles.section} data-theme="cream">
      <div className={styles.inner}>
        <div className={styles.header}>
          <span className={styles.label}>(proceso)</span>
          <h2 className={styles.title}>Así trabajamos</h2>
        </div>

        <ol className={styles.list}>
          {steps.map((step) => (
            <li key={step.number} className={styles.step}>
              <div className={styles.stepContent}>
                <div className={styles.stepHeader}>
                  <span className={styles.stepNumber}>{step.number}</span>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                </div>
                <p className={styles.stepDescription}>{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
