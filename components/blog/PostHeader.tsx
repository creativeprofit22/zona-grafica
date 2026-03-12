"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import { useRef } from "react";
import { Link } from "@/i18n/navigation";
import type { BlogPostMeta } from "@/lib/blog";
import styles from "./PostHeader.module.css";

interface Props {
  meta: BlogPostMeta;
}

export default function PostHeader({ meta }: Props) {
  const headerRef = useRef<HTMLElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const gradient = `linear-gradient(135deg, ${meta.gradientFrom}, ${meta.gradientTo})`;

  useGSAP(
    () => {
      gsap.from(".animWord", {
        y: 40,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.08,
      });
      gsap.from(metaRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
        delay: 0.4,
      });
    },
    { scope: headerRef },
  );

  const titleWords = meta.title.split(" ").map((word, i) => (
    // biome-ignore lint/suspicious/noArrayIndexKey: stable word order from title string
    <span key={`${word}-${i}`} className={`animWord ${styles.word}`}>
      {word}{" "}
    </span>
  ));

  return (
    <header
      ref={headerRef}
      className={meta.image ? styles.headerSplit : styles.header}
    >
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <Link href="/blog" className={styles.breadcrumbLink}>
          ← Blog
        </Link>
      </nav>

      {meta.image ? (
        <>
          <div
            className={styles.titleCol}
            style={
              {
                "--post-gradient": `${meta.gradientFrom}0D`,
              } as React.CSSProperties
            }
          >
            <span className={styles.categoryVertical}>{meta.category}</span>
            <h1 className={styles.title}>{titleWords}</h1>
            <div ref={metaRef} className={styles.meta}>
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
              fetchPriority="high"
            />
          </div>
        </>
      ) : (
        <div
          className={styles.titleOnly}
          style={
            {
              "--post-gradient": `${meta.gradientFrom}0D`,
            } as React.CSSProperties
          }
        >
          <span className={styles.category}>{meta.category}</span>
          <h1 translate="no" className={styles.titleLarge}>
            {titleWords}
          </h1>
          <div ref={metaRef} className={styles.meta}>
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
