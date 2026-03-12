import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import PortfolioClient from "@/components/portfolio/PortfolioClient";
import PortfolioHero from "@/components/portfolio/PortfolioHero";
import { portfolioCategories, projects } from "@/data/work";
import { localeAlternates } from "@/lib/alternates";
import { webPageSchema } from "@/lib/jsonld";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Portafolio",
    description:
      "Explora nuestro trabajo: branding, diseño editorial, web, fotografía, ilustración y cartelería.",
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
  return (
    <main id="main-content">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            webPageSchema({
              name: "Portafolio",
              description:
                "Proyectos de branding, diseño editorial, web, fotografía e ilustración.",
              url: "/portafolio",
            }),
          ).replace(/</g, "\\u003c"),
        }}
      />

      <PortfolioHero
        title="Nuestro trabajo"
        description="Cada proyecto es una historia. Aquí están las que más nos enorgullecen."
        projectCount={projects.length}
      />

      <PortfolioClient projects={projects} categories={portfolioCategories} />
    </main>
  );
}
