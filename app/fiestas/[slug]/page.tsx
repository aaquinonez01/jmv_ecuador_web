import type { Metadata } from "next";
import { notFound } from "next/navigation";
import FiestaHome from "@/components/fiestas/FiestaHome";
import { fetchFiesta } from "@/lib/fiestas/server";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const fiesta = await fetchFiesta(slug).catch(() => null);
  if (!fiesta) return { title: "Fiesta no encontrada" };
  const description =
    fiesta.subtitle ??
    ((fiesta.symbol?.kind ?? "medal") === "medal"
      ? "Vive la fiesta con JMV Ecuador: un tema cada día, preguntas, puntos y tu Medalla por armar."
      : "Vívelo con JMV Ecuador: temas para orar, preguntas, puntos y un símbolo que se completa paso a paso.");
  return {
    title: fiesta.title,
    description,
    alternates: { canonical: `/fiestas/${fiesta.slug}` },
    openGraph: { title: fiesta.title, description, url: `/fiestas/${fiesta.slug}`, type: "website" },
    twitter: { card: "summary_large_image", title: fiesta.title, description },
  };
}

export default async function FiestaPage({ params }: Props) {
  const { slug } = await params;
  const fiesta = await fetchFiesta(slug).catch(() => null);
  if (!fiesta) notFound();
  return <FiestaHome initial={fiesta} />;
}
