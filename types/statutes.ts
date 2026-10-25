// Estatutos Nacionales: cada reforma es una versión nueva; solo una está vigente.

export interface StatuteVersion {
  id: string;
  slug: string;
  title: string;
  /** Etiqueta corta de la versión, p. ej. "2010" */
  versionLabel: string;
  /** Fecha de aprobación, solo día (ISO "2010-08-15") */
  approvedAt: string;
  approvedBy: string;
  summary?: string | null;
  /** Texto en Markdown con las convenciones de lib/estatutos.ts */
  content: string;
  /** URL o ruta /documentos/... del original firmado */
  pdfUrl?: string | null;
  isCurrent: boolean;
  published: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/** Versión publicada sin el texto (listado público) */
export type StatuteVersionSummary = Pick<
  StatuteVersion,
  "id" | "slug" | "title" | "versionLabel" | "approvedAt" | "approvedBy" | "isCurrent" | "pdfUrl"
>;
