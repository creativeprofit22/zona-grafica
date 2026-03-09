import Image from "next/image";
import Link from "next/link";
import MotionSection from "@/components/animations/MotionSection";
import type { BlogPostMeta } from "@/lib/blog";
import styles from "./PostGrid.module.css";

interface Props {
  posts: BlogPostMeta[];
}

export default function PostGrid({ posts }: Props) {
  if (posts.length === 0) {
    return (
      <div className={styles.empty}>
        <p>Próximamente publicaremos nuevos artículos.</p>
      </div>
    );
  }

  const [featured, ...rest] = posts;

  return (
    <div className={styles.wrapper}>
      {/* Section label */}
      <MotionSection as="div" variant="fade-up">
        <div className={styles.sectionLabel}>
          <span className={styles.labelNumber}>(01)</span>
          <span className={styles.labelText}>Artículos recientes</span>
          <div className={styles.labelRule} />
        </div>
      </MotionSection>

      {/* Featured post */}
      <MotionSection as="div" variant="fade-up">
        <Link href={`/blog/${featured.slug}`} className={styles.featured}>
          <div className={styles.featuredContent}>
            <span className={styles.featuredCategory}>{featured.category}</span>
            <h2 className={styles.featuredTitle}>{featured.title}</h2>
            <p className={styles.featuredExcerpt}>{featured.excerpt}</p>
            <div className={styles.featuredMeta}>
              <time dateTime={featured.isoDate}>{featured.date}</time>
              <span className={styles.metaDot}>·</span>
              <span>{featured.readingTime}</span>
            </div>
          </div>
          <div className={styles.featuredImage}>
            {featured.image ? (
              <Image
                src={featured.image}
                alt={featured.title}
                fill
                sizes="(max-width: 768px) 100vw, 45vw"
              />
            ) : (
              <div
                className={styles.featuredGradient}
                style={{
                  background: `linear-gradient(135deg, ${featured.gradientFrom}, ${featured.gradientTo})`,
                }}
              />
            )}
          </div>
        </Link>
      </MotionSection>

      {/* Remaining posts */}
      {rest.length > 0 && (
        <MotionSection as="div" variant="fade-up">
          <div className={styles.list}>
            {rest.map((post, i) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className={styles.listItem}
              >
                <span className={styles.listIndex}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className={styles.listContent}>
                  <span className={styles.listTitle}>{post.title}</span>
                  <span className={styles.listExcerpt}>{post.excerpt}</span>
                </div>
                <div className={styles.listRight}>
                  <span className={styles.listCategory}>{post.category}</span>
                  <span className={styles.listTime}>{post.readingTime}</span>
                </div>
              </Link>
            ))}
          </div>
        </MotionSection>
      )}

      {/* Colophon line */}
      <MotionSection as="div" variant="fade-up">
        <div className={styles.colophon}>
          <p>Más artículos próximamente.</p>
        </div>
      </MotionSection>
    </div>
  );
}
