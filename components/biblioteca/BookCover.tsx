import { cn } from "@/lib/utils";
import { getOptimizedUrl, getSrcSet } from "@/lib/helpers/cloudinary";
import { TYPE_SINGULAR } from "@/lib/biblioteca";
import { MarianMonogram, StarsRing, TwoHearts } from "@/components/brand";
import { starPoints } from "@/components/brand/svg-props";
import type { LibraryDocument } from "@/types/library";
import { coverTheme, docStyle, type CoverMotif } from "./shared";

// Portada en proporción de libro (2:3) con lomo y sombra. Si el admin no subió
// imagen, se genera una con el color del eje (o del tipo) y un motivo de la Medalla.
// Decorativa: el título ya está en el texto de la tarjeta.

export type CoverDoc = Pick<LibraryDocument, "title" | "author" | "type" | "axis" | "coverUrl">;

function Motif({ motif, className }: { motif: CoverMotif; className?: string }) {
  if (motif === "monogram") return <MarianMonogram className={className} strokeWidth={4} />;
  if (motif === "hearts") return <TwoHearts className={className} strokeWidth={1.8} />;
  if (motif === "cross")
    return (
      <svg viewBox="0 0 60 90" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className={className}>
        <path d="M30 6v78M12 28h36" />
        <circle cx="30" cy="28" r="10" strokeWidth="1.5" opacity="0.6" />
      </svg>
    );
  if (motif === "seed")
    return (
      <svg viewBox="0 0 80 90" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M40 86V38" />
        <path d="M40 54C40 36 26 26 10 26c0 18 12 28 30 28Z" />
        <path d="M40 44c0-18 13-30 30-30 0 18-12 30-30 30Z" />
        <path d="M24 86h32" opacity="0.6" />
      </svg>
    );
  return (
    <svg viewBox="0 0 40 40" fill="currentColor" className={className}>
      <polygon points={starPoints(20, 21, 18)} />
    </svg>
  );
}

function GeneratedCover({ doc }: { doc: CoverDoc }) {
  const theme = coverTheme(doc);
  return (
    <div
      className="absolute inset-0 flex flex-col bg-[radial-gradient(120%_70%_at_80%_0%,color-mix(in_oklab,var(--acc)_28%,transparent),transparent_60%),linear-gradient(165deg,var(--from)_0%,var(--to)_85%)] py-[9%] pl-[15%] pr-[9%] text-white"
    >
      <StarsRing className="pointer-events-none absolute -right-[22%] -top-[12%] w-[85%] text-(--acc) opacity-[0.18]" />
      <p className="relative font-semibold uppercase tracking-[0.18em] text-(--acc)" style={{ fontSize: "6.2cqw" }}>
        {TYPE_SINGULAR[doc.type]}
      </p>
      <div className="relative flex flex-1 items-center justify-center py-[6%]">
        <Motif motif={theme.motif} className="h-auto max-h-full w-[46%] text-(--acc) opacity-80" />
      </div>
      <p
        className="relative line-clamp-4 font-display font-semibold leading-[1.08] text-balance"
        style={{ fontSize: doc.title.length > 48 ? "9.5cqw" : "11.5cqw" }}
      >
        {doc.title}
      </p>
      {doc.author && (
        <p className="relative mt-[5%] truncate text-white/75" style={{ fontSize: "6.2cqw" }}>
          {doc.author}
        </p>
      )}
      <span className="relative mt-[7%] block h-px w-[30%] bg-(--acc) opacity-70" />
    </div>
  );
}

export default function BookCover({
  doc,
  sizes = "(min-width: 640px) 180px, 40vw",
  priority = false,
  className,
}: {
  doc: CoverDoc;
  /** Atributo sizes del srcset (portadas de Cloudinary) */
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      style={docStyle(doc)}
      className={cn(
        "@container relative isolate aspect-[2/3] overflow-hidden rounded-[3px_10px_10px_3px] bg-(--to)",
        "shadow-[0_22px_32px_-14px_rgba(0,0,0,0.7),0_8px_12px_-8px_rgba(0,0,0,0.55)]",
        className,
      )}
    >
      {doc.coverUrl ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={getOptimizedUrl(doc.coverUrl, { w: 600 })}
          srcSet={getSrcSet(doc.coverUrl, [240, 400, 600, 900])}
          sizes={sizes}
          alt=""
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <GeneratedCover doc={doc} />
      )}
      {/* Lomo: pliegue oscuro con un brillo, y borde de hojas al otro lado */}
      <span className="pointer-events-none absolute inset-y-0 left-0 w-[9%] bg-[linear-gradient(90deg,rgba(0,0,0,0.38)_0%,rgba(255,255,255,0.16)_45%,rgba(0,0,0,0.12)_70%,transparent_100%)]" />
      <span className="pointer-events-none absolute inset-y-0 right-0 w-[2px] bg-white/15" />
      <span className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[linear-gradient(115deg,rgba(255,255,255,0.14)_0%,transparent_32%)] ring-1 ring-inset ring-white/10" />
    </div>
  );
}
