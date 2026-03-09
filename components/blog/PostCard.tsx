import Image from "next/image";
import Link from "next/link";
import type { BlogPostMeta } from "@/lib/blog";
import styles from "./PostCard.module.css";

interface Props {
  post: BlogPostMeta;
}

export default function PostCard({ post }: Props) {
  return (
    <Link href={`/blog/${post.slug}`} className={styles.card}>
      <div className={styles.visual}>
        {post.image ? (
          <Image
            src={post.image}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className={styles.image}
          />
        ) : (
          <div
            className={styles.gradient}
            style={{
              background: `linear-gradient(135deg, ${post.gradientFrom}, ${post.gradientTo})`,
            }}
          />
        )}
      </div>

      <div className={styles.content}>
        <div className={styles.top}>
          <span className={styles.category}>{post.category}</span>
          <div className={styles.meta}>
            <time dateTime={post.isoDate}>{post.date}</time>
            <span className={styles.dot}>·</span>
            <span>{post.readingTime}</span>
          </div>
        </div>

        <h3 className={styles.title}>{post.title}</h3>
        <p className={styles.excerpt}>{post.excerpt}</p>

        <span className={styles.readMore}>Leer artículo →</span>
      </div>
    </Link>
  );
}
