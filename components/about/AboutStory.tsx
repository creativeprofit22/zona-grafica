"use client";

import MotionSection from "@/components/animations/MotionSection";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import styles from "./AboutStory.module.css";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  body: string;
}

export default function AboutStory({ body }: Props) {
  const milestonesRef = useRef<HTMLDivElement>(null);

  // Split body into paragraphs at natural break points for editorial flow
  const sentences = body.split(". ").filter(Boolean);
  const mid = Math.ceil(sentences.length / 2);
  const para1 = `${sentences.slice(0, mid).join(". ")}.`;
  const para2 = `${sentences.slice(mid).join(". ")}`;

  useGSAP(
    () => {
      const container = milestonesRef.current;
      if (!container) return;

      const values = container.querySelectorAll<HTMLElement>(
        `.${styles.milestoneValue}`,
      );

      values.forEach((el, i) => {
        const target = Number.parseInt(el.textContent || "0", 10);
        const obj = { val: 0 };

        gsap.to(obj, {
          val: target,
          duration: 1.2,
          ease: "power2.out",
          delay: i * 0.1,
          snap: { val: 1 },
          scrollTrigger: {
            trigger: container,
            start: "top 80%",
            toggleActions: "play none none none",
          },
          onUpdate() {
            el.textContent = String(Math.round(obj.val));
          },
        });
      });
    },
    { scope: milestonesRef },
  );

  return (
    <MotionSection className={styles.section} data-theme="cream">
      <div className={styles.inner}>
        <div className={styles.labelRow}>
          <span className={styles.number}>(01)</span>
          <span className={styles.label}>La historia</span>
        </div>

        <div className={styles.content}>
          <div className={styles.pullQuote}>
            <span className={styles.quoteMarks}>"</span>
            <blockquote className={styles.quote}>
              El buen diseño no es un lujo — es la forma más honesta de
              comunicar.
            </blockquote>
          </div>

          <div className={styles.text}>
            <p className={styles.body}>{para1}</p>
            <p className={styles.body}>{para2}</p>
          </div>
        </div>

        <div ref={milestonesRef} className={styles.milestones}>
          <div className={styles.milestone}>
            <span className={styles.milestoneValue}>22</span>
            <span className={styles.milestoneLabel}>
              años diseñando
              <br />
              la imagen del GIFF
            </span>
          </div>
          <div className={styles.milestone}>
            <span className={styles.milestoneValue}>33</span>
            <span className={styles.milestoneLabel}>
              edición del Cervantino
              <br />— nuestro cartel
            </span>
          </div>
          <div className={styles.milestone}>
            <span className={styles.milestoneValue}>475</span>
            <span className={styles.milestoneLabel}>
              aniversario de SMA
              <br />— libro conmemorativo
            </span>
          </div>
          <div className={styles.milestone}>
            <span className={styles.milestoneValue}>5</span>
            <span className={styles.milestoneLabel}>
              libros de arte
              <br />
              publicados
            </span>
          </div>
        </div>
      </div>
    </MotionSection>
  );
}
