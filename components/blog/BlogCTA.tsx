import Link from "next/link";
import styles from "./BlogCTA.module.css";

export default function BlogCTA() {
  return (
    <section className={styles.coda}>
      <div className={styles.inner}>
        <span className={styles.pd}>P.D.</span>
        <p className={styles.message}>
          Después de 30 años haciendo esto, lo que más disfruto es cuando
          alguien llega con una idea a medio formar y juntos la convertimos en
          algo que funciona.{" "}
          <Link href="/contacto" className={styles.link}>
            Escríbeme
          </Link>
          , aunque sea solo para platicar.
        </p>
        <span className={styles.sig}>J.H.</span>
      </div>
    </section>
  );
}
