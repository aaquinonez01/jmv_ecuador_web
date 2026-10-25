"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Check, Clock, Lock } from "lucide-react";
import { KIND_LABELS, libraryHref, progressPercent, readingTimeLabel } from "@/lib/biblioteca";
import { cn } from "@/lib/utils";
import BookCover from "./BookCover";
import KindIcon from "./KindIcon";
import type { LibraryCardDoc } from "./shared";
import { useDocProgress } from "./useLibraryProgress";

const HEADINGS = { h2: "h2", h3: "h3", h4: "h4" } as const;

/**
 * Tarjeta-libro: portada con lomo, título, autor y tiempo de lectura.
 * Marca "Nuevo", "Solo miembros", el formato y, si ya se leyó en este teléfono,
 * el avance o el check de terminado. Toda la tarjeta es un enlace a la ficha.
 */
export default function BookCard({
  doc,
  isNew = false,
  index = 0,
  heading = "h3",
  sizes,
  className,
}: {
  doc: LibraryCardDoc;
  isNew?: boolean;
  /** Posición en la lista, para escalonar la aparición */
  index?: number;
  heading?: keyof typeof HEADINGS;
  sizes?: string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const progress = useDocProgress(doc.slug);
  const percent = progressPercent(progress);
  const finished = !!progress?.finished;
  const time = readingTimeLabel(doc.readingMinutes);
  const Heading = HEADINGS[heading];

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.45, delay: Math.min(index, 6) * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className={cn("h-full", className)}
    >
      <Link
        href={libraryHref(doc.slug)}
        className="group flex h-full flex-col rounded-2xl p-1.5 outline-offset-4 [perspective:900px]"
      >
        <div className="relative transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] [transform-origin:left_center] motion-safe:group-hover:[transform:rotateY(-14deg)_translateY(-6px)] motion-safe:group-focus-visible:[transform:rotateY(-14deg)_translateY(-6px)]">
          <BookCover doc={doc} sizes={sizes} />
          <div aria-hidden="true" className="absolute inset-x-2 top-2 flex items-start justify-between gap-1">
            {isNew ? (
              <span className="rounded-full bg-jmv-gold px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-jmv-ink shadow">
                Nuevo
              </span>
            ) : (
              <span />
            )}
            {finished ? (
              <span className="grid h-7 w-7 place-items-center rounded-full bg-emerald-500 text-white shadow-lg ring-2 ring-white/80">
                <Check className="h-4 w-4" strokeWidth={3} />
              </span>
            ) : (
              doc.visibility === "miembros" && (
                <span className="grid h-7 w-7 place-items-center rounded-full bg-jmv-ink/80 text-jmv-gold-text shadow backdrop-blur">
                  <Lock className="h-3.5 w-3.5" />
                </span>
              )
            )}
          </div>
          <span
            aria-hidden="true"
            className="absolute bottom-2 right-2 grid h-7 w-7 place-items-center rounded-full bg-black/45 text-white backdrop-blur"
          >
            <KindIcon kind={doc.kind} className="h-4 w-4" />
          </span>
          {!finished && percent > 0 && (
            <span aria-hidden="true" className="absolute inset-x-2 bottom-0 h-1 overflow-hidden rounded-full bg-white/25">
              <span className="block h-full rounded-full bg-jmv-gold-text" style={{ width: `${percent}%` }} />
            </span>
          )}
        </div>

        <div className="mt-3 flex flex-1 flex-col px-0.5">
          <Heading className="line-clamp-2 text-[15px] font-semibold leading-snug text-fg transition-colors group-hover:text-accent-gold sm:text-base">
            {doc.title}
          </Heading>
          {doc.author && <p className="mt-1 truncate text-sm text-fg-muted">{doc.author}</p>}
          <p className="mt-auto flex items-center gap-1.5 pt-2 text-xs font-medium text-fg-muted">
            {time && (
              <>
                <Clock className="h-3.5 w-3.5 text-accent-gold" aria-hidden />
                <span>
                  <span className="sr-only">Tiempo de lectura: </span>
                  {time}
                </span>
                <span aria-hidden="true">·</span>
              </>
            )}
            <span>{KIND_LABELS[doc.kind]}</span>
          </p>
          <span className="sr-only">
            {isNew && ". Nuevo"}
            {doc.visibility === "miembros" && ". Solo para miembros"}
            {finished ? ". Ya lo terminaste" : percent > 0 ? `. Llevas el ${percent} %` : ""}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
