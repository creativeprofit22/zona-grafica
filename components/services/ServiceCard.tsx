"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";
import ImageReveal from "@/components/animations/ImageReveal";
import type { Service } from "@/types/content";
import styles from "./ServiceCard.module.css";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  service: Service;
  index: number;
}

export default function ServiceCard({ service, index }: Props) {
  const cardRef = useRef<HTMLElement>(null);
  const isOdd = index % 2 === 1;

  useGSAP(
    () => {
      const el = cardRef.current;
      if (!el) return;

      const words = el.querySelectorAll<HTMLElement>(`.${styles.word}`);
      const steps = el.querySelectorAll(`.${styles.step}`);
      const numberEl = el.querySelector(`.${styles.number}`);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      /* ── Word-by-word illuminate on title ── */
      if (words.length > 0) {
        gsap.fromTo(
          words,
          { opacity: 0.15 },
          {
            opacity: 1,
            duration: 0.8,
            stagger: 0.04,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el.querySelector(`.${styles.title}`),
              start: "top 85%",
              end: "top 40%",
              scrub: 0.3,
            },
          },
        );
      }

      /* ── Spring-in cascade on process pills ── */
      if (steps.length > 0) {
        tl.from(
          steps,
          {
            y: 20,
            scale: 0.85,
            duration: 0.7,
            ease: "back.out(2)",
            stagger: 0.06,
            immediateRender: false,
          },
          0.4,
        );
      }

      /* ── Parallax drift on number watermark ── */
      if (numberEl) {
        gsap.to(numberEl, {
          y: isOdd ? 25 : -25,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      /* ── Magnetic hover tilt (desktop only) ── */
      const mm = gsap.matchMedia();
      mm.add("(min-width: 769px) and (hover: hover)", () => {
        const xTo = gsap.quickTo(el, "x", {
          duration: 0.6,
          ease: "power3.out",
        });
        const yTo = gsap.quickTo(el, "y", {
          duration: 0.6,
          ease: "power3.out",
        });

        const strength = 0.08;

        const onMove = (e: PointerEvent) => {
          const rect = el.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          xTo((e.clientX - cx) * strength);
          yTo((e.clientY - cy) * strength);
        };

        const onLeave = () => {
          xTo(0);
          yTo(0);
        };

        el.addEventListener("pointermove", onMove);
        el.addEventListener("pointerleave", onLeave);

        return () => {
          el.removeEventListener("pointermove", onMove);
          el.removeEventListener("pointerleave", onLeave);
        };
      });
    },
    { scope: cardRef, dependencies: [isOdd] },
  );

  const revealDirection = isOdd ? "right" : "left";

  return (
    <article
      ref={cardRef}
      id={service.slug}
      data-service={service.slug}
      className={styles.card}
    >
      <div className={styles.numberCol}>
        <span className={styles.number}>{service.number}</span>
      </div>

      <div className={styles.cardInner}>
        <div className={styles.imageCol}>
          {service.slug === "web" && (
            <div className={styles.chromeBar}>
              <span className={styles.chromeDot} />
              <span className={styles.chromeDot} />
              <span className={styles.chromeDot} />
            </div>
          )}
          <ImageReveal
            direction={revealDirection}
            className={styles.imageWrap}
            style={{ width: "100%", height: "100%" }}
          >
            <Image
              src={service.image}
              alt={service.title}
              fill
              sizes="(max-width: 768px) 100vw, 45vw"
              style={{ objectFit: "cover" }}
            />
          </ImageReveal>
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
            {service.title.split(/\s+/).map((word) => (
              <span key={word} className={styles.word}>
                {word}
              </span>
            ))}
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
      </div>
    </article>
  );
}
