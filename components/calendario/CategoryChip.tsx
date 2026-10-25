import { cn } from "@/lib/utils";
import { CATEGORY_META } from "@/lib/calendario";
import { CAT_VARS, categoryStyle, type EntryCategory } from "./shared";

// Chip de categoría: punto y texto en el color de la categoría sobre su fondo suave.
export default function CategoryChip({ category, className }: { category: EntryCategory; className?: string }) {
  return (
    <span
      style={categoryStyle(category)}
      className={cn(
        CAT_VARS,
        "inline-flex items-center gap-1.5 rounded-full bg-(--cat-soft) px-2.5 py-1 text-xs font-semibold text-(--cat) ring-1 ring-inset ring-(--cat)/30",
        className,
      )}
    >
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-(--cat)" />
      {CATEGORY_META[category].label}
    </span>
  );
}

export function UnverifiedTag({ className }: { className?: string }) {
  return (
    <span
      title="Estamos confirmando este dato con nuestros asesores"
      className={cn(
        "inline-flex items-center rounded-full border border-dashed border-fg/35 px-2.5 py-1 text-xs font-medium text-fg-muted",
        className,
      )}
    >
      Por confirmar
    </span>
  );
}
