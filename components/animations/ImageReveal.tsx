"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type ReactNode, useRef } from "react";
import styles from "./ImageReveal.module.css";

gsap.registerPlugin(ScrollTrigger);

type Direction = "left" | "bottom" | "right";

interface Props {
  children: ReactNode;
  /** Wipe direction. Default: "left" */
  direction?: Direction;
  /** Delay before animation starts (seconds). Default: 0 */
  delay?: number;
  /** Animation duration (seconds). Default: 1.2 */
  duration?: number;
  /** Slight inner scale zoom during reveal. Default: true */
  scaleReveal?: boolean;
  /** Extra class on the outer wrapper */
  className?: string;
  /** Extra inline styles */
  style?: React.CSSProperties;
}

const directionClass: Record<Direction, string> = {
  left: styles.wipeLeft,
  bottom: styles.wipeBottom,
  right: styles.wipeRight,
};

export default function ImageReveal({
  children,
  direction = "left",
  delay = 0,
  duration = 1.2,
  scaleReveal = true,
  className,
  style,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const wrap = wrapRef.current;
      const inner = innerRef.current;
      if (!wrap) return;

      gsap.to(wrap, {
        clipPath: "inset(0 0 0 0)",
        duration,
        delay,
        ease: "power3.inOut",
        scrollTrigger: {
          trigger: wrap,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });

      if (scaleReveal && inner) {
        gsap.fromTo(
          inner,
          { scale: 1.15 },
          {
            scale: 1,
            duration: duration + 0.4,
            delay,
            ease: "power2.out",
            scrollTrigger: {
              trigger: wrap,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          },
        );
      }
    },
    { scope: wrapRef },
  );

  return (
    <div
      ref={wrapRef}
      className={`${styles.wrap} ${directionClass[direction]} ${className ?? ""}`}
      style={style}
    >
      <div ref={innerRef} className={styles.inner}>
        {children}
      </div>
    </div>
  );
}
