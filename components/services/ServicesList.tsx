import type { Service } from "@/types/content";
import ServiceCard from "./ServiceCard";
import styles from "./ServicesList.module.css";

interface Props {
  services: Service[];
}

export default function ServicesList({ services }: Props) {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        {services.map((service, i) => (
          <ServiceCard
            key={service.id}
            service={service}
            reversed={i % 2 !== 0}
          />
        ))}
      </div>
    </section>
  );
}
