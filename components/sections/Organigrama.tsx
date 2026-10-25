import type { OrgEntidad } from "@/lib/data/organigrama";
import SectionHeading from "../ui/SectionHeading";
import OrganigramaInteractivo from "./organigrama/OrganigramaInteractivo";
import OrganigramaLista from "./organigrama/OrganigramaLista";

// Los datos llegan del backend desde app/estructura/page.tsx (ver buildOrganigrama)
export default function Organigrama({ nodos }: { nodos: OrgEntidad[] }) {
  return (
    <section
      id="organigrama"
      aria-labelledby="organigrama-titulo"
      className="scroll-mt-24 bg-section-blue py-16 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="organigrama-titulo"
          eyebrow="Zonas y grupos"
          title="Organigrama de JMV Ecuador"
          description="Del Consejo Nacional a los grupos locales: así nos organizamos en el país. Abre una zona para ver sus grupos y cómo contactarlos."
        />
      </div>

      <OrganigramaInteractivo nodos={nodos} lista={<OrganigramaLista nodos={nodos} />} />
    </section>
  );
}
