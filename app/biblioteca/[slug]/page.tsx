import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, FileText, Hash, HardDrive, Layers, Lock, Route, Users } from "lucide-react";
import { fetchLibraryCollections, fetchLibraryDocument, fetchLibraryDocuments } from "@/lib/api/library.server";
import {
  AXIS_LABELS,
  KIND_LABELS,
  STAGE_LABELS,
  TYPE_SINGULAR,
  collectionHref,
  fileSizeLabel,
  isNew,
  libraryHref,
  readingTimeLabel,
} from "@/lib/biblioteca";
import { SITE } from "@/lib/site";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { StarsRing } from "@/components/brand";
import StarField from "@/components/calendario/StarField";
import BookCover from "@/components/biblioteca/BookCover";
import DocumentActions, { DocumentVideo } from "@/components/biblioteca/DocumentActions";
import Shelf from "@/components/biblioteca/Shelf";
import { ACC_INK, axisShortLabel, docStyle, toCardDoc } from "@/components/biblioteca/shared";
import { filtersHref } from "@/components/biblioteca/filters";

// ISR: ver app/biblioteca/page.tsx
export const revalidate = 1800;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const items = await fetchLibraryDocuments().catch(() => []);
  return items.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const doc = await fetchLibraryDocument(slug).catch(() => null);
  if (!doc) return { title: "Lectura no encontrada" };
  const title = doc.author ? `${doc.title}, de ${doc.author}` : doc.title;
  const images = doc.coverUrl ? [{ url: doc.coverUrl, alt: "" }] : undefined;
  return {
    title,
    description: doc.summary,
    alternates: { canonical: libraryHref(doc.slug) },
    openGraph: { title, description: doc.summary, url: libraryHref(doc.slug), type: "book", images },
    twitter: { card: doc.coverUrl ? "summary_large_image" : "summary", title, description: doc.summary },
  };
}

export default async function LibraryDocumentPage({ params }: Props) {
  const { slug } = await params;
  const [doc, all, collections] = await Promise.all([
    fetchLibraryDocument(slug),
    fetchLibraryDocuments().catch(() => []),
    fetchLibraryCollections().catch(() => []),
  ]);
  if (!doc) notFound();

  const now = new Date();
  const time = readingTimeLabel(doc.readingMinutes);
  const size = doc.kind === "pdf" ? fileSizeLabel(doc.fileSize) : null;
  const paragraphs = (doc.description ?? "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  const routes = collections
    .map((c) => ({ c, index: c.documents.findIndex((d) => d.id === doc.id) }))
    .filter((r) => r.index >= 0);

  // Mismo eje primero, luego mismo tipo
  const others = all.filter((d) => d.id !== doc.id);
  const related = [
    ...others.filter((d) => doc.axis && d.axis === doc.axis),
    ...others.filter((d) => d.type === doc.type && !(doc.axis && d.axis === doc.axis)),
  ]
    .slice(0, 12)
    .map(toCardDoc);
  const newIds = related.filter((d) => isNew(d, now)).map((d) => d.id);

  // Al cliente solo viaja lo que usan las acciones; el enlace de miembros se
  // pide con token desde el navegador, nunca va en el HTML
  const locked = doc.visibility === "miembros";
  const actionDoc = {
    id: doc.id,
    slug: doc.slug,
    title: doc.title,
    kind: doc.kind,
    visibility: doc.visibility,
    externalUrl: locked ? null : (doc.externalUrl ?? null),
    fileUrl: locked ? null : (doc.fileUrl ?? null),
    pageCount: doc.pageCount ?? null,
  };
  const url = new URL(libraryHref(doc.slug), SITE.url).toString();
  const shareText = `Te comparto esta lectura de la Biblioteca JMV: «${doc.title}». ${doc.summary}`;

  const facts = [
    { icon: FileText, label: "Tipo", value: TYPE_SINGULAR[doc.type] },
    doc.axis && { icon: Layers, label: "Eje", value: axisShortLabel(doc.axis) },
    { icon: Users, label: "Para", value: STAGE_LABELS[doc.stage] },
    time && { icon: Clock, label: doc.kind === "video" ? "Duración" : "Lectura", value: time },
    doc.pageCount && { icon: Hash, label: "Páginas", value: String(doc.pageCount) },
    { icon: HardDrive, label: "Formato", value: size ? `${KIND_LABELS[doc.kind]} · ${size}` : KIND_LABELS[doc.kind] },
  ].filter(Boolean) as { icon: typeof FileText; label: string; value: string }[];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": doc.type === "libro" ? "Book" : doc.kind === "video" ? "VideoObject" : "CreativeWork",
    name: doc.title,
    description: doc.summary,
    url,
    inLanguage: "es",
    ...(doc.author ? { author: { "@type": "Person", name: doc.author } } : {}),
    ...(doc.coverUrl ? { image: doc.coverUrl } : {}),
    ...(doc.pageCount ? { numberOfPages: doc.pageCount } : {}),
    isAccessibleForFree: !locked,
    publisher: { "@type": "Organization", name: SITE.fullName },
  };

  return (
    <div className={`${ACC_INK} bg-page pb-24`} style={docStyle(doc)}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <section
        aria-labelledby="lectura-title"
        className="relative isolate overflow-hidden bg-page-deep pb-14 pt-28 sm:pt-32 lg:pb-20"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-20 bg-[radial-gradient(55%_65%_at_20%_40%,color-mix(in_oklab,var(--acc-l)_16%,transparent),transparent_75%),radial-gradient(90%_70%_at_60%_0%,#bcd4f1_0%,#e2ebf7_48%,#f3eee4_100%)] dark:bg-[radial-gradient(55%_65%_at_20%_40%,color-mix(in_oklab,var(--from)_80%,transparent),transparent_75%),radial-gradient(90%_70%_at_60%_0%,#1d4e8a_0%,#0f2547_45%,#070d1d_100%)]"
        />
        <StarField seed={doc.title.length * 7 + 3} count={60} className="-z-10" />
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-b from-transparent to-page" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[{ label: "Biblioteca", href: "/biblioteca" }, { label: doc.title }]}
            jsonLd
            className="mb-8"
          />
          <div className="grid items-start gap-7 md:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] md:gap-10 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-16">
            <div className="relative mx-auto w-36 sm:w-56 md:w-full">
              <StarsRing
                withCircle
                className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[150%] w-[150%] -translate-x-1/2 -translate-y-1/2 text-(--acc-ink) opacity-20"
              />
              <div className="[perspective:1200px]">
                <div className="[transform:rotateY(-10deg)] [transform-origin:left_center]">
                  <BookCover doc={doc} priority sizes="(min-width: 1024px) 320px, (min-width: 768px) 256px, (min-width: 640px) 224px, 144px" />
                </div>
              </div>
            </div>

            <div className="flex min-w-0 flex-col">
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={filtersHref({ tipo: doc.type })}
                  className="inline-flex min-h-9 items-center rounded-full border border-(--acc-ink)/50 bg-fg/[0.06] px-3 text-sm font-semibold text-(--acc-ink) hover:bg-fg/10"
                >
                  {TYPE_SINGULAR[doc.type]}
                </Link>
                {doc.axis && (
                  <Link
                    href={filtersHref({ eje: doc.axis })}
                    className="inline-flex min-h-9 items-center rounded-full border border-fg/20 bg-fg/[0.06] px-3 text-sm font-medium text-fg hover:bg-fg/10"
                  >
                    {AXIS_LABELS[doc.axis]}
                  </Link>
                )}
                {isNew(doc, now) && (
                  <span className="rounded-full bg-jmv-gold px-3 py-1 text-xs font-bold uppercase tracking-wide text-jmv-ink">
                    Nuevo
                  </span>
                )}
                {doc.visibility === "miembros" && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-accent-gold/40 bg-jmv-gold/10 px-3 py-1 text-sm font-semibold text-accent-gold">
                    <Lock className="h-3.5 w-3.5" aria-hidden />
                    Solo miembros
                  </span>
                )}
              </div>
              <h1
                id="lectura-title"
                className="mt-4 font-display text-4xl font-semibold leading-[1.06] text-fg text-balance sm:text-5xl lg:text-6xl"
              >
                {doc.title}
              </h1>
              {doc.author && <p className="mt-3 text-xl text-fg-muted">{doc.author}</p>}
              <p className="mt-4 max-w-2xl font-display text-lg leading-snug text-fg-muted dark:text-slate-100 sm:mt-5 sm:text-2xl">{doc.summary}</p>

              {/* En el celular la acción va antes que la ficha técnica */}
              <dl className="order-last mt-7 grid max-w-2xl grid-cols-2 md:order-none gap-x-4 gap-y-3 sm:grid-cols-3">
                {facts.map((f) => (
                  <div key={f.label} className="flex items-center gap-3 rounded-2xl border border-line bg-surface shadow-card dark:bg-white/[0.04] px-3 py-2.5">
                    <f.icon className="h-5 w-5 shrink-0 text-(--acc-ink)" aria-hidden />
                    <div className="min-w-0">
                      <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-fg-subtle">{f.label}</dt>
                      <dd className="text-sm font-semibold leading-snug text-fg">{f.value}</dd>
                    </div>
                  </div>
                ))}
              </dl>

              <div className="mt-6 max-w-2xl md:mt-8">
                <DocumentActions doc={actionDoc} shareUrl={url} shareText={shareText} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-12 px-4 pt-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-8">
        <div className="min-w-0 space-y-10">
          {doc.kind === "video" && <DocumentVideo doc={actionDoc} />}

          {paragraphs.length > 0 && (
            <article aria-labelledby="sobre-title" className="max-w-3xl">
              <h2 id="sobre-title" className="font-display text-2xl font-semibold text-fg sm:text-3xl">
                {doc.kind === "video" ? "Sobre este video" : "De qué trata"}
              </h2>
              <div className="mt-4 space-y-5 text-lg leading-relaxed text-fg-muted">
                {paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </article>
          )}

          {doc.tags.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-fg-subtle">Temas</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {doc.tags.map((tag) => (
                  <li key={tag}>
                    <Link
                      href={filtersHref({ q: tag })}
                      className="inline-flex min-h-11 items-center rounded-full border border-fg/15 bg-surface px-4 text-sm text-fg-muted shadow-card hover:border-(--acc-ink)/60 hover:bg-surface-2 dark:bg-white/[0.05] dark:text-slate-100 dark:hover:bg-white/10"
                    >
                      #{tag}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {routes.length > 0 && (
          <aside aria-labelledby="rutas-lectura-title" className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-3xl border border-line bg-surface shadow-card dark:bg-white/[0.04] p-5">
              <h2 id="rutas-lectura-title" className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-accent-gold">
                <Route className="h-4 w-4" aria-hidden />
                Forma parte de estas rutas
              </h2>
              <ul className="mt-4 space-y-2">
                {routes.map(({ c, index }) => (
                  <li key={c.id}>
                    <Link
                      href={collectionHref(c.slug)}
                      className="group flex min-h-11 items-center gap-3 rounded-2xl p-2 hover:bg-fg/[0.06]"
                    >
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-accent-gold/50 font-display text-lg font-semibold text-accent-gold">
                        {index + 1}
                      </span>
                      <span className="min-w-0">
                        <span className="block font-semibold text-fg group-hover:text-accent-gold">{c.title}</span>
                        <span className="block text-sm text-fg-muted">
                          Lectura {index + 1} de {c.documents.length}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        )}
      </div>

      {related.length > 0 && (
        <div className="mt-20">
          <Shelf id="relacionadas" eyebrow="Sigue por aquí" title="También te puede servir" docs={related} newIds={newIds} />
        </div>
      )}
    </div>
  );
}
