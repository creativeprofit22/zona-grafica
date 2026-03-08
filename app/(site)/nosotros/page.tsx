import type { Metadata } from "next";
import AboutHero from "@/components/about/AboutHero";
import AboutStory from "@/components/about/AboutStory";
import TeamSection from "@/components/about/TeamSection";
import ValuesGrid from "@/components/about/ValuesGrid";
import CTASection from "@/components/home/CTASection";
import { story, team, values } from "@/data/about";
import { aboutFAQ } from "@/data/faq";
import { siteConfig } from "@/data/site";
import { aboutPageSchema, faqSchema } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "Conoce a Zona Gráfica — estudio creativo fundado por Jesús Herrera en San Miguel de Allende, Guanajuato.",
  alternates: { canonical: "/nosotros" },
};

export default function NosotrosPage() {
  return (
    <main id="main-content">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            aboutPageSchema({
              name: "Nosotros — Zona Gráfica",
              description: story.intro,
            }),
          ).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema(aboutFAQ)).replace(/</g, "\\u003c"),
        }}
      />

      <AboutHero
        headline={story.headline}
        intro={story.intro}
        sectors={story.sectors}
      />

      <AboutStory segments={story.bodySegments} />

      <ValuesGrid values={values} />

      <TeamSection members={team} />

      <CTASection
        headline="¿Quieres trabajar con nosotros?"
        whatsappLabel="Escríbenos por WhatsApp"
        whatsappHref={siteConfig.contact.whatsapp}
        emailLabel="Mándanos un correo"
        emailHref={`mailto:${siteConfig.contact.email}`}
      />
    </main>
  );
}
