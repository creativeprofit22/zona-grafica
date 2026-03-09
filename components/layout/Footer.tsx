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
      </div>

      {/* ── Bottom bar ── */}
      <div className={styles.bottom}>
        <p className={styles.copyright}>
          © {year} {siteConfig.name}
        </p>
        <p className={styles.craft}>
          Hecho en San Miguel de Allende, GTO · Desde 1993
        </p>

        {/* ── Postal Cancellation Mark (Matasellos) ── */}
        <div className={styles.stamp} aria-hidden="true">
          <svg
            viewBox="0 0 180 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={styles.stampSvg}
            role="img"
          >
            <title>Zona Grafica · S.M.A. 1993</title>
            {/* Cancellation lines */}
            <line
              x1="0"
              y1="38"
              x2="180"
              y2="38"
              stroke="currentColor"
              strokeWidth="0.75"
            />
            <line
              x1="0"
              y1="50"
              x2="180"
              y2="50"
              stroke="currentColor"
              strokeWidth="0.75"
            />
            <line
              x1="0"
              y1="62"
              x2="180"
              y2="62"
              stroke="currentColor"
              strokeWidth="0.75"
            />

            {/* Elliptical outline */}
            <ellipse
              cx="90"
              cy="50"
              rx="65"
              ry="40"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="var(--bg-ink)"
            />

            {/* Arc paths for curved text */}
            <defs>
              <path id="topArc" d="M 35,50 A 55,32 0 0 1 145,50" />
              <path id="bottomArc" d="M 140,56 A 55,32 0 0 1 40,56" />
            </defs>

            {/* Top curved text: ZONA GRAFICA */}
            <text
              fill="currentColor"
              fontSize="9"
              fontWeight="700"
              letterSpacing="0.12em"
              textAnchor="middle"
            >
              <textPath href="#topArc" startOffset="50%">
                ZONA GR&#193;FICA
              </textPath>
            </text>

            {/* Star separators */}
            <text
              fill="currentColor"
              fontSize="7"
              textAnchor="middle"
              x="42"
              y="48"
            >
              &#9670;
            </text>
            <text
              fill="currentColor"
              fontSize="7"
              textAnchor="middle"
              x="138"
              y="48"
            >
              &#9670;
            </text>

            {/* Center text: S.M.A. */}
            <text
              x="90"
              y="56"
              fill="currentColor"
              fontSize="18"
              fontWeight="700"
              letterSpacing="0.08em"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              S.M.A.
            </text>

            {/* Bottom curved text: 1993 */}
            <text
              fill="currentColor"
              fontSize="8.5"
              fontWeight="600"
              letterSpacing="0.15em"
              textAnchor="middle"
            >
              <textPath href="#bottomArc" startOffset="50%">
                &#9670; 1993 &#9670;
              </textPath>
            </text>
          </svg>
        </div>
      </div>
    </footer>
  );
}
