import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { cache } from "react";

export interface BlogPostMeta {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  isoDate: string;
  readingTime: string;
  featured: boolean;
  gradientFrom: string;
  gradientTo: string;
  image?: string;
}

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export const getAllPosts = cache((): BlogPostMeta[] => {
  if (!fs.existsSync(BLOG_DIR)) return [];
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));
  const posts = files.map((file) => {
    const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf-8");
    const { data } = matter(raw);
    return {
      slug: file.replace(/\.mdx$/, ""),
      title: data.title ?? "",
      excerpt: data.excerpt ?? "",
      category: (data.category as string) ?? "",
      date: data.date ?? "",
      isoDate: data.isoDate ?? "",
      readingTime: data.readingTime ?? "",
      featured: data.featured === true,
      gradientFrom: data.gradientFrom ?? "#1a1a2e",
      gradientTo: data.gradientTo ?? "#16213e",
      ...(data.image ? { image: data.image as string } : {}),
    } satisfies BlogPostMeta;
  });
  return posts.sort(
    (a, b) => new Date(b.isoDate).getTime() - new Date(a.isoDate).getTime(),
  );
});

export const getPostBySlug = cache(
  (slug: string): { meta: BlogPostMeta; content: string } | null => {
    if (!/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(slug)) return null;
    const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
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
        readingTime: data.readingTime ?? "",
        featured: data.featured === true,
        gradientFrom: data.gradientFrom ?? "#1a1a2e",
        gradientTo: data.gradientTo ?? "#16213e",
        ...(data.image ? { image: data.image as string } : {}),
      },
      content,
    };
  },
);
