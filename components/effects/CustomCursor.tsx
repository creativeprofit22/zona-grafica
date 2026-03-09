"use client";

import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import styles from "./CustomCursor.module.css";

type CursorState =
  | "default"
  | "hover"
  | "project"
  | "section"
  | "form"
  | "logo";

export default function CustomCursor() {
  const eyeRef = useRef<HTMLDivElement>(null);
  const pupilRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const posRef = useRef({ x: -100, y: -100 });
  const prevPosRef = useRef({ x: 0, y: 0 });
  const stateRef = useRef<CursorState>("default");
  const [labelText, setLabelText] = useState("Ver");
  const [visible, setVisible] = useState(false);
  const [cursorState, setCursorState] = useState<CursorState>("default");

  useEffect(() => {
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouch) return;

    // Hide native cursor globally
    const style = document.createElement("style");
    style.textContent = "*, *::before, *::after { cursor: none !important; }";
    document.head.appendChild(style);

    const eye = eyeRef.current;
    const pupil = pupilRef.current;
    const orbit = orbitRef.current;
    const label = labelRef.current;
    if (!eye || !pupil || !orbit || !label) return;

    // Orbit ring follows with elastic lag
    const orbitX = gsap.quickTo(orbit, "x", {
      duration: 0.5,
      ease: "power3.out",
    });
    const orbitY = gsap.quickTo(orbit, "y", {
      duration: 0.5,
      ease: "power3.out",
    });
    const labelX = gsap.quickTo(label, "x", {
      duration: 0.5,
      ease: "power3.out",
    });
    const labelY = gsap.quickTo(label, "y", {
      duration: 0.5,
      ease: "power3.out",
    });

    // Blink animation for hover
    let blinkTween: gsap.core.Tween | null = null;

    const triggerBlink = () => {
      if (blinkTween?.isActive()) return;
      blinkTween = gsap.to(eye, {
        height: 4,
        duration: 0.1,
        ease: "power2.in",
        yoyo: true,
        repeat: 1,
        onComplete: () => {
          // Restore to hover height
          if (stateRef.current === "hover") {
            gsap.set(eye, { height: 14 });
          }
        },
      });
    };

    const onMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      setVisible(true);

      // Orbit & label follow with lag
      orbitX(e.clientX);
      orbitY(e.clientY);
      labelX(e.clientX);
      labelY(e.clientY);

      // Detect cursor target
      const target = e.target as HTMLElement;
      const closestForm = target.closest(
        "input, textarea, select, [contenteditable]",
      );
      const closestLogo = target.closest("[data-cursor-logo]");
      const closestProject = target.closest("[data-cursor-project]");
      const closestSection = target.closest("[data-cursor-label]");
      const closestLink = target.closest(
        'a, button, [role="button"], label[for]',
      );

      let newState: CursorState = "default";

      if (closestForm) {
        newState = "form";
      } else if (closestLogo) {
        newState = "logo";
      } else if (closestProject) {
        newState = "project";
        setLabelText("Ver");
      } else if (closestSection) {
        const sectionLabel = (closestSection as HTMLElement).dataset
          .cursorLabel;
        newState = "section";
        setLabelText(sectionLabel || "");
      } else if (closestLink) {
        newState = "hover";
      }

      if (newState !== stateRef.current) {
        const prevState = stateRef.current;
        stateRef.current = newState;
        setCursorState(newState);

        // Trigger blink on entering hover
        if (newState === "hover" && prevState !== "hover") {
          triggerBlink();
        }
      }
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    // Ticker: instant eye position + pupil direction tracking
    const tickerCallback = () => {
      const { x, y } = posRef.current;
      gsap.set(eye, { x, y });

      // Calculate mouse velocity for pupil offset
      const dx = x - prevPosRef.current.x;
      const dy = y - prevPosRef.current.y;
      prevPosRef.current = { x, y };

      // Normalize delta to max 3px offset
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 0.5) {
        const maxOffset = 3;
        const scale = Math.min(dist, 10) / 10;
        const offsetX = (dx / dist) * maxOffset * scale;
        const offsetY = (dy / dist) * maxOffset * scale;
        gsap.set(pupil, {
          x: `calc(-50% + ${offsetX}px)`,
          y: `calc(-50% + ${offsetY}px)`,
        });
      }
    };

    gsap.ticker.add(tickerCallback);
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    return () => {
      gsap.ticker.remove(tickerCallback);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      document.head.removeChild(style);
      if (blinkTween) blinkTween.kill();
    };
  }, []);

  const eyeClasses = [
    styles.eye,
    visible && styles.visible,
    cursorState === "hover" && styles.eyeHover,
    cursorState === "project" && styles.eyeProject,
    cursorState === "section" && styles.eyeSection,
    cursorState === "form" && styles.eyeForm,
    cursorState === "logo" && styles.eyeLogo,
  ]
    .filter(Boolean)
    .join(" ");

  const orbitClasses = [
    styles.orbit,
    visible && styles.visible,
    cursorState === "hover" && styles.orbitHover,
    cursorState === "project" && styles.orbitProject,
    cursorState === "logo" && styles.orbitLogo,
  ]
    .filter(Boolean)
    .join(" ");

  const labelClasses = [
    styles.label,
    visible &&
      (cursorState === "project" || cursorState === "section") &&
      styles.visible,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      {/* Chameleon eye — sticks to cursor */}
      <div ref={eyeRef} className={eyeClasses} aria-hidden="true">
        <div ref={pupilRef} className={styles.pupil} />
      </div>
      {/* Orbit ring — follows with elastic lag */}
      <div ref={orbitRef} className={orbitClasses} aria-hidden="true" />
      {/* Label — appears on project/section hover */}
      <span ref={labelRef} className={labelClasses} aria-hidden="true">
        {labelText}
      </span>
    </>
  );
}
