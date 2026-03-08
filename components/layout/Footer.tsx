import Image from "next/image";
import Link from "next/link";
import { navigation, siteConfig } from "@/data/site";
import styles from "./Footer.module.css";
import NewsletterForm from "./NewsletterForm";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        {/* ── Column 1: Brand + Coordinates ── */}
        <div className={styles.brand}>
          <Link href="/" className={styles.logo}>
            <Image
              src="/images/chameleon-logo.png"
              alt=""
              width={115}
              height={30}
              className={styles.logoImage}
            />
            {siteConfig.name}
          </Link>
          <p className={styles.tagline}>{siteConfig.tagline}</p>
          <div className={styles.locationBlock}>
            <p className={styles.location}>
              {siteConfig.location.city}, {siteConfig.location.state}
            </p>
            <p className={styles.coordinates}>20.9144° N, 100.7452° W</p>
          </div>
        </div>

        {/* ── Column 2: Navigation ── */}
        <nav className={styles.nav} aria-label="Navegación de pie de página">
          {navigation.map((link) => (
            <Link key={link.href} href={link.href} className={styles.navLink}>
              <span className={styles.navNumber}>{link.number}</span>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* ── Column 3: Contact + Social ── */}
        <div className={styles.contact}>
          <a
            href={siteConfig.contact.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.whatsapp}
          >
            WhatsApp →
          </a>
          <a
            href={`mailto:${siteConfig.contact.email}`}
            className={styles.email}
          >
            {siteConfig.contact.email}
          </a>
          <a
            href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
            className={styles.phone}
          >
            {siteConfig.contact.phone}
          </a>

          <div className={styles.social}>
            {siteConfig.social.instagram && (
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                IG
              </a>
            )}
            {siteConfig.social.facebook && (
              <a
                href={siteConfig.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                FB
              </a>
            )}
            {siteConfig.social.behance && (
              <a
                href={siteConfig.social.behance}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Behance"
              >
                Bē
              </a>
            )}
          </div>
        </div>

        {/* ── Column 4: Newsletter ── */}
        <div className={styles.newsletter}>
          <p className={styles.newsletterLabel}>Newsletter</p>
          <p className={styles.newsletterDesc}>
            Tips de diseño y branding directo a tu inbox.
          </p>
          <NewsletterForm />
        </div>

        {/* ── Postmark Stamp ── */}
        <div className={styles.stamp}>
          <div className={styles.stampInner}>
            <span className={styles.stampText}>Hecho en</span>
            <span className={styles.stampCity}>San Miguel de Allende</span>
            <span className={styles.stampYear}>· 1993 ·</span>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className={styles.bottom}>
        <p className={styles.copyright}>
          © {year} {siteConfig.name}
        </p>
        <p className={styles.craft}>
          Hecho en San Miguel de Allende, GTO · Desde 1993
        </p>
      </div>
    </footer>
  );
}
