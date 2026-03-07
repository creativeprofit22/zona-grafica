import type { BlogPostMeta } from "@/lib/blog";
import Link from "next/link";
import styles from "./PostHeader.module.css";

interface Props {
  meta: BlogPostMeta;
}

export default function PostHeader({ meta }: Props) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/blog" className={styles.breadcrumbLink}>
            ← Blog
          </Link>
        </nav>

        <span className={styles.category}>{meta.category}</span>
        <h1 className={styles.title}>{meta.title}</h1>

        <div className={styles.meta}>
          <time dateTime={meta.isoDate}>{meta.date}</time>
          <span className={styles.dot}>·</span>
          <span>{meta.readingTime}</span>
        </div>

        <div
          className={styles.accent}
          style={{
            background: `linear-gradient(135deg, ${meta.gradientFrom}, ${meta.gradientTo})`,
          }}
        />
      </div>
    </header>
  );
}
