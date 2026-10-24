import { cn } from "@/lib/utils";

// Estilos de botón reutilizables también en <Link> o <a>, para no anidar <a><button>.
// Módulo sin "use client": se puede llamar desde Server Components.

export const BUTTON_VARIANTS = {
  primary:
    "bg-jmv-blue text-white hover:bg-[#173f70] active:bg-[#12335b] shadow-jmv",
  secondary:
    "bg-jmv-red text-white hover:bg-[#b82827] active:bg-[#a02221]",
  outline:
    "border-2 border-jmv-blue text-jmv-blue hover:bg-jmv-blue hover:text-white",
  ghost: "text-jmv-blue hover:bg-jmv-blue/10 active:bg-jmv-blue/20",
  destructive: "bg-red-600 text-white hover:bg-red-700 active:bg-red-800",
  /** CTA principal sobre fondos oscuros: dorado con texto tinta (6.7:1) */
  gold: "bg-jmv-gold text-jmv-ink hover:bg-jmv-gold-text active:bg-jmv-gold shadow-lg",
  /** Botón claro sobre fondos oscuros o fotografía */
  light: "bg-white text-jmv-blue hover:bg-slate-100 shadow-lg",
  /** Contorno blanco sobre fondos oscuros o fotografía */
  outlineLight:
    "border-2 border-white/80 text-white hover:bg-white hover:text-jmv-blue",
} as const;

export const BUTTON_SIZES = {
  sm: "min-h-11 px-4 py-2 text-sm font-medium",
  md: "min-h-11 px-6 py-3 text-base font-medium",
  lg: "min-h-12 px-8 py-3.5 text-lg font-semibold",
  xl: "min-h-14 px-10 py-4 text-xl font-semibold",
} as const;

export type ButtonVariant = keyof typeof BUTTON_VARIANTS;
export type ButtonSize = keyof typeof BUTTON_SIZES;

export function buttonVariants({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  return cn(
    "inline-flex items-center justify-center gap-0 rounded-xl text-center",
    "transition-[color,background-color,border-color,box-shadow,transform] duration-200 ease-in-out",
    "focus-visible:outline-solid focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-(color:--focus-ring)",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
    "motion-safe:hover:scale-[1.02] motion-safe:active:scale-[0.98]",
    BUTTON_VARIANTS[variant],
    BUTTON_SIZES[size],
    className,
  );
}
