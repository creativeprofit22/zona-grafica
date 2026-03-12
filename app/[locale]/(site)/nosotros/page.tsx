import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import AboutHero from "@/components/about/AboutHero";
import AboutStory from "@/components/about/AboutStory";
import TeamSection from "@/components/about/TeamSection";
import ValuesGrid from "@/components/about/ValuesGrid";
import CTASection from "@/components/home/CTASection";
import { getDictionary } from "@/data/dictionaries";
import { siteConfig } from "@/data/site";
import { localeAlternates } from "@/lib/alternates";
import { aboutPageSchema, faqSchema } from "@/lib/jsonld";

type Locale = "es" | "en";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "en" ? "About" : "Nosotros",
    description:
      locale === "en"
        ? "Meet Zona Gráfica · creative studio founded by Jesús Herrera in San Miguel de Allende, Guanajuato."
        : "Conoce a Zona Gráfica · estudio creativo fundado por Jesús Herrera en San Miguel de Allende, Guanajuato.",
    alternates: localeAlternates("nosotros", locale),
  };
}

export default async function NosotrosPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { story, team, values, aboutFAQ } = await getDictionary(
    locale as Locale,
  );
  return (
    <main id="main-content">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            aboutPageSchema({
              name: `${locale === "en" ? "About" : "Nosotros"} · Zona Gráfica`,
              description: story.intro,
              locale: locale as Locale,
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
        headline={
          locale === "en"
            ? "Want to work with us? Let's talk"
            : "¿Quieres trabajar con nosotros? Platiquemos"
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
