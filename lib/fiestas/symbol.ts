// Lo que se va armando al completar los días de una fiesta.
// - "medal": la Medalla Milagrosa, dibujada en la web (components/fiestas/Medal.tsx)
// - "layers": una imagen base y, encima, una capa por cada día completado.
//   Se configura desde el admin, así una fiesta nueva no necesita programación.
import { pieceInfo } from "./pieces";

export type SymbolKind = "medal" | "layers";

export interface FiestaSymbolInfo {
  kind: SymbolKind;
  /** "Corona de Adviento" */
  name: string | null;
  /** Imagen base (capas) */
  image: string | null;
  /** "vela" / "velas" */
  pieceWord: string | null;
  piecesWord: string | null;
}

type WithSymbol = { symbol?: FiestaSymbolInfo | null };
type DayPiece = { piece: string; label: string; pieceName?: string | null };

export const isMedal = (f: WithSymbol) => (f.symbol?.kind ?? "medal") === "medal";

/** Palabras con las que se nombra el símbolo y sus partes en los textos de la página */
export function symbolWords(f: WithSymbol) {
  if (isMedal(f)) return { name: "Medalla", piece: "pieza", pieces: "piezas" };
  return {
    name: f.symbol?.name?.trim() || "símbolo",
    piece: f.symbol?.pieceWord?.trim() || "parte",
    pieces: f.symbol?.piecesWord?.trim() || "partes",
  };
}

/** Nombre de lo que se gana en un día */
export const dayPieceName = (f: WithSymbol, d: DayPiece) =>
  isMedal(f) ? pieceInfo(d.piece).name : d.pieceName?.trim() || d.label;

/** "vela" → "Vela" */
export const capital = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
