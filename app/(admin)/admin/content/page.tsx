import Link from "next/link";
import { listContent } from "@/lib/content";
import styles from "../../admin.module.css";

export const metadata = { title: "Content — Zona Gráfica Admin" };
export const dynamic = "force-dynamic";

/* Human-friendly names + descriptions for content keys */
const contentMeta: Record<string, { name: string; desc: string }> = {
  "about.hero": {
    name: "Nosotros Hero",
    desc: "Encabezado y subtítulo de la página Nosotros",
  },
  "about.intro": {
    name: "Nosotros Intro",
    desc: "Párrafo introductorio — la historia de Jesús y Zona Gráfica",
  },
  "about.values": {
    name: "Valores",
    desc: "Tarjetas de valores — diseño con raíz, comunicación, oficio",
  },
  "about.team.intro": {
    name: "Intro Equipo",
    desc: "Línea introductoria sobre el equipo",
  },
  "about.team.members": {
    name: "Miembros del Equipo",
    desc: "Nombres, roles y fotos del equipo",
  },
  "about.cta": {
    name: "Nosotros CTA",
    desc: "Llamada a la acción al final de Nosotros",
  },
  "home.hero": {
    name: "Home Hero",
    desc: "Encabezado principal — zona GRÁFICA diseño que habla",
  },
  "home.manifesto": {
    name: "Manifiesto",
    desc: "Cita de Jesús Herrera sobre Zona Gráfica y su trayectoria",
  },
  "home.cta": {
    name: "Home CTA",
    desc: "¿Tienes una idea? Platiquemos — WhatsApp y correo",
  },
  "home.nav": { name: "Navegación", desc: "Links del menú principal" },
  "home.footer.description": {
    name: "Footer Descripción",
    desc: "Párrafo en el pie de página",
  },
  "home.footer.contact": {
    name: "Footer Contacto",
    desc: "Correo, teléfono y dirección",
  },
  "home.footer.nav": {
    name: "Footer Navegación",
    desc: "Links del pie de página",
  },
  services: {
    name: "Servicios",
    desc: "Branding, editorial, web, fotografía, cartelería, ilustración",
  },
  clients: {
    name: "Clientes",
    desc: "GIFF, Cervantino, Cardo Café, Duncan Galería y más",
  },
  "work.hero": {
    name: "Portafolio Hero",
    desc: "Encabezado y subtítulo de la página de Portafolio",
  },
  "case-studies": {
    name: "Casos de Estudio",
    desc: "Proyectos destacados con detalle completo",
  },
  "blog.categories": {
    name: "Categorías del Blog",
    desc: "Branding, Diseño, Fotografía, etc.",
  },
};

const sectionLabels: Record<string, string> = {
  about: "About Page",
  home: "Homepage",
  services: "Services",
  clients: "Clients",
  work: "Work Page",
  "case-studies": "Case Studies",
  blog: "Blog",
};

function getMeta(key: string) {
  return contentMeta[key] || { name: key, desc: "" };
}

export default async function ContentPage() {
  const blocks = await listContent();

  const groups: Record<string, typeof blocks> = {};
  for (const block of blocks) {
    const section = block.key.includes(".")
      ? block.key.split(".")[0]
      : block.key;
    if (!groups[section]) groups[section] = [];
    groups[section].push(block);
  }

  return (
    <>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Content</h1>
        <p className={styles.pageDesc}>
          Edit text, team info, testimonials, and other site content.
        </p>
      </div>

      {blocks.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#666" }}>
          <p style={{ fontSize: 16, marginBottom: 8 }}>No content blocks yet</p>
          <p style={{ fontSize: 13 }}>
            Agrega bloques de contenido desde el panel de admin para empezar.
          </p>
        </div>
      ) : (
        Object.entries(groups).map(([section, items]) => (
          <div key={section} className={styles.sectionGroup}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                {sectionLabels[section] || section}
              </h2>
              <span className={styles.sectionCount}>
                {items.length} {items.length === 1 ? "item" : "items"}
              </span>
            </div>
            <div className={styles.contentGrid}>
              {items.map((block) => {
                const meta = getMeta(block.key);
                return (
                  <Link
                    key={block.key}
                    href={`/admin/content/${encodeURIComponent(block.key)}`}
                    className={styles.contentCard}
                  >
                    <div className={styles.contentCardInfo}>
                      <p className={styles.contentCardName}>{meta.name}</p>
                      {meta.desc && (
                        <p className={styles.contentCardMeta}>{meta.desc}</p>
                      )}
                    </div>
                    <span className={styles.contentCardArrow}>&rsaquo;</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))
      )}
    </>
  );
}
