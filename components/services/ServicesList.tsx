import MotionSection from "@/components/animations/MotionSection";
import type { Service } from "@/types/content";
import ServiceCard from "./ServiceCard";
import type { ServiceCardLayout } from "./ServiceCard";
import styles from "./ServicesList.module.css";

interface Props {
  services: Service[];
}

function getLayout(index: number): ServiceCardLayout {
  if (index <= 1) return "wide";
  if (index <= 3) return "compact";
  if (index === 4) return "centered";
  return "wide";
}

export default function ServicesList({ services }: Props) {
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < services.length) {
    const layout = getLayout(i);

    if (
      layout === "compact" &&
      i + 1 < services.length &&
      getLayout(i + 1) === "compact"
    ) {
      elements.push(
        <div key={`compact-${i}`} className={styles.compactRow}>
          <MotionSection as="div">
            <ServiceCard service={services[i]} layout="compact" />
          </MotionSection>
          <MotionSection as="div">
            <ServiceCard service={services[i + 1]} layout="compact" />
          </MotionSection>
        </div>,
      );
      i += 2;
    } else {
      const reversed = layout === "wide" && i >= 5;
      elements.push(
        <MotionSection key={services[i].id} as="div">
          <ServiceCard
            service={services[i]}
            layout={layout}
            reversed={reversed}
          />
        </MotionSection>,
      );
      i += 1;
    }
  }

  return (
    <section className={styles.section}>
      <div className={styles.inner}>{elements}</div>
    </section>
  );
}
