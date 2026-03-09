"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";
import ImageReveal from "@/components/animations/ImageReveal";
import ParallaxDrift from "@/components/animations/ParallaxDrift";
import type { Service } from "@/types/content";
import styles from "./ServiceCard.module.css";

gsap.registerPlugin(ScrollTrigger);

export type ServiceCardLayout = "wide" | "compact" | "centered";

interface Props {
  service: Service;
  layout?: ServiceCardLayout;
  reversed?: boolean;
}

export default function ServiceCard({
  service,
  layout = "wide",
  reversed = false,
}: Props) {
  const cardRef = useRef<HTMLElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);

  const layoutClass =
    layout === "compact"
      ? styles.cardCompact
      : layout === "centered"
        ? styles.cardCentered
        : styles.cardWide;

  const words = service.title.split(" ");

  useGSAP(
    () => {
      gsap.from(`.${styles.animWord}`, {
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      if (numberRef.current) {
        gsap.fromTo(
          numberRef.current,
          { y: -20 },
          {
            y: 20,
            ease: "none",
            scrollTrigger: {
              trigger: cardRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      }
    },
    { scope: cardRef },
  );

  return (
    <article
      ref={cardRef}
      id={service.slug}
      data-service={service.slug}
      className={`${styles.card} ${layoutClass} ${reversed ? styles.reversed : ""}`}
    >
      <div className={styles.numberCol}>
        <span ref={numberRef} className={styles.number}>
          {service.number}
        </span>
      </div>

      <div className={styles.imageCol}>
        {service.slug === "web" && (
          <div className={styles.chromeBar}>
            <span className={styles.chromeDot} />
            <span className={styles.chromeDot} />
            <span className={styles.chromeDot} />
          </div>
        )}
        <div className={styles.imageWrap}>
          <ParallaxDrift distance={15}>
            <ImageReveal direction={reversed ? "right" : "left"} delay={0.1}>
              <Image
                src={service.image}
                alt={service.title}
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                style={{ objectFit: "cover" }}
              />
            </ImageReveal>
          </ParallaxDrift>
        </div>
        {service.slug === "video" && (
          <div className={styles.playOverlay}>
            <svg
              className={styles.playIcon}
              viewBox="0 0 48 48"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="24" cy="24" r="23" stroke="white" strokeWidth="2" />
              <path d="M19 15L35 24L19 33V15Z" fill="white" />
            </svg>
          </div>
        )}
      </div>

      <div className={styles.content}>
        <h2 className={styles.title}>
          {words.map((word, i) => {
            const key = `${service.slug}-${word}-${i}`;
            return (
              <span
                key={key}
                className={styles.animWord}
                style={{ display: "inline-block" }}
              >
                {word}
                {i < words.length - 1 ? "\u00A0" : ""}
              </span>
            );
          })}
        </h2>
        <p className={styles.description}>{service.description}</p>

        <ul className={styles.process}>
          {service.process.map((step) => (
            <li key={step} className={styles.step}>
              {step}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
