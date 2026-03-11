"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import type { Service } from "@/types/content";
import ServiceCard from "./ServiceCard";
import styles from "./ServicesList.module.css";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  services: Service[];
}

export default function ServicesList({ services }: Props) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = sectionRef.current;
      if (!el) return;

      const wrappers = el.querySelectorAll<HTMLElement>(
        `.${styles.cardWrapper}`,
      );
      if (wrappers.length < 2) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 769px)", () => {
        wrappers.forEach((wrapper, i) => {
          if (i === wrappers.length - 1) return;

          gsap.to(wrapper, {
            scale: 0.96,

            ease: "none",
            scrollTrigger: {
              trigger: wrappers[i + 1],
              start: "top bottom",
              end: "top 10%",
              scrub: true,
            },
          });
        });
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.inner}>
        {services.map((service, i) => (
          <div
            key={service.id}
            className={styles.cardWrapper}
            style={{ zIndex: i + 1 }}
          >
            <ServiceCard service={service} index={i} />
          </div>
        ))}
      </div>
    </section>
  );
}
