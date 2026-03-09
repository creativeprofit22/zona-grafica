import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogCTA from "@/components/blog/BlogCTA";
import PostContent from "@/components/blog/PostContent";
import PostHeader from "@/components/blog/PostHeader";
import RelatedPosts from "@/components/blog/RelatedPosts";
import ScrollProgress from "@/components/effects/ScrollProgress";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { articleSchema, breadcrumbSchema } from "@/lib/jsonld";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.meta.title,
    description: post.meta.excerpt,
    alternates: { canonical: `/blog/${slug}` },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <main id="main-content">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            articleSchema({
              headline: post.meta.title,
              description: post.meta.excerpt,
              datePublished: post.meta.isoDate,
              url: `/blog/${slug}`,
            }),
          ).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: "Inicio", url: "/" },
              { name: "Blog", url: "/blog" },
              { name: post.meta.title, url: `/blog/${slug}` },
            ]),
          ).replace(/</g, "\\u003c"),
        }}
      />

      <ScrollProgress color={post.meta.gradientFrom} />
      <PostHeader meta={post.meta} />
      <PostContent source={post.content} />
      <BlogCTA />
      <RelatedPosts currentSlug={slug} category={post.meta.category} />
    </main>
  );
}
