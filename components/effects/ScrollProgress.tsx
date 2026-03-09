"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import styles from "./ScrollProgress.module.css";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  color?: string;
}

export default function ScrollProgress({ color }: Props) {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    const trigger = ScrollTrigger.create({
      trigger: document.documentElement,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        gsap.set(bar, { scaleX: self.progress });
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  return (
    <div
      ref={barRef}
      className={styles.bar}
      style={
        color
          ? ({ "--progress-color": color } as React.CSSProperties)
          : undefined
      }
      aria-hidden="true"
    />
  );
}
