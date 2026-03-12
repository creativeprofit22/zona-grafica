import Image from "next/image";
import MotionSection from "@/components/animations/MotionSection";
import { Link } from "@/i18n/navigation";
import { getAllPosts } from "@/lib/blog";
import styles from "./RelatedPosts.module.css";

interface Props {
  currentSlug: string;
  category: string;
}

export default function RelatedPosts({ currentSlug, category }: Props) {
  const allPosts = getAllPosts();
  const related = allPosts
    .filter((p) => p.slug !== currentSlug)
    .sort((a, b) => {
      if (a.category === category && b.category !== category) return -1;
      if (a.category !== category && b.category === category) return 1;
      return 0;
    })
    .slice(0, 3);

  if (related.length === 0) return null;

  return (
    <MotionSection
      as="section"
      variant="blur-in"
      className={styles.section}
      stagger
    >
      <h2 className={styles.heading}>Sigue leyendo</h2>
      <div className={styles.grid}>
        {related.map((post) => (
          <Link
            href={`/blog/${post.slug}`}
            key={post.slug}
            className={styles.card}
            style={{ borderTopColor: post.gradientFrom }}
          >
            <div className={styles.thumb}>
              {post.image ? (
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
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
            <div className={styles.body}>
              <span className={styles.category}>{post.category}</span>
              <h3 className={styles.title}>{post.title}</h3>
              <span className={styles.time}>{post.readingTime}</span>
            </div>
          </Link>
        ))}
      </div>
    </MotionSection>
  );
}
