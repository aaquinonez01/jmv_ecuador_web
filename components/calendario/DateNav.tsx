import Link from "next/link";
import { ArrowLeft, ArrowRight, CalendarDays } from "lucide-react";
import type { CalendarDateItem } from "@/types/calendar";
import { calendarHref, dayLabel } from "@/lib/calendario";
import { cn } from "@/lib/utils";
import { CAT_VARS, categoryStyle } from "./shared";

function NavLink({ item, dir }: { item: CalendarDateItem; dir: "prev" | "next" }) {
  const prev = dir === "prev";
  const Icon = prev ? ArrowLeft : ArrowRight;
  return (
    <Link
      href={calendarHref(item.slug)}
      rel={dir}
      style={categoryStyle(item.category)}
      className={cn(
        CAT_VARS,
        "group flex min-h-20 flex-1 items-center gap-4 rounded-2xl border border-line bg-surface p-4 shadow-card transition-colors hover:border-(--cat)/50 hover:bg-surface-2 dark:bg-white/[0.04] dark:hover:bg-white/[0.07]",
        !prev && "flex-row-reverse text-right",
      )}
    >
      <Icon
        className={cn(
          "h-5 w-5 shrink-0 text-(--cat) transition-transform",
          prev ? "motion-safe:group-hover:-translate-x-1" : "motion-safe:group-hover:translate-x-1",
        )}
        aria-hidden
      />
      <span className="min-w-0">
        <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-fg-muted">
          {prev ? "Fecha anterior" : "Fecha siguiente"} · {dayLabel(item.month, item.day)}
        </span>
        <span className="mt-1 block truncate font-semibold text-fg">{item.title}</span>
      </span>
    </Link>
  );
}

// Anterior / siguiente en el orden del año (circular) y vuelta al calendario.
export default function DateNav({ prev, next }: { prev: CalendarDateItem | null; next: CalendarDateItem | null }) {
  return (
    <nav aria-label="Otras fechas del Año Vicenciano" className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
      {(prev || next) && (
        <div className="flex flex-col gap-3 sm:flex-row">
          {prev && <NavLink item={prev} dir="prev" />}
          {next && <NavLink item={next} dir="next" />}
        </div>
      )}
      <div className="mt-6 text-center">
        <Link
          href="/calendario"
          className="inline-flex min-h-11 items-center gap-2 rounded-xl px-4 text-sm font-semibold text-accent-gold underline-offset-4 hover:underline"
        >
          <CalendarDays className="h-4 w-4" aria-hidden />
          Ver todo el Año Vicenciano
        </Link>
      </div>
    </nav>
  );
}
