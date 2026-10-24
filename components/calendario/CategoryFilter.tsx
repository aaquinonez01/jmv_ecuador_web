"use client";

import { Check } from "lucide-react";
import { CATEGORY_META } from "@/lib/calendario";
import { cn } from "@/lib/utils";
import { categoryStyle, type EntryCategory } from "./shared";

// Chips de categoría (uno a la vez). null = todas.
export default function CategoryFilter({
  categories,
  value,
  onChange,
  counts,
}: {
  categories: EntryCategory[];
  value: EntryCategory | null;
  onChange: (value: EntryCategory | null) => void;
  counts: Partial<Record<EntryCategory, number>>;
}) {
  const base =
    "inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-[background-color,border-color,color,transform] duration-200 motion-safe:active:scale-95";
  return (
    <div role="group" aria-label="Filtrar por categoría" className="scrollbar-hide -mx-4 flex gap-2 overflow-x-auto px-4 py-1 md:mx-0 md:flex-wrap md:px-0">
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
        Todas
      </button>
      {categories.map((c) => {
        const pressed = value === c;
        return (
          <button
            key={c}
            type="button"
            aria-pressed={pressed}
            onClick={() => onChange(pressed ? null : c)}
            style={categoryStyle(c)}
            className={cn(
              base,
              pressed
                ? "border-(--cat) bg-(--cat) text-jmv-ink"
                : "border-(--cat)/40 bg-(--cat-soft) text-white hover:border-(--cat)",
            )}
          >
            {pressed ? (
              <Check className="h-4 w-4" aria-hidden />
            ) : (
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-(--cat)" />
            )}
            {CATEGORY_META[c].label}
            <span aria-hidden="true" className={cn("text-xs", pressed ? "text-jmv-ink/75" : "text-slate-300")}>
              {counts[c] ?? 0}
            </span>
          </button>
        );
      })}
    </div>
  );
}
