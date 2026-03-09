import Image from "next/image";
import Link from "next/link";
import type { BlogPostMeta } from "@/lib/blog";
import styles from "./PostHeader.module.css";

interface Props {
  meta: BlogPostMeta;
}

export default function PostHeader({ meta }: Props) {
  const gradient = `linear-gradient(135deg, ${meta.gradientFrom}, ${meta.gradientTo})`;

  return (
    <header className={meta.image ? styles.headerSplit : styles.header}>
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <Link href="/blog" className={styles.breadcrumbLink}>
          ← Blog
        </Link>
      </nav>

      {meta.image ? (
        <>
          <div className={styles.titleCol}>
            <span className={styles.categoryVertical}>{meta.category}</span>
            <h1 className={styles.title}>{meta.title}</h1>
            <div className={styles.meta}>
              <time dateTime={meta.isoDate}>{meta.date}</time>
              <span className={styles.separator}>/</span>
              <span>{meta.readingTime}</span>
            </div>
          </div>
          <div className={styles.imageCol}>
            <Image
              src={meta.image}
              alt={meta.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className={styles.heroImg}
              priority
            />
          </div>
        </>
      ) : (
        <div className={styles.titleOnly}>
          <span className={styles.category}>{meta.category}</span>
          <h1 className={styles.titleLarge}>{meta.title}</h1>
          <div className={styles.meta}>
            <time dateTime={meta.isoDate}>{meta.date}</time>
            <span className={styles.separator}>/</span>
            <span>{meta.readingTime}</span>
          </div>
          <div className={styles.accent} style={{ background: gradient }} />
        </div>
      )}
    </header>
  );
}
