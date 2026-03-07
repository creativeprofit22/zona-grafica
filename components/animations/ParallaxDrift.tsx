"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type ReactNode, useRef } from "react";
import styles from "./ImageReveal.module.css";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  children: ReactNode;
  /** Vertical drift distance in px. Default: 30 */
  distance?: number;
  /** Extra class on the outer wrapper */
  className?: string;
  /** Extra inline styles */
  style?: React.CSSProperties;
}

/**
 * Subtle parallax vertical drift for images.
 * The inner element is 110% height so it can shift without revealing gaps.
 */
export default function ParallaxDrift({
  children,
  distance = 30,
  className,
  style,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const inner = innerRef.current;
      if (!inner) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 769px)", () => {
        gsap.fromTo(
          inner,
          { y: -distance },
          {
            y: distance,
            ease: "none",
            scrollTrigger: {
              trigger: wrapRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });
    },
    { scope: wrapRef },
  );

  return (
    <div
      ref={wrapRef}
      className={`${styles.parallaxWrap} ${className ?? ""}`}
      style={style}
    >
      <div ref={innerRef} className={styles.parallaxInner}>
        {children}
      </div>
    </div>
  );
}
