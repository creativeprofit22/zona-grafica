import Image from "next/image";
import ImageReveal from "@/components/animations/ImageReveal";
import MotionSection from "@/components/animations/MotionSection";
import type { CaseStudyImage } from "@/types/content";
import styles from "./CaseStudyGallery.module.css";

interface Props {
  images: CaseStudyImage[];
}

export default function CaseStudyGallery({ images }: Props) {
  if (images.length === 0) return null;

  return (
    <MotionSection as="div" className={styles.section} data-theme="light">
      <div className={styles.grid}>
        {images.map((img, i) => {
          const variant = img.width === "half" ? "half" : "full";

          return (
            <figure
              key={img.src}
              className={`${styles.item} ${styles[variant]}`}
            >
              <ImageReveal
                direction={
                  variant === "full" ? "left" : i % 2 === 0 ? "left" : "bottom"
                }
                delay={variant === "half" && i % 2 !== 0 ? 0.15 : 0}
                className={styles.imageWrap}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes={
                    variant === "full"
                      ? "100vw"
                      : "(max-width: 768px) 100vw, 50vw"
                  }
                  className={styles.image}
                />
              </ImageReveal>
              {img.caption && (
                <figcaption className={styles.caption}>
                  <span className={styles.captionIndex}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {img.caption}
                </figcaption>
              )}
            </figure>
          );
        })}
      </div>
    </MotionSection>
  );
}
