import MotionSection from "@/components/animations/MotionSection";
import styles from "./ServicesHero.module.css";

interface Props {
  serviceCount: number;
}

export default function ServicesHero({ serviceCount }: Props) {
  return (
    <MotionSection className={styles.hero}>
      <div className={styles.inner}>
        <div className={styles.topRow}>
          <span className={styles.count}>
            ({String(serviceCount).padStart(2, "0")})
          </span>
          <span className={styles.annotation}>servicios creativos</span>
        </div>
        <h1 className={styles.title}>
          Lo que
          <br />
          <span className={styles.titleAccent}>hacemos</span>
        </h1>
        <p className={styles.subtitle}>
          Cada servicio es un proceso — no una lista de precios. Investigamos,
          diseñamos, iteramos y entregamos piezas que funcionan.
        </p>
      </div>
    </MotionSection>
  );
}
