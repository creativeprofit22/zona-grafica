import ImageReveal from "@/components/animations/ImageReveal";
import type { Service } from "@/types/content";
import Image from "next/image";
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

      <div className={styles.imageCol}>
        <ImageReveal direction={reversed ? "right" : "left"} delay={0.1}>
          <Image
            src={service.image}
            alt={service.title}
            fill
            sizes="(max-width: 768px) 100vw, 40vw"
            style={{ objectFit: "cover" }}
          />
        </ImageReveal>
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
