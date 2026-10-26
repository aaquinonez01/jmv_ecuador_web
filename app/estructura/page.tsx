import type { Metadata } from "next";
import { Crown, MapPin } from "lucide-react";
import HeroMedia from "@/components/media/HeroMedia";
import ReadMore from "@/components/media/ReadMore";
import { fetchSlotImages } from "@/lib/api/site-images.server";
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
  const [consejo, asesores, zonas, heroImages] = await Promise.all([
    fetchConsejoActual(),
    fetchAsesoresActuales(),
    fetchZonasOrganigrama(),
    fetchSlotImages("estructura.hero"),
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
      <HeroMedia
        images={heroImages}
        eyebrow="Liderazgo y organización"
        title="Nuestra estructura"
        lead="Un liderazgo que guía con el ejemplo del servicio."
        breadcrumbs={[{ label: "Estructura" }]}
        actions={[
          { label: "Consejo Nacional", href: "#consejo-nacional", icon: Crown },
          { label: "Zonas y grupos", href: "#organigrama", icon: MapPin },
        ]}
      />

      {/* El párrafo y las cifras que antes iban sobre la foto */}
      <section aria-label="JMV Ecuador en cifras" className="bg-page py-10 sm:py-12">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center lg:gap-12 lg:px-8">
          <ReadMore lines={3}>
            <p className="text-lg leading-relaxed text-fg-soft">
              Conoce a quienes animan JMV Ecuador a nivel nacional y zonal: jóvenes y asesores que dedican su
              tiempo a acompañar a las nuevas generaciones vicencianas.
            </p>
          </ReadMore>
          {cifras.length > 0 && (
            <dl className={`grid gap-3 ${cifras.length >= 3 ? "grid-cols-3" : cifras.length === 2 ? "grid-cols-2" : "grid-cols-1"}`}>
              {cifras.map((c) => (
                <div
                  key={c.plural}
                  className="surface-card flex flex-col-reverse justify-end rounded-2xl p-3 text-center sm:p-4"
                >
                  <dt className="text-xs leading-snug text-fg-muted sm:text-sm">
                    {c.valor === 1 ? c.singular : c.plural}
                  </dt>
                  <dd className="text-3xl font-bold text-accent-gold sm:text-4xl">{c.valor}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </section>
      <ConsejoNacionalSection consejo={consejo} asesores={asesores} />
      <Organigrama nodos={nodos} />
      <SigueExplorando items={["mundo", "quienes-somos", "unete"]} />
    </>
  );
}
