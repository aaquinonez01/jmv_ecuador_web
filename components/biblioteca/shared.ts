// Utilidades de presentación de la Biblioteca JMV (sin "use client": sirven en servidor y cliente).

import type { CSSProperties } from "react";
import type { LibraryAxis, LibraryDocument, LibraryStage, LibraryType } from "@/types/library";
import { AXIS_LABELS } from "@/lib/biblioteca";

/** Lo que necesita una tarjeta o portada (sin la descripción larga) */
export type LibraryCardDoc = Pick<
  LibraryDocument,
  | "id"
  | "slug"
  | "title"
  | "author"
  | "summary"
  | "kind"
  | "type"
  | "axis"
  | "stage"
  | "tags"
  | "visibility"
  | "coverUrl"
  | "pageCount"
  | "readingMinutes"
  | "featured"
  | "createdAt"
>;

export function toCardDoc(d: LibraryDocument): LibraryCardDoc {
  return {
    id: d.id,
    slug: d.slug,
    title: d.title,
    author: d.author ?? null,
    summary: d.summary,
    kind: d.kind,
    type: d.type,
    axis: d.axis ?? null,
    stage: d.stage,
    tags: d.tags ?? [],
    visibility: d.visibility,
    coverUrl: d.coverUrl ?? null,
    pageCount: d.pageCount ?? null,
    readingMinutes: d.readingMinutes ?? null,
    featured: d.featured,
    createdAt: d.createdAt,
  };
}

export const TYPE_ORDER: LibraryType[] = ["libro", "guia", "documento", "oracion", "otro"];
export const AXIS_ORDER: LibraryAxis[] = ["humano", "cristocentrico", "mariano", "vicenciano", "eclesial"];
export const STAGE_ORDER: LibraryStage[] = ["aspirante", "promesa", "consagrado", "animador", "todos"];

export type CoverMotif = "monogram" | "hearts" | "stars" | "cross" | "seed";

interface CoverTheme {
  /** Color del lomo y del acento (sobre la portada y en modo oscuro) */
  accent: string;
  /** El mismo acento oscurecido para texto sobre fondo claro (4.5:1 sobre blanco y marfil) */
  ink: string;
  from: string;
  to: string;
  motif: CoverMotif;
}

// Cada eje tiene su color; sin eje, manda el tipo
const AXIS_THEME: Record<LibraryAxis, CoverTheme> = {
  humano: { accent: "#F2A65A", ink: "#9a4a0c", from: "#7a3412", to: "#2a1208", motif: "seed" },
  cristocentrico: { accent: "#F08A7E", ink: "#a3262b", from: "#8f1f24", to: "#2b0a0d", motif: "cross" },
  mariano: { accent: "#8EC5FF", ink: "#1d5fb4", from: "#1D4E8A", to: "#0a1a33", motif: "monogram" },
  vicenciano: { accent: "#F5B83D", ink: "#8a5a00", from: "#7c5004", to: "#241703", motif: "hearts" },
  eclesial: { accent: "#7FD8C4", ink: "#0b6b5e", from: "#0f5e55", to: "#062420", motif: "stars" },
};

const TYPE_THEME: Record<LibraryType, CoverTheme> = {
  libro: AXIS_THEME.mariano,
  documento: { accent: "#CBD5E1", ink: "#334155", from: "#334155", to: "#0f172a", motif: "stars" },
  guia: AXIS_THEME.eclesial,
  oracion: { accent: "#C4B5FD", ink: "#5b3aa8", from: "#4c2a85", to: "#160c2b", motif: "monogram" },
  otro: AXIS_THEME.humano,
};

export function coverTheme(doc: Pick<LibraryDocument, "type" | "axis">): CoverTheme {
  return doc.axis ? AXIS_THEME[doc.axis] : TYPE_THEME[doc.type];
}

/**
 * Variables CSS del documento: --acc (acento de la portada), --from y --to (degradado)
 * y --acc-l (acento para texto en modo claro). Fuera de la portada se usa --acc-ink,
 * que elige el de cada tema con la clase ACC_INK (solo CSS, sin re-render).
 */
export function docStyle(doc: Pick<LibraryDocument, "type" | "axis">): CSSProperties {
  const t = coverTheme(doc);
  return { "--acc": t.accent, "--acc-l": t.ink, "--from": t.from, "--to": t.to } as CSSProperties;
}

export const ACC_INK = "[--acc-ink:var(--acc-l)] dark:[--acc-ink:var(--acc)]";

/** Minúsculas y sin tildes, para buscar "oracion" y encontrar "Oración" */
export function normalizeText(text: string) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

export function searchableText(doc: LibraryCardDoc) {
  return normalizeText([doc.title, doc.author ?? "", doc.summary, ...(doc.tags ?? [])].join(" "));
}

/** Todas las palabras de la búsqueda deben aparecer (en cualquier orden) */
export function matchesQuery(haystack: string, query: string) {
  const words = normalizeText(query).split(/\s+/).filter(Boolean);
  return words.every((w) => haystack.includes(w));
}

/** "Página 34 de 120" */
export function pageLabel(page: number, pageCount?: number | null) {
  return pageCount ? `Página ${page} de ${pageCount}` : `Página ${page}`;
}

/** "1 lectura" / "5 lecturas" */
export function readingsLabel(n: number) {
  return n === 1 ? "1 lectura" : `${n} lecturas`;
}

/** Base pública de la API en el navegador (igual que config/axios.config.ts) */
export function publicApiBase() {
  const base = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002").replace(/\/+$/, "");
  return base.endsWith("/api") ? base : `${base}/api`;
}

/** Ruta del PDF en la API (para miembros fileUrl llega vacío y se pide con token) */
export function documentFileHref(doc: Pick<LibraryDocument, "id" | "fileUrl">) {
  return doc.fileUrl || `${publicApiBase()}/library/documents/${encodeURIComponent(doc.id)}/file`;
}

/** Id de un video de YouTube (watch, youtu.be, shorts, embed) o null */
export function youtubeId(url?: string | null) {
  if (!url) return null;
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\.|^m\./, "");
    let id: string | null = null;
    if (host === "youtu.be") id = u.pathname.slice(1);
    else if (host === "youtube.com" || host === "youtube-nocookie.com") {
      id = u.searchParams.get("v") ?? u.pathname.match(/^\/(?:embed|shorts|live)\/([^/?#]+)/)?.[1] ?? null;
    }
    return id && /^[\w-]{6,20}$/.test(id) ? id : null;
  } catch {
    return null;
  }
}

/** Para la ficha: "Abrir recurso" muestra el sitio al que lleva */
export function hostLabel(url?: string | null) {
  if (!url) return null;
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

/** "Humano", "Mariano"… (sin el "Eje" delante) */
export function axisShortLabel(axis: LibraryAxis) {
  const label = AXIS_LABELS[axis].replace(/^Eje /, "");
  return label.charAt(0).toUpperCase() + label.slice(1);
}
