import type { Service } from "@/types/content";

export const services: Service[] = [
  {
    id: "branding",
    slug: "branding",
    number: "01",
    title: "Branding & Identidad",
    description:
      "Construimos la personalidad visual de tu marca desde cero. Logotipo, paleta de color, tipografía, aplicaciones: todo lo que necesitas para que tu marca hable por sí sola.",
    process: [
      "Investigación y análisis de mercado",
      "Desarrollo de concepto y estrategia",
      "Diseño de logotipo y sistema visual",
      "Manual de identidad y aplicaciones",
    ],
    image: "/images/portfolio/branding-hero.jpg",
  },
  {
    id: "editorial",
    slug: "editorial",
    number: "02",
    title: "Diseño Editorial",
    description:
      "Revistas, libros, catálogos, folletos. Diseño editorial que se siente tan bien como se lee. Cada página tiene ritmo, cada spread cuenta una historia.",
    process: [
      "Definición de formato y retícula",
      "Diseño de portada y páginas maestras",
      "Maquetación y composición tipográfica",
      "Preparación para impresión o digital",
    ],
    image: "/images/portfolio/editorial-hero.jpg",
  },
  {
    id: "web",
    slug: "web",
    number: "03",
    title: "Diseño Web",
    description:
      "Sitios web que no solo se ven increíbles: funcionan, convierten y posicionan. Diseño responsive con atención obsesiva al detalle.",
    process: [
      "Wireframes y arquitectura de información",
      "Diseño visual y prototipado",
      "Desarrollo front-end responsivo",
      "Optimización SEO y rendimiento",
    ],
    image: "/images/portfolio/web-hero.jpg",
  },
  {
    id: "fotografia",
    slug: "fotografia",
    number: "04",
    title: "Fotografía",
    description:
      "Fotografía profesional de producto, retrato, arquitectura y estilo de vida. Imágenes que capturan la esencia de tu marca con luz, composición y narrativa visual.",
    process: [
      "Planeación y dirección de arte",
      "Sesión fotográfica profesional",
      "Selección y edición de imágenes",
      "Entrega en formatos optimizados",
    ],
    image: "/images/portfolio/foto-hero.jpg",
  },
  {
    id: "ilustracion",
    slug: "ilustracion",
    number: "05",
    title: "Ilustración",
    description:
      "Ilustraciones originales que dan carácter único a tu marca. Desde personajes y mascotas hasta arte conceptual y murales. Cada trazo tiene intención.",
    process: [
      "Brief creativo y referencias visuales",
      "Bocetos y exploración de estilo",
      "Ilustración final en alta resolución",
      "Adaptación para diferentes formatos",
    ],
    image: "/images/portfolio/ilustracion-hero.jpg",
  },
  {
    id: "carteleria",
    slug: "carteleria",
    number: "06",
    title: "Cartelería & Pósters",
    description:
      "Diseño de carteles para eventos culturales, campañas publicitarias y comunicación visual de alto impacto. Piezas que se ven en la calle y no se olvidan.",
    process: [
      "Concepto creativo y composición",
      "Diseño tipográfico y gráfico",
      "Adaptación a diferentes formatos",
      "Supervisión de producción e impresión",
    ],
    image: "/images/portfolio/carteleria-hero.jpg",
  },
  {
    id: "video",
    slug: "video",
    number: "07",
    title: "Video & Producción Audiovisual",
    description:
      "Videos promocionales, cobertura de eventos, contenido para redes sociales y video corporativo. Producción audiovisual que cuenta tu historia con imagen en movimiento.",
    process: [
      "Pre-producción y guion",
      "Filmación y dirección",
      "Edición y post-producción",
      "Entrega y distribución",
    ],
    image: "/images/portfolio/video-hero.webp",
  },
];
