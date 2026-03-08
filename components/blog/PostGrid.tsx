import MotionSection from "@/components/animations/MotionSection";
import type { BlogPostMeta } from "@/lib/blog";
import PostCard from "./PostCard";
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

  return (
    <div className={styles.grid}>
      {posts.map((post, i) => (
        <MotionSection
          key={post.slug}
          as="div"
          style={{ transitionDelay: i % 2 === 0 ? "0s" : "0.12s" }}
        >
          <PostCard post={post} />
        </MotionSection>
      ))}
    </div>
  );
}
