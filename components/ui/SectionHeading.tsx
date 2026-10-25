import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  /** Texto pequeño sobre el título (p. ej. "Testimonios") */
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  /** id del h2, para aria-labelledby de la sección */
  id?: string;
  align?: "center" | "left";
  /**
   * "auto" (por defecto): sigue el tema con tokens (text-fg, text-fg-muted, text-accent-gold).
   * "light": colores fijos de fondo claro. "dark": colores fijos de fondo oscuro.
   */
  tone?: "auto" | "dark" | "light";
  /** Nivel del encabezado (h2 por defecto) */
  as?: "h2" | "h3";
  className?: string;
}

// Encabezado de sección: eyebrow + h2 + descripción (sustituye la "pastilla vidrio + h2")
export default function SectionHeading({
  eyebrow,
  title,
  description,
  id,
  align = "center",
  tone = "auto",
  as: Heading = "h2",
  className,
}: SectionHeadingProps) {
  const colors = {
    auto: { eyebrow: "text-accent-gold", title: "text-fg", description: "text-fg-muted" },
    dark: { eyebrow: "text-jmv-gold-text", title: "text-white", description: "text-slate-300" },
    light: { eyebrow: "text-jmv-gold-ink", title: "text-slate-900", description: "text-slate-600" },
  }[tone];
  return (
    <div
      className={cn(
        "mb-10 max-w-3xl sm:mb-12",
        align === "center" ? "mx-auto text-center" : "text-left",
        className,
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            "mb-3 text-sm font-semibold uppercase tracking-[0.14em]",
            colors.eyebrow,
          )}
        >
          {eyebrow}
        </p>
      )}
      <Heading
        id={id}
        className={cn(
          "text-3xl font-bold leading-tight text-balance sm:text-4xl md:text-5xl",
          colors.title,
        )}
      >
        {title}
      </Heading>
      {description && (
        <p className={cn("mt-4 text-lg leading-relaxed", colors.description)}>
          {description}
        </p>
      )}
    </div>
  );
}
