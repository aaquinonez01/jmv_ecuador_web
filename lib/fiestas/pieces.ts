// Piezas de la Medalla Milagrosa que se ganan día a día (el día lo elige el admin).
// Solo nombran lo que se ve en la medalla; el significado lo da el tema de cada día.

export type PieceFace = "front" | "back" | "both";

export interface PieceInfo {
  id: string;
  name: string;
  face: PieceFace;
}

export const PIECES: PieceInfo[] = [
  { id: "maria", name: "La Virgen Inmaculada", face: "front" },
  { id: "globo", name: "El globo bajo sus pies", face: "front" },
  { id: "rayos", name: "Los rayos de sus manos", face: "front" },
  { id: "inscripcion", name: "La oración de la Medalla", face: "front" },
  { id: "estrellas", name: "Las doce estrellas", face: "back" },
  { id: "m", name: "La M de María", face: "back" },
  { id: "cruz", name: "La cruz", face: "back" },
  { id: "corazon_jesus", name: "El Corazón de Jesús", face: "back" },
  { id: "corazon_maria", name: "El Corazón de María", face: "back" },
  { id: "medalla", name: "La Medalla completa", face: "both" },
];

export const pieceInfo = (id: string): PieceInfo =>
  PIECES.find((p) => p.id === id) ?? { id, name: "Pieza de la Medalla", face: "both" };

/** "2026-11-18" → "miércoles 18 de noviembre" (sin desfase de zona horaria) */
export function longDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d, 12)).toLocaleDateString("es-EC", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  });
}

export function shortDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d, 12)).toLocaleDateString("es-EC", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
}

/** Días que faltan desde hoy (fechas AAAA-MM-DD) */
export function daysBetween(fromIso: string, toIso: string) {
  const a = Date.parse(`${fromIso}T12:00:00Z`);
  const b = Date.parse(`${toIso}T12:00:00Z`);
  return Math.round((b - a) / 86_400_000);
}
