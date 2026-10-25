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
      {/* Tarjeta azul JMV en ambos modos: data-tone="dark" para el foco dorado */}
      {nacional && (
        <div data-tone="dark" className="flex items-start gap-4 rounded-2xl border-2 border-jmv-gold-text/60 bg-jmv-blue p-5">
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
        <p className="rounded-2xl border border-line bg-surface p-5 text-fg-muted shadow-card dark:border-white/15 dark:bg-white/5">
          Pronto publicaremos las zonas pastorales y sus grupos.
        </p>
      ) : (
        <ul className="space-y-3 border-l-2 border-accent-gold/30 pl-3 sm:pl-5">
          {zonas.map((zona) => {
            const grupos = gruposDe(nodos, zona.id);
            return (
              <li key={zona.id}>
                <details className="group rounded-2xl border border-line bg-surface shadow-card dark:border-white/15 dark:bg-white/5 dark:open:bg-white/[0.07]">
                  <summary className="flex min-h-14 cursor-pointer list-none items-center gap-3 rounded-2xl px-4 py-3 hover:bg-surface-2 [&::-webkit-details-marker]:hidden">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-jmv-red/10 text-jmv-red dark:bg-jmv-red/20 dark:text-red-200">
                      <MapPin className="h-5 w-5" aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-lg font-bold text-fg">{zona.nombre}</span>
                      <span className="block text-sm text-fg-muted">
                        {zona.coordinador ? `Coordinación: ${zona.coordinador} · ` : ""}
                        {grupos.length === 1 ? "1 grupo" : `${grupos.length} grupos`}
                      </span>
                    </span>
                    <ChevronDown
                      className="h-5 w-5 shrink-0 text-fg-muted transition-transform dark:text-white group-open:rotate-180 motion-reduce:transition-none"
                      aria-hidden
                    />
                  </summary>

                  <div className="px-4 pb-4">
                    {zona.provincias && zona.provincias.length > 0 && (
                      <p className="mb-3 text-sm text-fg-muted">
                        <span className="font-semibold text-fg dark:text-slate-200">Ciudades: </span>
                        {zona.provincias.join(", ")}
                      </p>
                    )}
                    {grupos.length === 0 ? (
                      <p className="text-sm text-fg-muted">Esta zona aún no tiene grupos publicados.</p>
                    ) : (
                      <ul className="space-y-2">
                        {grupos.map((g) => (
                          <li key={g.id} className="rounded-xl border border-line bg-surface-2 p-4 dark:bg-jmv-ink/60">
                            <div className="flex items-start gap-3">
                              <Users className="mt-1 h-4 w-4 shrink-0 text-accent-gold" aria-hidden />
                              <div className="min-w-0">
                                <h3 className="font-semibold text-fg">{g.nombre}</h3>
                                {g.subtitulo && <p className="text-sm text-fg-muted">{g.subtitulo}</p>}
                                {g.descripcion && <p className="text-sm text-fg-muted">{g.descripcion}</p>}
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
