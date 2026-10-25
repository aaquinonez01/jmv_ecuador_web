import type { ReactNode } from "react";
import type { ParsedStatutes, StatuteArticle, StatuteBlock, StatuteListItem } from "@/lib/estatutos";
import { cn } from "@/lib/utils";
import StatuteText, { highlight } from "./StatuteText";

// Texto completo de los estatutos (capítulos > artículos > numerales).
// Sin estado: lo usan la página pública y la vista previa del admin.

interface StatutesBodyProps {
  doc: ParsedStatutes;
  /** Resalta esta búsqueda */
  query?: string;
  /** Si se pasa, solo se muestran estos artículos (resultado de la búsqueda) */
  visible?: Set<string> | null;
  /** Botones de cada artículo (copiar enlace, compartir) */
  articleActions?: (article: StatuteArticle) => ReactNode;
  className?: string;
}

export default function StatutesBody({ doc, query, visible, articleActions, className }: StatutesBodyProps) {
  return (
    <div className={cn("space-y-14", className)}>
      {doc.chapters.map((chapter) => {
        const articles = visible ? chapter.articles.filter((a) => visible.has(a.id)) : chapter.articles;
        if (!articles.length) return null;
        return (
          <section key={chapter.id} id={chapter.id} aria-labelledby={`${chapter.id}-titulo`} data-chapter={chapter.id} className="scroll-mt-36">
            <header className="mb-2 border-b-2 border-jmv-gold/60 pb-4">
              <h3 id={`${chapter.id}-titulo`} className="text-balance">
                {chapter.numeral ? (
                  <span className="block text-sm font-semibold uppercase tracking-[0.16em] text-jmv-gold-ink">
                    Capítulo {chapter.numeral}
                  </span>
                ) : null}
                <span className="mt-1 block font-display text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl">
                  {/* Sin resaltar: la búsqueda cuenta y filtra artículos, no capítulos */}
                  {chapter.title || "Disposiciones"}
                </span>
              </h3>
            </header>
            <div className="divide-y divide-slate-200">
              {articles.map((article) => (
                <ArticleView key={article.id} article={article} query={query} actions={articleActions?.(article)} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function ArticleView({ article, query, actions }: { article: StatuteArticle; query?: string; actions?: ReactNode }) {
  const label = article.number ? `Artículo ${article.number}` : null;
  return (
    <article id={article.id} data-article={article.id} aria-labelledby={`${article.id}-titulo`} className="scroll-mt-36 py-8 first:pt-6">
      <div className="mb-4 flex items-start justify-between gap-3">
        <h4 id={`${article.id}-titulo`} className="min-w-0">
          {label ? (
            <span className="block text-[13px] font-bold uppercase tracking-[0.14em] text-jmv-blue">
              {highlight(label, query)}
            </span>
          ) : null}
          {article.title ? (
            <span className="mt-1 block font-display text-2xl font-semibold leading-snug text-slate-900 text-balance">
              {highlight(article.title, query)}
            </span>
          ) : null}
        </h4>
        {actions ? <div className="flex shrink-0 items-center gap-1">{actions}</div> : null}
      </div>
      <div className="space-y-4 text-[17px] leading-[1.75] text-slate-800 sm:text-lg">
        {article.blocks.map((block, i) => (
          <Block key={i} block={block} query={query} after={article.blocks[i - 1]} />
        ))}
      </div>
    </article>
  );
}

function Block({ block, query, after }: { block: StatuteBlock; query?: string; after?: StatuteBlock }) {
  if (block.type === "numeral") {
    const depth = block.label.split(".").length - 1;
    return (
      <p className={cn("grid grid-cols-[auto_1fr] items-baseline gap-x-3 sm:gap-x-4", depth > 1 && "pl-4 sm:pl-10")}>
        {/* Ancho fijo por nivel: los textos de un mismo nivel quedan alineados */}
        <span
          className={cn(
            "inline-flex justify-center rounded-md bg-jmv-blue/[0.08] px-1 py-0.5 text-[15px] font-bold leading-6 tabular-nums text-jmv-blue sm:text-base",
            depth > 2 ? "w-[4.75rem]" : depth > 1 ? "w-[3.75rem]" : "w-12"
          )}
        >
          {highlight(block.label, query)}
        </span>
        <span>
          <StatuteText text={block.text} query={query} />
        </span>
      </p>
    );
  }
  if (block.type === "list") {
    // Una lista que sigue a un numeral se alinea con el texto del numeral
    const indent =
      after?.type !== "numeral"
        ? undefined
        : after.label.split(".").length > 2
          ? "pl-[5.5rem] sm:pl-[7.25rem]"
          : "pl-[3.75rem] sm:pl-16";
    return <List items={block.items} query={query} className={indent} />;
  }
  return (
    <p>
      <StatuteText text={block.text} query={query} />
    </p>
  );
}

function List({ items, query, className }: { items: StatuteListItem[]; query?: string; className?: string }) {
  return (
    <ul className={cn("space-y-2", className)}>
      {items.map((item, i) => (
        <li key={i} className="relative pl-6">
          <span aria-hidden className="absolute left-1 top-[0.8em] h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-jmv-gold" />
          <StatuteText text={item.text} query={query} />
          {item.children?.length ? <List items={item.children} query={query} className="mt-2" /> : null}
        </li>
      ))}
    </ul>
  );
}
