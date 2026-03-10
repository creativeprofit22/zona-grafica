import type { PullQuoteData } from "@/components/ui/PullQuote";
import type { HomeData, Stat } from "@/types/content";

export const homeData: HomeData = {
  hero: {
    headline: ["zona", "GRÁFICA", "diseño que", "habla"],
    subtitle: "(estudio creativo)",
    scrollPrompt: "Scroll para descubrir",
    location: "San Miguel de Allende, GTO · Desde 1993",
  },
  manifesto: {
    segments: [
      { text: "Fundé Zona Gráfica" },
      { text: "porque creo que", style: "italic" },
      { text: "el diseño no es decoración", style: "bold-accent" },
      { text: "es" },
      { text: "comunicación.", style: "bold" },
      { text: "Llevamos más de" },
      { text: "30 años", style: "ochre" },
      { text: "haciendo carteles, libros, marcas e identidades desde" },
      { text: "San Miguel de Allende.", style: "bold" },
      { text: "Hemos retratado a" },
      { text: "Tim Burton,", style: "italic" },
      { text: "diseñado" },
      { text: "22 años", style: "ochre" },
      { text: "la imagen del" },
      { text: "GIFF,", style: "bold" },
      { text: "y creado el cartel de la" },
      { text: "edición 33", style: "ochre" },
      { text: "del Cervantino." },
      { text: "No seguimos tendencias." },
      { text: "Hacemos diseño con raíz.", style: "bold-accent" },
    ],
    attribution: "Jesús Herrera, fundador",
  },
  cta: {
    headline: "¿Tienes una idea? Platiquemos",
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

export const pullQuotes: PullQuoteData[] = [
  {
    text: "No hacemos diseño bonito. Hacemos diseño que mueve, que comunica, que conecta, que deja marca.",
    accentPhrase: "diseño que mueve",
  },
];
