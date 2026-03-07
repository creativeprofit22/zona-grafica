import { listContent } from "@/lib/content";
import Link from "next/link";
import styles from "../../admin.module.css";

export const metadata = { title: "Content — Douro Digital Admin" };
export const dynamic = "force-dynamic";

/* Human-friendly names + descriptions for content keys */
const contentMeta: Record<string, { name: string; desc: string }> = {
  "about.hero": {
    name: "About Hero",
    desc: "Headline, italic text, and subtitle on the About page",
  },
  "about.intro": {
    name: "About Intro",
    desc: "The long intro paragraph on the About page",
  },
  "about.values": {
    name: "Our Values",
    desc: "Value cards — brand voice, security, partners",
  },
  "about.team.intro": {
    name: "Team Intro",
    desc: "One-liner above the team member cards",
  },
  "about.team.members": {
    name: "Team Members",
    desc: "Names, roles, photos, and accent colors",
  },
  "about.team.highlights": {
    name: "Team Highlights",
    desc: "Small team, built for results, security first",
  },
  "about.cta": {
    name: "About CTA",
    desc: "Call-to-action section at bottom of About page",
  },
  "home.hero": { name: "Home Hero", desc: "Main headline on the homepage" },
  "home.mission": {
    name: "Mission Text",
    desc: "The paragraph describing who Douro is",
  },
  "home.aboutTopics": {
    name: "About Topics",
    desc: "Our Approach, Values, and Process cards",
  },
  "home.cta": {
    name: "Rotating CTA",
    desc: "Missed calls, lead response, tool graveyard, follow-up",
  },
  "home.testimonials": {
    name: "Testimonials",
    desc: "Written client testimonials with quotes",
  },
  "home.videoTestimonials": {
    name: "Video Testimonials",
    desc: "Video testimonial names and companies",
  },
  "home.nav": { name: "Navigation Links", desc: "Top navigation menu items" },
  "home.footer.description": {
    name: "Footer Description",
    desc: "Paragraph in the site footer",
  },
  "home.footer.contact": {
    name: "Footer Contact",
    desc: "Email, phone, and address",
  },
  "home.footer.nav": {
    name: "Footer Navigation",
    desc: "Links shown in the footer",
  },
  services: { name: "Services", desc: "AI Agents, Custom Builds, AI Strategy" },
  clients: { name: "Client Logos", desc: "Client names and logo paths" },
  "work.hero": {
    name: "Work Hero",
    desc: "Headline and subtitle on the Work page",
  },
  "case-studies": {
    name: "Case Studies",
    desc: "Voice Noob, Pocket Agent, Social Bro, Viral Kid",
  },
  "blog.categories": {
    name: "Blog Categories",
    desc: "Compliance, AI Automation, Data Security, etc.",
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
            Run{" "}
            <code
              style={{
                color: "#fafafa",
                background: "#1a1a1a",
                padding: "2px 8px",
                borderRadius: 4,
              }}
            >
              npx tsx scripts/seed-content.ts
            </code>{" "}
            to populate.
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
