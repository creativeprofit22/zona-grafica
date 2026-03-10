"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import {
  type ReactNode,
  type RefObject,
  type SyntheticEvent,
  useCallback,
  useRef,
  useState,
} from "react";
import ParallaxDrift from "@/components/animations/ParallaxDrift";
import type { Project } from "@/types/content";
import styles from "./ProjectGrid.module.css";
import VideoEmbed, { PlayOverlay } from "./VideoEmbed";

gsap.registerPlugin(ScrollTrigger);

/* ─── Idle Float for Featured Images (desktop only) ────── */
function useIdleFloat(ref: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const mm = gsap.matchMedia();
      mm.add(
        {
          desktop: "(min-width: 769px)",
          reducedMotion: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { reducedMotion } = context.conditions as {
            desktop: boolean;
            reducedMotion: boolean;
          };
          if (reducedMotion) return;

          gsap.to(el, {
            y: 5,
            duration: 4,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          });
        },
      );
    },
    { scope: ref },
  );
}

/* ─── Magnetic Tilt Hover (desktop only) ───────────────── */
function useTiltEffect(cardRef: RefObject<HTMLElement | null>) {
  const xTo = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const yTo = useRef<ReturnType<typeof gsap.quickTo> | null>(null);

  useGSAP(
    () => {
      const el = cardRef.current;
      if (!el) return;

      const mm = gsap.matchMedia();
      mm.add("(min-width: 769px)", () => {
        gsap.set(el, { transformPerspective: 800 });
        xTo.current = gsap.quickTo(el, "rotateY", {
          duration: 0.6,
          ease: "power3.out",
        });
        yTo.current = gsap.quickTo(el, "rotateX", {
          duration: 0.6,
          ease: "power3.out",
        });

        return () => {
          gsap.set(el, { clearProps: "transform" });
          xTo.current = null;
          yTo.current = null;
        };
      });
    },
    { scope: cardRef },
  );

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!xTo.current || !yTo.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    xTo.current(x * 8);
    yTo.current(y * -8);
  }, []);

  const onMouseLeave = useCallback(() => {
    xTo.current?.(0);
    yTo.current?.(0);
  }, []);

  return { onMouseMove, onMouseLeave };
}

/* ─── Idle Float Wrapper for Featured Cards ────────────── */
function IdleFloat({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useIdleFloat(ref);
  return <div ref={ref}>{children}</div>;
}

/* ─── Diagonal Wipe Reveal for All Portfolio Cards ───────── */
function DiagonalReveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
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
          delay,
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
    <div ref={ref} className={`${styles.diagonalReveal} ${className ?? ""}`}>
      {children}
    </div>
  );
}

function CategoryImageWrap({
  children,
  className,
  staggerIndex = 0,
}: {
  category: string;
  children: ReactNode;
  className?: string;
  index: number;
  staggerIndex?: number;
}) {
  const delay = staggerIndex * 0.15;

  return (
    <DiagonalReveal className={className} delay={delay}>
      {children}
    </DiagonalReveal>
  );
}

/* ─── YouTube Thumbnail with quality fallback ─────────── */
function YouTubeThumbnail({
  src,
  alt,
  fill,
  sizes,
  className,
}: {
  src: string;
  alt: string;
  fill: boolean;
  sizes: string;
  className?: string;
}) {
  const [imgSrc, setImgSrc] = useState(src);

  const handleError = useCallback((e: SyntheticEvent<HTMLImageElement>) => {
    const el = e.currentTarget;
    // If maxresdefault failed, try hqdefault
    if (el.src.includes("maxresdefault")) {
      setImgSrc(el.src.replace("maxresdefault", "hqdefault"));
    }
  }, []);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill={fill}
      sizes={sizes}
      className={className}
      onError={handleError}
    />
  );
}

interface Props {
  projects: Project[];
  gridRef?: RefObject<HTMLDivElement | null>;
}

function VideoCard({
  project,
  index,
  staggerIndex,
}: {
  project: Project;
  index: number;
  staggerIndex: number;
}) {
  const [playing, setPlaying] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const { onMouseMove, onMouseLeave } = useTiltEffect(cardRef);

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
    // biome-ignore lint/a11y/noStaticElementInteractions: decorative tilt effect
    <div
      ref={cardRef}
      className={cardClass}
      data-flip-id={project.id}
      data-category={project.category}
      data-cursor-project
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {project.featured ? (
        <IdleFloat>
          <ParallaxDrift distance={20}>
            <CategoryImageWrap
              category={project.category}
              index={index}
              staggerIndex={staggerIndex}
              className={styles.imageWrap}
            >
              <YouTubeThumbnail
                src={project.thumbnail}
                alt={project.title}
                fill
                sizes="(max-width: 768px) 100vw, 66vw"
                className={styles.image}
              />
              <PlayOverlay onClick={handlePlay} />
            </CategoryImageWrap>
          </ParallaxDrift>
        </IdleFloat>
      ) : (
        <CategoryImageWrap
          category={project.category}
          index={index}
          staggerIndex={staggerIndex}
          className={styles.imageWrap}
        >
          <YouTubeThumbnail
            src={project.thumbnail}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className={styles.image}
          />
          <PlayOverlay onClick={handlePlay} />
        </CategoryImageWrap>
      )}

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

function ProjectCard({
  project,
  index,
  staggerIndex,
}: {
  project: Project;
  index: number;
  staggerIndex: number;
}) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const { onMouseMove, onMouseLeave } = useTiltEffect(cardRef);

  return (
    <Link
      ref={cardRef}
      href={`/portafolio/${project.slug}`}
      className={`${styles.card} ${project.featured ? styles.cardFeatured : styles.cardStandard}`}
      data-flip-id={project.id}
      data-category={project.category}
      data-cursor-project
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {project.featured ? (
        <IdleFloat>
          <ParallaxDrift distance={20}>
            <CategoryImageWrap
              category={project.category}
              index={index}
              staggerIndex={staggerIndex}
              className={styles.imageWrap}
            >
              <Image
                src={project.thumbnail}
                alt={project.title}
                fill
                sizes="(max-width: 768px) 100vw, 66vw"
                className={styles.image}
              />
            </CategoryImageWrap>
          </ParallaxDrift>
        </IdleFloat>
      ) : (
        <CategoryImageWrap
          category={project.category}
          index={index}
          staggerIndex={staggerIndex}
          className={styles.imageWrap}
        >
          <Image
            src={project.thumbnail}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className={styles.image}
          />
        </CategoryImageWrap>
      )}

      <div className={styles.info}>
        <h3 className={styles.title}>{project.title}</h3>
        <div className={styles.meta}>
          <span className={styles.category}>{project.category}</span>
          <span className={styles.separator}>·</span>
          <span className={styles.year}>{project.year}</span>
        </div>
      </div>
    </Link>
  );
}

/** Compute stagger index based on grid position (column within row) */
function getStaggerIndex(index: number, projects: Project[]): number {
  let col = 0;
  for (let i = 0; i < index; i++) {
    col += projects[i].featured ? 8 : 4;
    if (col >= 12) col = col % 12;
  }
  // Map column position to stagger slot (0-2)
  if (col === 0) return 0;
  if (col <= 4) return 1;
  return 2;
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
      {projects.map((project, i) => {
        const stagger = getStaggerIndex(i, projects);

        return project.videoUrl ? (
          <VideoCard
            key={project.id}
            project={project}
            index={i}
            staggerIndex={stagger}
          />
        ) : (
          <ProjectCard
            key={project.id}
            project={project}
            index={i}
            staggerIndex={stagger}
          />
        );
      })}
    </div>
  );
}
