import Image from "next/image";
import MotionSection from "@/components/animations/MotionSection";
import { Link } from "@/i18n/navigation";
import type { BlogPostMeta } from "@/lib/blog";
import styles from "./PostGrid.module.css";

function ReadingArc({ minutes }: { minutes: number }) {
  const pct = Math.min(minutes / 10, 1);
  const r = 8;
  const c = 2 * Math.PI * r;
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      className={styles.readingArc}
      aria-hidden="true"
    >
      <circle
        cx="10"
        cy="10"
        r={r}
        fill="none"
        stroke="var(--border-light)"
        strokeWidth="2"
      />
      <circle
        cx="10"
        cy="10"
        r={r}
        fill="none"
        stroke="var(--accent)"
        strokeWidth="2"
        strokeDasharray={`${c * pct} ${c}`}
        transform="rotate(-90 10 10)"
      />
    </svg>
  );
}

function parseMinutes(readingTime: string): number {
  const match = readingTime.match(/(\d+)/);
  return match?.[1] ? Number.parseInt(match[1], 10) : 3;
}

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

  const featuredPost = posts.find((p) => p.featured);
  // posts.length > 0 guaranteed by the early return above
  const featured = featuredPost ?? posts[0]!;
  const rest = posts.filter((p) => p !== featured);

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
      <MotionSection as="div" variant="clip-up">
        <Link
          href={`/blog/${featured.slug}`}
          className={styles.featured}
          style={{ borderLeftColor: featured.gradientFrom }}
        >
          <div className={styles.featuredContent}>
            <span className={styles.featuredCategory}>{featured.category}</span>
            <h2 className={styles.featuredTitle}>{featured.title}</h2>
            <p className={styles.featuredExcerpt}>{featured.excerpt}</p>
            <div className={styles.featuredMeta}>
              <time dateTime={featured.isoDate}>{featured.date}</time>
              <span className={styles.metaDot}>·</span>
              <span className={styles.readingTimeWrap}>
                <ReadingArc minutes={parseMinutes(featured.readingTime)} />
                {featured.readingTime}
              </span>
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
        <MotionSection as="div" variant="blur-in" stagger>
          <div className={styles.list}>
            {rest.map((post, i) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className={styles.listItem}
                style={{ borderLeftColor: post.gradientFrom }}
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
                  <span className={styles.listTime}>
                    <ReadingArc minutes={parseMinutes(post.readingTime)} />
                    {post.readingTime}
                  </span>
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
