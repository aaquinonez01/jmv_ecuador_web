import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchLibraryCollections, fetchLibraryDocument } from "@/lib/api/library.server";
import { libraryHref } from "@/lib/biblioteca";
import ReaderLoader from "@/components/biblioteca/reader/ReaderLoader";
import { ReaderSkeleton } from "@/components/biblioteca/reader/ReaderStates";
import type { NextReading } from "@/components/biblioteca/reader/ReaderEnd";

export const revalidate = 1800;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const doc = await fetchLibraryDocument(slug).catch(() => null);
  return {
    title: doc ? `Leyendo: ${doc.title}` : "Lector",
    description: doc?.summary,
    alternates: { canonical: libraryHref(slug) },
    // La ficha es la página indexable; el lector no
    robots: { index: false, follow: true },
  };
}

/** Siguiente lectura de la primera ruta de formación que incluya este documento */
async function findNextReading(docId: string): Promise<NextReading | null> {
  const collections = await fetchLibraryCollections().catch(() => []);
  for (const c of collections) {
    const i = c.documents.findIndex((d) => d.id === docId);
    const next = i >= 0 ? c.documents[i + 1] : undefined;
    if (next) return { slug: next.slug, title: next.title, collectionTitle: c.title };
  }
  return null;
}

export default async function LeerPage({ params }: Props) {
  const { slug } = await params;
  const doc = await fetchLibraryDocument(slug);
  if (!doc || doc.kind !== "pdf") notFound();
  const next = await findNextReading(doc.id);

  return (
    <>
      <ReaderSkeleton id="lector-esqueleto" title={doc.title} backHref={libraryHref(doc.slug)} />
      <ReaderLoader doc={doc} next={next} />
    </>
  );
}
