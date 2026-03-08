import Image from "next/image";
import ImageReveal from "@/components/animations/ImageReveal";
import type { Service } from "@/types/content";
import styles from "./ServiceCard.module.css";

export type ServiceCardLayout = "wide" | "compact" | "centered";

interface Props {
  service: Service;
  layout?: ServiceCardLayout;
  reversed?: boolean;
}

export default function ServiceCard({
  service,
  layout = "wide",
  reversed = false,
}: Props) {
  const layoutClass =
    layout === "compact"
      ? styles.cardCompact
      : layout === "centered"
        ? styles.cardCentered
        : styles.cardWide;

  return (
    <article
      id={service.slug}
      data-service={service.slug}
      className={`${styles.card} ${layoutClass} ${reversed ? styles.reversed : ""}`}
    >
      <div className={styles.numberCol}>
        <span className={styles.number}>{service.number}</span>
      </div>

      <div className={styles.imageCol}>
        {service.slug === "web" && (
          <div className={styles.chromeBar}>
            <span className={styles.chromeDot} />
            <span className={styles.chromeDot} />
            <span className={styles.chromeDot} />
          </div>
        )}
        <div className={styles.imageWrap}>
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
        {service.slug === "video" && (
          <div className={styles.playOverlay}>
            <svg
              className={styles.playIcon}
              viewBox="0 0 48 48"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="24" cy="24" r="23" stroke="white" strokeWidth="2" />
              <path d="M19 15L35 24L19 33V15Z" fill="white" />
            </svg>
          </div>
        )}
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
