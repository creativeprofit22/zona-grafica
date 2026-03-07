import MotionSection from "@/components/animations/MotionSection";
import type { Testimonial } from "@/types/content";
import styles from "./CaseStudyTestimonial.module.css";

interface Props {
  testimonial: Testimonial;
}

export default function CaseStudyTestimonial({ testimonial }: Props) {
  return (
    <MotionSection className={styles.section}>
      <div className={styles.inner}>
        <span className={styles.label}>Testimonio del cliente</span>

        <blockquote className={styles.quote}>
          <span className={styles.quoteMark} aria-hidden="true">
            &ldquo;
          </span>
          <p className={styles.quoteText}>{testimonial.quote}</p>
        </blockquote>

        <div className={styles.attribution}>
          <span className={styles.authorName}>{testimonial.author}</span>
          <span className={styles.authorRole}>
            {testimonial.role}, {testimonial.company}
          </span>
        </div>
      </div>
    </MotionSection>
  );
}
