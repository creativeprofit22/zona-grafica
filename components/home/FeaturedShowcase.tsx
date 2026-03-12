"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";
import ImageReveal from "@/components/animations/ImageReveal";
import { Link } from "@/i18n/navigation";
import type { Project } from "@/types/content";
import styles from "./FeaturedShowcase.module.css";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  projects: Project[];
}

const categoryLabels: Record<string, string> = {
  branding: "branding",
  editorial: "editorial",
  web: "web",
  fotografia: "fotografía",
  ilustracion: "ilustración",
  carteleria: "cartelería",
  poster: "poster / cartel",
  video: "video",
};

export default function FeaturedShowcase({ projects }: Props) {
  const containerRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      const track = trackRef.current;
      if (!container || !track) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 769px)", () => {
        const spreads = track.querySelectorAll<HTMLElement>(
          `.${styles.spread}`,
        );
        if (!spreads.length) return;

        const totalWidth = track.scrollWidth - container.offsetWidth;

        /* Horizontal scroll driven by vertical scroll */
        const scrollTween = gsap.to(track, {
          x: -totalWidth,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top top",
            end: () => `+=${totalWidth}`,
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        /* Each spread's content fades in as it enters viewport */
        spreads.forEach((spread, idx) => {
          const content = spread.querySelector(`.${styles.spreadContent}`);

          if (content && idx > 0) {
            gsap.fromTo(
              content,
              { opacity: 0, y: 30 },
              {
                opacity: 1,
                y: 0,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: spread,
                  containerAnimation: scrollTween,
                  start: "left 75%",
                  end: "left 45%",
                  scrub: true,
                },
              },
            );
          }
        });
      });

      /* Mobile: simple reveal on scroll */
      mm.add("(max-width: 768px)", () => {
        const cards = container.querySelectorAll<HTMLElement>(
          `.${styles.mobileCard}`,
        );
        for (const card of cards) {
          gsap.fromTo(
            card,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out",
              scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none none",
              },
            },
          );
        }
      });
    },
    { scope: containerRef },
  );

  return (
    <section ref={containerRef} className={styles.section}>
      {/* Section header */}
      <div className={styles.header}>
        <span className={styles.label}>(portafolio)</span>
        <h2 className={styles.title}>Trabajo seleccionado</h2>
      </div>

      {/* Desktop: horizontal scroll track */}
      <div className={styles.track} ref={trackRef}>
        {projects.map((project, i) => (
          <Link
            key={project.id}
            href={`/portafolio/${project.slug}`}
            className={styles.spread}
            data-cursor-project
          >
            {/* Left: full-bleed image */}
            <div className={styles.spreadImage}>
              <div className={styles.spreadImageInner}>
                <Image
                  src={project.thumbnail}
                  alt={project.title}
                  fill
                  sizes="60vw"
                  className={styles.image}
                />
              </div>
            </div>

            {/* Right: editorial metadata */}
            <div className={styles.spreadContent}>
              <span className={styles.projectIndex}>
                {String(i + 1).padStart(2, "0")}
              </span>

              <div className={styles.projectMeta}>
                <span className={styles.projectCategory}>
                  ({categoryLabels[project.category] || project.category})
                </span>
                <span className={styles.projectDot}>·</span>
                <span className={styles.projectLocation}>Hecho en SMA</span>
                <span className={styles.projectDot}>·</span>
                <span className={styles.projectYear}>{project.year}</span>
              </div>

              <h3 className={styles.projectTitle}>{project.title}</h3>

              <p className={styles.projectDescription}>{project.description}</p>

              <div className={styles.projectCta}>
                <span className={styles.projectCtaText}>Ver proyecto</span>
                <span className={styles.projectCtaArrow}>→</span>
              </div>
            </div>
          </Link>
        ))}

        {/* End slide: view all */}
        <div className={styles.endSlide}>
          <div className={styles.endContent}>
            <p className={styles.endLabel}>(y muchos más)</p>
            <Link href="/portafolio" className={styles.endLink}>
              Ver todo el portafolio
              <span className={styles.endArrow}>→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile: stacked cards */}
      <div className={styles.mobileStack}>
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/portafolio/${project.slug}`}
            className={styles.mobileCard}
          >
            <ImageReveal direction="left" className={styles.mobileCardImage}>
              <Image
                src={project.thumbnail}
                alt={project.title}
                fill
                sizes="100vw"
                className={styles.image}
              />
            </ImageReveal>

            <div className={styles.mobileCardContent}>
              <div className={styles.mobileCardMeta}>
                <span className={styles.projectCategory}>
                  ({categoryLabels[project.category] || project.category})
                </span>
                <span className={styles.projectDot}>·</span>
                <span className={styles.projectYear}>{project.year}</span>
              </div>

              <h3 className={styles.mobileCardTitle}>{project.title}</h3>

              <p className={styles.mobileCardDescription}>
                {project.description}
              </p>

              <span className={styles.mobileCardArrow}>Ver →</span>
            </div>
          </Link>
        ))}

        <div className={styles.mobileViewAll}>
          <Link href="/portafolio" className={styles.endLink}>
            Ver todo el portafolio
            <span className={styles.endArrow}>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
