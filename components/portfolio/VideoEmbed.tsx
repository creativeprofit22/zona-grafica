"use client";

import styles from "./VideoEmbed.module.css";

interface VideoEmbedProps {
  url: string;
  title: string;
}

export default function VideoEmbed({ url, title }: VideoEmbedProps) {
  return (
    <div className={styles.wrapper}>
      <iframe
        className={styles.iframe}
        src={url}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

export function PlayOverlay({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      className={styles.playOverlay}
      onClick={onClick}
      aria-label="Reproducir video"
    >
      <span className={styles.playIcon}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <polygon points="6,3 20,12 6,21" />
        </svg>
      </span>
    </button>
  );
}
