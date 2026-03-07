import styles from "./BlogHero.module.css";

interface Props {
  postCount: number;
}

export default function BlogHero({ postCount }: Props) {
  return (
    <section className={styles.hero}>
      <div className={styles.inner}>
        <span className={styles.annotation}>
          ({String(postCount).padStart(2, "0")} artículos)
        </span>
        <h1 className={styles.title}>Blog</h1>
        <p className={styles.subtitle}>
          Ideas, proceso y reflexiones sobre diseño, branding y creatividad
          desde San Miguel de Allende.
        </p>
        <div className={styles.rule} />
      </div>
    </section>
  );
}
