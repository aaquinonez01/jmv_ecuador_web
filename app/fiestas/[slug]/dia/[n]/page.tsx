import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DayExperience from "@/components/fiestas/DayExperience";
import { fetchFiesta } from "@/lib/fiestas/server";

type Props = { params: Promise<{ slug: string; n: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, n } = await params;
  const fiesta = await fetchFiesta(slug).catch(() => null);
  const day = fiesta?.days.find((d) => d.dayNumber === Number(n));
  if (!fiesta || !day) return { title: "Día no encontrado" };
  const title = `${day.label}${day.title ? `: ${day.title}` : ""} · ${fiesta.title}`;
  return {
    title,
    description: `${fiesta.title}: el tema del día, su oración, preguntas y propósito.`,
    alternates: { canonical: `/fiestas/${slug}/dia/${n}` },
    robots: { index: false },
  };
}

export default async function FiestaDayPage({ params }: Props) {
  const { slug, n } = await params;
  const dayNumber = Number(n);
  if (!Number.isInteger(dayNumber) || dayNumber < 1 || dayNumber > 60) notFound();
  return <DayExperience slug={slug} dayNumber={dayNumber} />;
}
