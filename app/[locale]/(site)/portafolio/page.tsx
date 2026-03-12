import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import PortfolioClient from "@/components/portfolio/PortfolioClient";
import PortfolioHero from "@/components/portfolio/PortfolioHero";
import { getDictionary } from "@/data/dictionaries";
import { localeAlternates } from "@/lib/alternates";
import { webPageSchema } from "@/lib/jsonld";

type Locale = "es" | "en";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "en" ? "Portfolio" : "Portafolio",
    description:
      locale === "en"
        ? "Explore our work: branding, editorial design, web, photography, illustration and poster design."
        : "Explora nuestro trabajo: branding, diseño editorial, web, fotografía, ilustración y cartelería.",
    alternates: localeAlternates("portafolio", locale),
  };
}

export default async function PortafolioPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { projects, portfolioCategories } = await getDictionary(
    locale as Locale,
  );
  return (
    <main id="main-content">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            webPageSchema({
              name: locale === "en" ? "Portfolio" : "Portafolio",
              description:
                locale === "en"
                  ? "Branding, editorial design, web, photography and illustration projects."
                  : "Proyectos de branding, diseño editorial, web, fotografía e ilustración.",
              url: "/portafolio",
              locale: locale as Locale,
            }),
          ).replace(/</g, "\\u003c"),
        }}
      />

      <PortfolioHero
        title={locale === "en" ? "Our work" : "Nuestro trabajo"}
        description={
          locale === "en"
            ? "Every project is a story. Here are the ones we're most proud of."
            : "Cada proyecto es una historia. Aquí están las que más nos enorgullecen."
        }
        projectCount={projects.length}
      />

      <PortfolioClient projects={projects} categories={portfolioCategories} />
    </main>
  );
}
