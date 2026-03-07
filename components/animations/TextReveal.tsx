"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import styles from "./TextReveal.module.css";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  text: string;
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  delay?: number;
}

export default function TextReveal({
  text,
  as: Tag = "h2",
  className,
  delay = 0,
}: Props) {
  const containerRef = useRef<HTMLElement>(null);
  // Track whether we're client-side so we can swap the server-rendered
  // plain text for the split-word DOM structure.
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const words = text.split(" ");

  useGSAP(
    () => {
      if (!isMounted) return;
      const el = containerRef.current;
      if (!el) return;

      const inners = el.querySelectorAll<HTMLElement>(`.${styles.wordInner}`);
      if (!inners.length) return;

      // Start position: hidden below the clip edge
      gsap.set(inners, { yPercent: 120, opacity: 0 });

      const anim = gsap.to(inners, {
        yPercent: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power3.out",
        stagger: 0.08,
        delay,
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none none",
        },
        onStart() {
          // Activate GPU compositing layer during animation
          for (const w of inners) {
            w.style.willChange = "transform, opacity";
          }
        },
        onComplete() {
          // Release the compositing layer once animation is done
          for (const w of inners) {
            w.style.willChange = "auto";
          }
        },
      });

      return () => {
        anim.kill();
      };
    },
    // Re-run when mount state changes so GSAP picks up the split DOM
    { scope: containerRef, dependencies: [isMounted] },
  );

  // Server render (and pre-hydration): plain text inside the tag so crawlers
  // see the full heading content and there's no layout shift.
  if (!isMounted) {
    return (
      <Tag
        // biome-ignore lint/suspicious/noExplicitAny: Tag is dynamic (h1-h6/p), ref type varies
        ref={containerRef as React.RefObject<any>}
        className={className}
      >
        {text}
      </Tag>
    );
  }

  // Client render: split into per-word clip containers
  return (
    <Tag
      // biome-ignore lint/suspicious/noExplicitAny: Tag is dynamic (h1-h6/p), ref type varies
      ref={containerRef as React.RefObject<any>}
      className={className}
    >
      {words.map((word, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: stable word order from split
        <span key={i} className={styles.word}>
          <span className={styles.wordInner}>{word}</span>
        </span>
      ))}
    </Tag>
  );
}
