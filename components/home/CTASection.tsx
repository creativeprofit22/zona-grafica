"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import MagneticButton from "@/components/ui/MagneticButton";
import styles from "./CTASection.module.css";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  headline: string;
  whatsappLabel: string;
  whatsappHref: string;
  emailLabel: string;
  emailHref: string;
}

function splitHeadline(headline: string) {
  // Split "¿Tienes una idea? Platiquemos." into visual lines
  // Accent word: "Platiquemos." gets terracotta treatment
  const accentMatch = headline.match(/(Platiquemos\.?)/);
  if (!accentMatch) {
    // Fallback: split into ~2-3 word lines
    const words = headline.split(" ");
    const mid = Math.ceil(words.length / 2);
    return [
      { text: words.slice(0, mid).join(" "), accent: false },
      { text: words.slice(mid).join(" "), accent: false },
    ];
  }

  const idx = headline.indexOf(accentMatch[1]);
  const before = headline.slice(0, idx).trim();
  const accentText = accentMatch[1];

  // Split the "before" text into short visual lines (~2 words each)
  const words = before.split(" ").filter(Boolean);
  const lines: { text: string; accent: boolean }[] = [];
  for (let i = 0; i < words.length; i += 2) {
    lines.push({
      text: words.slice(i, i + 2).join(" "),
      accent: false,
    });
  }
  lines.push({ text: accentText, accent: true });

  return lines;
}

export default function CTASection({
  headline,
  whatsappLabel,
  whatsappHref,
  emailLabel,
  emailHref,
}: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const lines = splitHeadline(headline);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const lineEls = section.querySelectorAll(`.${styles.line}`);
      const actions = section.querySelector(`.${styles.actions}`);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          once: true,
        },
      });

      tl.from(lineEls, {
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
      });

      if (actions) {
        tl.from(
          actions,
          {
            y: 30,
            opacity: 0,
            duration: 0.6,
            ease: "power3.out",
          },
          "-=0.3",
        );
      }
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className={styles.section} data-theme="dark">
      <div className={styles.inner}>
        <h2 className={styles.headline}>
          {lines.map((line) => (
            <span
              key={line.text}
              className={`${styles.line} ${line.accent ? styles.accent : ""}`}
            >
              {line.text}
            </span>
          ))}
        </h2>

        <div className={styles.actions}>
          <MagneticButton>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.whatsapp}
            >
              <svg
                width={20}
                height={20}
                viewBox="0 0 24 24"
                fill="currentColor"
                className={styles.icon}
                aria-hidden="true"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              {whatsappLabel}
            </a>
          </MagneticButton>

          <MagneticButton>
            <a href={emailHref} className={styles.emailBracket}>
              <svg
                width={18}
                height={18}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className={styles.icon}
                aria-hidden="true"
              >
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M22 7l-10 7L2 7" />
              </svg>
              {emailLabel}
            </a>
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
