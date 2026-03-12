import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import CTASection from "@/components/home/CTASection";
import ServicesHero from "@/components/services/ServicesHero";
import ServicesList from "@/components/services/ServicesList";
import ServicesProcess from "@/components/services/ServicesProcess";
import { getDictionary } from "@/data/dictionaries";
import { siteConfig } from "@/data/site";
import { localeAlternates } from "@/lib/alternates";
import { webPageSchema } from "@/lib/jsonld";

type Locale = "es" | "en";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "en" ? "Services" : "Servicios",
    description:
      locale === "en"
        ? "Branding, editorial design, web, photography, illustration and poster design. Creative services from San Miguel de Allende."
        : "Branding, diseño editorial, web, fotografía, ilustración y cartelería. Servicios creativos desde San Miguel de Allende.",
    alternates: localeAlternates("servicios", locale),
  };
}

export default async function ServiciosPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { services } = await getDictionary(locale as Locale);
  return (
    <main id="main-content">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            webPageSchema({
              name: locale === "en" ? "Services" : "Servicios",
              description:
                locale === "en"
                  ? "Creative graphic design and branding services."
                  : "Servicios creativos de diseño gráfico y branding.",
              url: "/servicios",
              locale: locale as Locale,
            }),
          ).replace(/</g, "\\u003c"),
        }}
      />

      <ServicesHero serviceCount={services.length} />

      <ServicesList services={services} />

      <ServicesProcess />

      <CTASection
        headline={
          locale === "en"
            ? "Have a project in mind? Let's talk"
            : "¿Tienes un proyecto en mente? Platiquemos"
        }
        whatsappLabel={
          locale === "en" ? "Message us on WhatsApp" : "Escríbenos por WhatsApp"
        }
        whatsappHref={siteConfig.contact.whatsapp}
        emailLabel={locale === "en" ? "Send us an email" : "Mándanos un correo"}
        emailHref={`mailto:${siteConfig.contact.email}`}
      />
    </main>
  );
}
