"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import { useRef } from "react";
import { clients } from "@/data/clients";
import styles from "./ClientMarquee.module.css";

/* Two rows scrolling in opposite directions */
const ROW_1 = clients.slice(0, 7);
const ROW_2 = clients.slice(7);

/* Triple the items for seamless loop (original + 2 clones) */
function tripled<T>(arr: T[]): T[] {
  return [...arr, ...arr, ...arr];
}

function MarqueeRow({
  items,
  reverse,
  rowRef,
}: {
  items: typeof clients;
  reverse?: boolean;
  rowRef: React.RefObject<HTMLDivElement | null>;
}) {
  const tripleItems = tripled(items);

  return (
    <div className={styles.track} ref={rowRef}>
      <div
        className={`${styles.slide} ${reverse ? styles.slideReverse : ""}`}
        aria-hidden="true"
      >
        {tripleItems.map((client, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: tripled array needs index for unique keys
          <span key={`${client.name}-${i}`} className={styles.item}>
            <Image
              src={client.logo}
              alt={client.name}
              width={160}
              height={80}
              className={styles.logo}
              unoptimized={client.logo.endsWith(".svg")}
            />
          </span>
        ))}
      </div>
    </div>
  );
}

export default function ClientMarquee() {
  const sectionRef = useRef<HTMLElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const animateRow = (rowEl: HTMLDivElement | null, reverse: boolean) => {
        if (!rowEl) return;
        const slide = rowEl.querySelector(`.${styles.slide}`) as HTMLElement;
        if (!slide) return;

        // Each slide contains 3x the items. We scroll exactly 1/3 then reset.
        const distance = slide.scrollWidth / 3;

        gsap.to(slide, {
          x: reverse ? distance : -distance,
          duration: reverse ? 45 : 35,
          ease: "none",
          repeat: -1,
          modifiers: {
            x: gsap.utils.unitize((x: number) => {
              // Wrap so it loops seamlessly
              return reverse
                ? ((Number.parseFloat(String(x)) % distance) + distance) %
                    distance
                : -(
                    ((-Number.parseFloat(String(x)) % distance) + distance) %
                    distance
                  );
            }),
          },
        });
      };

      animateRow(row1Ref.current, false);
      animateRow(row2Ref.current, true);
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className={styles.wrapper}>
      <p className={styles.tagline}>Buenos clientes hacen buenas historias.</p>
      <div className={styles.marquee}>
        <MarqueeRow items={ROW_1} rowRef={row1Ref} />
        <MarqueeRow items={ROW_2} reverse rowRef={row2Ref} />
      </div>
    </section>
  );
}
