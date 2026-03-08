import Image from "next/image";
import Link from "next/link";
import ImageReveal from "@/components/animations/ImageReveal";
import MotionSection from "@/components/animations/MotionSection";
import type { Project } from "@/types/content";
import styles from "./RelatedProjects.module.css";

interface Props {
  projects: Project[];
}

export default function RelatedProjects({ projects }: Props) {
  if (projects.length === 0) return null;

  return (
    <MotionSection className={styles.section} data-theme="light">
      <div className={styles.inner}>
        <div className={styles.header}>
          <span className={styles.label}>Más proyectos</span>
          <h2 className={styles.heading}>También te puede interesar</h2>
        </div>

        <div className={styles.grid}>
          {projects.map((project, i) => (
            <Link
              key={project.id}
              href={`/portafolio/${project.slug}`}
              className={styles.card}
              data-cursor-project
            >
              <ImageReveal
                direction={i % 2 === 0 ? "left" : "bottom"}
                delay={i * 0.1}
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

              <div className={styles.cardContent}>
                <span className={styles.cardCategory}>
                  ({project.category})
                </span>
                <h3 className={styles.cardTitle}>{project.title}</h3>
                <span className={styles.cardYear}>{project.year}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </MotionSection>
  );
}
