"use client";

import styles from "./ProjectFilter.module.css";

interface Category {
  slug: string;
  label: string;
}

interface Props {
  categories: readonly Category[];
  active: string;
  onSelect: (slug: string) => void;
  counts: Record<string, number>;
}

export default function ProjectFilter({
  categories,
  active,
  onSelect,
  counts,
}: Props) {
  return (
    <div className={styles.wrapper}>
      <nav className={styles.track} aria-label="Filtrar proyectos">
        {categories.map((cat) => {
          const isActive = active === cat.slug;
          const count = cat.slug === "todos" ? undefined : counts[cat.slug];
          return (
            <button
              key={cat.slug}
              type="button"
              className={`${styles.filter} ${isActive ? styles.active : ""}`}
              onClick={() => onSelect(cat.slug)}
              aria-pressed={isActive}
            >
              <span className={styles.label}>{cat.label}</span>
              {count !== undefined && (
                <span className={styles.count}>({count})</span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
