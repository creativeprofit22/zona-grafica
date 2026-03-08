"use client";

import ImageReveal from "@/components/animations/ImageReveal";
import type { Project } from "@/types/content";
import Image from "next/image";
import Link from "next/link";
import type { RefObject } from "react";
import styles from "./ProjectGrid.module.css";

interface Props {
  projects: Project[];
  gridRef?: RefObject<HTMLDivElement | null>;
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
    <div className={styles.grid} ref={gridRef}>
      {projects.map((project, i) => (
        <Link
          key={project.id}
          href={`/portafolio/${project.slug}`}
          className={styles.card}
          data-flip-id={project.id}
          data-cursor-project
        >
          <ImageReveal
            direction={i % 2 === 0 ? "left" : "bottom"}
            delay={i % 2 === 0 ? 0 : 0.1}
            className={styles.imageWrap}
          >
            <Image
              src={project.thumbnail}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className={styles.image}
            />
          </ImageReveal>

          <div className={styles.info}>
            <h3 className={styles.title}>{project.title}</h3>
            <div className={styles.meta}>
              <span className={styles.category}>{project.category}</span>
              <span className={styles.separator}>·</span>
              <span className={styles.year}>{project.year}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
