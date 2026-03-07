import PortfolioClient from "@/components/portfolio/PortfolioClient";
import PortfolioHero from "@/components/portfolio/PortfolioHero";
import { portfolioCategories, projects } from "@/data/work";
import { webPageSchema } from "@/lib/jsonld";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portafolio",
  description:
    "Explora nuestro trabajo: branding, diseño editorial, web, fotografía, ilustración y cartelería.",
  alternates: { canonical: "/portafolio" },
};

export default function PortafolioPage() {
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
