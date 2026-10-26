import Link from "next/link";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SlotPhoto } from "@/lib/site-images";
import { buttonVariants, type ButtonVariant } from "@/components/ui/button-variants";
import Breadcrumbs, { type BreadcrumbItem } from "@/components/ui/Breadcrumbs";
import SiteImage from "./SiteImage";
import HeroCarousel from "./HeroCarousel";

export interface HeroMediaAction {
  label: string;
  href: string;
  /** Por defecto: gold la primera y outlineLight la segunda */
  variant?: ButtonVariant;
  icon?: LucideIcon;
  external?: boolean;
}

export interface HeroBackdropProps {
  images: readonly SlotPhoto[];
  /** Milisegundos entre fotos del carrusel (por defecto 5500) */
  interval?: number;
  /** Nombre accesible de los controles del carrusel */
  carouselLabel?: string;
  sizes?: string;
  /** La primera foto es la imagen principal de la página (LCP): priority. Por defecto sí */
  priority?: boolean;
}

/**
 * Capa de fondo de una cabecera: foto (o carrusel por fundido si hay 2 o más) y
 * velo degradado solo abajo, donde va el texto. Debe ir dentro de un contenedor
 * `relative isolate` con `data-tone="dark"` (HeroMedia ya lo hace).
 */
export function HeroBackdrop({
  images,
  interval = 5500,
  carouselLabel = "Fotos de la cabecera",
  sizes = "100vw",
  priority = true,
}: HeroBackdropProps) {
  const [firstPhoto, ...rest] = images;
  const first = firstPhoto ? (
    <SiteImage
      src={firstPhoto.src}
      alt={firstPhoto.alt}
      fill
      priority={priority}
      fetchPriority={priority ? "high" : undefined}
      sizes={sizes}
      className="object-cover"
      style={{ objectPosition: firstPhoto.position ?? "center" }}
    />
  ) : null;

  return (
    <>
      {rest.length > 0 ? (
        <HeroCarousel first={first} rest={rest} interval={interval} label={carouselLabel} sizes={sizes} />
      ) : (
        <div className="absolute inset-0 -z-20">{first}</div>
      )}
      {/* Velo: oscuro abajo para leer el texto */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-hero-veil from-5% via-hero-veil/60 via-40% to-hero-veil/0 to-70%"
      />
      {/* En pantallas anchas el texto va a la izquierda: un velo lateral suave */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 hidden bg-gradient-to-r from-hero-veil/60 via-hero-veil/15 via-45% to-transparent md:block"
      />
    </>
  );
}

export interface HeroMediaProps extends HeroBackdropProps {
  /** Título (h1). Si no se pasa, usa `children` como contenido completo */
  title?: ReactNode;
  /** Etiqueta corta sobre el título */
  eyebrow?: ReactNode;
  /** UNA línea bajo el título (máx. ~90 caracteres). Nada de párrafos en la cabecera */
  lead?: ReactNode;
  /** 1 o 2 botones */
  actions?: HeroMediaAction[];
  breadcrumbs?: BreadcrumbItem[];
  /** Contenido extra bajo los botones (o el contenido completo si no hay `title`) */
  children?: ReactNode;
  /** "home": casi toda la pantalla. "page" (por defecto): cabecera interior */
  size?: "home" | "page";
  /** id del h1 (aria-labelledby de la sección) */
  titleId?: string;
  className?: string;
}

/**
 * Cabecera con foto protagonista (Server Component). Isla oscura en ambos modos:
 * velo oscuro y texto blanco. En móvil la foto ocupa casi toda la pantalla y encima
 * solo van etiqueta + título + una línea + 1-2 botones.
 */
export default function HeroMedia({
  title,
  eyebrow,
  lead,
  actions = [],
  breadcrumbs,
  children,
  size = "page",
  titleId = "page-hero-title",
  className,
  ...backdrop
}: HeroMediaProps) {
  const multiple = backdrop.images.length > 1;

  return (
    <section
      aria-labelledby={title ? titleId : undefined}
      data-tone="dark"
      className={cn(
        "relative isolate flex items-end overflow-hidden bg-jmv-ink pt-24 text-fg",
        size === "home" ? "min-h-[86svh] lg:min-h-[90vh]" : "min-h-[68svh] lg:min-h-[64vh]",
        multiple ? "pb-14 sm:pb-16" : "pb-10 sm:pb-14",
        className,
      )}
    >
      <HeroBackdrop {...backdrop} />

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {title ? (
          <div className="max-w-3xl">
            {breadcrumbs && breadcrumbs.length > 0 && (
              <Breadcrumbs items={breadcrumbs} tone="auto" className="mb-4 hidden sm:flex" />
            )}
            {eyebrow && (
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-jmv-gold-text sm:text-sm">
                {eyebrow}
              </p>
            )}
            <h1
              id={titleId}
              className={cn(
                "font-bold leading-[1.06] text-white text-balance [text-shadow:0_2px_16px_rgb(15_23_42/0.45)]",
                size === "home" ? "text-4xl sm:text-6xl lg:text-7xl" : "text-[2.15rem] sm:text-5xl lg:text-6xl",
              )}
            >
              {title}
            </h1>
            {lead && (
              <p className="mt-3 max-w-2xl text-base leading-snug text-slate-100 [text-shadow:0_1px_10px_rgb(15_23_42/0.6)] sm:mt-4 sm:text-xl">
                {lead}
              </p>
            )}
            {actions.length > 0 && (
              <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
                {actions.slice(0, 2).map((action, i) => {
                  const Icon = action.icon;
                  const cls = buttonVariants({
                    variant: action.variant ?? (i === 0 ? "gold" : "outlineLight"),
                    size: "lg",
                  });
                  const content = (
                    <>
                      {action.label}
                      {Icon && <Icon className="ml-2 h-5 w-5" aria-hidden />}
                      {action.external && <span className="sr-only"> (se abre en una pestaña nueva)</span>}
                    </>
                  );
                  return action.external ? (
                    <a key={action.href} href={action.href} target="_blank" rel="noopener noreferrer" className={cls}>
                      {content}
                    </a>
                  ) : (
                    <Link key={action.href} href={action.href} className={cls}>
                      {content}
                    </Link>
                  );
                })}
              </div>
            )}
            {children}
          </div>
        ) : (
          children
        )}
      </div>
    </section>
  );
}
