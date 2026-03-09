import type { Metadata } from "next";
import BlogCTA from "@/components/blog/BlogCTA";
import BlogHero from "@/components/blog/BlogHero";
import PostGrid from "@/components/blog/PostGrid";
import { getAllPosts } from "@/lib/blog";
import { webPageSchema } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Ideas sobre branding, diseño, proceso creativo e inspiración visual desde Zona Gráfica.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <main id="main-content">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            webPageSchema({
              name: "Blog · Zona Gráfica",
              description: "Ideas sobre branding, diseño y proceso creativo.",
              url: "/blog",
            }),
          ).replace(/</g, "\\u003c"),
        }}
      />

      <BlogHero postCount={posts.length} />
      <PostGrid posts={posts} />
      <BlogCTA />
    </main>
  );
}
