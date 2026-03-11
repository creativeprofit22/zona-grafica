"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import ImageReveal from "@/components/animations/ImageReveal";
import MotionSection from "@/components/animations/MotionSection";
import styles from "./Gallery.module.css";

interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

export function Gallery({ images }: { images: GalleryImage[] }) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  const close = useCallback(() => setLightbox(null), []);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [lightbox, close]);

  return (
    <>
      <MotionSection
        as="div"
        variant="fade-up"
        className={styles.gallery}
        stagger
      >
        {images.map((img, i) => (
          <button
            key={img.src}
            type="button"
            className={styles.galleryItem}
            onClick={() => setLightbox(i)}
          >
            <ImageReveal direction={i % 2 === 0 ? "left" : "bottom"}>
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                style={{ objectFit: "cover" }}
              />
            </ImageReveal>
            {img.caption && (
              <span className={styles.caption}>{img.caption}</span>
            )}
          </button>
        ))}
      </MotionSection>

      {lightbox !== null && (
        <div
          className={styles.lightbox}
          onClick={close}
          onKeyDown={(e) => {
            if (e.key === "Escape") close();
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Imagen ampliada"
        >
          <button
            type="button"
            className={styles.closeBtn}
            onClick={close}
            aria-label="Cerrar"
          >
            ✕
          </button>
          {/* biome-ignore lint/a11y/noStaticElementInteractions: stops click from closing lightbox */}
          {/* biome-ignore lint/a11y/useKeyWithClickEvents: keyboard handled on parent */}
          <div
            className={styles.lightboxInner}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[lightbox]!.src}
              alt={images[lightbox]!.alt}
              width={1200}
              height={800}
              style={{ objectFit: "contain", width: "100%", height: "auto" }}
            />
            {images[lightbox]!.caption && (
              <p className={styles.lightboxCaption}>
                {images[lightbox]!.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
