"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import MagneticButton from "@/components/ui/MagneticButton";
import { navigation, siteConfig } from "@/data/site";
import styles from "./Navbar.module.css";

gsap.registerPlugin(ScrollTrigger);

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [heroDark, setHeroDark] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const navRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

  // Detect scroll position and direction
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 60);
      setHidden(y > 80 && y > lastScrollY.current);
      lastScrollY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Detect if hero section is dark-themed
  // Watches for elements with data-theme="dark" in the first viewport
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-observe hero on route change
  useEffect(() => {
    const heroEl = document.querySelector<HTMLElement>(
      '[data-hero-theme="dark"]',
    );
    if (!heroEl) {
      setHeroDark(false);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Hero is dark when it's visible (intersecting) and covers most of viewport
        setHeroDark(entry.isIntersecting && entry.intersectionRatio > 0.3);
      },
      { threshold: [0, 0.3, 0.5, 1] },
    );

    observer.observe(heroEl);
    return () => observer.disconnect();
  }, [pathname]);

  // Close menu on route change
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally only react to pathname changes
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Scroll progress bar
  useGSAP(
    () => {
      if (!progressRef.current) return;
      gsap.to(progressRef.current, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.3,
        },
      });
    },
    { scope: navRef },
  );

  // Section-aware active tracking
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-observe sections on route change
  useEffect(() => {
    const sections = document.querySelectorAll("[data-nav-section]");
    if (sections.length === 0) {
      setActiveSection("");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(
              entry.target.getAttribute("data-nav-section") || "",
            );
          }
        }
      },
      { threshold: 0.3, rootMargin: "-80px 0px 0px 0px" },
    );
    for (const s of sections) observer.observe(s);
    return () => observer.disconnect();
  }, [pathname]);

  const toggleMenu = useCallback(() => setMenuOpen((o) => !o), []);

  // Nav is in "inverted" (light text) mode when hero is dark and not scrolled
  const inverted = heroDark && !scrolled;

  return (
    <>
      <nav
        ref={navRef}
        className={`${styles.nav} ${scrolled ? styles.scrolled : ""} ${hidden ? styles.hidden : ""} ${inverted ? styles.inverted : ""}`}
      >
        <div className={styles.inner}>
          <Link
            href="/"
            className={styles.logo}
            aria-label="Inicio"
            data-cursor-logo
          >
            <Image
              src="/images/chameleon-logo.png"
              alt=""
              width={153}
              height={40}
              className={styles.logoImage}
              preload
            />
            <span className={styles.logoFull}>Zona Gráfica</span>
          </Link>

          <div className={styles.desktopLinks}>
            {navigation.slice(1).map((link) => (
              <MagneticButton
                key={link.href}
                strength={0.25}
                className={styles.navLinkWrap}
              >
                <Link
                  href={link.href}
                  className={`${styles.navLink} ${activeSection ? (activeSection === link.href ? styles.active : "") : pathname === link.href ? styles.active : ""}`}
                >
                  <span className={styles.navNumber}>{link.number}</span>
                  {link.label}
                </Link>
              </MagneticButton>
            ))}
          </div>

          <div className={styles.right}>
            <a
              href={siteConfig.contact.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ctaButton}
            >
              Hablemos
            </a>
            <button
              type="button"
              className={`${styles.burger} ${menuOpen ? styles.burgerOpen : ""}`}
              onClick={toggleMenu}
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={menuOpen}
            >
              <span className={styles.burgerLine} />
              <span className={styles.burgerLine} />
            </button>
          </div>
        </div>
        <div
          ref={progressRef}
          className={styles.progressBar}
          aria-hidden="true"
        />
      </nav>

      {/* ── Mobile Overlay ── */}
      <dialog
        className={`${styles.overlay} ${menuOpen ? styles.overlayOpen : ""}`}
        aria-label="Menú de navegación"
        open={menuOpen}
      >
        <div className={styles.overlayContent}>
          {navigation.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              className={styles.overlayLink}
              style={{ transitionDelay: menuOpen ? `${0.05 * i}s` : "0s" }}
              onClick={() => setMenuOpen(false)}
            >
              <span className={styles.overlayNumber}>{link.number}</span>
              <span className={styles.overlayLabel}>{link.label}</span>
            </Link>
          ))}
        </div>
        <div className={styles.overlayFooter}>
          <a
            href={siteConfig.contact.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.overlayWhatsapp}
          >
            WhatsApp →
          </a>
          <a
            href={`mailto:${siteConfig.contact.email}`}
            className={styles.overlayEmail}
          >
            {siteConfig.contact.email}
          </a>
        </div>
      </dialog>
    </>
  );
}
