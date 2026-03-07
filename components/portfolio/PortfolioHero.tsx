import MotionSection from "@/components/animations/MotionSection";
import styles from "./PortfolioHero.module.css";

interface Props {
  title: string;
  description: string;
  projectCount: number;
}

export default function PortfolioHero({
  title,
  description,
  projectCount,
}: Props) {
  return (
    <MotionSection className={styles.hero}>
      <div className={styles.inner}>
        <span className="section-number">
          {String(projectCount).padStart(2, "0")} proyectos
        </span>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.description}>{description}</p>
      </div>
    </MotionSection>
  );
}
