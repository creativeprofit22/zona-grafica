import MotionSection from "@/components/animations/MotionSection";
import styles from "./Marquee.module.css";

const DEFAULT_ITEMS = [
  "AI Agents",
  "Custom Software",
  "Revenue Growth",
  "Go-to-Market Strategy",
  "Automation",
  "Digital Transformation",
];

export default function Marquee({
  items = DEFAULT_ITEMS,
}: { items?: string[] }) {
  // Duplicate items to fill the seamless loop
  const repeated = [...items, ...items];

  return (
    <MotionSection as="div" className={styles.wrapper}>
      <div className={styles.track}>
        {repeated.map((item, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static repeated content
          <span key={i}>{item}</span>
        ))}
      </div>
    </MotionSection>
  );
}
