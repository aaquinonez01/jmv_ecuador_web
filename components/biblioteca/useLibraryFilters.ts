"use client";

import { useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { filtersFromParams, filtersHref, hasActiveFilters, type LibraryFilters } from "./filters";


// Los filtros se actualizan con history.replaceState: sin recargar ni pedir datos.

export function useLibraryFilters() {
  const params = useSearchParams();
  const filters = useMemo(() => filtersFromParams(params), [params]);

  const setFilters = useCallback((patch: Partial<LibraryFilters>) => {
    const next = { ...filtersFromParams(new URLSearchParams(window.location.search)), ...patch };
    const url = filtersHref(next, "");
    window.history.replaceState(null, "", url === "/biblioteca" ? window.location.pathname : url);
  }, []);

  return { filters, setFilters, active: hasActiveFilters(filters) };
}
