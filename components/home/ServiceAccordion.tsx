"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Service } from "@/types/content";
import styles from "./ServiceAccordion.module.css";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  services: Service[];
}

export default function ServiceAccordion({ services }: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [tappedId, setTappedId] = useState<string | null>(null);
  const cursorImgRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const animFrame = useRef<number>(0);

  const updateCursorImage = useCallback(() => {
    if (!cursorImgRef.current || !sectionRef.current) return;

    const rect = sectionRef.current.getBoundingClientRect();
    const x = mousePos.current.x - rect.left;
    const y = mousePos.current.y - rect.top;

    cursorImgRef.current.style.transform = `translate(${x + 20}px, ${y - 150}px)`;
    animFrame.current = requestAnimationFrame(updateCursorImage);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!animFrame.current && hoveredId) {
        animFrame.current = requestAnimationFrame(updateCursorImage);
      }
    },
    [hoveredId, updateCursorImage],
  );

  const handleMouseEnter = useCallback(
    (id: string) => {
      setHoveredId(id);
      animFrame.current = requestAnimationFrame(updateCursorImage);
    },
    [updateCursorImage],
  );

  const handleMouseLeave = useCallback(() => {
    setHoveredId(null);
    if (animFrame.current) {
      cancelAnimationFrame(animFrame.current);
      animFrame.current = 0;
    }
  }, []);

  const handleTap = useCallback((id: string) => {
    setTappedId((prev) => (prev === id ? null : id));
  }, []);

  useEffect(() => {
    return () => {
      if (animFrame.current) {
        cancelAnimationFrame(animFrame.current);
      }
    };
  }, []);

  useGSAP(
    () => {
      const el = sectionRef.current;
      if (!el) return;

      const items = el.querySelectorAll<HTMLElement>(`.${styles.item}`);

      items.forEach((item, i) => {
        const number = item.querySelector<HTMLElement>(`.${styles.number}`);
        const name = item.querySelector<HTMLElement>(`.${styles.name}`);
        const oneliner = item.querySelector<HTMLElement>(`.${styles.oneliner}`);

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
          delay: i * 0.08,
        });

        // Clip-path opens the row
        tl.fromTo(
          item,
          { clipPath: "inset(0 100% 0 0)" },
          { clipPath: "inset(0 0% 0 0)", duration: 0.6, ease: "power2.out" },
        );

        // Number scales in
        if (number) {
          tl.fromTo(
            number,
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 0.12, duration: 0.4, ease: "back.out(1.7)" },
            "-=0.35",
          );
        }

        // Name slides in with skew
        if (name) {
          tl.fromTo(
            name,
            { x: -20, skewX: -3, opacity: 0 },
            { x: 0, skewX: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
            "-=0.3",
          );
        }

        // Accent slash flashes full height then settles
        tl.fromTo(
          item,
          { "--slash-h": "100%" },
          { "--slash-h": "0%", duration: 0.4, ease: "power2.in" },
          "-=0.4",
        );

        // Oneliner fades in last
        if (oneliner) {
          tl.fromTo(
            oneliner,
            { opacity: 0, y: 6 },
            { opacity: 0, y: 0, duration: 0.3, ease: "power2.out" },
            "-=0.15",
          );
        }
      });
    },
    { scope: sectionRef },
  );

  const activeImage = services.find((s) => s.id === hoveredId)?.image;

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: decorative mouse tracking for cursor effect
    <section
      ref={sectionRef}
      className={styles.section}
      data-theme="dark"
      data-cursor-label="→"
      onMouseMove={handleMouseMove}
    >
      <div className={styles.header}>
        <span className={styles.label}>(servicios)</span>
        <h2 className={styles.title}>Lo que hacemos</h2>
      </div>

      <div className={styles.list}>
        {services.map((service) => {
          const isTapped = tappedId === service.id;
          return (
            <div key={service.id} className={styles.item}>
              <Link
                href={`/servicios#${service.slug}`}
                className={styles.row}
                onMouseEnter={() => handleMouseEnter(service.id)}
                onMouseLeave={handleMouseLeave}
                onClick={(e) => {
                  if (window.innerWidth <= 768) {
                    e.preventDefault();
                    handleTap(service.id);
                  }
                }}
              >
                <div className={styles.rowLeft}>
                  <span className={styles.number}>{service.number}</span>
                  <span className={styles.name}>{service.title}</span>
                  <span className={styles.oneliner}>
                    {service.description.split(".")[0]}.
                  </span>
                </div>
                <span className={styles.arrow} aria-hidden="true">
                  →
                </span>
              </Link>

              {isTapped && (
                <div className={styles.mobileImage}>
                  <Image
                    src={service.image}
                    alt={service.title}
                    width={400}
                    height={300}
                    className={styles.mobileImg}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div
        ref={cursorImgRef}
        className={`${styles.cursorImage} ${hoveredId ? styles.cursorVisible : ""}`}
        aria-hidden="true"
      >
        {activeImage && (
          <Image
            src={activeImage}
            alt=""
            width={400}
            height={300}
            className={styles.cursorImg}
            preload
          />
        )}
      </div>
    </section>
  );
}
