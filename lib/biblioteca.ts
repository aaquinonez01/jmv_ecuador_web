// Etiquetas y progreso de lectura de la Biblioteca JMV. El progreso vive en el
// teléfono (localStorage), así funciona sin iniciar sesión.

import type { LibraryAxis, LibraryDocument, LibraryKind, LibraryStage, LibraryType } from "@/types/library";

export const TYPE_LABELS: Record<LibraryType, string> = {
  libro: "Libros",
  documento: "Documentos oficiales",
  guia: "Guías para reuniones",
  oracion: "Oraciones",
  otro: "Otros recursos",
};

export const TYPE_SINGULAR: Record<LibraryType, string> = {
  libro: "Libro",
  documento: "Documento",
  guia: "Guía",
  oracion: "Oración",
  otro: "Recurso",
};

export const AXIS_LABELS: Record<LibraryAxis, string> = {
  humano: "Eje humano",
  cristocentrico: "Eje cristocéntrico",
  mariano: "Eje mariano",
  vicenciano: "Eje vicenciano",
  eclesial: "Eje eclesial",
};

export const STAGE_LABELS: Record<LibraryStage, string> = {
  aspirante: "Aspirantes",
  promesa: "Promesa mariana",
  consagrado: "Consagrados",
  animador: "Animadores y asesores",
  todos: "Para todos",
};

export const KIND_LABELS: Record<LibraryKind, string> = {
  pdf: "PDF",
  enlace: "Enlace",
  video: "Video",
};

export function libraryHref(slug: string) {
  return `/biblioteca/${slug}`;
}

export function readerHref(slug: string, page?: number) {
  return `/biblioteca/${slug}/leer${page && page > 1 ? `?p=${page}` : ""}`;
}

export function collectionHref(slug: string) {
  return `/biblioteca/rutas/${slug}`;
}

/** Nuevo si se publicó hace menos de 30 días */
export function isNew(doc: Pick<LibraryDocument, "createdAt">, now: Date = new Date()) {
  if (!doc.createdAt) return false;
  return now.getTime() - new Date(doc.createdAt).getTime() < 30 * 86_400_000;
}

/** "12 min" / "1 h 20 min" */
export function readingTimeLabel(minutes?: number | null) {
  if (!minutes || minutes <= 0) return null;
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h} h ${m} min` : `${h} h`;
}

/** "2,4 MB" */
export function fileSizeLabel(bytes?: number | null) {
  if (!bytes) return null;
  const mb = bytes / (1024 * 1024);
  return mb >= 1
    ? `${mb.toLocaleString("es-EC", { maximumFractionDigits: 1 })} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

// ---------- Progreso local ----------

export interface ReadingProgress {
  slug: string;
  page: number;
  pageCount: number;
  /** ms desde epoch */
  updatedAt: number;
  finished: boolean;
}

const KEY = "jmv-biblioteca-progreso";

export function readAllProgress(): Record<string, ReadingProgress> {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Record<string, ReadingProgress>) : {};
  } catch {
    return {};
  }
}

export function getProgress(slug: string): ReadingProgress | null {
  return readAllProgress()[slug] ?? null;
}

export function saveProgress(p: Omit<ReadingProgress, "updatedAt" | "finished"> & { finished?: boolean }) {
  try {
    const all = readAllProgress();
    const finished = p.finished ?? (p.pageCount > 0 && p.page >= p.pageCount);
    all[p.slug] = { ...p, finished: finished || !!all[p.slug]?.finished, updatedAt: Date.now() };
    window.localStorage.setItem(KEY, JSON.stringify(all));
    window.dispatchEvent(new Event("jmv-biblioteca-progreso"));
  } catch {
    // Sin almacenamiento (modo privado): la lectura sigue funcionando
  }
}

/** Para enlaces y videos, o para marcar a mano "Lo terminé" */
export function markFinished(slug: string, finished = true) {
  const prev = getProgress(slug);
  saveProgress({ slug, page: prev?.page ?? 1, pageCount: prev?.pageCount ?? 0, finished });
  if (!finished) {
    try {
      const all = readAllProgress();
      if (all[slug]) all[slug].finished = false;
      window.localStorage.setItem(KEY, JSON.stringify(all));
      window.dispatchEvent(new Event("jmv-biblioteca-progreso"));
    } catch {}
  }
}

export function progressPercent(p?: ReadingProgress | null) {
  if (!p) return 0;
  if (p.finished) return 100;
  if (!p.pageCount) return 0;
  return Math.min(100, Math.round((p.page / p.pageCount) * 100));
}
