import { cn } from "@/lib/utils";
import type { SlotPhoto } from "@/lib/site-images";
import SiteImage from "./SiteImage";

export interface PhotoMosaicProps {
  /** 2 a 5 fotos (si llegan más, se muestran las 5 primeras) */
  images: readonly SlotPhoto[];
  /** Nombre accesible de la lista de fotos */
  label?: string;
  className?: string;
  /** Redondeo de cada foto */
  rounded?: string;
}

// Distribución en escritorio (rejilla de 4 columnas y 2 filas) según cuántas fotos hay.
// En móvil: 2 columnas, la primera foto a todo el ancho.
const DESKTOP: Record<number, string[]> = {
  1: ["md:col-span-4 md:row-span-2"],
  2: ["md:col-span-2 md:row-span-2", "md:col-span-2 md:row-span-2"],
  3: ["md:col-span-2 md:row-span-2", "md:col-span-2", "md:col-span-2"],
  4: ["md:col-span-2 md:row-span-2", "md:col-span-2", "md:col-span-1", "md:col-span-1"],
  5: ["md:col-span-2 md:row-span-2", "md:col-span-1", "md:col-span-1", "md:col-span-1", "md:col-span-1"],
};

// "sizes" aproximado de cada casilla (contenedor máx. ~1280px)
function sizesFor(count: number, i: number) {
  const mobile = i === 0 || (count % 2 === 0 && i === count - 1) ? "100vw" : "50vw";
  const big = i === 0 || count === 2;
  const desktop = big ? "640px" : count === 3 || (count === 4 && i === 1) ? "640px" : "320px";
  return `(min-width: 768px) ${desktop}, ${mobile}`;
}

/**
 * Mosaico de 2 a 5 fotos (Server Component). Fotos con carga diferida.
 * En móvil la primera va a todo el ancho y el resto en 2 columnas.
 */
export default function PhotoMosaic({
  images,
  label = "Galería de fotos",
  className,
  rounded = "rounded-2xl",
}: PhotoMosaicProps) {
  const photos = images.slice(0, 5);
  const count = photos.length;
  if (count === 0) return null;
  const layout = DESKTOP[count];

  return (
    <ul
      aria-label={label}
      className={cn(
        "grid grid-cols-2 gap-2 sm:gap-3 md:h-[30rem] md:grid-cols-4 md:grid-rows-2 lg:h-[34rem]",
        className,
      )}
    >
      {photos.map((photo, i) => {
        // En móvil: primera foto ancha; si el resto es impar, la última también
        const wideOnMobile = i === 0 || ((count - 1) % 2 === 1 && i === count - 1);
        return (
          <li
            key={`${photo.src}-${i}`}
            className={cn(
              "relative overflow-hidden bg-surface-2",
              rounded,
              wideOnMobile ? "col-span-2 aspect-[16/10]" : "aspect-square",
              "md:aspect-auto",
              layout[i],
            )}
          >
            <SiteImage
              src={photo.src}
              alt={photo.alt}
              fill
              loading="lazy"
              sizes={sizesFor(count, i)}
              className="object-cover transition-transform duration-700 ease-out hover:scale-[1.03]"
              style={{ objectPosition: photo.position ?? "center" }}
            />
          </li>
        );
      })}
    </ul>
  );
}
