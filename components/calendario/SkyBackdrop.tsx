import { cn } from "@/lib/utils";

/**
 * Fondo de cielo de las cabeceras del Año Vicenciano (decorativo, solo CSS).
 * Oscuro: el cielo nocturno de siempre. Claro: un amanecer con azules suaves arriba
 * y un resplandor dorado en el horizonte. `glow` añade el halo de la categoría.
 */
export function SkyBackdrop({ glow = false, className }: { glow?: boolean; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "absolute inset-0 -z-20",
        glow
          ? "bg-[radial-gradient(70%_60%_at_15%_10%,var(--cat-soft),transparent_70%),radial-gradient(80%_45%_at_50%_100%,rgba(245,184,61,0.26),transparent_70%),radial-gradient(90%_70%_at_60%_0%,#bcd4f1_0%,#e2ebf7_48%,#f3eee4_100%)] dark:bg-[radial-gradient(70%_60%_at_15%_10%,var(--cat-soft),transparent_70%),radial-gradient(90%_70%_at_60%_0%,#1d4e8a_0%,#0f2547_45%,#070d1d_100%)]"
          : "bg-[radial-gradient(80%_45%_at_50%_100%,rgba(245,184,61,0.26),transparent_70%),radial-gradient(90%_70%_at_50%_0%,#bcd4f1_0%,#e2ebf7_48%,#f3eee4_100%)] dark:bg-[radial-gradient(90%_70%_at_50%_0%,#1d4e8a_0%,#0f2547_45%,#070d1d_100%)]",
        className,
      )}
    />
  );
}
