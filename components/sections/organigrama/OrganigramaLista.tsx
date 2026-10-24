import { Building, ChevronDown, MapPin, Users } from "lucide-react";
import type { OrgEntidad } from "@/lib/data/organigrama";
import { gruposDe } from "./layout";
import ContactoLinks from "./contacto";

// Organigrama como acordeón HTML (Consejo → Zonas → Grupos). Es la vista en
// móvil y la alternativa "Ver como lista" en escritorio. Funciona sin JS.
export default function OrganigramaLista({ nodos }: { nodos: OrgEntidad[] }) {
  const nacional = nodos.find((n) => n.nivel === "nacional");
  const zonas = nodos.filter((n) => n.nivel === "zona");

  return (
    <div className="space-y-4">
      {nacional && (
        <div className="flex items-start gap-4 rounded-2xl border-2 border-jmv-gold-text/60 bg-jmv-blue p-5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15 text-jmv-gold-text">
            <Building className="h-5 w-5" aria-hidden />
          </span>
          <div className="min-w-0">
            <h3 className="text-xl font-bold text-white">{nacional.nombre}</h3>
            {nacional.subtitulo && <p className="text-slate-100">{nacional.subtitulo}</p>}
            {nacional.descripcion && (
              <p className="mt-1 text-sm text-slate-100">{nacional.descripcion}</p>
            )}
            <a
              href="#consejo-nacional"
              className="mt-2 inline-flex min-h-11 items-center font-semibold text-jmv-gold-text underline underline-offset-4 hover:text-white"
            >
              Ver miembros y asesores
            </a>
          </div>
        </div>
      )}

      {zonas.length === 0 ? (
        <p className="rounded-2xl border border-white/15 bg-white/5 p-5 text-slate-300">
          Pronto publicaremos las zonas pastorales y sus grupos.
        </p>
      ) : (
        <ul className="space-y-3 border-l-2 border-jmv-gold-text/30 pl-3 sm:pl-5">
          {zonas.map((zona) => {
            const grupos = gruposDe(nodos, zona.id);
            return (
              <li key={zona.id}>
                <details className="group rounded-2xl border border-white/15 bg-white/5 open:bg-white/[0.07]">
                  <summary className="flex min-h-14 cursor-pointer list-none items-center gap-3 rounded-2xl px-4 py-3 hover:bg-white/10 [&::-webkit-details-marker]:hidden">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-jmv-red/20 text-red-200">
                      <MapPin className="h-5 w-5" aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-lg font-bold text-white">{zona.nombre}</span>
                      <span className="block text-sm text-slate-300">
                        {zona.coordinador ? `Coordinación: ${zona.coordinador} · ` : ""}
                        {grupos.length === 1 ? "1 grupo" : `${grupos.length} grupos`}
                      </span>
                    </span>
                    <ChevronDown
                      className="h-5 w-5 shrink-0 text-white transition-transform group-open:rotate-180 motion-reduce:transition-none"
                      aria-hidden
                    />
                  </summary>

                  <div className="px-4 pb-4">
                    {zona.provincias && zona.provincias.length > 0 && (
                      <p className="mb-3 text-sm text-slate-300">
                        <span className="font-semibold text-slate-200">Ciudades: </span>
                        {zona.provincias.join(", ")}
                      </p>
                    )}
                    {grupos.length === 0 ? (
                      <p className="text-sm text-slate-300">Esta zona aún no tiene grupos publicados.</p>
                    ) : (
                      <ul className="space-y-2">
                        {grupos.map((g) => (
                          <li key={g.id} className="rounded-xl border border-white/10 bg-jmv-ink/60 p-4">
                            <div className="flex items-start gap-3">
                              <Users className="mt-1 h-4 w-4 shrink-0 text-jmv-gold-text" aria-hidden />
                              <div className="min-w-0">
                                <h3 className="font-semibold text-white">{g.nombre}</h3>
                                {g.subtitulo && <p className="text-sm text-slate-300">{g.subtitulo}</p>}
                                {g.descripcion && <p className="text-sm text-slate-300">{g.descripcion}</p>}
                              </div>
                            </div>
                            {g.contacto && (
                              <ContactoLinks
                                telefono={g.contacto.telefono}
                                email={g.contacto.email}
                                nombre={g.nombre}
                                className="mt-2 -ml-2"
                              />
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </details>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
