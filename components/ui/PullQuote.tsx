"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import styles from "./PullQuote.module.css";

gsap.registerPlugin(ScrollTrigger);

export interface PullQuoteData {
  text: string;
  accentPhrase: string;
}

interface PullQuoteProps {
  data: PullQuoteData;
}

export default function PullQuote({ data }: PullQuoteProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(`.${styles.animItem}`, {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });
    },
    { scope: sectionRef },
  );

  // Split text around the accent phrase
  const parts = data.text.split(data.accentPhrase);

  return (
    <aside ref={sectionRef} className={styles.strip} data-theme="dark">
      <div className={styles.inner}>
        <blockquote className={`${styles.quote} ${styles.animItem}`}>
          {parts[0]}
          <span className={styles.accent}>{data.accentPhrase}</span>
          {parts[1] ?? ""}
        </blockquote>
      </div>
    </aside>
  );
}
