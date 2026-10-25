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
      <p className="w-20 shrink-0 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400" aria-hidden="true">
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
            value === null ? "border-white bg-white text-jmv-ink" : "border-white/20 bg-white/5 text-white hover:bg-white/10",
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
                  ? "border-jmv-gold-text bg-jmv-gold-text text-jmv-ink"
                  : "border-white/20 bg-white/5 text-white hover:border-jmv-gold-text/60 hover:bg-white/10",
                !pressed && count === 0 && "text-slate-400",
              )}
            >
              {pressed && <Check className="h-4 w-4" aria-hidden />}
              {o.label}
              {counts && (
                <span aria-hidden="true" className={cn("text-xs", pressed ? "text-jmv-ink/75" : "text-slate-400")}>
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
