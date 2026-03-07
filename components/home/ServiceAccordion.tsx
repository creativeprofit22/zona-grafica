"use client";

import type { Service } from "@/types/content";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./ServiceAccordion.module.css";

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

  const activeImage = services.find((s) => s.id === hoveredId)?.image;

  return (
    <section
      ref={sectionRef}
      className={styles.section}
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
                </div>
                <span className={styles.oneliner}>
                  {service.description.split(".")[0]}.
                </span>
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
