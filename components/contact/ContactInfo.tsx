import MotionSection from "@/components/animations/MotionSection";
import { siteConfig } from "@/data/site";
import styles from "./ContactInfo.module.css";

export default function ContactInfo() {
  const { contact, location, social } = siteConfig;

  return (
    <MotionSection
      className={styles.section}
      data-theme="cream"
      variant="fade-up"
    >
      <div className={styles.inner}>
        <div className={styles.header}>
          <span className={styles.label}>(también nos encuentras aquí)</span>
        </div>

        <div className={styles.grid}>
          {/* Footnote 1: Email */}
          <div className={styles.footnote}>
            <span className={styles.marker}>*</span>
            <div className={styles.footnoteContent}>
              <span className={styles.footnoteLabel}>Correo</span>
              <a href={`mailto:${contact.email}`} className={styles.link}>
                {contact.email}
              </a>
            </div>
          </div>

          {/* Footnote 2: Phone */}
          <div className={styles.footnote}>
            <span className={styles.marker}>*</span>
            <div className={styles.footnoteContent}>
              <span className={styles.footnoteLabel}>Teléfono</span>
              <a
                href={`tel:${contact.phone.replace(/\s/g, "")}`}
                className={styles.link}
              >
                {contact.phone}
              </a>
            </div>
          </div>

          {/* Footnote 3: Location */}
          <div className={styles.footnote}>
            <span className={styles.marker}>*</span>
            <div className={styles.footnoteContent}>
              <span className={styles.footnoteLabel}>Ubicación</span>
              <p className={styles.locationText}>
                {location.city}, {location.state}
              </p>
              <p className={styles.coords}>20.9144° N, 100.7452° W</p>
            </div>
          </div>

          {/* Footnote 4: Social */}
          <div className={styles.footnote}>
            <span className={styles.marker}>*</span>
            <div className={styles.footnoteContent}>
              <span className={styles.footnoteLabel}>Redes</span>
              <div className={styles.socials}>
                {social.instagram && (
                  <a
                    href={social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialLink}
                  >
                    Instagram
                  </a>
                )}
                {social.facebook && (
                  <a
                    href={social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialLink}
                  >
                    Facebook
                  </a>
                )}
                {social.behance && (
                  <a
                    href={social.behance}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialLink}
                  >
                    Behance
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Styled map */}
        <div className={styles.mapWrap}>
          <div className={styles.mapLabel}>
            <span className={styles.marker}>*</span>
            <span className={styles.footnoteLabel}>Encuéntranos</span>
          </div>
          <div className={styles.mapFrame}>
            <iframe
              src="https://www.openstreetmap.org/export/embed.html?bbox=-100.7650%2C20.9000%2C-100.7250%2C20.9290&layer=mapnik&marker=20.9144%2C-100.7452"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              title="Ubicación de Zona Gráfica en San Miguel de Allende"
            />
          </div>
        </div>

        <div className={styles.closing}>
          <p className={styles.closingText}>
            Hecho en San Miguel de Allende · Desde 1993
          </p>
        </div>
      </div>
    </MotionSection>
  );
}
