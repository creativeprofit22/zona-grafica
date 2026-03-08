import styles from "./SectionNumber.module.css";

interface SectionNumberProps {
  n: number;
}

export default function SectionNumber({ n }: SectionNumberProps) {
  return (
    <span className={styles.number} aria-hidden="true">
      {String(n).padStart(2, "0")}
    </span>
  );
}
