import { Network } from "lucide-react";
import { fetchConsejoActual, fetchAsesoresActuales } from "@/lib/api/consejo.server";
import { fetchZonasOrganigrama } from "@/lib/api/territorios.server";
import { buildOrganigrama } from "@/lib/data/organigrama";
import ScrollReveal from "../ui/ScrollReveal";
import OrganigramaFlow from "./organigrama/OrganigramaFlow";

export default async function Organigrama() {
  const [consejo, asesores, zonas] = await Promise.all([
    fetchConsejoActual(),
    fetchAsesoresActuales(),
    fetchZonasOrganigrama(),
  ]);

  const nodos = buildOrganigrama({ consejo, zonas });

  return (
    <section
      id="organigrama"
      className="relative overflow-hidden bg-gradient-to-br from-jmv-blue-dark via-blue-800 to-blue-700 pt-20"
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" delay={50}>
          <div className="mb-10 text-center">
            <div className="mb-6 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-6 py-3 font-medium text-white backdrop-blur-md">
              <Network className="mr-2 h-5 w-5" />
              Organizador Gráfico
            </div>
            <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
              Organigrama <span className="text-jmv-gold">JMV Ecuador</span>
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-white/80">
              Desde el Consejo Nacional hasta los grupos locales, descubre cómo
              se organiza la Juventud Mariana Vicenciana en el Ecuador. Haz clic
              en cualquier nodo para ver sus detalles.
            </p>
          </div>
        </ScrollReveal>
      </div>

      {/* Lienzo a todo el ancho de la página. */}
      <OrganigramaFlow nodos={nodos} consejo={consejo} asesores={asesores} />
    </section>
  );
}
