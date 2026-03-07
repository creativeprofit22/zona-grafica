"use client";

import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import styles from "./CustomCursor.module.css";

type CursorState = "default" | "hover" | "project";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const posRef = useRef({ x: -100, y: -100 });
  const [cursorState, setCursorState] = useState<CursorState>("default");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Skip on touch devices
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouch) return;

    // Hide default cursor globally via injected style
    const style = document.createElement("style");
    style.textContent = "*, *::before, *::after { cursor: none !important; }";
    document.head.appendChild(style);

    const cursor = cursorRef.current;
    const label = labelRef.current;
    if (!cursor || !label) return;

    const onMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      setVisible(true);

      // Detect what we're hovering
      const target = e.target as HTMLElement;
      const closestProject = target.closest("[data-cursor-project]");
      const closestLink = target.closest(
        'a, button, [role="button"], input, textarea, select, label[for]'
      );

      if (closestProject) {
        setCursorState("project");
      } else if (closestLink) {
        setCursorState("hover");
      } else {
        setCursorState("default");
      }
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    // Smooth follow via GSAP ticker (synced with rAF)
    const tickerCallback = () => {
      const { x, y } = posRef.current;
      gsap.set(cursor, { x, y });
      gsap.set(label, { x, y });
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
    };
  }, []);

  const cursorClasses = [
    styles.cursor,
    visible && styles.visible,
    cursorState === "hover" && styles.hover,
    cursorState === "project" && styles.project,
  ]
    .filter(Boolean)
    .join(" ");

  const labelClasses = [
    styles.label,
    visible && cursorState === "project" && styles.visible,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <div ref={cursorRef} className={cursorClasses} aria-hidden="true" />
      <span ref={labelRef} className={labelClasses} aria-hidden="true">
        Ver →
      </span>
    </>
  );
}
