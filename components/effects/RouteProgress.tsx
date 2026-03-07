"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import styles from "./RouteProgress.module.css";

type BarState = "idle" | "loading" | "complete";

export default function RouteProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const stateRef = useRef<BarState>("idle");
  const completeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setState = useCallback((next: BarState) => {
    const bar = barRef.current;
    if (!bar) return;
    stateRef.current = next;
    bar.setAttribute("data-state", next);
  }, []);

  const startLoading = useCallback(() => {
    if (completeTimerRef.current) {
      clearTimeout(completeTimerRef.current);
      completeTimerRef.current = null;
    }
    setState("loading");
  }, [setState]);

  const finishLoading = useCallback(() => {
    setState("complete");
    completeTimerRef.current = setTimeout(() => {
      setState("idle");
      completeTimerRef.current = null;
    }, 500);
  }, [setState]);

  // Intercept anchor clicks to show the bar before the route changes.
  // App Router has no router events, so we listen at the DOM level.
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as Element).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href) return;

      // Only internal same-origin navigations — skip anchors, external, and
      // mailto/tel links that won't trigger a route change.
      const isInternal =
        href.startsWith("/") &&
        !href.startsWith("//") &&
        !href.startsWith("/#");

      if (isInternal) {
        startLoading();
      }
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [startLoading]);

  // Pathname change means the new page has rendered — mark complete.
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally only react to pathname changes
  useEffect(() => {
    finishLoading();
  }, [pathname]);

  return (
    <div
      ref={barRef}
      className={styles.bar}
      data-state="idle"
      aria-hidden="true"
    />
  );
}
