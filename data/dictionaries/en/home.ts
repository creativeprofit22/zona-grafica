import type { PullQuoteData } from "@/components/ui/PullQuote";
import type { HomeData, Stat } from "@/types/content";

export const homeData: HomeData = {
  hero: {
    headline: ["zona", "GRÁFICA", "design that", "speaks"],
    subtitle: "(creative studio)",
    scrollPrompt: "Scroll to discover",
    location: "San Miguel de Allende, GTO · Since 1993",
  },
  manifesto: {
    segments: [
      { text: "I founded Zona Gráfica" },
      { text: "because I believe that", style: "italic" },
      { text: "design isn't decoration", style: "bold-accent" },
      { text: "it's" },
      { text: "communication.", style: "bold" },
      { text: "We've spent over" },
      { text: "30 years", style: "ochre" },
      { text: "making posters, books, brands and identities from" },
      { text: "San Miguel de Allende.", style: "bold" },
      { text: "We've photographed" },
      { text: "Tim Burton,", style: "italic" },
      { text: "designed" },
      { text: "22 years", style: "ochre" },
      { text: "of branding for the" },
      { text: "GIFF,", style: "bold" },
      { text: "and created the poster for the" },
      { text: "33rd edition", style: "ochre" },
      { text: "of the Cervantino." },
      { text: "We don't follow trends." },
      { text: "We make design with roots.", style: "bold-accent" },
    ],
    attribution: "Jesús Herrera, founder",
  },
  cta: {
    headline: "Got an idea? Let's talk",
    whatsappLabel: "WhatsApp →",
    emailLabel: "email →",
  },
};

export const stats: Stat[] = [
  {
    value: "30+",
    label: "years making design from San Miguel de Allende",
  },
  { value: "22", label: "years designing the GIFF's visual identity" },
  { value: "ed. 33", label: "of the Cervantino Festival. Our poster." },
  {
    value: "1",
    label: "portrait of Tim Burton we never published",
  },
  {
    value: "5",
    label: "art books with Guanajuato World Heritage Site",
  },
  { value: "∞", label: "coffees at the studio" },
];

export const pullQuotes: PullQuoteData[] = [
  {
    text: "We make design that moves, that communicates, that connects, that leaves a mark.",
    accentPhrase: "design that moves",
  },
];
