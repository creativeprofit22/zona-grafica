import MotionSection from "@/components/animations/MotionSection";
import type { Project } from "@/types/content";
import styles from "./ProjectDetail.module.css";

interface Props {
  project: Project;
}

export default function ProjectDetail({ project }: Props) {
  return (
    <MotionSection className={styles.section} data-theme="light">
      <div className={styles.inner}>
        <p className={styles.description}>{project.description}</p>

        <div className={styles.divider} />

        <div className={styles.detailGrid}>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Cliente</span>
            <span className={styles.detailValue}>{project.client}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Categoría</span>
            <span className={styles.detailValue}>{project.category}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Año</span>
            <span className={styles.detailValue}>{project.year}</span>
          </div>
        </div>
      </div>
    </MotionSection>
  );
}
