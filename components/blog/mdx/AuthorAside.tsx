import type { ReactNode } from "react";
import styles from "./AuthorAside.module.css";

export function AuthorAside({ children }: { children: ReactNode }) {
  return (
    <aside className={styles.authorAside}>
      <span className={styles.initials}>J.H.</span>
      <div className={styles.content}>{children}</div>
    </aside>
  );
}
