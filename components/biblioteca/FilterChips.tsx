"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const base =
  "inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-[background-color,border-color,color,transform] duration-200 motion-safe:active:scale-95";

/** Grupo de chips de una sola opción (null = todas), con aria-pressed */
export default function FilterChips<T extends string>({
  label,
  options,
  value,
  onChange,
  counts,
  allLabel = "Todos",
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T | null;
  onChange: (value: T | null) => void;
  counts?: Partial<Record<T, number>>;
  allLabel?: string;
}) {
  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
      <p className="w-20 shrink-0 text-xs font-semibold uppercase tracking-[0.14em] text-fg-subtle" aria-hidden="true">
        {label}
      </p>
      <div
        role="group"
        aria-label={`Filtrar por ${label.toLowerCase()}`}
        className="scrollbar-hide -mx-4 flex gap-2 overflow-x-auto px-4 py-1 md:mx-0 md:flex-wrap md:px-0"
      >
        <button
          type="button"
          aria-pressed={value === null}
          onClick={() => onChange(null)}
          className={cn(
            base,
            value === null
              ? "border-jmv-ink bg-jmv-ink text-white dark:border-white dark:bg-white dark:text-jmv-ink"
              : "border-fg/20 bg-surface text-fg shadow-card hover:bg-surface-2 dark:bg-white/5 dark:hover:bg-white/10",
          )}
        >
          {value === null && <Check className="h-4 w-4" aria-hidden />}
          {allLabel}
        </button>
        {options.map((o) => {
          const pressed = value === o.value;
          const count = counts?.[o.value] ?? 0;
          return (
            <button
              key={o.value}
              type="button"
              aria-pressed={pressed}
              onClick={() => onChange(pressed ? null : o.value)}
              className={cn(
                base,
                pressed
                  ? "border-jmv-gold bg-jmv-gold text-jmv-ink dark:border-jmv-gold-text dark:bg-jmv-gold-text"
                  : "border-fg/20 bg-surface text-fg shadow-card hover:border-accent-gold/60 hover:bg-surface-2 dark:bg-white/5 dark:hover:bg-white/10",
                !pressed && count === 0 && "text-fg-subtle",
              )}
            >
              {pressed && <Check className="h-4 w-4" aria-hidden />}
              {o.label}
              {counts && (
                <span aria-hidden="true" className={cn("text-xs", pressed ? "text-jmv-ink/75" : "text-fg-subtle")}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
