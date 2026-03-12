import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import CTASection from "@/components/home/CTASection";
import ServicesHero from "@/components/services/ServicesHero";
import ServicesList from "@/components/services/ServicesList";
import ServicesProcess from "@/components/services/ServicesProcess";
import { services } from "@/data/services";
import { siteConfig } from "@/data/site";
import { localeAlternates } from "@/lib/alternates";
import { webPageSchema } from "@/lib/jsonld";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Servicios",
    description:
      "Branding, diseño editorial, web, fotografía, ilustración y cartelería. Servicios creativos desde San Miguel de Allende.",
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
  return (
    <main id="main-content">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            webPageSchema({
              name: "Servicios",
              description: "Servicios creativos de diseño gráfico y branding.",
              url: "/servicios",
            }),
          ).replace(/</g, "\\u003c"),
        }}
      />

      <ServicesHero serviceCount={services.length} />

      <ServicesList services={services} />

      <ServicesProcess />

      <CTASection
        headline="¿Tienes un proyecto en mente? Platiquemos"
        whatsappLabel="Escríbenos por WhatsApp"
        whatsappHref={siteConfig.contact.whatsapp}
        emailLabel="Mándanos un correo"
        emailHref={`mailto:${siteConfig.contact.email}`}
      />
    </main>
  );
}
