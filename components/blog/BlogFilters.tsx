"use client";

import { useId, useState } from "react";
import { Camera, ChevronDown, FileText, LayoutGrid, Search, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSubtypes } from "@/lib/hooks/usePostCategories";
import type { PostFilters } from "@/lib/blog/posts";
import type { BlogCategory, PostType } from "@/types/user";

interface BlogFiltersProps {
  filters: PostFilters;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onFilterChange: <K extends keyof PostFilters>(key: K, value: PostFilters[K] | undefined) => void;
  onClear: () => void;
  hasFilters: boolean;
  scopes: BlogCategory[];
  activityTypes: BlogCategory[];
}

const TYPE_CHIPS: { id: PostType | undefined; label: string; icon: typeof Camera }[] = [
  { id: undefined, label: "Todos", icon: LayoutGrid },
  { id: "moments", label: "Momentos", icon: Camera },
  { id: "documents", label: "Documentos", icon: FileText },
];

const selectClass =
  "min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-base text-gray-900 disabled:bg-slate-100 disabled:text-gray-500";

// Barra compacta: búsqueda, chips de tipo con scroll horizontal y filtros
// avanzados plegados (alcance, actividad y subtipo).
export default function BlogFilters({
  filters,
  searchValue,
  onSearchChange,
  onFilterChange,
  onClear,
  hasFilters,
  scopes,
  activityTypes,
}: BlogFiltersProps) {
  const ids = useId();
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const { subtypes, loading: subtypesLoading } = useSubtypes(filters.activityType);
  const advancedCount = [filters.scope, filters.activityType, filters.subtype].filter(Boolean).length;

  return (
    <section
      aria-label="Buscar y filtrar publicaciones"
      className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4"
      data-surface="light"
    >
      <div role="search" className="relative">
        <label htmlFor={`${ids}-q`} className="sr-only">
          Buscar publicaciones
        </label>
        <Search
          className="pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-500"
          aria-hidden="true"
        />
        <input
          id={`${ids}-q`}
          type="search"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar por título o texto"
          enterKeyHint="search"
          className="min-h-11 w-full rounded-xl border border-slate-300 bg-white py-2 pr-3 pl-10 text-base text-gray-900 placeholder:text-gray-500"
        />
      </div>

      <div className="mt-3 flex items-center gap-2">
        <div
          role="group"
          aria-label="Tipo de publicación"
          className="scrollbar-hide -mx-1 flex min-w-0 flex-1 gap-2 overflow-x-auto px-1 py-0.5"
        >
          {TYPE_CHIPS.map(({ id, label, icon: Icon }) => {
            const active = filters.typePost === id;
            return (
              <button
                key={label}
                type="button"
                aria-pressed={active}
                onClick={() => onFilterChange("typePost", id)}
                className={cn(
                  "inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full border px-4 text-sm font-semibold whitespace-nowrap",
                  active
                    ? "border-jmv-blue bg-jmv-blue text-white"
                    : "border-slate-300 bg-white text-gray-800 hover:border-jmv-blue hover:text-jmv-blue"
                )}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {label}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          aria-expanded={advancedOpen}
          aria-controls={`${ids}-advanced`}
          onClick={() => setAdvancedOpen((o) => !o)}
          className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full border border-slate-300 px-3 text-sm font-semibold text-gray-800 hover:border-jmv-blue hover:text-jmv-blue"
        >
          <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          <span>
            Filtros
            {advancedCount ? <span className="sr-only"> ({advancedCount} activos)</span> : null}
          </span>
          {advancedCount ? (
            <span
              className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-jmv-gold px-1 text-xs font-bold text-jmv-ink"
              aria-hidden="true"
            >
              {advancedCount}
            </span>
          ) : null}
          <ChevronDown
            className={cn("h-4 w-4 motion-safe:transition-transform", advancedOpen && "rotate-180")}
            aria-hidden="true"
          />
        </button>
      </div>

      <div id={`${ids}-advanced`} hidden={!advancedOpen} className="mt-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <label htmlFor={`${ids}-scope`} className="mb-1 block text-sm font-semibold text-gray-800">
              Alcance
            </label>
            <select
              id={`${ids}-scope`}
              className={selectClass}
              value={filters.scope ?? ""}
              onChange={(e) => onFilterChange("scope", e.target.value || undefined)}
            >
              <option value="">Todos</option>
              {scopes.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor={`${ids}-activity`} className="mb-1 block text-sm font-semibold text-gray-800">
              Tipo de actividad
            </label>
            <select
              id={`${ids}-activity`}
              className={selectClass}
              value={filters.activityType ?? ""}
              onChange={(e) => onFilterChange("activityType", e.target.value || undefined)}
            >
              <option value="">Todos</option>
              {activityTypes.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor={`${ids}-subtype`} className="mb-1 block text-sm font-semibold text-gray-800">
              Subtipo
            </label>
            <select
              id={`${ids}-subtype`}
              className={selectClass}
              value={filters.subtype ?? ""}
              onChange={(e) => onFilterChange("subtype", e.target.value || undefined)}
              disabled={!filters.activityType || subtypesLoading || subtypes.length === 0}
              aria-describedby={`${ids}-subtype-hint`}
            >
              <option value="">Todos</option>
              {subtypes.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name}
                </option>
              ))}
            </select>
            <p id={`${ids}-subtype-hint`} className="mt-1 text-sm text-gray-600">
              {!filters.activityType
                ? "Elige primero un tipo de actividad."
                : subtypesLoading
                  ? "Cargando subtipos…"
                  : subtypes.length === 0
                    ? "Esta actividad no tiene subtipos."
                    : "Opcional."}
            </p>
          </div>
        </div>
      </div>

      {hasFilters ? (
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={onClear}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-xl px-3 text-sm font-semibold text-jmv-blue hover:bg-jmv-blue/10"
          >
            <X className="h-4 w-4" aria-hidden="true" />
            Limpiar filtros
          </button>
        </div>
      ) : null}
    </section>
  );
}
