import MotionSection from "@/components/animations/MotionSection";
import type { ValueItem } from "@/types/content";
import styles from "./ValuesGrid.module.css";

interface Props {
  values: ValueItem[];
}

export default function ValuesGrid({ values }: Props) {
  return (
    <MotionSection className={styles.section} stagger>
      <div className={styles.inner}>
        <div className={styles.labelRow}>
          <span className={styles.number}>(02)</span>
          <span className={styles.label}>Lo que nos guía</span>
        </div>

        <div className={styles.list}>
          {values.map((value, i) => (
            <div key={value.title} className={styles.item}>
              <div className={styles.itemNumber}>
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className={styles.itemContent}>
                <h3 className={styles.itemTitle}>{value.title}</h3>
                <p className={styles.itemDescription}>{value.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MotionSection>
  );
}
