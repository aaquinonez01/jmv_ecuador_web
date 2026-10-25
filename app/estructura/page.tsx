import type { Metadata } from "next";
import { Crown, MapPin } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import ConsejoNacionalSection from "@/components/sections/ConsejoNacionalSection";
import Organigrama from "@/components/sections/Organigrama";
import SigueExplorando from "@/components/sections/institucional/SigueExplorando";
import { fetchConsejoActual, fetchAsesoresActuales } from "@/lib/api/consejo.server";
import { fetchZonasOrganigrama } from "@/lib/api/territorios.server";
import { buildOrganigrama } from "@/lib/data/organigrama";

// ISR: ver app/page.tsx.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Estructura",
  description:
    "Cómo se organiza JMV Ecuador: Consejo Nacional, asesores, zonas pastorales y grupos locales en todo el país.",
  alternates: { canonical: "/estructura" },
};

export default async function EstructuraPage() {
  const [consejo, asesores, zonas] = await Promise.all([
    fetchConsejoActual(),
    fetchAsesoresActuales(),
    fetchZonasOrganigrama(),
  ]);

  const nodos = buildOrganigrama({ consejo, zonas });

  // Cifras calculadas con los datos publicados; si no hay datos, no se muestran.
  const cifras = [
    {
      valor: (consejo?.miembros ?? []).filter((m) => m.active !== false).length,
      singular: "miembro del Consejo Nacional",
      plural: "miembros del Consejo Nacional",
    },
    { valor: zonas.length, singular: "zona pastoral", plural: "zonas pastorales" },
    {
      valor: zonas.reduce((total, z) => total + (z.comunidades?.length ?? 0), 0),
      singular: "grupo local",
      plural: "grupos locales",
    },
  ].filter((c) => c.valor > 0);

  return (
    <>
      <PageHero
        eyebrow="Liderazgo y organización"
        title="Nuestra estructura"
        motto="Un liderazgo que guía con el ejemplo del servicio."
        description="Conoce a quienes animan JMV Ecuador a nivel nacional y zonal: jóvenes y asesores que dedican su tiempo a acompañar a las nuevas generaciones vicencianas."
        image={{ src: "/images/hero/hero.jpg", position: "center 60%" }}
        motif="stars"
        breadcrumbs={[{ label: "Estructura" }]}
        actions={[
          { label: "Consejo Nacional", href: "#consejo-nacional", icon: Crown },
          { label: "Zonas y grupos", href: "#organigrama", icon: MapPin },
        ]}
      >
        {cifras.length > 0 && (
          <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
            {cifras.map((c) => (
              <div key={c.plural} className="flex flex-col-reverse">
                <dt className="text-sm text-fg-muted dark:text-slate-200">
                  {c.valor === 1 ? c.singular : c.plural}
                </dt>
                <dd className="text-3xl font-bold text-accent-gold sm:text-4xl">{c.valor}</dd>
              </div>
            ))}
          </dl>
        )}
      </PageHero>
      <ConsejoNacionalSection consejo={consejo} asesores={asesores} />
      <Organigrama nodos={nodos} />
      <SigueExplorando items={["mundo", "quienes-somos", "unete"]} />
    </>
  );
}
