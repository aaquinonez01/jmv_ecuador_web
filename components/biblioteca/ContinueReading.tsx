"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { BookOpenText, Play } from "lucide-react";
import { libraryHref, progressPercent, readerHref } from "@/lib/biblioteca";
import { buttonVariants } from "@/components/ui/button-variants";
import BookCover from "./BookCover";
import { pageLabel, type LibraryCardDoc } from "./shared";
import { useLibraryProgress } from "./useLibraryProgress";

/** "Sigue leyendo": lo que empezaste en este teléfono y aún no terminas. Sin progreso, no aparece. */
export default function ContinueReading({ docs }: { docs: LibraryCardDoc[] }) {
  const reduce = useReducedMotion();
  const all = useLibraryProgress();

  const items = useMemo(() => {
    if (!all) return [];
    const bySlug = new Map(docs.map((d) => [d.slug, d]));
    return Object.values(all)
      .filter((p) => !p.finished && p.page >= 1 && bySlug.get(p.slug)?.kind === "pdf")
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, 8)
      .map((p) => ({ progress: p, doc: bySlug.get(p.slug)! }));
  }, [all, docs]);

  if (items.length === 0) return null;

  return (
    <section aria-labelledby="sigue-leyendo-title" className="relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 id="sigue-leyendo-title" className="flex items-center gap-2.5 font-display text-2xl font-semibold text-fg sm:text-3xl">
          <BookOpenText className="h-6 w-6 text-accent-gold" aria-hidden />
          Sigue leyendo
        </h2>
      </div>
      <ul className="scrollbar-hide mx-auto mt-4 flex max-w-7xl snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-4 pt-1 sm:scroll-px-6 sm:px-6 lg:scroll-px-8 lg:px-8">
        {items.map(({ doc, progress }, i) => {
          const percent = progressPercent(progress);
          const total = progress.pageCount || doc.pageCount || 0;
          return (
            <motion.li
              key={doc.id}
              initial={reduce ? false : { opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="w-[86vw] max-w-[24rem] shrink-0 snap-start"
            >
              <div className="relative flex h-full gap-4 rounded-3xl border border-line bg-surface p-4 shadow-card dark:bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))]">
                <Link href={libraryHref(doc.slug)} tabIndex={-1} aria-hidden="true" className="w-20 shrink-0 sm:w-24">
                  <BookCover doc={doc} sizes="96px" />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <h3 className="line-clamp-2 font-semibold leading-snug text-fg">
                    <Link href={libraryHref(doc.slug)} className="hover:text-accent-gold">
                      {doc.title}
                    </Link>
                  </h3>
                  <p className="mt-1 text-sm text-fg-muted">{pageLabel(progress.page, total)}</p>
                  <div
                    role="progressbar"
                    aria-label={`Avance en ${doc.title}`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={percent}
                    aria-valuetext={`${percent} %`}
                    className="mt-2 h-1.5 overflow-hidden rounded-full bg-fg/15"
                  >
                    <div className="h-full rounded-full bg-gradient-to-r from-jmv-gold to-jmv-gold-text" style={{ width: `${Math.max(percent, 3)}%` }} />
                  </div>
                  <div className="mt-auto pt-3">
                    <Link
                      href={readerHref(doc.slug, progress.page)}
                      className={buttonVariants({ variant: "gold", size: "sm", className: "gap-2 rounded-full" })}
                    >
                      <Play className="h-4 w-4 fill-current" aria-hidden />
                      Continuar
                      <span className="sr-only"> {doc.title} en la página {progress.page}</span>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}
