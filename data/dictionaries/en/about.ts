import type { ManifestoSegment, TeamMember, ValueItem } from "@/types/content";

export const story = {
  headline: "30 years making design from San Miguel de Allende",
  intro:
    "I founded Zona Gráfica in 1993 because I believe good design isn't a luxury — it's the most honest way to communicate. Since then, this studio has been my way of telling visual stories for culture, tourism, education, and the private sector in Guanajuato and beyond.",
  bodySegments: [
    { text: "For 22 years we've designed the visual identity of the" },
    {
      text: "GIFF, the Guanajuato International Film Festival,",
      style: "accent" as const,
    },
    { text: "where I've had the privilege of" },
    {
      text: "photographing Tim Burton, Spike Lee, Danny Boyle, and Peter Greenaway.",
      style: "ochre" as const,
    },
    { text: "We designed the poster for the" },
    {
      text: "33rd edition of the Festival Internacional Cervantino.",
      style: "accent" as const,
    },
    {
      text: "We created the commemorative book for the 475th anniversary of San Miguel de Allende and",
    },
    { text: "five art books", style: "ochre" as const },
    {
      text: "with Guanajuato World Heritage Site. We work across four sectors:",
    },
    {
      text: "Culture & Education, Private Sector, Tourism, and Art.",
      style: "accent" as const,
    },
    {
      text: "We're not a big agency, and we don't want to be. We're a studio where every project gets the attention it deserves.",
    },
  ] satisfies ManifestoSegment[],
  sectors: ["Culture & Education", "Private Sector", "Tourism", "Art"],
};

export const values: ValueItem[] = [
  {
    title: "Design with roots",
    description:
      "Every project is rooted in its context: the history, the place, the people. We don't apply formulas. We listen, research, and design from what's authentic.",
  },
  {
    title: "Obsession with detail",
    description:
      "Every curve, every space, every typographic decision has a reason behind it. We don't deliver anything we're not proud of.",
  },
  {
    title: "Communicate, don't decorate",
    description:
      "Design that doesn't communicate is visual noise. Everything we do has a purpose: connecting an idea with the right people.",
  },
  {
    title: "Creative honesty",
    description:
      "We tell you what you need to hear, not what you want to hear. Good communication makes good projects.",
  },
];

export const team: TeamMember[] = [
  {
    name: "Jesús Herrera",
    role: "Creative Director & Founder",
    image: "",
    bio: "Graphic designer and photographer with over 30 years of experience. He's designed the GIFF's visual identity for 22 years, photographed Tim Burton and Spike Lee, created the poster for the 33rd edition of the Cervantino, and published five art books about Guanajuato. From San Miguel de Allende, he leads Zona Gráfica with the conviction that design is the most powerful way to tell a story.",
  },
];
