import fs from "fs";
import matter from "gray-matter";
import path from "path";
import { cache } from "react";

export interface BlogPostMeta {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  isoDate: string;
  readingTime: string;
  gradientFrom: string;
  gradientTo: string;
  image?: string;
  featured?: boolean;
}

const BLOG_ROOT = path.join(process.cwd(), "content", "blog");
const WORDS_PER_MINUTE = 200;

function blogDir(locale: string): string {
  const localeDir = path.join(BLOG_ROOT, locale);
  if (fs.existsSync(localeDir)) return localeDir;
  return BLOG_ROOT;
}

function estimateReadingTime(content: string): string {
  const words = content
    .replace(/---[\s\S]*?---/, "")
    .trim()
    .split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / WORDS_PER_MINUTE));
  return `${minutes} min`;
}

function parsePostMeta(file: string, dir: string): BlogPostMeta | null {
  const filePath = path.join(dir, file);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return {
    slug: file.replace(/\.mdx$/, ""),
    title: data.title ?? "",
    excerpt: data.excerpt ?? "",
    category: (data.category as string) ?? "",
    date: data.date ?? "",
    isoDate: data.isoDate ?? "",
    readingTime: (data.readingTime as string) || estimateReadingTime(content),
    gradientFrom: data.gradientFrom ?? "#1a1a2e",
    gradientTo: data.gradientTo ?? "#16213e",
    image: (data.image as string) || undefined,
    featured: (data.featured as boolean) || false,
  } satisfies BlogPostMeta;
}

export const getAllPosts = cache((locale = "es"): BlogPostMeta[] => {
  const dir = blogDir(locale);
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));
  const posts = files
    .map((file) => parsePostMeta(file, dir))
    .filter((p): p is BlogPostMeta => p !== null);
  return posts.sort(
    (a, b) => new Date(b.isoDate).getTime() - new Date(a.isoDate).getTime(),
  );
});

export const getPostBySlug = cache(
  (
    slug: string,
    locale = "es",
  ): { meta: BlogPostMeta; content: string } | null => {
    if (!/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(slug)) return null;
    const dir = blogDir(locale);
    const filePath = path.join(dir, `${slug}.mdx`);
    if (!fs.existsSync(filePath)) return null;
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);
    return {
      meta: {
        slug,
        title: data.title ?? "",
        excerpt: data.excerpt ?? "",
        category: (data.category as string) ?? "",
        date: data.date ?? "",
        isoDate: data.isoDate ?? "",
        readingTime:
          (data.readingTime as string) || estimateReadingTime(content),
        gradientFrom: data.gradientFrom ?? "#1a1a2e",
        gradientTo: data.gradientTo ?? "#16213e",
        image: (data.image as string) || undefined,
        featured: (data.featured as boolean) || false,
      },
      content,
    };
  },
);
