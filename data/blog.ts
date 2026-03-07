import type { BlogCategory } from "@/types/content";

export const blogCategories: BlogCategory[] = [
  {
    slug: "branding",
    label: "Branding",
    description: "Estrategia de marca, identidad visual y posicionamiento.",
    color: "#C45D3E",
  },
  {
    slug: "diseno",
    label: "Diseño",
    description: "Tendencias, técnicas y herramientas de diseño gráfico.",
    color: "#D4893F",
  },
  {
    slug: "web",
    label: "Web",
    description: "Diseño web, UX/UI, SEO y presencia digital.",
    color: "#2A3F5F",
  },
  {
    slug: "proceso",
    label: "Proceso",
    description: "Detrás de escena: cómo trabajamos y por qué.",
    color: "#7A756E",
  },
  {
    slug: "inspiracion",
    label: "Inspiración",
    description: "Referencias, tendencias y cultura visual que nos mueve.",
    color: "#C4B9A8",
  },
];

export function getCategoryMeta(slug: string): BlogCategory | undefined {
  return blogCategories.find((c) => c.slug === slug);
}
