import type { Service } from "@/types/content";
import styles from "./ServiceCard.module.css";

interface Props {
  service: Service;
  reversed?: boolean;
}

export default function ServiceCard({ service, reversed = false }: Props) {
  return (
    <article
      id={service.slug}
      className={`${styles.card} ${reversed ? styles.reversed : ""}`}
    >
      <div className={styles.numberCol}>
        <span className={styles.number}>{service.number}</span>
      </div>

      <div className={styles.content}>
        <h2 className={styles.title}>{service.title}</h2>
        <p className={styles.description}>{service.description}</p>

        <ul className={styles.process}>
          {service.process.map((step) => (
            <li key={step} className={styles.step}>
              {step}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
