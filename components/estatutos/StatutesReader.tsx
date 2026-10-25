"use client";

import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, ChevronUp, Link2, ListTree, MessageCircle, ScrollText, Search, X } from "lucide-react";
import { allArticles, countMatches, type ParsedStatutes, type StatuteArticle } from "@/lib/estatutos";
import { SITE } from "@/lib/site";
import { whatsappShareLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import StatutesBody from "./StatutesBody";
import StatuteText from "./StatuteText";

const MIN_QUERY = 2;

interface StatutesReaderProps {
  doc: ParsedStatutes;
  /** Ruta de esta versión, para los enlaces de cada artículo */
  basePath: string;
  /** "Estatutos de JMV Ecuador (2010)", para el mensaje de WhatsApp */
  shareTitle: string;
}

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Texto completo con índice, buscador y enlaces por artículo.
export default function StatutesReader({ doc, basePath, shareTitle }: StatutesReaderProps) {
  const [query, setQuery] = useState("");
  const deferred = useDeferredValue(query);
  const term = deferred.trim().length >= MIN_QUERY ? deferred.trim() : "";
  const [hit, setHit] = useState(-1);
  const [active, setActive] = useState<string | null>(null);
  const [tocOpen, setTocOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const bodyRef = useRef<HTMLDivElement>(null);
  const noticeTimer = useRef<number | undefined>(undefined);

  const articles = useMemo(() => allArticles(doc), [doc]);
  const chapterOf = useMemo(() => {
    const map = new Map<string, string>();
    for (const c of doc.chapters) for (const a of c.articles) map.set(a.id, c.id);
    return map;
  }, [doc]);

  const counts = useMemo(() => {
    if (!term) return null;
    const map = new Map<string, number>();
    for (const a of articles) {
      const n = countMatches(a, term);
      if (n) map.set(a.id, n);
    }
    return map;
  }, [articles, term]);

  const visible = useMemo(() => (counts ? new Set(counts.keys()) : null), [counts]);
  const totalHits = counts ? [...counts.values()].reduce((s, n) => s + n, 0) : 0;
  const visibleKey = visible ? [...visible].join(",") : "todo";

  // La búsqueda nueva empieza desde el primer resultado
  useEffect(() => setHit(-1), [term]);

  // Capítulo y artículo que se están leyendo (para resaltar el índice)
  useEffect(() => {
    const root = bodyRef.current;
    if (!root || typeof IntersectionObserver === "undefined") return;
    const shown = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).dataset.article!;
          if (entry.isIntersecting) shown.set(id, entry.boundingClientRect.top);
          else shown.delete(id);
        }
        if (shown.size) {
          const [first] = [...shown.entries()].sort((a, b) => a[1] - b[1]);
          setActive(first[0]);
        }
      },
      { rootMargin: "-150px 0px -55% 0px" }
    );
    root.querySelectorAll<HTMLElement>("[data-article]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [visibleKey]);

  const activeChapter = active ? chapterOf.get(active) : doc.chapters[0]?.id;
  const activeNumeral = doc.chapters.find((c) => c.id === activeChapter)?.numeral;

  const flash = useCallback((message: string) => {
    setNotice(message);
    window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => setNotice(""), 2800);
  }, []);
  useEffect(() => () => window.clearTimeout(noticeTimer.current), []);

  const goToHit = (direction: 1 | -1) => {
    const marks = bodyRef.current?.querySelectorAll<HTMLElement>("mark[data-hit]");
    if (!marks?.length) return;
    const next = hit < 0 ? (direction === 1 ? 0 : marks.length - 1) : (hit + direction + marks.length) % marks.length;
    marks.forEach((m) => m.removeAttribute("data-current"));
    const mark = marks[next];
    mark.setAttribute("data-current", "true");
    mark.scrollIntoView({ block: "center", behavior: prefersReducedMotion() ? "auto" : "smooth" });
    setHit(next);
  };

  const articleUrl = (article: StatuteArticle) => `${SITE.url}${basePath}#${article.id}`;

  const copyLink = async (article: StatuteArticle) => {
    const url = articleUrl(article);
    try {
      await navigator.clipboard.writeText(url);
      flash(`Enlace copiado: ${article.number ? `artículo ${article.number}` : article.title}`);
    } catch {
      window.prompt("Copia este enlace:", url);
    }
  };

  const articleActions = (article: StatuteArticle) => {
    const name = article.number ? `el artículo ${article.number}` : `«${article.title}»`;
    const iconButton =
      "inline-flex h-11 w-11 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 hover:text-jmv-blue focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-(color:--focus-ring)";
    return (
      <>
        <button type="button" onClick={() => void copyLink(article)} className={iconButton} aria-label={`Copiar enlace a ${name}`} title="Copiar enlace">
          <Link2 className="h-5 w-5" aria-hidden />
        </button>
        <a
          href={whatsappShareLink(
            `${article.number ? `Artículo ${article.number}` : ""}${article.title ? ` · ${article.title}` : ""} — ${shareTitle}`.trim(),
            articleUrl(article)
          )}
          target="_blank"
          rel="noopener noreferrer"
          className={iconButton}
          aria-label={`Compartir ${name} por WhatsApp (se abre en una pestaña nueva)`}
          title="Compartir por WhatsApp"
        >
          <MessageCircle className="h-5 w-5" aria-hidden />
        </a>
      </>
    );
  };

  const status = !term
    ? query.trim().length > 0
      ? `Escribe al menos ${MIN_QUERY} letras para buscar.`
      : ""
    : totalHits
      ? `${totalHits} coincidencia${totalHits === 1 ? "" : "s"} en ${visible!.size} artículo${visible!.size === 1 ? "" : "s"}${hit >= 0 ? ` · viendo ${hit + 1} de ${totalHits}` : ""}`
      : `No encontramos «${term}». Prueba con otra palabra o sin tildes.`;

  const toc = (onNavigate?: () => void) => (
    <ol className="space-y-1">
      {doc.chapters.map((chapter) => {
        const chapterArticles = visible ? chapter.articles.filter((a) => visible.has(a.id)) : chapter.articles;
        if (!chapterArticles.length) return null;
        const isActive = activeChapter === chapter.id;
        const chapterHits = counts ? chapterArticles.reduce((s, a) => s + (counts.get(a.id) ?? 0), 0) : 0;
        const first = chapterArticles[0]?.number;
        const last = chapterArticles[chapterArticles.length - 1]?.number;
        return (
          <li key={chapter.id}>
            <a
              href={`#${chapter.id}`}
              onClick={onNavigate}
              aria-current={isActive ? "true" : undefined}
              className={cn(
                "flex min-h-11 items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors",
                isActive ? "bg-jmv-blue text-white" : "text-slate-700 hover:bg-slate-100"
              )}
            >
              <span className={cn("w-7 shrink-0 font-display text-base font-semibold", isActive ? "text-jmv-gold-text" : "text-jmv-gold-ink")}>
                {chapter.numeral || "·"}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold leading-snug">{chapter.title || "Disposiciones"}</span>
                {first ? (
                  <span className={cn("block text-xs", isActive ? "text-white/80" : "text-slate-500")}>
                    {first === last ? `Artículo ${first}` : `Artículos ${first} al ${last}`}
                  </span>
                ) : null}
              </span>
              {chapterHits ? (
                <span className="rounded-full bg-jmv-gold px-2 py-0.5 text-xs font-bold text-jmv-ink">{chapterHits}</span>
              ) : null}
            </a>
            {isActive || visible ? (
              <ol className="my-1 ml-6 space-y-0.5 border-l border-slate-200 pl-2">
                {chapterArticles.map((a) => (
                  <li key={a.id}>
                    <a
                      href={`#${a.id}`}
                      onClick={onNavigate}
                      aria-current={active === a.id ? "location" : undefined}
                      className={cn(
                        "flex min-h-11 items-center gap-2 rounded-lg px-2 py-1.5 text-[13px] leading-snug transition-colors lg:min-h-9",
                        active === a.id ? "bg-jmv-gold/15 font-semibold text-slate-900" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      )}
                    >
                      <span className="w-6 shrink-0 tabular-nums text-slate-500">{a.number}</span>
                      <span className="min-w-0 flex-1">{a.title}</span>
                      {counts?.get(a.id) ? <span className="text-xs font-bold text-jmv-gold-ink">{counts.get(a.id)}</span> : null}
                    </a>
                  </li>
                ))}
              </ol>
            ) : null}
          </li>
        );
      })}
    </ol>
  );

  return (
    <div className="lg:grid lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[19rem_minmax(0,1fr)]">
      <aside className="hidden lg:block">
        <nav aria-label="Índice de los estatutos" className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto overscroll-contain pb-6 pr-1">
          <p className="mb-3 flex items-center gap-2 px-3 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
            <ListTree className="h-4 w-4" aria-hidden />
            Índice
          </p>
          {toc()}
        </nav>
      </aside>

      <div className="min-w-0">
        <div
          role="search"
          aria-label="Buscar en los estatutos"
          className={cn(
            "sticky top-16 z-20 -mx-4 border-b border-slate-200 px-4 py-3 sm:top-20 sm:-mx-6 sm:px-6 lg:mx-0 lg:rounded-b-2xl lg:px-4",
            tocOpen ? "bg-white shadow-lg" : "bg-white/95 backdrop-blur"
          )}
        >
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setTocOpen((v) => !v)}
              aria-expanded={tocOpen}
              aria-controls="estatutos-indice-movil"
              className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-xl border border-slate-300 px-3 text-sm font-semibold text-slate-800 hover:bg-slate-50 lg:hidden"
            >
              <ListTree className="h-4 w-4" aria-hidden />
              Índice
              {activeNumeral ? (
                <span className="rounded-md bg-jmv-blue/10 px-1.5 font-display text-xs text-jmv-blue">
                  <span className="sr-only">, capítulo actual </span>
                  {activeNumeral}
                </span>
              ) : null}
              <ChevronDown className={cn("h-4 w-4 transition-transform motion-reduce:transition-none", tocOpen && "rotate-180")} aria-hidden />
            </button>
            <div className="relative min-w-0 flex-1">
              <label htmlFor="estatutos-buscar" className="sr-only">
                Buscar una palabra en los estatutos
              </label>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
              <input
                id="estatutos-buscar"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    goToHit(e.shiftKey ? -1 : 1);
                  } else if (e.key === "Escape" && query) {
                    e.preventDefault();
                    setQuery("");
                  }
                }}
                placeholder="Busca una palabra…"
                aria-describedby="estatutos-buscar-estado estatutos-buscar-ayuda"
                enterKeyHint="search"
                autoComplete="off"
                className="block min-h-11 w-full rounded-xl border border-slate-300 bg-white pl-9 pr-3 text-base text-slate-900 placeholder-slate-500 focus:border-jmv-blue focus:outline-none focus:ring-2 focus:ring-jmv-blue/25"
              />
              <span id="estatutos-buscar-ayuda" className="sr-only">
                Pulsa Enter para ir a la siguiente coincidencia.
              </span>
            </div>
          </div>
          <div className={cn("flex items-center justify-between gap-2", status && "mt-1")}>
            <p id="estatutos-buscar-estado" aria-live="polite" className="text-sm text-slate-600">
              {status}
            </p>
            {term && totalHits ? (
              <div className="-my-1 flex shrink-0 items-center">
                <button
                  type="button"
                  onClick={() => goToHit(-1)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-slate-700 hover:bg-slate-100"
                  aria-label="Coincidencia anterior"
                >
                  <ChevronUp className="h-5 w-5" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => goToHit(1)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-slate-700 hover:bg-slate-100"
                  aria-label="Coincidencia siguiente"
                >
                  <ChevronDown className="h-5 w-5" aria-hidden />
                </button>
              </div>
            ) : null}
          </div>
          {tocOpen ? (
            <nav id="estatutos-indice-movil" aria-label="Índice de los estatutos" className="mt-3 max-h-[60vh] overflow-y-auto overscroll-contain border-t border-slate-200 pt-3 lg:hidden">
              {toc(() => setTocOpen(false))}
            </nav>
          ) : null}
        </div>

        <div ref={bodyRef} className="mx-auto max-w-[70ch] pt-8">
          {doc.preamble.length > 0 && !term ? (
            <details className="group mb-12 rounded-2xl border border-slate-200 bg-slate-50 open:bg-white">
              <summary className="flex min-h-14 cursor-pointer list-none items-center gap-3 rounded-2xl px-5 py-3 marker:hidden hover:bg-slate-100 [&::-webkit-details-marker]:hidden">
                <ScrollText className="h-5 w-5 shrink-0 text-jmv-gold-ink" aria-hidden />
                <span className="flex-1">
                  <span className="block font-semibold text-slate-900">Carta de aprobación</span>
                  <span className="block text-sm text-slate-600">Con la que el Director General aprobó estos estatutos</span>
                </span>
                <ChevronDown className="h-5 w-5 text-slate-500 transition-transform group-open:rotate-180 motion-reduce:transition-none" aria-hidden />
              </summary>
              <div className="space-y-4 border-t border-slate-200 px-5 py-5 font-display text-[17px] leading-8 text-slate-800 sm:px-7 sm:text-lg">
                {doc.preamble.map((p, i) => (
                  <p key={i}>
                    <StatuteText text={p} />
                  </p>
                ))}
              </div>
            </details>
          ) : null}

          {term && !totalHits ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
              <p className="text-lg font-semibold text-slate-900">Ningún artículo menciona «{term}»</p>
              <p className="mt-2 text-slate-600">Prueba con una palabra más corta o revisa el glosario de abajo.</p>
              <button
                type="button"
                onClick={() => setQuery("")}
                className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-jmv-blue px-5 font-semibold text-white hover:bg-[#173f70]"
              >
                <X className="h-4 w-4" aria-hidden />
                Borrar búsqueda
              </button>
            </div>
          ) : (
            <StatutesBody doc={doc} query={term} visible={visible} articleActions={articleActions} />
          )}

          {doc.closing && !term ? (
            <p className="mt-14 border-t border-slate-200 pt-8 text-center font-display text-lg italic text-slate-700">
              <StatuteText text={doc.closing} />
            </p>
          ) : null}
        </div>
      </div>

      <div
        role="status"
        aria-live="polite"
        className={cn(
          "pointer-events-none fixed inset-x-0 bottom-24 z-40 flex justify-center px-4 transition-opacity motion-reduce:transition-none",
          notice ? "opacity-100" : "opacity-0"
        )}
      >
        {notice ? (
          <span className="rounded-full bg-jmv-ink px-5 py-3 text-sm font-semibold text-white shadow-xl">{notice}</span>
        ) : null}
      </div>
    </div>
  );
}
