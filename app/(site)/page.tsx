import { homeFAQ } from "@/data/faq";
import { homeData, pullQuotes, stats, testimonials } from "@/data/home";
import { services } from "@/data/services";
import { siteConfig } from "@/data/site";
import { projects } from "@/data/work";
import { faqSchema, webPageSchema } from "@/lib/jsonld";
import type { Metadata } from "next";

import CTASection from "@/components/home/CTASection";
import ClientMarquee from "@/components/home/ClientMarquee";
import FeaturedShowcase from "@/components/home/FeaturedShowcase";
import HeroSection from "@/components/home/HeroSection";
import ManifestoSection from "@/components/home/ManifestoSection";
import ServiceAccordion from "@/components/home/ServiceAccordion";
import StatsStrip from "@/components/home/StatsStrip";
import TestimonialCarousel from "@/components/home/TestimonialCarousel";
import PullQuote from "@/components/ui/PullQuote";
import SectionNumber from "@/components/ui/SectionNumber";

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

        <div style={{ position: "relative" }}>
          <SectionNumber n={1} />
          <ManifestoSection />
        </div>

        <ClientMarquee />

        <div style={{ position: "relative" }}>
          <SectionNumber n={2} />
          <ServiceAccordion services={services} />
        </div>

        <PullQuote data={pullQuotes[0]} />

        <div style={{ position: "relative" }}>
          <SectionNumber n={3} />
          <FeaturedShowcase projects={featuredProjects} />
        </div>

        <div style={{ position: "relative" }}>
          <SectionNumber n={4} />
          <StatsStrip stats={stats} />
        </div>

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
