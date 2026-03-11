import type { ManifestoSegment, TeamMember, ValueItem } from "@/types/content";

export const story = {
  headline: "30 años haciendo diseño desde San Miguel de Allende",
  intro:
    "Fundé Zona Gráfica en 1993 porque creo que el buen diseño no es un lujo, es la forma más honesta de comunicar. Desde entonces, este estudio ha sido mi manera de contar historias visuales para la cultura, el turismo, la educación y la iniciativa privada de Guanajuato y más allá.",
  bodySegments: [
    { text: "Durante 22 años hemos diseñado la imagen del" },
    {
      text: "GIFF, el Guanajuato International Film Festival,",
      style: "accent" as const,
    },
    { text: "donde he tenido el privilegio de" },
    {
      text: "fotografiar a Tim Burton, Spike Lee, Danny Boyle y Peter Greenaway.",
      style: "ochre" as const,
    },
    { text: "Diseñamos el cartel de la" },
    {
      text: "edición 33 del Festival Internacional Cervantino.",
      style: "accent" as const,
    },
    {
      text: "Creamos el libro conmemorativo del 475 aniversario de San Miguel de Allende y",
    },
    { text: "cinco libros de arte", style: "ochre" as const },
    {
      text: "con Guanajuato Patrimonio de la Humanidad. Trabajamos en cuatro sectores:",
    },
    {
      text: "Cultura y Educación, Iniciativa Privada, Turismo, y Arte.",
      style: "accent" as const,
    },
    {
      text: "No somos una agencia grande ni queremos serlo. Somos un estudio donde cada proyecto recibe la atención que merece.",
    },
  ] satisfies ManifestoSegment[],
  sectors: ["Cultura y Educación", "Iniciativa Privada", "Turismo", "Arte"],
};

export const values: ValueItem[] = [
  {
    title: "Diseño con raíz",
    description:
      "Cada proyecto está enraizado en su contexto: la historia, el lugar, la gente. No aplicamos fórmulas. Escuchamos, investigamos y diseñamos desde lo auténtico.",
  },
  {
    title: "Obsesión por el detalle",
    description:
      "Cada curva, cada espacio, cada decisión tipográfica tiene una razón de ser. No entregamos nada que no nos enorgullezca.",
  },
  {
    title: "Comunicar, no decorar",
    description:
      "El diseño que no comunica es ruido visual. Todo lo que hacemos tiene un propósito: conectar una idea con las personas correctas.",
  },
  {
    title: "Honestidad creativa",
    description:
      "Te decimos lo que necesitas escuchar, no lo que quieres escuchar. La buena comunicación hace buenos proyectos.",
  },
];

export const team: TeamMember[] = [
  {
    name: "Jesús Herrera",
    role: "Director Creativo & Fundador",
    image: "",
    bio: "Diseñador gráfico y fotógrafo con más de 30 años de experiencia. Ha diseñado la imagen del GIFF durante 22 años, fotografiado a Tim Burton y Spike Lee, creado el cartel de la edición 33 del Cervantino, y publicado cinco libros de arte sobre Guanajuato. Desde San Miguel de Allende, dirige Zona Gráfica con la convicción de que el diseño es la forma más poderosa de contar una historia.",
  },
];
