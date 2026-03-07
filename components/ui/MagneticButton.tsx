"use client";

import gsap from "gsap";
import { type ReactNode, useEffect, useRef } from "react";
import styles from "./MagneticButton.module.css";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  strength?: number;
}

export default function MagneticButton({
  children,
  className,
  strength = 0.35,
}: MagneticButtonProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;

    // Skip on touch devices — no hover behaviour
    if (window.matchMedia("(hover: none)").matches) return;

    const xTo = gsap.quickTo(inner, "x", {
      duration: 0.6,
      ease: "elastic.out(1, 0.4)",
    });
    const yTo = gsap.quickTo(inner, "y", {
      duration: 0.6,
      ease: "elastic.out(1, 0.4)",
    });

    const onMove = (e: MouseEvent) => {
      const rect = wrap.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      xTo(dx * strength);
      yTo(dy * strength);
    };

    const onLeave = () => {
      xTo(0);
      yTo(0);
    };

    const onPointerDown = () => {
      gsap.to(inner, {
        scale: 0.95,
        duration: 0.15,
        ease: "power2.out",
      });
    };

    const onPointerUp = () => {
      gsap.to(inner, {
        scale: 1,
        duration: 0.4,
        ease: "elastic.out(1, 0.4)",
      });
    };

    wrap.addEventListener("mousemove", onMove);
    wrap.addEventListener("mouseleave", onLeave);
    wrap.addEventListener("pointerdown", onPointerDown);
    wrap.addEventListener("pointerup", onPointerUp);
    wrap.addEventListener("pointerleave", onPointerUp);

    return () => {
      wrap.removeEventListener("mousemove", onMove);
      wrap.removeEventListener("mouseleave", onLeave);
      wrap.removeEventListener("pointerdown", onPointerDown);
      wrap.removeEventListener("pointerup", onPointerUp);
      wrap.removeEventListener("pointerleave", onPointerUp);
      gsap.killTweensOf(inner);
    };
  }, [strength]);

  return (
    <div ref={wrapRef} className={`${styles.wrap} ${className ?? ""}`}>
      <div ref={innerRef} className={styles.inner}>
        {children}
      </div>
    </div>
  );
}
