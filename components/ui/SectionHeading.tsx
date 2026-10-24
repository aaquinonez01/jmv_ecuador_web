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
  /** "dark" para fondos oscuros, "light" para fondos claros */
  tone?: "dark" | "light";
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
  tone = "dark",
  as: Heading = "h2",
  className,
}: SectionHeadingProps) {
  const dark = tone === "dark";
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
            dark ? "text-jmv-gold-text" : "text-jmv-gold-ink",
          )}
        >
          {eyebrow}
        </p>
      )}
      <Heading
        id={id}
        className={cn(
          "text-3xl font-bold leading-tight text-balance sm:text-4xl md:text-5xl",
          dark ? "text-white" : "text-slate-900",
        )}
      >
        {title}
      </Heading>
      {description && (
        <p className={cn("mt-4 text-lg leading-relaxed", dark ? "text-slate-300" : "text-slate-600")}>
          {description}
        </p>
      )}
    </div>
  );
}
