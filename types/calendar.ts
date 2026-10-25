// Año Vicenciano: fechas fijas de JMV y la Familia Vicenciana, editables desde el admin.

export type CalendarCategory =
  | "maria"
  | "fundadores"
  | "santos"
  | "familia"
  | "jmv"
  | "ecuador";

export interface CalendarDateItem {
  id: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  /** 1-12 */
  month: number;
  /** 1-31 */
  day: number;
  /** Año del hecho (fundación, aparición…), para mostrar "hace N años" */
  year?: number | null;
  category: CalendarCategory;
  /** 1-2 frases para la tarjeta */
  summary: string;
  /** Historia corta para jóvenes (párrafos separados por línea en blanco) */
  story?: string | null;
  quote?: string | null;
  quoteAuthor?: string | null;
  /** "¿Cómo vivirlo hoy?": un reto pequeño de oración o servicio */
  challenge?: string | null;
  /** URL de Cloudinary o ruta local (/images/...) */
  imageUrl?: string | null;
  source?: string | null;
  /** Validada por un asesor; si es false se muestra "por confirmar" */
  verified: boolean;
  published: boolean;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

/** Entrada del calendario ya resuelta para un año concreto (fecha fija o actividad del admin) */
export interface CalendarEntry {
  key: string;
  kind: "fecha" | "actividad";
  title: string;
  subtitle?: string | null;
  summary?: string | null;
  category: CalendarCategory | "actividad";
  month: number;
  day: number;
  /** Fecha ISO (medianoche UTC del día) de la próxima vez que ocurre */
  date: string;
  /** Hasta qué día dura (actividades de varios días) */
  endDate?: string | null;
  href: string;
  imageUrl?: string | null;
  verified: boolean;
  /** Fecha fija completa, si kind === "fecha" */
  item?: CalendarDateItem;
}
