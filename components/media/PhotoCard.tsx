import Link from "next/link";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ASPECT_CLASS, type SlotAspect, type SlotPhoto } from "@/lib/site-images";
import SiteImage from "./SiteImage";

export interface PhotoCardProps {
  image: SlotPhoto;
  title: ReactNode;
  /** 1 o 2 líneas (se recorta a 2) */
  text?: ReactNode;
  /** Etiqueta corta sobre el título */
  eyebrow?: ReactNode;
  /** Icono pequeño en una pastilla sobre la foto */
  icon?: LucideIcon;
  href?: string;
  /** Texto del enlace (accesible) cuando hay href; por defecto el título */
  linkLabel?: string;
  /**
   * "stacked" (por defecto): foto arriba y texto debajo, sobre tarjeta que sigue el tema.
   * "overlay": texto sobre la foto con velo inferior (isla oscura en ambos modos).
   */
  variant?: "stacked" | "overlay";
  aspect?: SlotAspect;
  /** Atributo sizes de la foto (por defecto: 1 col móvil, 2 tablet, 3 escritorio) */
  sizes?: string;
  headingLevel?: "h2" | "h3" | "h4";
  className?: string;
}

/**
 * Tarjeta con foto + título + 1-2 líneas (Server Component). Si tiene href, toda
 * la tarjeta es un enlace (un solo destino táctil grande).
 */
export default function PhotoCard({
  image,
  title,
  text,
  eyebrow,
  icon: Icon,
  href,
  linkLabel,
  variant = "stacked",
  aspect = variant === "overlay" ? "4/5" : "3/2",
  sizes = "(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw",
  headingLevel: Heading = "h3",
  className,
}: PhotoCardProps) {
  const overlay = variant === "overlay";

  const photo = (
    <SiteImage
      src={image.src}
      alt={image.alt}
      fill
      loading="lazy"
      sizes={sizes}
      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
      style={{ objectPosition: image.position ?? "center" }}
    />
  );

  const badge = Icon ? (
    <span className="absolute left-3 top-3 flex h-10 w-10 items-center justify-center rounded-xl bg-jmv-gold text-jmv-ink shadow-md">
      <Icon className="h-5 w-5" aria-hidden />
    </span>
  ) : null;

  const titleNode = (
    <Heading className={cn("font-bold leading-tight text-balance", overlay ? "text-xl text-white" : "text-lg text-fg")}>
      {href ? (
        <Link
          href={href}
          aria-label={linkLabel}
          className="after:absolute after:inset-0 after:rounded-[inherit] focus-visible:outline-none"
        >
          {title}
        </Link>
      ) : (
        title
      )}
    </Heading>
  );

  if (overlay) {
    return (
      <article
        data-tone="dark"
        className={cn(
          "group relative isolate flex flex-col justify-end overflow-hidden rounded-2xl bg-jmv-ink p-5 has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-focus",
          ASPECT_CLASS[aspect],
          className,
        )}
      >
        <div className="absolute inset-0 -z-20">{photo}</div>
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-t from-hero-veil via-hero-veil/60 via-35% to-hero-veil/0 to-70%"
        />
        {badge}
        {eyebrow && (
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-jmv-gold-text">{eyebrow}</p>
        )}
        {titleNode}
        {text && <p className="mt-1.5 line-clamp-2 text-sm leading-snug text-slate-100">{text}</p>}
      </article>
    );
  }

  return (
    <article
      className={cn(
        "group surface-card relative flex flex-col overflow-hidden rounded-2xl has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-focus",
        className,
      )}
    >
      <div className={cn("relative overflow-hidden bg-surface-2", ASPECT_CLASS[aspect])}>
        {photo}
        {badge}
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {eyebrow && (
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-accent-gold">{eyebrow}</p>
        )}
        {titleNode}
        {text && <p className="mt-1.5 line-clamp-2 text-sm leading-snug text-fg-muted">{text}</p>}
        {href && (
          <span aria-hidden="true" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-accent-blue">
            Ver más
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        )}
      </div>
    </article>
  );
}
