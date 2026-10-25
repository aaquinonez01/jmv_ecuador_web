import type { Metadata } from "next";
import { fetchCurrentStatutes, fetchStatuteVersions } from "@/lib/api/statutes.server";
import StatutesView from "@/components/estatutos/StatutesView";
import StatutesEmpty from "@/components/estatutos/StatutesEmpty";

// ISR: el backend invalida el tag "statutes" al publicar o cambiar la versión vigente.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Estatutos Nacionales",
  description:
    "Lee los Estatutos Nacionales de las Juventudes Marianas Vicencianas del Ecuador: quiénes somos, para qué existimos, cómo nos organizamos. Con buscador, índice y glosario.",
  alternates: { canonical: "/quienes-somos/estatutos" },
  openGraph: {
    title: "Estatutos Nacionales de JMV Ecuador",
    description: "Quiénes somos y cómo nos organizamos, artículo por artículo.",
    url: "/quienes-somos/estatutos",
  },
};

export default async function EstatutosPage() {
  const [version, versions] = await Promise.all([fetchCurrentStatutes(), fetchStatuteVersions().catch(() => [])]);
  if (!version) return <StatutesEmpty />;
  return <StatutesView version={version} versions={versions} />;
}
