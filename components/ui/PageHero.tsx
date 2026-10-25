import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants, type ButtonVariant } from "./button-variants";
import Breadcrumbs, { type BreadcrumbItem } from "./Breadcrumbs";
import StarsRing from "@/components/brand/StarsRing";
import MarianMonogram from "@/components/brand/MarianMonogram";
import TwoHearts from "@/components/brand/TwoHearts";

export interface PageHeroAction {
  label: string;
  href: string;
  /** gold (principal), outlineLight (secundaria), light… Por defecto: gold la primera, outlineLight el resto */
  variant?: ButtonVariant;
  icon?: LucideIcon;
  /** Enlace externo: abre en pestaña nueva con rel seguro */
  external?: boolean;
}

export interface PageHeroProps {
  title: ReactNode;
  eyebrow?: ReactNode;
  /** Lema corto en serif editorial (se renderiza como <p>, no como h2) */
  motto?: ReactNode;
  description?: ReactNode;
  actions?: PageHeroAction[];
  /** Fotografía de fondo (ruta en /public o URL de Cloudinary) */
  image?: { src: string; alt?: string; position?: string };
  breadcrumbs?: BreadcrumbItem[];
  /** Motivo decorativo de la Medalla Milagrosa */
  motif?: "stars" | "monogram" | "hearts" | "none";
  align?: "center" | "left";
  /** Contenido extra bajo las acciones (chips, datos, etc.) */
  children?: ReactNode;
  className?: string;
  /** id del h1 (para aria-labelledby de la sección) */
  id?: string;
}

// Hero de página interior: no ocupa la pantalla completa, el texto se ve sin JS
// y la foto se conserva con un velo degradado (no opacity-10).
// Tema: CON foto es una isla oscura (data-tone="dark": velo oscuro y texto blanco en
// ambos modos). SIN foto sigue el tema (bg-hero-plain: marfil→azul claro en claro,
// tinta→azul JMV en oscuro) y "outlineLight" se cambia por "outlineAuto".
export default function PageHero({
  title,
  eyebrow,
  motto,
  description,
  actions = [],
  image,
  breadcrumbs,
  motif = "stars",
  align = "left",
  children,
  className,
  id = "page-hero-title",
}: PageHeroProps) {
  const centered = align === "center";
  const onPhoto = Boolean(image);

  return (
    <section
      aria-labelledby={id}
      data-tone={onPhoto ? "dark" : undefined}
      className={cn(
        "relative isolate flex min-h-[55svh] items-end overflow-hidden bg-page pt-24 pb-12 sm:pt-28 lg:min-h-[60vh] lg:pb-16",
        className,
      )}
    >
      {image ? (
        <>
          <Image
            src={image.src}
            alt={image.alt ?? ""}
            fill
            priority
            sizes="100vw"
            className="-z-20 object-cover"
            style={{ objectPosition: image.position ?? "center" }}
          />
          {/* Velo: oscuro abajo (donde va el texto), deja ver la foto arriba */}
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-gradient-to-t from-hero-veil via-hero-veil/70 to-hero-veil/10"
          />
          {!centered && (
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 bg-gradient-to-r from-hero-veil/70 via-hero-veil/20 to-transparent"
            />
          )}
        </>
      ) : (
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-20 bg-hero-plain"
        />
      )}

      {motif !== "none" && (
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute -z-10 text-accent-gold",
            centered
              ? "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 dark:opacity-15"
              : "-right-16 top-16 opacity-20 dark:opacity-25 sm:right-4 lg:right-12",
          )}
        >
          {motif === "stars" && <StarsRing withCircle className="h-72 w-72 sm:h-96 sm:w-96" />}
          {motif === "monogram" && (
            <div className="relative h-72 w-72 sm:h-96 sm:w-96">
              <StarsRing className="absolute inset-0 h-full w-full" />
              <MarianMonogram className="absolute left-1/2 top-1/2 h-32 w-28 -translate-x-1/2 -translate-y-1/2 sm:h-44 sm:w-36" strokeWidth={4} />
            </div>
          )}
          {motif === "hearts" && (
            <div className="relative h-72 w-72 sm:h-96 sm:w-96">
              <StarsRing className="absolute inset-0 h-full w-full" />
              <TwoHearts className="absolute left-1/2 top-1/2 w-40 -translate-x-1/2 -translate-y-1/2 sm:w-52" />
            </div>
          )}
        </div>
      )}

      <div
        className={cn(
          "relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8",
          centered && "text-center",
        )}
      >
        <div className={cn("max-w-3xl", centered && "mx-auto")}>
          {breadcrumbs && breadcrumbs.length > 0 && (
            <Breadcrumbs items={breadcrumbs} tone="auto" className={cn("mb-6", centered && "flex justify-center")} />
          )}

          {eyebrow && (
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-accent-gold">
              {eyebrow}
            </p>
          )}

          <h1
            id={id}
            className="text-4xl font-bold leading-[1.1] text-fg text-balance sm:text-5xl lg:text-6xl"
          >
            {title}
          </h1>

          {motto && (
            <p className="mt-4 font-display text-xl italic leading-snug text-accent-gold sm:text-2xl">
              {motto}
            </p>
          )}

          {description && (
            <p className={cn("mt-5 max-w-2xl text-base leading-relaxed text-fg-soft sm:text-lg", centered && "mx-auto")}>
              {description}
            </p>
          )}

          {actions.length > 0 && (
            <div
              className={cn(
                "mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap",
                centered && "sm:justify-center",
              )}
            >
              {actions.map((action, i) => {
                const Icon = action.icon;
                const requested = action.variant ?? (i === 0 ? "gold" : "outlineLight");
                const className = buttonVariants({
                  variant: !onPhoto && requested === "outlineLight" ? "outlineAuto" : requested,
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
                  <a key={action.href} href={action.href} target="_blank" rel="noopener noreferrer" className={className}>
                    {content}
                  </a>
                ) : (
                  <Link key={action.href} href={action.href} className={className}>
                    {content}
                  </Link>
                );
              })}
            </div>
          )}

          {children}
        </div>
      </div>
    </section>
  );
}
