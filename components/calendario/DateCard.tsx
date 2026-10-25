import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { CalendarEntry } from "@/types/calendar";
import { MONTHS, todayInEcuador } from "@/lib/calendario";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import CategoryChip, { UnverifiedTag } from "./CategoryChip";
import DateVisual from "./DateVisual";
import { CAT_VARS, categoryStyle, entryAccessibleName, yearsAgo } from "./shared";

export interface DateCardProps {
  entry: CalendarEntry;
  /** "Hoy" de referencia; el cliente lo pasa tras montar para no romper la hidratación */
  now?: Date;
  /** Con imagen o motivo arriba (por defecto) o compacta, sin imagen */
  variant?: "full" | "compact";
  headingLevel?: "h2" | "h3" | "h4";
  className?: string;
}

/** Día y mes en grande, con el color de la categoría */
export function DayBadge({
  month,
  day,
  size = "md",
  className,
}: {
  month: number;
  day: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex shrink-0 flex-col items-center justify-center rounded-2xl border border-(--cat)/40 bg-white/90 text-center leading-none dark:bg-jmv-ink/70",
        size === "sm" && "h-12 w-12",
        size === "md" && "h-16 w-16",
        size === "lg" && "h-24 w-24",
        className,
      )}
    >
      <span
        className={cn(
          "font-display font-semibold text-fg tabular-nums",
          size === "sm" && "text-xl",
          size === "md" && "text-3xl",
          size === "lg" && "text-5xl",
        )}
      >
        {day}
      </span>
      <span
        className={cn(
          "mt-1 font-semibold uppercase tracking-[0.12em] text-(--cat)",
          size === "lg" ? "text-xs" : "text-[10px]",
        )}
      >
        {MONTHS[month - 1].slice(0, 3)}
      </span>
    </span>
  );
}

// Tarjeta reutilizable de una fecha del Año Vicenciano o de una actividad del admin.
// Toda la tarjeta es clicable con un único enlace en el título (sin enlaces anidados).
export default function DateCard({
  entry,
  now,
  variant = "full",
  headingLevel: Heading = "h3",
  className,
}: DateCardProps) {
  const today = todayInEcuador(now);
  const years = entry.item ? yearsAgo(entry.item, today) : null;
  const isActivity = entry.kind === "actividad";
  const range =
    isActivity && entry.endDate
      ? `Hasta el ${formatDate(entry.endDate, { day: "numeric", month: "long" })}`
      : null;

  return (
    <article
      style={categoryStyle(entry.category)}
      className={cn(
        CAT_VARS,
        "group relative flex flex-col overflow-hidden rounded-3xl border border-line bg-surface shadow-card dark:bg-white/[0.04] dark:shadow-lg dark:shadow-black/20",
        "transition-[transform,box-shadow,border-color] duration-300 ease-out",
        "hover:border-(--cat)/50 hover:shadow-card-lg dark:hover:shadow-2xl dark:hover:shadow-black/40 motion-safe:hover:-translate-y-1",
        "focus-within:border-(--cat)/60 motion-safe:focus-within:-translate-y-1",
        className,
      )}
    >
      {variant === "full" && (
        <div className="relative">
          <DateVisual
            imageUrl={entry.imageUrl}
            category={entry.category}
            sizes="(min-width: 1024px) 420px, (min-width: 640px) 50vw, 100vw"
            className="aspect-[16/9] w-full"
            imgClassName="transition-transform duration-500 motion-safe:group-hover:scale-[1.04]"
          />
          <DayBadge month={entry.month} day={entry.day} className="absolute bottom-3 left-3 backdrop-blur-sm" />
        </div>
      )}

      <div className={cn("flex flex-1 gap-4 p-5", variant === "full" ? "flex-col" : "flex-row items-start")}>
        {variant === "compact" && <DayBadge month={entry.month} day={entry.day} />}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <CategoryChip category={entry.category} />
            {!entry.verified && <UnverifiedTag />}
          </div>
          <Heading className="text-lg font-semibold leading-snug text-fg text-balance">
            <Link
              href={entry.href}
              className="rounded-sm after:absolute after:inset-0 after:rounded-3xl after:content-[''] focus-visible:outline-none focus-visible:after:outline-3 focus-visible:after:outline-offset-[-3px] focus-visible:after:outline-(--focus-ring) focus-visible:after:outline-solid"
            >
              <span className="sr-only">{entryAccessibleName(entry)}</span>
              <span aria-hidden="true">{entry.title}</span>
            </Link>
          </Heading>
          {entry.subtitle && <p className="mt-1 text-sm text-fg-muted">{entry.subtitle}</p>}
          {entry.summary && (
            <p className={cn("mt-3 text-sm leading-relaxed text-fg-muted", variant === "compact" && "line-clamp-3")}>
              {entry.summary}
            </p>
          )}
          <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-4 text-sm">
            <span className="font-medium text-fg-muted">
              {years ? `Hace ${years} años · ${entry.item?.year}` : range}
            </span>
            <span aria-hidden="true" className="inline-flex items-center gap-1 font-semibold text-(--cat)">
              {isActivity ? "Ver actividad" : "Ver historia"}
              <ArrowRight className="h-4 w-4 transition-transform motion-safe:group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
