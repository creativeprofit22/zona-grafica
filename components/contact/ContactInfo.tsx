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
                    className={styles.socialIcon}
                    aria-label="Instagram"
                  >
                    <span className={styles.srOnly}>Instagram</span>
                    <svg
                      width={20}
                      height={20}
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                  </a>
                )}
                {social.facebook && (
                  <a
                    href={social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialIcon}
                    aria-label="Facebook"
                  >
                    <span className={styles.srOnly}>Facebook</span>
                    <svg
                      width={20}
                      height={20}
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                )}
                {social.behance && (
                  <a
                    href={social.behance}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialIcon}
                    aria-label="Behance"
                  >
                    <span className={styles.srOnly}>Behance</span>
                    <svg
                      width={20}
                      height={20}
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M6.938 4.503c.702 0 1.34.06 1.92.188.577.13 1.07.33 1.485.61.41.28.733.65.96 1.12.225.47.34 1.05.34 1.73 0 .74-.17 1.36-.507 1.86-.338.5-.837.9-1.502 1.22.906.26 1.576.72 2.022 1.37.448.66.665 1.45.665 2.36 0 .75-.13 1.39-.41 1.93-.28.55-.67 1-1.16 1.35-.48.348-1.05.6-1.67.767-.63.165-1.27.25-1.95.25H0V4.51h6.938v-.007zM6.545 10.16c.563 0 1.03-.14 1.397-.418.37-.28.554-.7.554-1.272 0-.32-.06-.585-.174-.79-.116-.21-.27-.375-.46-.5-.19-.12-.41-.2-.67-.24-.26-.04-.54-.06-.82-.06H3.53v3.28h3.016zm.19 5.72c.304 0 .59-.03.86-.09.27-.065.51-.16.72-.295.21-.135.38-.32.51-.555.125-.24.19-.54.19-.92 0-.73-.21-1.26-.628-1.572-.42-.31-.97-.465-1.65-.465H3.53v3.9h3.204v-.003zM21.792 18.04c-.553.603-1.38.9-2.482.9-.674 0-1.257-.14-1.754-.42-.497-.28-.87-.756-1.12-1.434h7.543c.036-.33.06-.654.06-.99 0-.97-.162-1.83-.486-2.574-.324-.74-.755-1.36-1.298-1.86-.54-.5-1.16-.87-1.86-1.116-.7-.245-1.433-.368-2.2-.368-.7 0-1.37.13-2.01.39-.64.26-1.2.63-1.69 1.1-.49.48-.88 1.05-1.17 1.74-.285.688-.428 1.46-.428 2.31 0 .87.13 1.65.395 2.33.27.68.64 1.25 1.12 1.71.48.46 1.05.81 1.72 1.05.66.24 1.39.36 2.18.36 1.07 0 2-.25 2.79-.73.79-.49 1.38-1.27 1.77-2.34h-2.48l-.002-.002zm-4.88-5.37c.41-.434.97-.65 1.68-.65.47 0 .88.09 1.22.27.34.18.61.4.82.66.21.26.36.54.44.84.09.3.14.57.15.82h-5.15c.09-.73.43-1.5.84-1.94v-.001zM15.01 4.66h6.58v1.57h-6.58V4.66z" />
                    </svg>
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
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3734.!2d-100.7452!3d20.9144!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x842b51a5a42db2e3%3A0x29a4b4e02e3b7e54!2sSan%20Miguel%20de%20Allende%2C%20Gto.!5e0!3m2!1ses-419!2smx!4v1"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación de Zona Gráfica en San Miguel de Allende"
            />
          </div>
          <p className={styles.mapCaption}>
            San Miguel de Allende, Guanajuato · 20.9144° N, 100.7452° W
          </p>
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
