"use client";

import { useState } from "react";
import styles from "./VideoEmbed.module.css";

function getEmbedUrl(url: string): string {
  const yt = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]+)/,
  );
  if (yt) return `https://www.youtube.com/embed/${yt[1]}?autoplay=1`;
  return url;
}

export function VideoEmbed({
  url,
  caption,
}: {
  url: string;
  caption?: string;
}) {
  const [playing, setPlaying] = useState(false);
  const embedUrl = getEmbedUrl(url);

  return (
    <div className={styles.videoWrap}>
      <div className={styles.frame}>
        {!playing ? (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className={styles.playOverlay}
            aria-label="Reproducir video"
          >
            <svg
              className={styles.playIcon}
              viewBox="0 0 68 48"
              width="68"
              height="48"
              aria-hidden="true"
            >
              <path
                d="M66.5 7.7c-.8-2.9-2.5-5.4-5.4-6.2C55.8.1 34 0 34 0S12.2.1 6.9 1.6c-2.9.7-4.6 3.2-5.4 6.1C.1 13 0 24 0 24s.1 11 1.5 16.3c.8 2.9 2.5 5.4 5.4 6.2C12.2 47.9 34 48 34 48s21.8-.1 27.1-1.6c2.9-.7 4.6-3.2 5.4-6.1C67.9 35 68 24 68 24s-.1-11-1.5-16.3z"
                fill="#FF0000"
              />
              <path d="M45 24L27 14v20z" fill="#FFF" />
            </svg>
          </button>
        ) : (
          <iframe
            src={embedUrl}
            allow="autoplay; encrypted-media"
            allowFullScreen
            title="Video"
            className={styles.iframe}
          />
        )}
      </div>
      {caption && <p className={styles.videoCaption}>{caption}</p>}
    </div>
  );
}
