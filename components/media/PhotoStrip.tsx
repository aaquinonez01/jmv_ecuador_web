import Link from "next/link";
import { cn } from "@/lib/utils";
import { ASPECT_CLASS, type SlotAspect, type SlotPhoto } from "@/lib/site-images";
import SiteImage from "./SiteImage";

export interface PhotoStripItem extends SlotPhoto {
  /** Pie de foto corto (opcional) */
  caption?: string;
  href?: string;
}

export interface PhotoStripProps {
  items: readonly PhotoStripItem[];
  /** Nombre accesible de la franja (obligatorio: es una región desplazable) */
  label: string;
  aspect?: SlotAspect;
  /** Ancho de cada foto. Por defecto: ~78% en móvil, 2,5 por fila en tablet, 3,5 en escritorio */
  itemClassName?: string;
  className?: string;
}

/**
 * Franja de fotos que se desliza con el dedo (scroll-snap, sin JS). En móvil se
 * ve una foto y asoma la siguiente para invitar a deslizar. Con teclado: Tab
 * enfoca la franja y las flechas la desplazan.
 */
export default function PhotoStrip({
  items,
  label,
  aspect = "4/5",
  itemClassName = "w-[78%] sm:w-[40%] lg:w-[28%]",
  className,
}: PhotoStripProps) {
  if (items.length === 0) return null;

  return (
    <div
      role="region"
      aria-label={label}
      tabIndex={0}
      className={cn(
        "scrollbar-hide -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto overscroll-x-contain px-4 pb-1 sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:mx-0 lg:scroll-px-0 lg:px-0",
        "rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4",
        className,
      )}
    >
      {items.map((item, i) => {
        const figure = (
          <figure className="group">
            <div className={cn("relative overflow-hidden rounded-2xl bg-surface-2", ASPECT_CLASS[aspect])}>
              <SiteImage
                src={item.src}
                alt={item.alt}
                fill
                loading="lazy"
                sizes="(min-width: 1024px) 360px, (min-width: 640px) 40vw, 78vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                style={{ objectPosition: item.position ?? "center" }}
              />
            </div>
            {item.caption && (
              <figcaption className="mt-2 line-clamp-2 text-sm font-medium leading-snug text-fg-muted">
                {item.caption}
              </figcaption>
            )}
          </figure>
        );
        return (
          <div key={`${item.src}-${i}`} className={cn("shrink-0 snap-start", itemClassName)}>
            {item.href ? (
              <Link href={item.href} className="block rounded-2xl">
                {figure}
              </Link>
            ) : (
              figure
            )}
          </div>
        );
      })}
    </div>
  );
}
