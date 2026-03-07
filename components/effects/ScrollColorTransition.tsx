"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

/**
 * Smooth background-color transitions between page sections.
 *
 * Instead of hard-cut backgrounds where one section ends cream and the
 * next begins dark, this interpolates each section's own background
 * color during its entry, creating a scroll-linked blend.
 *
 * How it works:
 * 1. Finds all <section> elements in #main-content
 * 2. Reads each section's background color (from CSS or data-theme)
 * 3. For adjacent sections with different colors, animates the incoming
 *    section's background from the outgoing color → its own color
 *    as the boundary scrolls into the viewport
 */

const THEME_COLORS: Record<string, string> = {
  dark: "#1A1714",
  cream: "#F2EDE7",
  paper: "#FAF9F6",
};

function rgbToHex(rgb: string): string {
  const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) return rgb;
  const r = Number.parseInt(match[1]);
  const g = Number.parseInt(match[2]);
  const b = Number.parseInt(match[3]);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

function getSectionColor(el: HTMLElement): string {
  // 1. Explicit data-bg-color attribute (highest priority)
  const explicit = el.getAttribute("data-bg-color");
  if (explicit) return explicit;

  // 2. data-theme attribute
  const theme = el.getAttribute("data-theme");
  if (theme && THEME_COLORS[theme]) return THEME_COLORS[theme];

  // 3. Computed background (catches CSS module backgrounds like bg-ink, bg-cream)
  const computed = getComputedStyle(el).backgroundColor;
  if (
    computed &&
    computed !== "rgba(0, 0, 0, 0)" &&
    computed !== "transparent"
  ) {
    return rgbToHex(computed);
  }

  // 4. Default: paper
  return THEME_COLORS.paper;
}

export default function ScrollColorTransition() {
  const pathname = usePathname();
  const cleanupRef = useRef<(() => void) | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-run on pathname change to rebuild scroll triggers
  useEffect(() => {
    // Clean up previous transitions
    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = null;
    }

    // Wait for sections to render and layout to settle
    const timer = setTimeout(() => {
      const main = document.getElementById("main-content");
      if (!main) return;

      const sections = Array.from(
        main.querySelectorAll<HTMLElement>(":scope > section"),
      );

      if (sections.length < 2) return;

      const tweens: gsap.core.Tween[] = [];
      const colors = sections.map((s) => getSectionColor(s));

      for (let i = 1; i < sections.length; i++) {
        const prevColor = colors[i - 1];
        const currColor = colors[i];

        // Skip identical backgrounds — no transition needed
        if (prevColor === currColor) continue;

        const section = sections[i];

        // Animate the incoming section's background from the previous
        // section's color to its own, scrubbed to scroll position.
        // The transition happens as the section's top edge moves from
        // 95% of viewport height (just entering) to 25% (well in view).
        const tween = gsap.fromTo(
          section,
          { backgroundColor: prevColor },
          {
            backgroundColor: currColor,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top 95%",
              end: "top 25%",
              scrub: 0.4,
            },
          },
        );

        tweens.push(tween);
      }

      cleanupRef.current = () => {
        for (const t of tweens) {
          t.scrollTrigger?.kill();
          t.kill();
        }
        // Reset inline background-color styles
        for (const s of sections) {
          s.style.backgroundColor = "";
        }
      };
    }, 250);

    return () => {
      clearTimeout(timer);
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
  }, [pathname]);

  return null;
}
