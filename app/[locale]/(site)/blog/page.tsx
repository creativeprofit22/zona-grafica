import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import BlogCTA from "@/components/blog/BlogCTA";
import BlogHero from "@/components/blog/BlogHero";
import PostGrid from "@/components/blog/PostGrid";
import { localeAlternates } from "@/lib/alternates";
import { getAllPosts } from "@/lib/blog";
import { webPageSchema } from "@/lib/jsonld";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Blog",
    description:
      locale === "en"
        ? "Ideas on branding, design, creative process and visual inspiration from Zona Gráfica."
        : "Ideas sobre branding, diseño, proceso creativo e inspiración visual desde Zona Gráfica.",
    alternates: localeAlternates("blog", locale),
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const posts = getAllPosts(locale);

  return (
    <main id="main-content">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            webPageSchema({
              name: "Blog · Zona Gráfica",
              description:
                locale === "en"
                  ? "Ideas on branding, design and creative process."
                  : "Ideas sobre branding, diseño y proceso creativo.",
              url: "/blog",
              locale: locale as "es" | "en",
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
