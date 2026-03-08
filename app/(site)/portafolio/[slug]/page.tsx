import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CaseStudyGallery from "@/components/case-study/CaseStudyGallery";
import CaseStudyHero from "@/components/case-study/CaseStudyHero";
import CaseStudyNarrative from "@/components/case-study/CaseStudyNarrative";
import CaseStudyTestimonial from "@/components/case-study/CaseStudyTestimonial";
import ProjectDetail from "@/components/case-study/ProjectDetail";
import RelatedProjects from "@/components/case-study/RelatedProjects";
import { caseStudies, projects } from "@/data/work";
import { breadcrumbSchema } from "@/lib/jsonld";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: `${project.title} — ${project.client}`,
    description: project.description,
    alternates: { canonical: `/portafolio/${slug}` },
  };
}

export async function generateStaticParams() {
  return projects.filter((p) => p.featured).map((p) => ({ slug: p.slug }));
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const caseStudy = caseStudies.find((cs) => cs.slug === slug);
  const project = caseStudy ?? projects.find((p) => p.slug === slug);

  if (!project) notFound();

  // Resolve related projects from slugs
  const relatedProjects = caseStudy
    ? caseStudy.relatedSlugs
        .map((s) => projects.find((p) => p.slug === s))
        .filter((p): p is (typeof projects)[number] => p !== undefined)
    : [];

  return (
    <main id="main-content">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: "Inicio", url: "/" },
              { name: "Portafolio", url: "/portafolio" },
              { name: project.title, url: `/portafolio/${slug}` },
            ]),
          ).replace(/</g, "\\u003c"),
        }}
      />

      <CaseStudyHero project={project} />

      {caseStudy ? (
        <>
          <CaseStudyNarrative
            brief={caseStudy.brief}
            approach={caseStudy.approach}
            result={caseStudy.result}
            stats={caseStudy.stats}
          />

          <CaseStudyGallery images={caseStudy.gallery} />

          {caseStudy.testimonial && (
            <CaseStudyTestimonial testimonial={caseStudy.testimonial} />
          )}

          <RelatedProjects projects={relatedProjects} />
        </>
      ) : (
        <ProjectDetail project={project} />
      )}
    </main>
  );
}
