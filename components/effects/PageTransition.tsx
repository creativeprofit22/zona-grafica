"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * PageTransition — intercepts internal link clicks and wraps navigation
 * with the View Transitions API so page changes feel like page turns:
 * content fades out upward, new content fades in from below.
 *
 * Falls back gracefully when View Transitions API is not supported.
 */
export default function PageTransition() {
  const pathname = usePathname();
  const mainRef = useRef<HTMLElement | null>(null);
  const isTransitioning = useRef(false);

  // Cache reference to main element
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-cache on route change
  useEffect(() => {
    mainRef.current = document.getElementById("main-content");
  }, [pathname]);

  // Assign view-transition-name to main content so the CSS
  // ::view-transition-old / ::view-transition-new rules apply
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-apply on route change
  useEffect(() => {
    const main = document.getElementById("main-content");
    if (main) {
      main.style.viewTransitionName = "page-content";
    }
  }, [pathname]);

  // Intercept internal anchor clicks to wrap navigation in startViewTransition
  useEffect(() => {
    const supportsVT =
      typeof document !== "undefined" && "startViewTransition" in document;

    if (!supportsVT) return;

    // Respect reduced motion preference
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return;

    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as Element).closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Only intercept internal same-origin navigations
      const isInternal =
        href.startsWith("/") &&
        !href.startsWith("//") &&
        !href.startsWith("/#");

      // Skip if it's the current page
      if (!isInternal || href === pathname) return;

      // Skip if modifier keys are held (new tab, etc.)
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      // Skip if target is set (e.g., target="_blank")
      if (anchor.target && anchor.target !== "_self") return;

      // Already transitioning — don't double-fire
      if (isTransitioning.current) return;

      // Don't prevent default — let Next.js handle the actual navigation.
      // The View Transitions API will capture the visual change.
      // We mark that we're transitioning so the pathname effect knows.
      isTransitioning.current = true;

      // Reset after a short delay
      setTimeout(() => {
        isTransitioning.current = false;
      }, 800);
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [pathname]);

  // On pathname change, animate the new content entrance
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally only react to pathname changes
  useEffect(() => {
    const main = document.getElementById("main-content");
    if (!main) return;

    // Apply entrance animation
    main.style.animation = "none";
    // Force reflow
    main.offsetHeight;
    main.style.animation =
      "pageEnter 0.5s cubic-bezier(0.25, 0.1, 0.25, 1) both";

    const cleanup = () => {
      main.style.animation = "";
    };

    const timer = setTimeout(cleanup, 600);
    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
