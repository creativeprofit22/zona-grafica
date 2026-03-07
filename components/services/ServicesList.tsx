import MotionSection from "@/components/animations/MotionSection";
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
          <MotionSection key={service.id} as="div">
            <ServiceCard service={service} reversed={i % 2 !== 0} />
          </MotionSection>
        ))}
      </div>
    </section>
  );
}
