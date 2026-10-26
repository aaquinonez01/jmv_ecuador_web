// Compartido entre el servidor y la pestaña de pilares (sin dependencias de servidor).

/** Pestañas de /pilares → slug del catálogo de pilares del admin (activity_pillars) */
export const PILLAR_SLUGS = {
  comunidad: "comunidad-juvenil",
  espiritualidad: "espiritualidad",
  apostolado: "apostolado",
  formacion: "formacion",
} as const;

export type PillarKey = keyof typeof PILLAR_SLUGS;

/** Datos mínimos y serializables para las tarjetas de /pilares */
export interface PillarActivity {
  key: string;
  kind: "proxima" | "realizada";
  title: string;
  dateLabel: string | null;
  coverUrl: string | null;
  href: string;
}
