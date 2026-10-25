import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { StarsRing } from "@/components/brand";

// Piezas sin pdf.js ni hooks: el esqueleto también se pinta desde el servidor.

type SkeletonProps = {
  title: string;
  backHref: string;
  /** 0-1 mientras llega el archivo */
  progress?: number | null;
  /** Dentro del lector usa los colores del tema elegido; desde el servidor, la tinta del sitio */
  themed?: boolean;
};

export function ReaderSkeleton({ title, backHref, progress, themed = false, id }: SkeletonProps & { id?: string }) {
  const pct = progress != null ? Math.round(progress * 100) : null;
  return (
    <div
      id={id}
      className={cn(
        "fixed inset-0 z-[70] flex flex-col",
        themed ? "bg-(--r-bg) text-(--r-fg)" : "bg-[#0b1224] text-slate-100",
      )}
    >
      <div
        className={cn(
          "flex h-14 shrink-0 items-center gap-2 border-b px-2 sm:px-4",
          themed ? "border-(--r-line) bg-(--r-bar)" : "border-white/10 bg-jmv-ink",
        )}
      >
        <Link
          href={backHref}
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-full hover:bg-white/10"
          aria-label="Volver a la ficha del documento"
        >
          <ArrowLeft className="size-5" aria-hidden="true" />
        </Link>
        <p className="min-w-0 flex-1 truncate font-display text-base font-semibold sm:text-lg">{title}</p>
      </div>
      <div className="flex flex-1 flex-col items-center overflow-hidden px-2 pt-6 sm:pt-10">
        <div
          aria-hidden="true"
          className={cn(
            "relative aspect-[1/1.414] w-full max-w-[880px] overflow-hidden rounded-[3px] shadow-xl",
            themed ? "bg-(--r-paper)" : "bg-white/[0.06]",
          )}
        >
          <div className="jmv-reader-shimmer absolute inset-0 motion-safe:animate-pulse" />
          <div className="absolute inset-x-[10%] top-[10%] space-y-4">
            <div className={cn("h-3 w-1/3 rounded-full", themed ? "bg-(--r-soft)" : "bg-white/10")} />
            <div className={cn("h-6 w-2/3 rounded-full", themed ? "bg-(--r-soft)" : "bg-white/10")} />
            {Array.from({ length: 9 }, (_, i) => (
              <div
                key={i}
                className={cn("h-2.5 rounded-full", themed ? "bg-(--r-soft)" : "bg-white/[0.07]")}
                style={{ width: `${92 - ((i * 17) % 30)}%` }}
              />
            ))}
          </div>
        </div>
      </div>
      <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-8 flex justify-center px-4">
        <div
          className={cn(
            "flex items-center gap-3 rounded-full px-4 py-2.5 text-sm shadow-lg",
            themed ? "bg-(--r-bar) text-(--r-fg)" : "bg-jmv-ink text-slate-100 ring-1 ring-white/10",
          )}
        >
          <StarsRing className="size-5 text-jmv-gold-text motion-safe:animate-spin [animation-duration:6s]" />
          <span>{pct != null && pct > 0 ? `Abriendo el documento… ${pct} %` : "Abriendo el documento…"}</span>
        </div>
      </div>
    </div>
  );
}

type MessageProps = {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  actions: React.ReactNode;
};

/** Pantalla de aviso dentro del lector: errores e "inicia sesión" */
export function ReaderMessage({ icon, title, children, actions }: MessageProps) {
  return (
    <div className="flex min-h-full items-center justify-center px-4 py-24">
      <div className="w-full max-w-md rounded-3xl border border-(--r-line) bg-(--r-bar) p-6 text-center shadow-xl sm:p-8">
        <div className="relative mx-auto mb-5 flex size-20 items-center justify-center">
          <StarsRing className="absolute inset-0 text-(--r-accent) opacity-30" />
          <span className="text-(--r-accent)">{icon}</span>
        </div>
        <h1 className="font-display text-2xl font-semibold text-balance">{title}</h1>
        <div className="mt-3 text-pretty text-(--r-muted)">{children}</div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">{actions}</div>
      </div>
    </div>
  );
}

export const readerButton = {
  primary:
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-(--r-accent) px-5 py-2.5 font-semibold text-(--r-paper) hover:opacity-90 [[data-theme=noche]_&]:text-jmv-ink",
  secondary:
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border-2 border-(--r-line) px-5 py-2.5 font-semibold text-(--r-fg) hover:bg-(--r-soft)",
};
