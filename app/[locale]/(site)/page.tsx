import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import ClientMarquee from "@/components/home/ClientMarquee";
import CTASection from "@/components/home/CTASection";
import FeaturedShowcase from "@/components/home/FeaturedShowcase";
import HeroSection from "@/components/home/HeroSection";
import ManifestoSection from "@/components/home/ManifestoSection";
import ServiceAccordion from "@/components/home/ServiceAccordion";
import StatsStrip from "@/components/home/StatsStrip";
import PullQuote from "@/components/ui/PullQuote";
import SectionNumber from "@/components/ui/SectionNumber";
import { clients } from "@/data/clients";
import { getDictionary } from "@/data/dictionaries";
import { siteConfig } from "@/data/site";
import { localeAlternates } from "@/lib/alternates";
import { faqSchema, webPageSchema } from "@/lib/jsonld";

type Locale = "es" | "en";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: `${siteConfig.name} · ${locale === "en" ? "Creative Studio in" : "Estudio Creativo en"} ${siteConfig.location.city}`,
    description: siteConfig.description,
    alternates: localeAlternates("", locale),
    openGraph: {
      title: `${siteConfig.name} · ${siteConfig.tagline}`,
      description: siteConfig.description,
      type: "website",
      url: "/",
      images: [
        {
          url: "/og-image-v2.png",
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} · Estudio Creativo en ${siteConfig.location.city}`,
        },
      ],
    },
  };
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const dict = await getDictionary(locale as Locale);
  const { homeData, pullQuotes, stats, services, projects, homeFAQ } = dict;
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
              name: `${siteConfig.name} · ${siteConfig.tagline}`,
              description: siteConfig.description,
              url: "/",
              locale: locale as Locale,
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
        <HeroSection hero={homeData.hero} />

        <div style={{ position: "relative" }}>
          <SectionNumber n={1} />
          <ManifestoSection manifesto={homeData.manifesto} />
        </div>

        <ClientMarquee
          clients={clients}
          tagline={
            locale === "en"
              ? "Good clients make good stories."
              : "Buenos clientes hacen buenas historias."
          }
        />

        <div style={{ position: "relative" }}>
          <SectionNumber n={2} />
          <ServiceAccordion services={services} />
        </div>

        {pullQuotes[0] && <PullQuote data={pullQuotes[0]} />}

        <div style={{ position: "relative" }}>
          <SectionNumber n={3} />
          <FeaturedShowcase projects={featuredProjects} />
        </div>

        <div style={{ position: "relative" }}>
          <SectionNumber n={4} />
          <StatsStrip stats={stats} />
        </div>

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
