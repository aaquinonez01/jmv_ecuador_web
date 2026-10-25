// Contenido fijo de la página de estatutos, redactado a partir del texto de
// 2010. Cada referencia apunta a un artículo; si una reforma cambia la
// numeración y el ancla no existe, el enlace simplemente no se muestra.

export interface ArticleRef {
  /** Número del artículo, como en el ancla "articulo-N" */
  article: string;
  label: string;
}

export interface SummaryCard {
  key: string;
  title: string;
  text: string;
  icon: "heart" | "target" | "compass" | "network" | "shield";
  refs: ArticleRef[];
  extra?: { label: string; href: string };
}

export const SUMMARY_CARDS: SummaryCard[] = [
  {
    key: "somos",
    title: "Somos",
    text: "Eclesiales, laicos, marianos, vicencianos y misioneros. Jóvenes de Iglesia que miran a María y hacen del servicio a los pobres su sello, al estilo de san Vicente.",
    icon: "heart",
    refs: [{ article: "3", label: "Artículo 3" }],
  },
  {
    key: "para-que",
    title: "Para qué existimos",
    text: "Para formarnos en la vocación cristiana con María como modelo, animar el espíritu misionero y el servicio a los pobres —sobre todo a los jóvenes— y aportar a la Iglesia y a la sociedad.",
    icon: "target",
    refs: [{ article: "5", label: "Artículo 5" }],
  },
  {
    key: "como-vivimos",
    title: "Cómo vivimos",
    text: "Cada joven arma su Proyecto Personal de Vida: el estilo cristiano que quiere asumir y los pasos concretos para lograrlo. Y no camina solo: cuenta con un acompañante espiritual.",
    icon: "compass",
    refs: [{ article: "4", label: "Artículo 4.4" }],
  },
  {
    key: "organizacion",
    title: "Cómo nos organizamos",
    text: "La Asamblea Nacional, la mayor instancia de decisión, se reúne cada tres años y elige al Consejo Nacional, que anima a los grupos, aprueba el plan anual y cuida la economía.",
    icon: "network",
    refs: [
      { article: "21", label: "Artículo 21" },
      { article: "22", label: "Artículo 22" },
      { article: "23", label: "Artículo 23" },
    ],
    extra: { label: "Mira nuestra estructura", href: "/estructura" },
  },
  {
    key: "transparencia",
    title: "Transparencia",
    text: "Somos una entidad sin fines de lucro. El Consejo Nacional examina y aprueba los presupuestos e informes del tesorero/a, y si la Asociación se disolviera, sus bienes irían a los pobres.",
    icon: "shield",
    refs: [
      { article: "2", label: "Artículo 2.2" },
      { article: "23", label: "Artículo 23" },
      { article: "44", label: "Artículo 44.4" },
    ],
  },
];

export interface GlossaryTerm {
  term: string;
  definition: string;
  refs: ArticleRef[];
}

export const GLOSSARY: GlossaryTerm[] = [
  {
    term: "Asesor/a",
    definition:
      "Cristiano adulto que acompaña, en nombre de la Iglesia y de la comunidad local, el camino de fe de los jóvenes de un grupo. Puede ser un miembro de la Congregación de la Misión, una Hija de la Caridad o un joven adulto que culminó su formación en JMV.",
    refs: [
      { article: "38", label: "Artículo 38" },
      { article: "30", label: "Artículos 30 y 31" },
    ],
  },
  {
    term: "Asamblea Nacional",
    definition:
      "La mayor instancia de decisión y de animación de JMV en el país. La ordinaria se reúne cada tres años: propone planes pastorales, aprueba los informes, elige a los miembros laicos del Consejo Nacional y puede revisar los estatutos.",
    refs: [{ article: "21", label: "Artículo 21" }],
  },
  {
    term: "Consejo Nacional",
    definition:
      "Equipo que anima y guía la Asociación: coordinador/a, vicecoordinador/a, secretario/a, tesorero/a, vocales, asesor y asesora nacionales. Se reúne al menos dos veces al año.",
    refs: [
      { article: "22", label: "Artículo 22" },
      { article: "23", label: "Artículo 23" },
    ],
  },
  {
    term: "Consagrado/a",
    definition:
      "Joven que, después de al menos dos años de formación, se consagra a María para reafirmar su consagración bautismal. Recibe la Medalla Milagrosa y es miembro de pleno derecho.",
    refs: [
      { article: "7", label: "Artículo 7" },
      { article: "9", label: "Artículo 9.4" },
    ],
  },
  {
    term: "Aspirante",
    definition:
      "Así llaman los estatutos al joven que pide por escrito al Consejo Nacional su Consagración Mariana, con el informe de su asesor/a local.",
    refs: [{ article: "7", label: "Artículo 7.5" }],
  },
  {
    term: "Proyecto Personal de Vida",
    definition:
      "Plan que cada joven elabora para recoger el estilo de vida cristiano que quiere ir asumiendo y los pasos concretos para conseguirlo, con la ayuda de un acompañante espiritual.",
    refs: [{ article: "4", label: "Artículo 4.4" }],
  },
  {
    term: "Director General",
    definition:
      "El Superior General de la Congregación de la Misión y de las Hijas de la Caridad. Por concesión pontificia dirige la Asociación en todo el mundo y aprueba los estatutos de cada país.",
    refs: [
      { article: "15", label: "Artículo 15" },
      { article: "1", label: "Artículo 1" },
    ],
  },
];

export const MILESTONES = [
  { label: "Inspiración mariana", year: "1830" },
  { label: "Aprobada por Pío IX", year: "1847" },
  { label: "En Ecuador desde", year: "1995" },
];

export const STATUTES_PATH = "/quienes-somos/estatutos";

export function statuteVersionHref(slug: string) {
  return `${STATUTES_PATH}/${slug}`;
}
