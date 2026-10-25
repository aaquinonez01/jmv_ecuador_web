// Filtros de /biblioteca guardados en la URL (?q=&tipo=&eje=&etapa=) para poder
// compartir una búsqueda. Sin "use client": filtersHref sirve también en el servidor.

import type { LibraryAxis, LibraryStage, LibraryType } from "@/types/library";
import { AXIS_LABELS, STAGE_LABELS, TYPE_LABELS } from "@/lib/biblioteca";

export interface LibraryFilters {
  q: string;
  tipo: LibraryType | null;
  eje: LibraryAxis | null;
  etapa: LibraryStage | null;
}

export const EMPTY_FILTERS: LibraryFilters = { q: "", tipo: null, eje: null, etapa: null };

function pick<T extends string>(value: string | null, allowed: Record<T, string>): T | null {
  return value && value in allowed ? (value as T) : null;
}

export function filtersFromParams(params: URLSearchParams | null): LibraryFilters {
  if (!params) return EMPTY_FILTERS;
  return {
    q: params.get("q") ?? "",
    tipo: pick(params.get("tipo"), TYPE_LABELS),
    eje: pick(params.get("eje"), AXIS_LABELS),
    etapa: pick(params.get("etapa"), STAGE_LABELS),
  };
}

export function hasActiveFilters(f: LibraryFilters) {
  return Boolean(f.q.trim() || f.tipo || f.eje || f.etapa);
}

/** "/biblioteca?tipo=libro" para enlazar a un filtro */
export function filtersHref(f: Partial<LibraryFilters>, hash = "explorar") {
  const params = new URLSearchParams();
  if (f.q) params.set("q", f.q);
  if (f.tipo) params.set("tipo", f.tipo);
  if (f.eje) params.set("eje", f.eje);
  if (f.etapa) params.set("etapa", f.etapa);
  const qs = params.toString();
  return `/biblioteca${qs ? `?${qs}` : ""}${hash ? `#${hash}` : ""}`;
}

