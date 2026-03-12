import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site";
import { projects } from "@/data/work";
import { getAllPosts } from "@/lib/blog";

const BASE_URL = siteConfig.url;

function localizedEntry(
  path: string,
  opts: {
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority: number;
    lastModified?: Date;
  },
): MetadataRoute.Sitemap[number] {
  const esUrl = path ? `${BASE_URL}/${path}` : BASE_URL;
  const enUrl = path ? `${BASE_URL}/en/${path}` : `${BASE_URL}/en`;
  return {
    url: esUrl,
    lastModified: opts.lastModified ?? new Date(),
    changeFrequency: opts.changeFrequency,
    priority: opts.priority,
    alternates: {
      languages: {
        es: esUrl,
        en: enUrl,
      },
    },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    localizedEntry("", { changeFrequency: "monthly", priority: 1.0 }),
    localizedEntry("portafolio", { changeFrequency: "monthly", priority: 0.8 }),
    localizedEntry("servicios", { changeFrequency: "monthly", priority: 0.8 }),
    localizedEntry("nosotros", { changeFrequency: "monthly", priority: 0.7 }),
    localizedEntry("blog", { changeFrequency: "weekly", priority: 0.7 }),
    localizedEntry("contacto", { changeFrequency: "yearly", priority: 0.6 }),
  ];

  const projectRoutes: MetadataRoute.Sitemap = projects
    .filter((p) => p.featured)
    .map((p) =>
      localizedEntry(`portafolio/${p.slug}`, {
        changeFrequency: "monthly",
        priority: 0.7,
      }),
    );

  const blogRoutes: MetadataRoute.Sitemap = getAllPosts().map((post) =>
    localizedEntry(`blog/${post.slug}`, {
      changeFrequency: "yearly",
      priority: 0.6,
      lastModified: post.isoDate ? new Date(post.isoDate) : new Date(),
    }),
  );

  return [...staticRoutes, ...projectRoutes, ...blogRoutes];
}
