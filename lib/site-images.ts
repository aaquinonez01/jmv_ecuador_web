// Registro de los "espacios de foto" de la web pública.
//
// Cada espacio es un lugar concreto de una página (la portada del inicio, la
// cabecera de Pilares, la tarjeta de Comunidad…) donde el equipo puede subir sus
// fotos desde /admin/imagenes. Si todavía no hay fotos subidas, o si la API no
// responde, se muestran las fotos locales de `fallback` (en /public/images).
//
// - El id es "<página>.<uso>". El backend valida ese patrón y usa la primera parte
//   para revalidar la ruta de la página (src/site_images/site_images.paths.ts).
// - `max` lo aplica el panel; la web nunca muestra más de `max` fotos.
// - Para añadir un espacio: agrégalo aquí, usa `fetchSlotImages("<id>")` en la
//   página y, si es una página nueva, añade su ruta en el backend.
// - Este archivo no importa nada del servidor: lo usan la web y el panel.

export type SlotAspect = "16/9" | "4/5" | "1/1" | "3/2";

export interface SlotPhoto {
  src: string;
  alt: string;
  /** object-position CSS opcional (solo fotos locales), p. ej. "center 40%" */
  position?: string;
}

export interface SiteImageSlot {
  /** Ruta de la página donde se ve (para "Ver en la página") */
  page: string;
  /** Nombre corto para el panel */
  label: string;
  /** Para qué sirve y qué foto conviene, para quien administra */
  description: string;
  /** Proporción recomendada (la foto se recorta a esta forma) */
  aspect: SlotAspect;
  /** Máximo de fotos (más de 1 = carrusel o mosaico) */
  max: number;
  /** Fotos locales que se muestran mientras no haya fotos subidas */
  fallback: readonly SlotPhoto[];
}

// Fotos locales disponibles (todas reales de JMV o del carisma)
const P = {
  portada: {
    src: "/images/hero/hero.jpg",
    alt: "Jóvenes de JMV de distintas zonas del Ecuador con sus banderas frente a la gruta de la Virgen",
    position: "50% 40%",
  },
  encuentro: {
    src: "/images/gallery/encuentro_nacional_2025.jpg",
    alt: "Jóvenes de JMV Ecuador con sus banderas en el Encuentro Nacional 2025, reunidos en una iglesia",
    position: "center 45%",
  },
  asamblea: {
    src: "/images/gallery/asamblea_2024.jpg",
    alt: "Jóvenes de JMV reunidos en un salón durante la Asamblea 2024",
    position: "center 40%",
  },
  adoracion: {
    src: "/images/gallery/adoracion_santisimo.jpeg",
    alt: "Jóvenes de JMV arrodillados en adoración ante el Santísimo, a la luz de las velas",
    position: "center 55%",
  },
  internacional: {
    src: "/images/gallery/secretariado.jpg",
    alt: "Jóvenes de JMV de varios países, con camisetas en distintos idiomas, junto a la imagen de la Virgen Milagrosa",
    position: "center 30%",
  },
  campamento: {
    src: "/images/events/evento_campamento.jpg",
    alt: "Carpas iluminadas de noche en un campamento de JMV",
    position: "center 60%",
  },
  aniversario: {
    src: "/images/historia/jmv_20.jpg",
    alt: "Celebración de los 30 años de JMV Ecuador",
    position: "center 45%",
  },
  grupoEcuador: {
    src: "/images/historia/jmv-fundacion.jpg",
    alt: "Grupo de JMV Ecuador con la bandera de la asociación",
    position: "center 30%",
  },
  catalina: {
    src: "/images/historia/catalina.jpg",
    alt: "Pintura de santa Catalina Labouré ante la Virgen, con la Medalla Milagrosa",
    position: "center 25%",
  },
  equipoInternacional: {
    src: "/images/historia/fundacion.jpg",
    alt: "Equipo internacional de JMV con la Medalla Milagrosa",
    position: "center 35%",
  },
  hijasHijos: {
    src: "/images/historia/hijas_hijos.webp",
    alt: "Pintura de la Virgen Milagrosa ante los primeros Hijos e Hijas de María",
    position: "center 30%",
  },
} satisfies Record<string, SlotPhoto>;

const HERO = "Cabecera de la página";
const HERO_TIP = "Horizontal, con las personas en el centro o arriba: abajo va el título sobre un velo oscuro.";

export const SITE_IMAGE_SLOTS = {
  // INICIO
  "home.hero": {
    page: "/",
    label: "Portada del inicio",
    description: `Foto grande de la portada del inicio; ideal jóvenes en una actividad. Con 2 o más, pasan solas en carrusel. ${HERO_TIP}`,
    aspect: "16/9",
    max: 5,
    fallback: [P.portada, P.encuentro, P.asamblea],
  },
  "home.galeria": {
    page: "/",
    label: "JMV en imágenes",
    description: "Mosaico de fotos de la vida de los grupos: oración, servicio, encuentros, campamentos. Mejor variadas y de distintas zonas.",
    aspect: "3/2",
    max: 8,
    fallback: [P.adoracion, P.internacional, P.campamento, P.aniversario],
  },
  "home.unete": {
    page: "/",
    label: "Invitación a unirse (inicio)",
    description: "Acompaña la invitación «Encuentra tu grupo». Un grupo de jóvenes sonriendo, mirando a la cámara. Vertical.",
    aspect: "4/5",
    max: 1,
    fallback: [P.grupoEcuador],
  },

  // QUIÉNES SOMOS
  "quienes-somos.hero": {
    page: "/quienes-somos",
    label: HERO,
    description: `Cabecera de «Quiénes somos». Fotos de grupo que muestren quiénes somos. ${HERO_TIP}`,
    aspect: "16/9",
    max: 3,
    fallback: [P.encuentro, P.aniversario],
  },
  "quienes-somos.mision": {
    page: "/quienes-somos",
    label: "Misión",
    description: "Acompaña el texto de la misión. Jóvenes reunidos, formándose o compartiendo. Vertical.",
    aspect: "4/5",
    max: 1,
    fallback: [P.asamblea],
  },
  "quienes-somos.carisma": {
    page: "/quienes-somos",
    label: "Carisma vicenciano",
    description: "Acompaña el carisma mariano y vicenciano: la Virgen Milagrosa, santa Catalina, san Vicente o un momento de servicio. Vertical.",
    aspect: "4/5",
    max: 1,
    fallback: [P.catalina],
  },
  "historia.hero": {
    page: "/quienes-somos/historia",
    label: "Cabecera de Historia",
    description: `Cabecera de «Nuestra historia». Fotos antiguas o de aniversarios de JMV Ecuador. ${HERO_TIP}`,
    aspect: "16/9",
    max: 3,
    fallback: [P.grupoEcuador, P.hijasHijos],
  },
  "estatutos.hero": {
    page: "/quienes-somos/estatutos",
    label: "Cabecera de Estatutos",
    description: `Cabecera de los Estatutos. Una asamblea o reunión de consejo. ${HERO_TIP}`,
    aspect: "16/9",
    max: 1,
    fallback: [P.asamblea],
  },
  "estructura.hero": {
    page: "/estructura",
    label: "Cabecera de Estructura",
    description: `Cabecera de «Estructura». El Consejo Nacional o jóvenes de varias zonas juntos. ${HERO_TIP}`,
    aspect: "16/9",
    max: 1,
    fallback: [P.portada],
  },

  // PILARES
  "pilares.hero": {
    page: "/pilares",
    label: "Cabecera de Pilares",
    description: `Cabecera de «Pilares». Momentos que mezclen comunidad, oración y servicio. ${HERO_TIP}`,
    aspect: "16/9",
    max: 3,
    fallback: [P.campamento, P.internacional, P.aniversario],
  },
  "pilares.comunidad": {
    page: "/pilares",
    label: "Pilar Comunidad",
    description: "Tarjeta del pilar Comunidad: un grupo compartiendo, abrazado o en una dinámica. Vertical.",
    aspect: "4/5",
    max: 1,
    fallback: [P.encuentro],
  },
  "pilares.espiritualidad": {
    page: "/pilares",
    label: "Pilar Espiritualidad",
    description: "Tarjeta del pilar Espiritualidad: oración, adoración o Eucaristía (sin flash, con respeto). Vertical.",
    aspect: "4/5",
    max: 1,
    fallback: [P.adoracion],
  },
  "pilares.apostolado": {
    page: "/pilares",
    label: "Pilar Apostolado",
    description: "Tarjeta del pilar Apostolado: jóvenes sirviendo (misiones, visitas, ayuda a los más pobres). Cuida la dignidad de las personas atendidas. Vertical.",
    aspect: "4/5",
    max: 1,
    fallback: [P.portada],
  },
  "pilares.formacion": {
    page: "/pilares",
    label: "Pilar Formación",
    description: "Tarjeta del pilar Formación: un taller, una charla o un retiro. Vertical.",
    aspect: "4/5",
    max: 1,
    fallback: [P.asamblea],
  },

  // FORMACIÓN
  "formacion.hero": {
    page: "/formacion",
    label: "Cabecera de Formación",
    description: `Cabecera de «Formación». Talleres, retiros o encuentros formativos. ${HERO_TIP}`,
    aspect: "16/9",
    max: 3,
    fallback: [P.asamblea, P.adoracion],
  },
  "ejes.hero": {
    page: "/formacion/ejes",
    label: "Cabecera de Ejes de formación",
    description: `Cabecera de «Ejes de formación». ${HERO_TIP}`,
    aspect: "16/9",
    max: 1,
    fallback: [P.adoracion],
  },
  "santos.hero": {
    page: "/formacion/santos",
    label: "Cabecera de Santos",
    description: `Cabecera de «Santos y beatos de la familia vicenciana». Una imagen de santos del carisma. ${HERO_TIP}`,
    aspect: "16/9",
    max: 1,
    fallback: [P.catalina],
  },
  "jmv-mundo.hero": {
    page: "/jmv-en-el-mundo",
    label: "Cabecera de JMV en el mundo",
    description: `Cabecera de «JMV en el mundo». Encuentros internacionales o jóvenes de varios países. ${HERO_TIP}`,
    aspect: "16/9",
    max: 3,
    fallback: [P.internacional, P.equipoInternacional],
  },

  // PARTICIPAR
  "actividades.hero": {
    page: "/actividades",
    label: "Cabecera de Actividades",
    description: `Cabecera de «Actividades». Encuentros, campamentos o misiones recientes. ${HERO_TIP}`,
    aspect: "16/9",
    max: 3,
    fallback: [P.asamblea, P.campamento, P.encuentro],
  },
  "unete.hero": {
    page: "/unete",
    label: "Cabecera de Únete",
    description: `Cabecera de «Únete». Jóvenes alegres que inviten a acercarse. ${HERO_TIP}`,
    aspect: "16/9",
    max: 3,
    fallback: [P.encuentro, P.portada, P.aniversario],
  },
  "unete.primer-encuentro": {
    page: "/unete",
    label: "Tu primer encuentro",
    description: "Fotos de una reunión de grupo normal, para que quien llega sepa qué esperar: un círculo, una oración, una dinámica. Horizontales.",
    aspect: "3/2",
    max: 3,
    fallback: [P.asamblea, P.adoracion, P.grupoEcuador],
  },
  "contacto.hero": {
    page: "/contacto",
    label: "Cabecera de Contacto",
    description: `Cabecera de «Contacto». ${HERO_TIP}`,
    aspect: "16/9",
    max: 1,
    fallback: [P.portada],
  },
  "donar.hero": {
    page: "/donar",
    label: "Cabecera de Donar",
    description: `Cabecera de «Donar». Jóvenes en una actividad que se sostiene con las donaciones. ${HERO_TIP}`,
    aspect: "16/9",
    max: 3,
    fallback: [P.encuentro, P.portada, P.aniversario],
  },
  "donar.usos": {
    page: "/donar",
    label: "En qué se usa tu donación",
    description: "Fotos de lo que hacen posible las donaciones: formación, misiones, encuentros, materiales. Horizontales.",
    aspect: "3/2",
    max: 4,
    fallback: [P.asamblea, P.campamento, P.adoracion, P.internacional],
  },

  // CONTENIDOS
  "blog.hero": {
    page: "/blog",
    label: "Cabecera del Blog",
    description: `Cabecera de «Comunidad JMV» (blog). ${HERO_TIP}`,
    aspect: "16/9",
    max: 1,
    fallback: [P.aniversario],
  },
  "calendario.hero": {
    page: "/calendario",
    label: "Cabecera del Año Vicenciano",
    description: `Cabecera del calendario de fiestas. Una celebración, una procesión o la imagen de la Virgen Milagrosa. ${HERO_TIP}`,
    aspect: "16/9",
    max: 1,
    fallback: [P.internacional],
  },
  "biblioteca.hero": {
    page: "/biblioteca",
    label: "Cabecera de la Biblioteca",
    description: `Cabecera de la Biblioteca. Jóvenes leyendo, estudiando o en un taller. ${HERO_TIP}`,
    aspect: "16/9",
    max: 1,
    fallback: [P.asamblea],
  },
} as const satisfies Record<string, SiteImageSlot>;

export type SiteImageSlotId = keyof typeof SITE_IMAGE_SLOTS;

export const SITE_IMAGE_SLOT_IDS = Object.keys(SITE_IMAGE_SLOTS) as SiteImageSlotId[];

export function getSlot(id: SiteImageSlotId): SiteImageSlot {
  return SITE_IMAGE_SLOTS[id];
}

export function isSlotId(id: string): id is SiteImageSlotId {
  return Object.prototype.hasOwnProperty.call(SITE_IMAGE_SLOTS, id);
}

/** Nombre de cada página para agrupar los espacios en el panel (en orden del menú) */
export const SLOT_PAGE_LABELS: Record<string, string> = {
  "/": "Inicio",
  "/quienes-somos": "Quiénes somos",
  "/quienes-somos/historia": "Historia",
  "/quienes-somos/estatutos": "Estatutos",
  "/estructura": "Estructura",
  "/pilares": "Pilares",
  "/formacion": "Formación",
  "/formacion/ejes": "Ejes de formación",
  "/formacion/santos": "Santos",
  "/jmv-en-el-mundo": "JMV en el mundo",
  "/actividades": "Actividades",
  "/unete": "Únete",
  "/contacto": "Contacto",
  "/donar": "Donar",
  "/blog": "Blog",
  "/calendario": "Año Vicenciano",
  "/biblioteca": "Biblioteca",
};

/** Espacios agrupados por página, en el orden del registro */
export function slotsByPage(): { page: string; label: string; slots: { id: SiteImageSlotId; slot: SiteImageSlot }[] }[] {
  const groups = new Map<string, { id: SiteImageSlotId; slot: SiteImageSlot }[]>();
  for (const id of SITE_IMAGE_SLOT_IDS) {
    const slot = SITE_IMAGE_SLOTS[id];
    const list = groups.get(slot.page) ?? [];
    list.push({ id, slot });
    groups.set(slot.page, list);
  }
  return [...groups.entries()].map(([page, slots]) => ({
    page,
    label: SLOT_PAGE_LABELS[page] ?? page,
    slots,
  }));
}

/** Clase de Tailwind para la proporción de cada espacio */
export const ASPECT_CLASS: Record<SlotAspect, string> = {
  "16/9": "aspect-video",
  "4/5": "aspect-[4/5]",
  "1/1": "aspect-square",
  "3/2": "aspect-[3/2]",
};
