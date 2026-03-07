import type { HomeData, Stat } from "@/types/content";

export const homeData: HomeData = {
  hero: {
    headline: ["zona", "GRÁFICA", "diseño que", "habla"],
    subtitle: "(estudio creativo)",
    scrollPrompt: "Scroll para descubrir",
    location: "San Miguel de Allende, GTO · Desde 1993",
  },
  manifesto: {
    text: "Fundé Zona Gráfica porque creo que el diseño no es decoración — es comunicación. Llevamos más de 30 años haciendo carteles, libros, marcas e identidades desde San Miguel de Allende. Hemos retratado a Tim Burton, diseñado 22 años la imagen del GIFF, y creado el cartel de la edición 33 del Cervantino. No seguimos tendencias. Hacemos diseño con raíz.",
  },
  cta: {
    headline: "¿Tienes una idea? Platiquemos.",
    whatsappLabel: "WhatsApp →",
    emailLabel: "correo →",
  },
};

export const stats: Stat[] = [
  { value: "30+", label: "años haciendo diseño desde San Miguel de Allende" },
  { value: "22", label: "años diseñando la imagen del GIFF" },
  { value: "ed. 33", label: "del Festival Cervantino. Nuestro cartel." },
  {
    value: "1",
    label: "retrato de Tim Burton que nunca publicamos",
  },
  {
    value: "5",
    label: "libros de arte con Guanajuato Patrimonio de la Humanidad",
  },
  { value: "∞", label: "cafés en el estudio" },
];

/* Testimonials removed — better to have zero than fake ones.
   Will add real testimonials when available from clients. */
export const testimonials: never[] = [];
