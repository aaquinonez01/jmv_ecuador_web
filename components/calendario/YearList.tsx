import Link from "next/link";
import type { CalendarEntry } from "@/types/calendar";
import { CATEGORY_META, MONTHS } from "@/lib/calendario";
import { cn } from "@/lib/utils";
import { categoryStyle, entryAccessibleName } from "./shared";

// "Todo el año": lista semántica por meses (h3 por mes, ol de fechas).
// Alternativa accesible al anillo y contenido para buscadores.
export default function YearList({ entries, className }: { entries: CalendarEntry[]; className?: string }) {
  const byMonth = MONTHS.map((name, i) => ({
    name,
    month: i + 1,
    items: entries
      .filter((e) => e.month === i + 1)
      .sort((a, b) => a.day - b.day || a.title.localeCompare(b.title)),
  })).filter((m) => m.items.length > 0);

  if (byMonth.length === 0) {
    return <p className="text-slate-300">No hay fechas con este filtro.</p>;
  }

  return (
    <div className={cn("grid items-start gap-5 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {byMonth.map(({ name, month, items }) => (
        <section
          key={month}
          aria-labelledby={`anio-mes-${month}`}
          className="rounded-3xl border border-white/10 bg-white/[0.03] p-5"
        >
          <h3 id={`anio-mes-${month}`} className="flex items-baseline justify-between font-display text-2xl font-semibold text-white">
            {name}
            <span className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-jmv-gold-text">
              {items.length === 1 ? "1 fecha" : `${items.length} fechas`}
            </span>
          </h3>
          <ol className="mt-3 space-y-1">
            {items.map((e) => (
              <li key={e.key} style={categoryStyle(e.category)}>
                <Link
                  href={e.href}
                  className="group flex min-h-11 items-start gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-white/5"
                >
                  <span className="sr-only">{entryAccessibleName(e)}</span>
                  <span
                    aria-hidden="true"
                    className="mt-0.5 w-7 shrink-0 text-right font-display text-lg font-semibold leading-none text-(--cat) tabular-nums"
                  >
                    {e.day}
                  </span>
                  <span aria-hidden="true" className="min-w-0">
                    <span className="block text-sm font-medium leading-snug text-white group-hover:underline underline-offset-4">
                      {e.title}
                    </span>
                    <span className="block text-xs text-slate-300">
                      {CATEGORY_META[e.category].label}
                      {!e.verified && " · Por confirmar"}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}
