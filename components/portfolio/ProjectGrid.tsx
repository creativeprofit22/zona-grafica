"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import {
  type ReactNode,
  type RefObject,
  useCallback,
  useRef,
  useState,
} from "react";
import ImageReveal from "@/components/animations/ImageReveal";
import type { Project } from "@/types/content";
import styles from "./ProjectGrid.module.css";
import VideoEmbed, { PlayOverlay } from "./VideoEmbed";

gsap.registerPlugin(ScrollTrigger);

/* ─── Custom Reveal: Photography "film develop" effect ──── */
function DevelopReveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      gsap.fromTo(
        el,
        { filter: "brightness(3) contrast(0.3) sepia(1)", opacity: 0 },
        {
          filter: "brightness(1) contrast(1) sepia(0)",
          opacity: 1,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        },
      );
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={`${styles.developReveal} ${className ?? ""}`}>
      {children}
    </div>
  );
}

/* ─── Custom Reveal: Web "center expand" effect ─────────── */
function CenterReveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      gsap.fromTo(
        el,
        { clipPath: "inset(50% 50% 50% 50%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1,
          ease: "power3.inOut",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        },
      );
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      className={className}
      style={{ clipPath: "inset(50% 50% 50% 50%)" }}
    >
      {children}
    </div>
  );
}

/* ─── Custom Reveal: Editorial diagonal wipe ────────────── */
function DiagonalReveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      gsap.fromTo(
        el,
        { clipPath: "polygon(0 0, 0 0, -20% 100%, -20% 100%)" },
        {
          clipPath: "polygon(0 0, 120% 0, 100% 100%, -20% 100%)",
          duration: 1.2,
          ease: "power3.inOut",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        },
      );
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      className={className}
      style={{ clipPath: "polygon(0 0, 0 0, -20% 100%, -20% 100%)" }}
    >
      {children}
    </div>
  );
}

/* ─── Category → Reveal wrapper ─────────────────────────── */
function CategoryImageWrap({
  category,
  children,
  className,
  index,
}: {
  category: string;
  children: ReactNode;
  className?: string;
  index: number;
}) {
  switch (category) {
    case "fotografia":
      return <DevelopReveal className={className}>{children}</DevelopReveal>;
    case "web":
      return <CenterReveal className={className}>{children}</CenterReveal>;
    case "editorial":
      return <DiagonalReveal className={className}>{children}</DiagonalReveal>;
    case "branding":
      return (
        <ImageReveal direction="left" className={className}>
          {children}
        </ImageReveal>
      );
    case "poster":
      return (
        <ImageReveal direction="bottom" className={className}>
          {children}
        </ImageReveal>
      );
    case "video":
      return (
        <ImageReveal direction="left" delay={0.1} className={className}>
          {children}
        </ImageReveal>
      );
    default:
      return (
        <ImageReveal
          direction={index % 2 === 0 ? "left" : "bottom"}
          delay={index % 2 === 0 ? 0 : 0.1}
          className={className}
        >
          {children}
        </ImageReveal>
      );
  }
}

interface Props {
  projects: Project[];
  gridRef?: RefObject<HTMLDivElement | null>;
}

function VideoCard({ project, index }: { project: Project; index: number }) {
  const [playing, setPlaying] = useState(false);

  const handlePlay = useCallback(() => {
    setPlaying(true);
  }, []);

  const cardClass = `${styles.card} ${project.featured ? styles.cardFeatured : styles.cardStandard}`;

  if (playing && project.videoUrl) {
    return (
      <div
        className={cardClass}
        data-flip-id={project.id}
        data-category={project.category}
      >
        <VideoEmbed url={project.videoUrl} title={project.title} />
        <div className={styles.info}>
          <h3 className={styles.title}>{project.title}</h3>
          <div className={styles.meta}>
            <span className={styles.category}>{project.category}</span>
            <span className={styles.separator}>·</span>
            <span className={styles.year}>{project.year}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cardClass}
      data-flip-id={project.id}
      data-category={project.category}
      data-cursor-project
    >
      <CategoryImageWrap
        category={project.category}
        index={index}
        className={styles.imageWrap}
      >
        <Image
          src={project.thumbnail}
          alt={project.title}
          fill
          sizes={
            project.featured
              ? "(max-width: 768px) 100vw, 66vw"
              : "(max-width: 768px) 100vw, 33vw"
          }
          className={styles.image}
        />
        <PlayOverlay onClick={handlePlay} />
      </CategoryImageWrap>

      <div className={styles.info}>
        <h3 className={styles.title}>{project.title}</h3>
        <div className={styles.meta}>
          <span className={styles.category}>{project.category}</span>
          <span className={styles.separator}>·</span>
          <span className={styles.year}>{project.year}</span>
        </div>
      </div>
    </div>
  );
}

export default function ProjectGrid({ projects, gridRef }: Props) {
  if (projects.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No hay proyectos en esta categoría.</p>
      </div>
    );
  }

  return (
    <div className={styles.grid} ref={gridRef} data-cursor-label="Ver">
      {projects.map((project, i) =>
        project.videoUrl ? (
          <VideoCard key={project.id} project={project} index={i} />
        ) : (
          <Link
            key={project.id}
            href={`/portafolio/${project.slug}`}
            className={`${styles.card} ${project.featured ? styles.cardFeatured : styles.cardStandard}`}
            data-flip-id={project.id}
            data-category={project.category}
            data-cursor-project
          >
            <CategoryImageWrap
              category={project.category}
              index={i}
              className={styles.imageWrap}
            >
              <Image
                src={project.thumbnail}
                alt={project.title}
                fill
                sizes={
                  project.featured
                    ? "(max-width: 768px) 100vw, 66vw"
                    : "(max-width: 768px) 100vw, 33vw"
                }
                className={styles.image}
              />
            </CategoryImageWrap>

            <div className={styles.info}>
              <h3 className={styles.title}>{project.title}</h3>
              <div className={styles.meta}>
                <span className={styles.category}>{project.category}</span>
                <span className={styles.separator}>·</span>
                <span className={styles.year}>{project.year}</span>
              </div>
            </div>
          </Link>
        ),
      )}
    </div>
  );
}
