import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Clock, Route } from "lucide-react";
import { fetchLibraryCollection, fetchLibraryCollections } from "@/lib/api/library.server";
import { collectionHref, readingTimeLabel } from "@/lib/biblioteca";
import { SITE } from "@/lib/site";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { StarsRing } from "@/components/brand";
import StarField from "@/components/calendario/StarField";
import BookCover from "@/components/biblioteca/BookCover";
import RoutePath, { RouteProgressSummary } from "@/components/biblioteca/RoutePath";
import { readingsLabel, toCardDoc } from "@/components/biblioteca/shared";

// ISR: ver app/biblioteca/page.tsx
export const revalidate = 1800;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const items = await fetchLibraryCollections().catch(() => []);
  return items.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const route = await fetchLibraryCollection(slug).catch(() => null);
  if (!route) return { title: "Ruta no encontrada" };
  const title = `${route.title} · Ruta de formación`;
  const description =
    route.description || `${readingsLabel(route.documents.length)} de la Biblioteca JMV para recorrer en orden.`;
  return {
    title,
    description,
    alternates: { canonical: collectionHref(route.slug) },
    openGraph: { title, description, url: collectionHref(route.slug), type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function LibraryRoutePage({ params }: Props) {
  const { slug } = await params;
  const route = await fetchLibraryCollection(slug);
  if (!route) notFound();

  const docs = route.documents.map(toCardDoc);
  const minutes = docs.reduce((sum, d) => sum + (d.readingMinutes ?? 0), 0);
  const time = readingTimeLabel(minutes);
  const fan = docs.slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: route.title,
    url: new URL(collectionHref(route.slug), SITE.url).toString(),
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: docs.length,
    itemListElement: docs.map((d, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: d.title,
      url: new URL(`/biblioteca/${d.slug}`, SITE.url).toString(),
    })),
  };

  return (
    <div className="bg-page pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <section aria-labelledby="ruta-title" className="relative isolate overflow-hidden bg-page-deep pb-16 pt-28 sm:pt-32">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-20 bg-[radial-gradient(55%_60%_at_85%_40%,rgba(217,143,6,0.18),transparent_70%),radial-gradient(90%_70%_at_30%_0%,#bcd4f1_0%,#e2ebf7_48%,#f3eee4_100%)] dark:bg-[radial-gradient(55%_60%_at_85%_40%,rgba(217,143,6,0.2),transparent_70%),radial-gradient(90%_70%_at_30%_0%,#1d4e8a_0%,#0f2547_45%,#070d1d_100%)]"
        />
        <StarField seed={route.title.length * 13 + 5} count={60} className="-z-10" />
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-b from-transparent to-page" />

        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:px-8">
          <div>
            <Breadcrumbs
              items={[{ label: "Biblioteca", href: "/biblioteca" }, { label: route.title }]}
              jsonLd
              className="mb-8"
            />
            <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-accent-gold">
              <Route className="h-4 w-4" aria-hidden />
              Ruta de formación
            </p>
            <h1
              id="ruta-title"
              className="mt-4 font-display text-4xl font-semibold leading-[1.06] text-fg text-balance sm:text-5xl lg:text-6xl"
            >
              {route.title}
            </h1>
            {route.description && (
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-fg-muted sm:text-xl">{route.description}</p>
            )}
            <p className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-fg-muted">
              <span className="font-semibold text-fg">{readingsLabel(docs.length)}</span>
              {time && (
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-accent-gold" aria-hidden />
                  {time} en total
                </span>
              )}
            </p>
            <div className="mt-7 w-fit">
              <RouteProgressSummary docs={docs} />
            </div>
          </div>

          <div aria-hidden="true" className="relative mx-auto hidden h-72 w-full max-w-sm sm:block">
            <StarsRing withCircle className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 text-accent-gold opacity-[0.14]" />
            {fan.map((doc, i) => {
              const offset = i - (fan.length - 1) / 2;
              return (
                <div
                  key={doc.id}
                  className="absolute left-1/2 top-1/2 w-36"
                  style={{
                    zIndex: 5 - Math.abs(Math.round(offset)),
                    transform: `translate(-50%, -50%) translateX(${offset * 80}px) translateY(${Math.abs(offset) * 16}px) rotate(${offset * 8}deg)`,
                  }}
                >
                  <BookCover doc={doc} priority={i === 0} sizes="144px" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <h2 className="sr-only">Lecturas de la ruta, en orden</h2>
        {docs.length > 0 ? (
          <RoutePath docs={docs} />
        ) : (
          <p className="py-12 text-center text-lg text-fg-muted">Muy pronto añadiremos las lecturas de esta ruta.</p>
        )}
      </div>
    </div>
  );
}
