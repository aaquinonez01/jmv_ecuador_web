import Image from "next/image";
import { cn } from "@/lib/utils";
import { getOptimizedUrl, getSrcSet } from "@/lib/helpers/cloudinary";
import { MarianMonogram, StarsRing, TwoHearts } from "@/components/brand";
import { starPoints } from "@/components/brand/svg-props";
import { categoryStyle, isCloudinary, type EntryCategory } from "./shared";

// Imagen de una fecha o, si no tiene, un motivo de la Medalla sobre un degradado de su categoría.
// Decorativa: el título ya va en el texto de la tarjeta.

const MOTIF: Record<EntryCategory, "monogram" | "hearts" | "stars"> = {
  maria: "monogram",
  fundadores: "hearts",
  santos: "stars",
  familia: "hearts",
  jmv: "stars",
  ecuador: "stars",
  actividad: "stars",
};

export function CategoryMotif({ category, className }: { category: EntryCategory; className?: string }) {
  const motif = MOTIF[category];
  return (
    <div
      aria-hidden="true"
      style={categoryStyle(category)}
      className={cn(
        "relative isolate flex items-center justify-center overflow-hidden text-(--cat)",
        "bg-[radial-gradient(120%_90%_at_30%_10%,var(--cat-soft),transparent_60%),linear-gradient(150deg,#16325a_0%,#0f172a_70%)]",
        className,
      )}
    >
      <StarsRing className="absolute h-[88%] w-auto max-w-[88%] opacity-40" withCircle={motif === "stars"} />
      {motif === "monogram" && <MarianMonogram className="relative h-[38%] w-auto opacity-90" strokeWidth={5} />}
      {motif === "hearts" && <TwoHearts className="relative h-auto w-[46%] opacity-90" strokeWidth={2.4} />}
      {motif === "stars" && (
        <svg viewBox="0 0 40 40" className="relative h-[30%] w-auto opacity-90 drop-shadow-[0_0_18px_var(--cat)]">
          <polygon points={starPoints(20, 21, 18)} fill="currentColor" />
        </svg>
      )}
    </div>
  );
}

export default function DateVisual({
  imageUrl,
  category,
  sizes = "(min-width: 1024px) 400px, 100vw",
  priority = false,
  className,
  imgClassName,
}: {
  imageUrl?: string | null;
  category: EntryCategory;
  sizes?: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
}) {
  if (!imageUrl) return <CategoryMotif category={category} className={className} />;

  return (
    <div className={cn("relative overflow-hidden bg-jmv-ink", className)}>
      {isCloudinary(imageUrl) ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={getOptimizedUrl(imageUrl, { w: 800 })}
          srcSet={getSrcSet(imageUrl, [400, 800, 1200])}
          sizes={sizes}
          alt=""
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className={cn("absolute inset-0 h-full w-full object-cover", imgClassName)}
        />
      ) : imageUrl.startsWith("/") ? (
        <Image src={imageUrl} alt="" fill sizes={sizes} priority={priority} className={cn("object-cover", imgClassName)} />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt=""
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className={cn("absolute inset-0 h-full w-full object-cover", imgClassName)}
        />
      )}
      <div
        aria-hidden="true"
        style={categoryStyle(category)}
        className="absolute inset-0 bg-gradient-to-t from-jmv-ink/80 via-transparent to-transparent"
      />
    </div>
  );
}
