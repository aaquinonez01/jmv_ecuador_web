"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Route } from "lucide-react";
import { collectionHref } from "@/lib/biblioteca";
import { getOptimizedUrl } from "@/lib/helpers/cloudinary";
import BookCover from "./BookCover";
import ProgressRing from "./ProgressRing";
import { readingsLabel, type LibraryCardDoc } from "./shared";
import { useLibraryProgress } from "./useLibraryProgress";

export interface CollectionCardData {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  coverUrl?: string | null;
  documents: LibraryCardDoc[];
}

/** Cuántas lecturas de la ruta ya se terminaron en este teléfono */
export function useRouteProgress(docs: Pick<LibraryCardDoc, "slug">[]) {
  const all = useLibraryProgress();
  const done = all ? docs.filter((d) => all[d.slug]?.finished).length : 0;
  return { ready: all !== null, done, total: docs.length, percent: docs.length ? Math.round((done / docs.length) * 100) : 0 };
}

// Tarjeta de ruta de formación: abanico de portadas, número de lecturas y avance local.
export default function CollectionCard({ collection, index = 0 }: { collection: CollectionCardData; index?: number }) {
  const reduce = useReducedMotion();
  const { done, total, percent } = useRouteProgress(collection.documents);
  const fan = collection.documents.slice(0, 3);

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="h-full"
    >
      <Link
        href={collectionHref(collection.slug)}
        className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-[linear-gradient(160deg,#e3ecf8_0%,#ffffff_70%)] p-5 shadow-card transition-colors hover:border-accent-gold/50 sm:p-6 dark:bg-[linear-gradient(160deg,#16325a_0%,#0d1830_70%)]"
      >
        <div aria-hidden="true" className="relative h-40 sm:h-44">
          {collection.coverUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={getOptimizedUrl(collection.coverUrl, { w: 640 })}
              alt=""
              loading="lazy"
              decoding="async"
              className="h-full w-full rounded-2xl object-cover"
            />
          ) : (
            fan.map((doc, i) => (
              <div
                key={doc.id}
                className="absolute bottom-0 w-24 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:w-[6.5rem]"
                style={{
                  left: `${i * 26}%`,
                  zIndex: 3 - i,
                  transform: `rotate(${(i - 1) * 6}deg) translateY(${i === 1 ? -6 : 0}px)`,
                }}
              >
                <div className="motion-safe:group-hover:-translate-y-2 motion-safe:transition-transform motion-safe:duration-500">
                  <BookCover doc={doc} sizes="104px" />
                </div>
              </div>
            ))
          )}
        </div>

        <p className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-accent-gold">
          <Route className="h-4 w-4" aria-hidden />
          Ruta de formación
        </p>
        <h3 className="mt-2 font-display text-2xl font-semibold leading-tight text-fg group-hover:text-accent-gold">
          {collection.title}
        </h3>
        {collection.description && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-fg-muted">{collection.description}</p>
        )}

        <div className="mt-auto flex items-center gap-3 pt-5">
          <ProgressRing percent={percent} size={44} stroke={4} className="text-accent-gold">
            <span aria-hidden="true" className="text-[11px] font-bold text-fg">
              {done}/{total}
            </span>
          </ProgressRing>
          <p className="text-sm text-fg-muted">
            <span className="block font-semibold text-fg">{readingsLabel(total)}</span>
            {done > 0 ? `${done} de ${total} leídas` : "Aún no empiezas"}
          </p>
          <ArrowRight
            className="ml-auto h-5 w-5 text-accent-gold transition-transform motion-safe:group-hover:translate-x-1"
            aria-hidden
          />
        </div>
      </Link>
    </motion.div>
  );
}
