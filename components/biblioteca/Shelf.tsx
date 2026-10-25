"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import BookCard from "./BookCard";
import type { LibraryCardDoc } from "./shared";

const arrow =
  "grid h-11 w-11 place-items-center rounded-full border border-fg/15 bg-surface text-fg shadow-card transition-colors hover:bg-surface-2 disabled:cursor-default disabled:opacity-30 disabled:hover:bg-surface dark:hover:bg-white/15";

/**
 * Estante horizontal con scroll-snap. En el móvil se desliza con el dedo; en
 * escritorio hay flechas (que se desactivan al llegar a un extremo).
 */
export default function Shelf({
  id,
  title,
  eyebrow,
  icon,
  docs,
  newIds = [],
  seeAllHref,
  seeAllLabel = "Ver todo",
}: {
  id: string;
  title: string;
  eyebrow?: string;
  icon?: ReactNode;
  docs: LibraryCardDoc[];
  newIds?: string[];
  seeAllHref?: string;
  seeAllLabel?: string;
}) {
  const listRef = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: true });

  const update = useCallback(() => {
    const el = listRef.current;
    if (!el) return;
    setEdges({ start: el.scrollLeft <= 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 });
  }, []);

  useEffect(() => {
    update();
    const el = listRef.current;
    if (!el) return;
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [update]);

  const scrollBy = (dir: 1 | -1) => {
    const el = listRef.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: reduce ? "auto" : "smooth" });
  };

  const headingId = `${id}-title`;
  const fresh = new Set(newIds);

  return (
    <section aria-labelledby={headingId} className="relative">
      <div className="mx-auto flex max-w-7xl items-end justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="min-w-0">
          {eyebrow && (
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-accent-gold">{eyebrow}</p>
          )}
          <h2 id={headingId} className="flex items-center gap-2.5 font-display text-2xl font-semibold text-fg sm:text-3xl">
            {icon}
            {title}
            <span className="ml-1 font-sans text-sm font-medium text-fg-subtle">
              <span className="sr-only">, </span>
              {docs.length}
            </span>
          </h2>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {seeAllHref && (
            <Link
              href={seeAllHref}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-accent-gold hover:bg-fg/10"
            >
              {seeAllLabel}
              <span className="sr-only">: {title}</span>
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          )}
          <div className={cn("hidden gap-2 md:flex", edges.start && edges.end && "md:hidden")}>
            <button type="button" className={arrow} onClick={() => scrollBy(-1)} disabled={edges.start} aria-controls={`${id}-list`}>
              <ChevronLeft className="h-5 w-5" aria-hidden />
              <span className="sr-only">Anteriores en {title}</span>
            </button>
            <button type="button" className={arrow} onClick={() => scrollBy(1)} disabled={edges.end} aria-controls={`${id}-list`}>
              <ChevronRight className="h-5 w-5" aria-hidden />
              <span className="sr-only">Siguientes en {title}</span>
            </button>
          </div>
        </div>
      </div>

      <ul
        ref={listRef}
        id={`${id}-list`}
        onScroll={update}
        className="scrollbar-hide mx-auto mt-4 flex max-w-7xl snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-6 pt-2 sm:scroll-px-6 sm:gap-5 sm:px-6 lg:scroll-px-8 lg:px-8"
      >
        {docs.map((doc, i) => (
          <li key={doc.id} className="w-[40vw] max-w-[11.5rem] shrink-0 snap-start sm:w-44 sm:max-w-none lg:w-48">
            <BookCard doc={doc} isNew={fresh.has(doc.id)} index={i} sizes="(min-width: 1024px) 192px, (min-width: 640px) 176px, 40vw" />
          </li>
        ))}
      </ul>
    </section>
  );
}
