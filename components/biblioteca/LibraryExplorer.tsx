"use client";

import { Suspense, useMemo, useState, type ReactNode } from "react";
import { SearchX } from "lucide-react";
import type { LibraryAxis, LibraryStage, LibraryType } from "@/types/library";
import { AXIS_LABELS, STAGE_LABELS, TYPE_LABELS } from "@/lib/biblioteca";
import { StarsRing } from "@/components/brand";
import BookCard from "./BookCard";
import FilterChips from "./FilterChips";
import LibrarySearch from "./LibrarySearch";
import { AXIS_ORDER, STAGE_ORDER, TYPE_ORDER, axisShortLabel, matchesQuery, searchableText, type LibraryCardDoc } from "./shared";
import { EMPTY_FILTERS, hasActiveFilters, type LibraryFilters } from "./filters";
import { useLibraryFilters } from "./useLibraryFilters";

const PAGE = 24;

type Indexed = LibraryCardDoc & { _text: string };

/** Una lectura "Para todos" sirve en cualquier etapa */
function matches(d: Indexed, f: LibraryFilters) {
  if (f.tipo && d.type !== f.tipo) return false;
  if (f.eje && d.axis !== f.eje) return false;
  if (f.etapa && d.stage !== f.etapa && d.stage !== "todos") return false;
  if (f.q.trim() && !matchesQuery(d._text, f.q)) return false;
  return true;
}

/** Cuántas quedarían al elegir cada opción, respetando los demás filtros */
function facetCounts<K extends "tipo" | "eje" | "etapa", V extends string>(
  docs: Indexed[],
  f: LibraryFilters,
  key: K,
  values: V[],
) {
  const out: Partial<Record<V, number>> = {};
  for (const v of values) out[v] = docs.filter((d) => matches(d, { ...f, [key]: v })).length;
  return out;
}

function resultsLabel(n: number, f: LibraryFilters) {
  const q = f.q.trim();
  if (n === 0) return q ? `Ninguna lectura coincide con «${q}»` : "Ninguna lectura con esos filtros";
  const what = n === 1 ? "1 lectura" : `${n} lecturas`;
  if (q) return `${what} para «${q}»`;
  return hasActiveFilters(f) ? `${what} con esos filtros` : `${what} en la biblioteca`;
}

function ExplorerView({
  docs,
  newIds,
  filters,
  setFilters,
}: {
  docs: LibraryCardDoc[];
  newIds: string[];
  filters: LibraryFilters;
  setFilters: (patch: Partial<LibraryFilters>) => void;
}) {
  const [limit, setLimit] = useState(PAGE);
  const indexed = useMemo<Indexed[]>(() => docs.map((d) => ({ ...d, _text: searchableText(d) })), [docs]);
  const fresh = useMemo(() => new Set(newIds), [newIds]);
  const results = useMemo(() => indexed.filter((d) => matches(d, filters)), [indexed, filters]);

  const { types, axes, stages } = useMemo(
    () => ({
      types: TYPE_ORDER.filter((t) => docs.some((d) => d.type === t)),
      axes: AXIS_ORDER.filter((a) => docs.some((d) => d.axis === a)),
      stages: STAGE_ORDER.filter((s) => s !== "todos" && docs.some((d) => d.stage === s)),
    }),
    [docs],
  );
  const active = hasActiveFilters(filters);

  const typeCounts = useMemo(() => facetCounts(indexed, filters, "tipo", types), [indexed, filters, types]);
  const axisCounts = useMemo(() => facetCounts(indexed, filters, "eje", axes), [indexed, filters, axes]);
  const stageCounts = useMemo(() => facetCounts(indexed, filters, "etapa", stages), [indexed, filters, stages]);

  const set = (patch: Partial<LibraryFilters>) => {
    setLimit(PAGE);
    setFilters(patch);
  };
  const clear = () => set(EMPTY_FILTERS);

  return (
    <>
      <div className="mt-6 max-w-xl">
        <LibrarySearch label="Buscar lecturas" placeholder="Título, autor o tema" size="md" />
      </div>

      <div className="mt-6 space-y-3">
        {types.length > 1 && (
          <FilterChips<LibraryType>
            label="Tipo"
            options={types.map((t) => ({ value: t, label: TYPE_LABELS[t] }))}
            value={filters.tipo}
            onChange={(tipo) => set({ tipo })}
            counts={typeCounts}
          />
        )}
        {axes.length > 0 && (
          <FilterChips<LibraryAxis>
            label="Eje"
            options={axes.map((a) => ({ value: a, label: axisShortLabel(a) }))}
            value={filters.eje}
            onChange={(eje) => set({ eje })}
            counts={axisCounts}
          />
        )}
        {stages.length > 0 && (
          <FilterChips<LibraryStage>
            label="Etapa"
            allLabel="Todas"
            options={stages.map((s) => ({ value: s, label: STAGE_LABELS[s] }))}
            value={filters.etapa}
            onChange={(etapa) => set({ etapa })}
            counts={stageCounts}
          />
        )}
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
        <p aria-live="polite" aria-atomic="true" className="text-sm font-medium text-fg-muted">
          {resultsLabel(results.length, filters)}
        </p>
        {active && results.length > 0 && (
          <button
            type="button"
            onClick={clear}
            className="min-h-11 rounded-full px-4 text-sm font-semibold text-accent-gold underline-offset-4 hover:bg-fg/10 hover:underline"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {results.length === 0 ? (
        <div className="mx-auto max-w-lg py-14 text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-fg/[0.06] text-accent-gold">
            <SearchX className="h-8 w-8" aria-hidden />
          </span>
          <h3 className="mt-5 font-display text-2xl font-semibold text-fg">No encontramos esa lectura</h3>
          <p className="mt-2 text-fg-muted">
            Prueba con otra palabra o quita algún filtro. Si buscas algo que no está, cuéntale a tu animador o animadora:
            ¡nos ayuda a crecer la biblioteca!
          </p>
          <button
            type="button"
            onClick={clear}
            className="mt-6 inline-flex min-h-12 items-center rounded-full bg-jmv-gold px-6 font-semibold text-jmv-ink shadow-lg transition-colors hover:bg-jmv-gold-text"
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <>
          <ul className="mt-6 grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 sm:gap-x-5 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {results.slice(0, limit).map((doc, i) => (
              <li key={doc.id}>
                <BookCard
                  doc={doc}
                  isNew={fresh.has(doc.id)}
                  index={i % PAGE}
                  sizes="(min-width: 1280px) 190px, (min-width: 1024px) 18vw, (min-width: 640px) 30vw, 45vw"
                />
              </li>
            ))}
          </ul>
          {results.length > limit && (
            <div className="mt-10 text-center">
              <button
                type="button"
                onClick={() => setLimit((l) => l + PAGE)}
                className="inline-flex min-h-12 items-center rounded-full border border-fg/25 bg-surface px-6 font-semibold text-fg shadow-card hover:bg-surface-2 dark:hover:bg-white/15"
              >
                Ver más lecturas ({results.length - limit})
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}

function ConnectedExplorer(props: { docs: LibraryCardDoc[]; newIds: string[] }) {
  const { filters, setFilters } = useLibraryFilters();
  return <ExplorerView {...props} filters={filters} setFilters={setFilters} />;
}

/** "Explora la biblioteca": búsqueda instantánea y filtros por tipo, eje y etapa (en la URL). */
export default function LibraryExplorer({ docs, newIds }: { docs: LibraryCardDoc[]; newIds: string[] }) {
  return (
    <section aria-labelledby="explorar-title" id="explorar" className="relative mx-auto max-w-7xl scroll-mt-24 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <StarsRing className="h-9 w-9 text-accent-gold/70" />
        <h2 id="explorar-title" className="font-display text-3xl font-semibold text-fg sm:text-4xl">
          Explora la biblioteca
        </h2>
      </div>
      <Suspense fallback={<ExplorerView docs={docs} newIds={newIds} filters={EMPTY_FILTERS} setFilters={() => {}} />}>
        <ConnectedExplorer docs={docs} newIds={newIds} />
      </Suspense>
    </section>
  );
}

/** Oculta los estantes mientras hay una búsqueda o filtro: los resultados quedan junto al buscador. */
function BrowseInner({ children }: { children: ReactNode }) {
  const { active } = useLibraryFilters();
  return active ? null : <>{children}</>;
}

export function BrowseOnly({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={children}>
      <BrowseInner>{children}</BrowseInner>
    </Suspense>
  );
}
