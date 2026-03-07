import MotionSection from "@/components/animations/MotionSection";
import styles from "./AboutHero.module.css";

interface Props {
  headline: string;
  intro: string;
}

export default function AboutHero({ headline, intro }: Props) {
  // Split headline for editorial treatment
  // "30 años haciendo diseño desde San Miguel de Allende"
  const parts = headline.split("desde");
  const mainLine = parts[0]?.trim() ?? headline;
  const locationLine = parts[1] ? `desde ${parts[1].trim()}` : null;

  return (
    <MotionSection className={styles.hero}>
      <div className={styles.inner}>
        <div className={styles.topRow}>
          <span className={styles.annotation}>(nosotros)</span>
          <span className={styles.since}>Desde 1993</span>
        </div>

        <h1 className={styles.title}>
          <span className={styles.mainLine}>{mainLine}</span>
          {locationLine && (
            <span className={styles.locationLine}>{locationLine}</span>
          )}
        </h1>

        <div className={styles.introWrap}>
          <p className={styles.intro}>{intro}</p>
          <div className={styles.sectors}>
            <span className={styles.sectorsLabel}>Nuestros sectores</span>
            <div className={styles.sectorList}>
              <span className={styles.sector}>Cultura y Educación</span>
              <span className={styles.sectorDot}>·</span>
              <span className={styles.sector}>Iniciativa Privada</span>
              <span className={styles.sectorDot}>·</span>
              <span className={styles.sector}>Turismo</span>
              <span className={styles.sectorDot}>·</span>
              <span className={styles.sector}>Arte</span>
            </div>
          </div>
        </div>
      </div>
    </MotionSection>
  );
}
