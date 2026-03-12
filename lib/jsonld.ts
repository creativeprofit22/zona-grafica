import { siteConfig } from "@/data/site";

const SITE_URL = siteConfig.url;
const SITE_NAME = siteConfig.name;

type Locale = "es" | "en";

function langTag(locale: Locale): string {
  return locale === "es" ? "es-MX" : "en-US";
}

export function organizationSchema(locale: Locale = "es") {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.svg`,
    description: siteConfig.description,
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.location.city,
      addressRegion: siteConfig.location.state,
      addressCountry: siteConfig.location.country,
    },
    sameAs: [
      siteConfig.social.instagram,
      siteConfig.social.facebook,
      siteConfig.social.behance,
    ].filter(Boolean),
    priceRange: "$$",
    knowsLanguage: ["es", "en"],
    inLanguage: langTag(locale),
  };
}

export function webSiteSchema(locale: Locale = "es") {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: langTag(locale),
  };
}

export function webPageSchema({
  name,
  description,
  url,
  locale = "es",
}: {
  name: string;
  description: string;
  url: string;
  locale?: Locale;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url: `${SITE_URL}${url}`,
    inLanguage: langTag(locale),
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
  };
}

export function aboutPageSchema({
  name,
  description,
  url = "/nosotros",
  locale = "es",
}: {
  name: string;
  description: string;
  url?: string;
  locale?: Locale;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name,
    description,
    url: `${SITE_URL}${url}`,
    inLanguage: langTag(locale),
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
  };
}

export function articleSchema({
  headline,
  description,
  datePublished,
  url,
  image,
  locale = "es",
}: {
  headline: string;
  description: string;
  datePublished: string;
  url: string;
  image?: string;
  locale?: Locale;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline,
    description,
    datePublished,
    url: `${SITE_URL}${url}`,
    inLanguage: langTag(locale),
    ...(image ? { image: `${SITE_URL}${image}` } : {}),
    author: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/images/logo.svg` },
    },
  };
}

export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}
