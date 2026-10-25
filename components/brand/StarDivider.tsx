import { cn } from "@/lib/utils";
import { starPoints } from "./svg-props";

// Separador de sección sobrio: línea, tres estrellas, línea. Decorativo.
// Color: text-accent-gold (sigue el tema); se puede cambiar con className (currentColor).
export default function StarDivider({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("flex items-center justify-center gap-3 text-accent-gold", className)}>
      <span className="h-px w-12 bg-gradient-to-r from-transparent to-current opacity-60 sm:w-20" />
      <svg viewBox="0 0 60 16" className="h-4 w-14" fill="currentColor">
        <polygon points={starPoints(8, 8, 4.5)} opacity="0.6" />
        <polygon points={starPoints(30, 8, 7)} />
        <polygon points={starPoints(52, 8, 4.5)} opacity="0.6" />
      </svg>
      <span className="h-px w-12 bg-gradient-to-l from-transparent to-current opacity-60 sm:w-20" />
    </div>
  );
}
