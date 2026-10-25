import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { fetchStatuteVersion, fetchStatuteVersions } from "@/lib/api/statutes.server";
import StatutesView from "@/components/estatutos/StatutesView";
import { STATUTES_PATH, statuteVersionHref } from "@/components/estatutos/content";

// ISR: ver app/quienes-somos/estatutos/page.tsx
export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const version = await fetchStatuteVersion(slug).catch(() => null);
  if (!version) return { title: "Estatutos" };
  return {
    title: `Estatutos ${version.versionLabel}`,
    description: `Versión ${version.versionLabel} de los Estatutos Nacionales de JMV Ecuador, aprobada por ${version.approvedBy}.`,
    alternates: { canonical: version.isCurrent ? STATUTES_PATH : statuteVersionHref(version.slug) },
    // Las versiones anteriores no deben competir con la vigente en buscadores
    robots: version.isCurrent ? undefined : { index: false, follow: true },
  };
}

export default async function EstatutosVersionPage({ params }: Props) {
  const { slug } = await params;
  const [version, versions] = await Promise.all([fetchStatuteVersion(slug), fetchStatuteVersions().catch(() => [])]);
  if (!version) notFound();
  if (version.isCurrent) redirect(STATUTES_PATH);
  return <StatutesView version={version} versions={versions} />;
}
