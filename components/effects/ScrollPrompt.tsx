import styles from "./ScrollPrompt.module.css";

interface Props {
  className?: string;
  text?: string;
}

export default function ScrollPrompt({
  className,
  text = "Scroll para descubrir",
}: Props) {
  return (
    <div className={`${styles.prompt} ${className || ""}`}>
      <span className={styles.text}>{text}</span>
      <svg
        width={14}
        height={14}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={styles.chevron}
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>
  );
}
