import type { CaseStudy, Project } from "@/types/content";

export const projects: Project[] = [
  /* ─── Featured Projects (heaviest hitters) ─────────────── */
  {
    id: "giff-identidad",
    slug: "giff-identidad",
    title: "GIFF",
    client: "Guanajuato International Film Festival",
    category: "branding",
    year: 2024,
    thumbnail: "/images/portfolio/giff-thumb.jpg",
    description:
      "22 años diseñando la identidad visual del festival internacional de cine de Guanajuato. Branding, cartelería, web y fotografía de invitados.",
    tags: ["Branding", "Cartel", "Fotografía", "Web"],
    featured: true,
  },
  {
    id: "cervantino-cartel",
    slug: "cervantino-cartel",
    title: "Festival Cervantino",
    client: "Festival Internacional Cervantino",
    category: "poster",
    year: 2023,
    thumbnail: "/images/portfolio/cervantino-thumb.jpg",
    description:
      "Cartel y campaña gráfica para la edición 33 del festival cultural más importante de Latinoamérica.",
    tags: ["Cartel", "Campaña", "Evento Cultural"],
    featured: true,
  },
  {
    id: "cardo-cafe",
    slug: "cardo-cafe",
    title: "Cardo Café",
    client: "Cardo Café",
    category: "branding",
    year: 2024,
    thumbnail: "/images/portfolio/cardo-cafe-thumb.jpg",
    description:
      "Identidad visual completa para cafetería de especialidad en San Miguel de Allende. Logotipo, papelería, menú y señalética.",
    tags: ["Logotipo", "Identidad", "Papelería", "Menú"],
    featured: true,
  },
  {
    id: "lobby-branding",
    slug: "lobby-branding",
    title: "Lobby",
    client: "Lobby Restaurante",
    category: "branding",
    year: 2023,
    thumbnail: "/images/portfolio/lobby-thumb.jpg",
    description:
      "Branding integral para restaurante de autor en el centro histórico de San Miguel de Allende.",
    tags: ["Logotipo", "Menú", "Señalética", "Identidad"],
    featured: true,
  },
  {
    id: "duncan-galeria",
    slug: "duncan-galeria",
    title: "Duncan Galería",
    client: "Duncan Galería",
    category: "branding",
    year: 2022,
    thumbnail: "/images/portfolio/duncan-thumb.jpg",
    description:
      "Identidad visual y sitio web para galería de arte contemporáneo en San Miguel de Allende.",
    tags: ["Branding", "Sitio Web", "Galería"],
    featured: true,
  },
  {
    id: "zeferino-mezcal",
    slug: "zeferino-mezcal",
    title: "Zeferino Mezcal",
    client: "Zeferino Mezcal",
    category: "branding",
    year: 2021,
    thumbnail: "/images/portfolio/zeferino-thumb.jpg",
    description:
      "Identidad de marca y diseño de etiqueta para mezcal artesanal de Guanajuato.",
    tags: ["Branding", "Etiqueta", "Packaging"],
    featured: true,
  },

  /* ─── Additional Projects ──────────────────────────────── */
  {
    id: "sma-475",
    slug: "sma-475",
    title: "SMA 475 Aniversario",
    client: "Municipio de San Miguel de Allende",
    category: "editorial",
    year: 2017,
    thumbnail: "/images/portfolio/sma-475-thumb.jpg",
    description:
      "Libro conmemorativo del 475 aniversario de la fundación de San Miguel de Allende. Diseño editorial, fotografía y producción.",
    tags: ["Libro", "Diseño Editorial", "Fotografía"],
    featured: false,
  },
  {
    id: "guanajuato-patrimonio",
    slug: "guanajuato-patrimonio",
    title: "Guanajuato Patrimonio",
    client: "Gobierno del Estado de Guanajuato",
    category: "editorial",
    year: 2020,
    thumbnail: "/images/portfolio/guanajuato-patrimonio-thumb.jpg",
    description:
      "Serie de cinco libros de arte sobre Guanajuato Patrimonio de la Humanidad. Diseño editorial y dirección de arte fotográfica.",
    tags: ["Libro de Arte", "Diseño Editorial", "Fotografía"],
    featured: false,
  },
  {
    id: "consejo-turistico",
    slug: "consejo-turistico",
    title: "Consejo Turístico SMA",
    client: "Consejo Turístico de San Miguel de Allende",
    category: "branding",
    year: 2022,
    thumbnail: "/images/portfolio/consejo-turistico-thumb.jpg",
    description:
      "Identidad visual y materiales de comunicación para el consejo turístico de San Miguel de Allende.",
    tags: ["Branding", "Materiales", "Turismo"],
    featured: false,
  },
  {
    id: "prospecta",
    slug: "prospecta",
    title: "Prospecta",
    client: "Prospecta",
    category: "branding",
    year: 2022,
    thumbnail: "/images/portfolio/prospecta-thumb.jpg",
    description:
      "Identidad corporativa y sistema visual para empresa de consultoría y desarrollo.",
    tags: ["Logotipo", "Identidad Corporativa", "Papelería"],
    featured: false,
  },
  {
    id: "casa-misha",
    slug: "casa-misha",
    title: "Casa Misha",
    client: "Casa Misha",
    category: "branding",
    year: 2023,
    thumbnail: "/images/portfolio/casa-misha-thumb.jpg",
    description:
      "Branding y señalética para hotel boutique en San Miguel de Allende.",
    tags: ["Branding", "Señalética", "Hospitalidad"],
    featured: false,
  },
  {
    id: "geek-logo",
    slug: "geek-logo",
    title: "Geek",
    client: "Geek Store",
    category: "branding",
    year: 2022,
    thumbnail: "/images/portfolio/geek-thumb.jpg",
    description:
      "Logotipo y sistema de identidad para tienda de tecnología y cultura pop.",
    tags: ["Logotipo", "Identidad", "Retail"],
    featured: false,
  },
  {
    id: "cpi-identidad",
    slug: "cpi-identidad",
    title: "CPI",
    client: "CPI",
    category: "branding",
    year: 2021,
    thumbnail: "/images/portfolio/cpi-thumb.jpg",
    description:
      "Identidad visual y materiales corporativos para consultoría profesional.",
    tags: ["Logotipo", "Identidad", "Corporativo"],
    featured: false,
  },
  {
    id: "giff-fotografia",
    slug: "giff-fotografia",
    title: "GIFF — Retratos",
    client: "Guanajuato International Film Festival",
    category: "fotografia",
    year: 2023,
    thumbnail: "/images/portfolio/giff-retratos-thumb.jpg",
    description:
      "Fotografía de invitados especiales del GIFF: Tim Burton, Spike Lee, Danny Boyle, Peter Greenaway y más.",
    tags: ["Retrato", "Evento", "Cine"],
    featured: false,
  },
  {
    id: "artes-mexico-editorial",
    slug: "artes-mexico-editorial",
    title: "Artes de México",
    client: "Artes de México",
    category: "editorial",
    year: 2020,
    thumbnail: "/images/portfolio/artes-mexico-thumb.jpg",
    description:
      "Colaboración editorial con Artes de México en publicaciones sobre patrimonio cultural.",
    tags: ["Revista", "Maquetación", "Tipografía"],
    featured: false,
  },
  {
    id: "cervantino-cartel-historico",
    slug: "cervantino-cartel-historico",
    title: "Cervantino — Carteles",
    client: "Festival Internacional Cervantino",
    category: "poster",
    year: 2019,
    thumbnail: "/images/portfolio/cervantino-carteles-thumb.jpg",
    description:
      "Serie histórica de carteles diseñados para distintas ediciones del Festival Internacional Cervantino.",
    tags: ["Cartel", "Serie", "Cultura"],
    featured: false,
  },
  {
    id: "ilustraciones-personajes",
    slug: "ilustraciones-personajes",
    title: "Personajes",
    client: "Proyectos Varios",
    category: "ilustracion",
    year: 2023,
    thumbnail: "/images/portfolio/personajes-thumb.jpg",
    description:
      "Serie de ilustraciones de personajes para proyectos de branding y comunicación.",
    tags: ["Personajes", "Digital", "Concepto"],
    featured: false,
  },
  {
    id: "giff-web",
    slug: "giff-web",
    title: "GIFF — Web",
    client: "Guanajuato International Film Festival",
    category: "web",
    year: 2023,
    thumbnail: "/images/portfolio/giff-web-thumb.jpg",
    description:
      "Diseño y desarrollo del sitio web para el festival internacional de cine de Guanajuato.",
    tags: ["Sitio Web", "UI/UX", "Responsive"],
    featured: false,
  },
  {
    id: "duncan-web",
    slug: "duncan-web",
    title: "Duncan — Web",
    client: "Duncan Galería",
    category: "web",
    year: 2022,
    thumbnail: "/images/portfolio/duncan-web-thumb.jpg",
    description:
      "Sitio web para galería de arte contemporáneo con catálogo en línea.",
    tags: ["Sitio Web", "Galería", "E-commerce"],
    featured: false,
  },
];

export const caseStudies: CaseStudy[] = [
  {
    ...projects[2], // Cardo Café
    heroImage: "/images/portfolio/cardo-cafe-hero.jpg",
    brief:
      "Cardo Café necesitaba una identidad que reflejara su propuesta: café de especialidad en un espacio con alma artesanal, ubicado en el corazón de San Miguel de Allende.",
    approach:
      "Desarrollamos un sistema visual inspirado en la planta del cardo — orgánico, resistente, con carácter. La paleta de colores terrosos y la tipografía manuscrita conectan con la calidez del lugar.",
    result:
      "La nueva identidad posicionó a Cardo Café como referencia de café artesanal en la región. El reconocimiento de marca aumentó significativamente en los primeros meses.",
    gallery: [
      {
        src: "/images/portfolio/cardo-cafe-01.jpg",
        alt: "Logotipo Cardo Café",
        width: "full",
      },
      {
        src: "/images/portfolio/cardo-cafe-02.jpg",
        alt: "Papelería Cardo Café",
        width: "half",
      },
      {
        src: "/images/portfolio/cardo-cafe-03.jpg",
        alt: "Menú Cardo Café",
        width: "half",
      },
      {
        src: "/images/portfolio/cardo-cafe-04.jpg",
        alt: "Señalética Cardo Café",
        width: "full",
      },
    ],
    relatedSlugs: ["lobby-branding", "zeferino-mezcal"],
  },
];

export const portfolioCategories = [
  { slug: "todos", label: "Todos" },
  { slug: "branding", label: "Branding" },
  { slug: "editorial", label: "Editorial" },
  { slug: "web", label: "Web" },
  { slug: "fotografia", label: "Fotografía" },
  { slug: "ilustracion", label: "Ilustración" },
  { slug: "poster", label: "Poster / Cartel" },
  { slug: "carteleria", label: "Cartelería" },
  { slug: "video", label: "Video" },
] as const;
