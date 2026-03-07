import MotionSection from "@/components/animations/MotionSection";
import type { CaseStudyStat } from "@/types/content";
import styles from "./CaseStudyNarrative.module.css";

interface Props {
  brief: string;
  approach: string;
  result: string;
  stats?: CaseStudyStat[];
}

const blocks = [
  { number: "01", heading: "El reto" },
  { number: "02", heading: "El enfoque" },
  { number: "03", heading: "El resultado" },
] as const;

export default function CaseStudyNarrative({
  brief,
  approach,
  result,
  stats,
}: Props) {
  const texts = [brief, approach, result];

  return (
    <>
      <MotionSection className={styles.section} data-theme="light">
        <div className={styles.inner}>
          {blocks.map((block, i) => (
            <article key={block.number} className={styles.block}>
              <div className={styles.numberLine}>
                <span className={styles.number}>({block.number})</span>
                <span className={styles.rule} />
              </div>
              <h2 className={styles.heading}>{block.heading}</h2>
              <p className={styles.text}>{texts[i]}</p>
            </article>
          ))}
        </div>
      </MotionSection>

      {stats && stats.length > 0 && (
        <MotionSection
          as="div"
          className={styles.statsSection}
          data-theme="light"
        >
          <div className={styles.statsInner}>
            {stats.map((stat) => (
              <div key={stat.label} className={styles.stat}>
                <span className={styles.statValue}>{stat.value}</span>
                <p className={styles.statLabel}>{stat.label}</p>
              </div>
            ))}
          </div>
        </MotionSection>
      )}
    </>
  );
}
