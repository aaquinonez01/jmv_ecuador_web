import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { fetchLibraryCollections, fetchLibraryDocuments } from "@/lib/api/library.server";
import { TYPE_LABELS, isNew } from "@/lib/biblioteca";
import { StarDivider } from "@/components/brand";
import CollectionsSection from "@/components/biblioteca/CollectionsSection";
import ContinueReading from "@/components/biblioteca/ContinueReading";
import EmptyLibrary from "@/components/biblioteca/EmptyLibrary";
import FeaturedBlock from "@/components/biblioteca/FeaturedBlock";
import LibraryExplorer, { BrowseOnly } from "@/components/biblioteca/LibraryExplorer";
import LibraryHero from "@/components/biblioteca/LibraryHero";
import Shelf from "@/components/biblioteca/Shelf";
import { TYPE_ORDER, toCardDoc } from "@/components/biblioteca/shared";
import { filtersHref } from "@/components/biblioteca/filters";

export const metadata: Metadata = {
  title: "Biblioteca JMV",
  description:
    "Libros, documentos y guías de formación de las Juventudes Marianas Vicencianas: lecturas para crecer en la fe, formarte y servir. Léelas desde tu celular.",
  keywords: "Biblioteca JMV, formación JMV, guías para reuniones, documentos JMV, lecturas vicencianas, JMV Ecuador",
  alternates: { canonical: "/biblioteca" },
};

// ISR: el admin cambia poco la biblioteca; el backend además invalida el tag al editar.
export const revalidate = 1800;

export default async function BibliotecaPage() {
  const [all, collections] = await Promise.all([fetchLibraryDocuments(), fetchLibraryCollections().catch(() => [])]);
  const docs = all.filter((d) => d.published !== false).map(toCardDoc);
  const now = new Date();
  const newIds = docs.filter((d) => isNew(d, now)).map((d) => d.id);

  if (docs.length === 0) {
    return (
      <div className="bg-jmv-ink pb-16">
        <LibraryHero covers={[]} total={0} routes={0} types={[]} />
        <EmptyLibrary />
      </div>
    );
  }

  const featured = docs.filter((d) => d.featured);
  const types = TYPE_ORDER.filter((t) => docs.some((d) => d.type === t));
  const fresh = docs.filter((d) => newIds.includes(d.id));
  const routes = collections
    .filter((c) => c.documents.length > 0)
    .map((c) => ({
      id: c.id,
      slug: c.slug,
      title: c.title,
      description: c.description,
      coverUrl: c.coverUrl,
      documents: c.documents.map(toCardDoc),
    }));
  // Abanico de la cabecera: primero las que tienen portada propia
  const heroCovers = [...featured, ...docs.filter((d) => !d.featured)]
    .sort((a, b) => Number(!!b.coverUrl) - Number(!!a.coverUrl))
    .slice(0, 5);

  return (
    <div className="bg-jmv-ink pb-24">
      <LibraryHero covers={heroCovers} total={docs.length} routes={routes.length} types={types} />

      <div className="relative -mt-6 space-y-16 sm:space-y-20">
        <BrowseOnly>
          <div className="space-y-16 sm:space-y-20">
            <ContinueReading docs={docs} />
            {featured.length > 0 && <FeaturedBlock docs={featured} />}
            <CollectionsSection collections={routes} />
            {/* Si todo es nuevo (lanzamiento), el estante "Nuevos" repetiría la biblioteca entera */}
            {fresh.length > 0 && fresh.length < docs.length && (
              <Shelf
                id="estante-nuevos"
                eyebrow="Recién llegados"
                title="Nuevos"
                icon={<Sparkles className="h-6 w-6 text-jmv-gold-text" aria-hidden />}
                docs={fresh}
                newIds={newIds}
              />
            )}
            {types.map((t) => {
              const list = docs.filter((d) => d.type === t);
              return (
                <Shelf
                  key={t}
                  id={`estante-${t}`}
                  title={TYPE_LABELS[t]}
                  docs={list}
                  newIds={newIds}
                  seeAllHref={list.length > 4 ? filtersHref({ tipo: t }) : undefined}
                />
              );
            })}
            <StarDivider />
          </div>
        </BrowseOnly>

        <LibraryExplorer docs={docs} newIds={newIds} />
      </div>
    </div>
  );
}
