/* ─── Content Type Contracts ──────────────────────────────────
   All data files implement these interfaces.
   Components accept these as props.
   lib/content.ts returns these types.
   Swap data/ → CMS without touching anything above this layer. */

export interface SiteConfig {
  name: string;
  tagline: string;
  description: string;
  url: string;
  locale: string;
  location: {
    city: string;
    state: string;
    country: string;
  };
  contact: {
    phone: string;
    email: string;
    whatsapp: string;
  };
  social: {
    instagram?: string;
    facebook?: string;
    behance?: string;
  };
}

export type PortfolioCategory =
  | "branding"
  | "editorial"
  | "web"
  | "fotografia"
  | "ilustracion"
  | "carteleria"
  | "poster"
  | "video";

export interface Project {
  id: string;
  slug: string;
  title: string;
  client: string;
  category: PortfolioCategory;
  year: number;
  thumbnail: string;
  description: string;
  tags: string[];
  featured: boolean;
}

export interface CaseStudy extends Project {
  heroImage: string;
  brief: string;
  approach: string;
  result: string;
  gallery: CaseStudyImage[];
  testimonial?: Testimonial;
  stats?: CaseStudyStat[];
  relatedSlugs: string[];
}

export interface CaseStudyImage {
  src: string;
  alt: string;
  width?: "full" | "half";
  caption?: string;
}

export interface CaseStudyStat {
  label: string;
  value: string;
}

export interface Service {
  id: string;
  slug: string;
  number: string;
  title: string;
  description: string;
  process: string[];
  image: string;
}

export interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface NavLink {
  number: string;
  label: string;
  href: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface BlogCategory {
  slug: string;
  label: string;
  description: string;
  color: string;
}

export interface ValueItem {
  title: string;
  description: string;
}

export interface ManifestoSegment {
  text: string;
  style?: "bold" | "italic" | "accent" | "ochre" | "bold-accent";
}

export interface HomeData {
  hero: {
    headline: string[];
    subtitle: string;
    scrollPrompt: string;
    location: string;
  };
  manifesto: {
    segments: ManifestoSegment[];
    attribution: string;
  };
  cta: {
    headline: string;
    whatsappLabel: string;
    emailLabel: string;
  };
}
