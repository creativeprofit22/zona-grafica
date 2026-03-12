"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";
import { Link } from "@/i18n/navigation";
import type { CaseStudy, Project } from "@/types/content";
import styles from "./CaseStudyHero.module.css";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  project: Project | CaseStudy;
}

export default function CaseStudyHero({ project }: Props) {
  const heroImage =
    "heroImage" in project ? project.heroImage : project.thumbnail;
  const sectionRef = useRef<HTMLElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const imageWrap = imageWrapRef.current;
      if (!section || !imageWrap) return;

      // Parallax — desktop only
      const mm = gsap.matchMedia();
      mm.add("(min-width: 769px)", () => {
        gsap.to(imageWrap, {
          y: -60,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      // Content stagger entrance on load
      const items = section.querySelectorAll(`.${styles.animItem}`);
      if (items.length) {
        gsap.fromTo(
          items,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.1,
          },
        );
      }

      // Tags stagger (faster cascade)
      const tags = section.querySelectorAll(`.${styles.tag}`);
      if (tags.length) {
        gsap.fromTo(
          tags,
          { y: 15, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            ease: "power2.out",
            stagger: 0.05,
            delay: 0.6,
          },
        );
      }
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className={styles.hero}>
      <div ref={imageWrapRef} className={styles.imageWrap}>
        <Image
          src={heroImage}
          alt={project.title}
          fill
          fetchPriority="high"
          sizes="100vw"
          className={styles.image}
        />
        <div className={styles.overlay} />
      </div>

      <div className={styles.content}>
        <Link
          href="/portafolio"
          className={`${styles.backLink} ${styles.animItem}`}
        >
          <svg
            width={14}
            height={14}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={styles.backArrow}
            aria-hidden="true"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Portafolio
        </Link>

        <div className={`${styles.titleBlock} ${styles.animItem}`}>
          <h1 className={styles.title}>{project.title}</h1>

          <div className={styles.annotation}>
            <span className={styles.category}>({project.category})</span>
            <span className={styles.separator}>·</span>
            <span className={styles.year}>{project.year}</span>
          </div>
        </div>

        <p className={`${styles.description} ${styles.animItem}`}>
          {project.description}
        </p>

        <div className={styles.tags}>
          {project.tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
