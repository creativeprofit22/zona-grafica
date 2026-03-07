import { siteConfig } from "@/data/site";
import { homeData, stats, testimonials } from "@/data/home";
import { services } from "@/data/services";
import { projects } from "@/data/work";
import { homeFAQ } from "@/data/faq";
import { faqSchema, webPageSchema } from "@/lib/jsonld";
import type { Metadata } from "next";

import HeroSection from "@/components/home/HeroSection";
import ManifestoSection from "@/components/home/ManifestoSection";
import ServiceAccordion from "@/components/home/ServiceAccordion";
import FeaturedShowcase from "@/components/home/FeaturedShowcase";
import StatsStrip from "@/components/home/StatsStrip";
import TestimonialCarousel from "@/components/home/TestimonialCarousel";
import CTASection from "@/components/home/CTASection";
import ClientMarquee from "@/components/home/ClientMarquee";

export const metadata: Metadata = {
  title: `${siteConfig.name} — Estudio Creativo en ${siteConfig.location.city}`,
  description: siteConfig.description,
  alternates: { canonical: "/" },
  openGraph: {
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    type: "website",
    url: "/",
  },
};

export default function Home() {
  const { cta } = homeData;
  const featuredProjects = projects.filter((p) => p.featured).slice(0, 5);

  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            webPageSchema({
              name: `${siteConfig.name} — ${siteConfig.tagline}`,
              description: siteConfig.description,
              url: "/",
            }),
          ).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema(homeFAQ)).replace(/</g, "\\u003c"),
        }}
      />

      <main id="main-content">
        <HeroSection />

        <ManifestoSection />

        <ClientMarquee />

        <ServiceAccordion services={services} />

        <FeaturedShowcase projects={featuredProjects} />

        <StatsStrip stats={stats} />

        <TestimonialCarousel testimonials={testimonials} />

        <CTASection
          headline={cta.headline}
          whatsappLabel={cta.whatsappLabel}
          whatsappHref={siteConfig.contact.whatsapp}
          emailLabel={cta.emailLabel}
          emailHref={`mailto:${siteConfig.contact.email}`}
        />
      </main>
    </>
  );
}
