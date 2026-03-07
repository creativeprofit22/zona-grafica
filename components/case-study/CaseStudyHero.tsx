import type { CaseStudy, Project } from "@/types/content";
import Image from "next/image";
import Link from "next/link";
import styles from "./CaseStudyHero.module.css";

interface Props {
  project: Project | CaseStudy;
}

export default function CaseStudyHero({ project }: Props) {
  const heroImage =
    "heroImage" in project ? project.heroImage : project.thumbnail;

  return (
    <section className={styles.hero}>
      <div className={styles.imageWrap}>
        <Image
          src={heroImage}
          alt={project.title}
          fill
          priority
          sizes="100vw"
          className={styles.image}
        />
        <div className={styles.overlay} />
      </div>

      <div className={styles.content}>
        <Link href="/portafolio" className={styles.backLink}>
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

        <div className={styles.titleBlock}>
          <h1 className={styles.title}>{project.title}</h1>

          <div className={styles.annotation}>
            <span className={styles.category}>({project.category})</span>
            <span className={styles.separator}>·</span>
            <span className={styles.year}>{project.year}</span>
          </div>
        </div>

        <p className={styles.description}>{project.description}</p>

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
