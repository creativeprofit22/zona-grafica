import Link from "next/link";
import { notFound } from "next/navigation";
import { getContent } from "@/lib/content";
import styles from "../../../admin.module.css";
import ContentEditor from "./ContentEditor";

export const dynamic = "force-dynamic";

const contentNames: Record<string, string> = {
  "about.hero": "About Hero",
  "about.intro": "About Intro",
  "about.values": "Our Values",
  "about.team.intro": "Team Intro",
  "about.team.members": "Team Members",
  "about.team.highlights": "Team Highlights",
  "about.cta": "About CTA",
  "home.hero": "Home Hero",
  "home.mission": "Mission Text",
  "home.aboutTopics": "About Topics",
  "home.cta": "Rotating CTA",
  "home.testimonials": "Testimonials",
  "home.videoTestimonials": "Video Testimonials",
  "home.nav": "Navigation Links",
  "home.footer.description": "Footer Description",
  "home.footer.contact": "Footer Contact",
  "home.footer.nav": "Footer Navigation",
  services: "Services",
  clients: "Client Logos",
  "work.hero": "Work Hero",
  "case-studies": "Case Studies",
  "blog.categories": "Blog Categories",
};

export default async function ContentEditPage({
  params,
}: {
  params: Promise<{ key: string }>;
}) {
  const { key } = await params;
  const decodedKey = decodeURIComponent(key);
  const value = await getContent(decodedKey);

  if (value === null) notFound();

  const name = contentNames[decodedKey] || decodedKey;

  return (
    <>
      <div className={styles.breadcrumb}>
        <Link href="/admin/content">Content</Link>
        <span className={styles.breadcrumbSep}>/</span>
        <span style={{ color: "#ccc" }}>{name}</span>
      </div>

      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>{name}</h1>
      </div>

      <ContentEditor contentKey={decodedKey} initialValue={value} />
    </>
  );
}
