import { MapPin, Quote, Star, User } from "lucide-react";
import type { Asesor, ConsejoMember, ConsejoPeriod } from "@/types/consejo";
import { getOptimizedUrl } from "@/lib/helpers/cloudinary";
import { formatDate } from "@/lib/format";
import SectionHeading from "../ui/SectionHeading";
import ContactoLinks from "./organigrama/contacto";

const ORDEN_CARGOS: Record<string, number> = {
  coordinador: 1,
  vicecoordinador: 2,
  secretario: 3,
  tesorero: 4,
  vocal: 5,
};

export function sortMembers(members: ConsejoMember[]): ConsejoMember[] {
  return [...members].sort((a, b) => {
    const orderA = ORDEN_CARGOS[a.tipoCargo] ?? 99;
    const orderB = ORDEN_CARGOS[b.tipoCargo] ?? 99;
    if (orderA !== orderB) return orderA - orderB;
    return (a.displayOrder ?? 0) - (b.displayOrder ?? 0);
  });
}

interface Props {
  consejo: ConsejoPeriod | null;
  asesores: Asesor[];
}

// Consejo Nacional y asesores vigentes, desde el backend (gestionados en el admin)
export default function ConsejoNacionalSection({ consejo, asesores }: Props) {
  const miembros = consejo ? sortMembers((consejo.miembros ?? []).filter((m) => m.active !== false)) : [];
  const asesoresActivos = asesores.filter((a) => a.active);

  return (
    <section
      id="consejo-nacional"
      tabIndex={-1}
      aria-labelledby="consejo-titulo"
      className="scroll-mt-24 bg-gradient-to-b from-page to-section-blue py-16 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="consejo-titulo"
          eyebrow="Liderazgo nacional"
          title="Consejo Nacional"
          description={
            consejo?.descripcion ??
            "Jóvenes y asesores que animan y coordinan JMV en todo el Ecuador."
          }
        />
        {consejo?.nombre && (
          <p className="-mt-6 mb-10 text-center text-sm text-fg-muted">
            {consejo.nombre}
            {consejo.fechaInicio && consejo.fechaFin && (
              <>
                {" · "}
                {formatDate(consejo.fechaInicio, { year: "numeric" })}–
                {formatDate(consejo.fechaFin, { year: "numeric" })}
              </>
            )}
          </p>
        )}

        {miembros.length === 0 ? (
          <p className="rounded-2xl border border-line bg-surface p-6 text-center text-fg-muted shadow-card dark:border-white/15 dark:bg-white/5">
            Pronto publicaremos a los miembros del Consejo Nacional.
          </p>
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {miembros.map((m) => (
              <li key={m.id}>
                <PersonaCard
                  nombre={m.nombre}
                  cargo={m.cargo}
                  imageUrl={m.imageUrl}
                  comunidad={m.comunidad}
                  santoFavorito={m.santoFavorito}
                  citaBiblica={m.citaBiblica}
                  descripcion={m.descripcion}
                  email={m.email}
                  telefono={m.telefono}
                />
              </li>
            ))}
          </ul>
        )}

        {asesoresActivos.length > 0 && (
          <>
            <h3 className="mt-14 mb-6 text-center text-2xl font-bold text-fg sm:text-3xl">
              Asesores nacionales
            </h3>
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {asesoresActivos.map((a) => (
                <li key={a.id}>
                  <PersonaCard
                    nombre={a.nombre}
                    cargo={a.cargo}
                    imageUrl={a.imageUrl}
                    comunidad={a.comunidad}
                    santoFavorito={a.santoFavorito}
                    citaBiblica={a.citaBiblica}
                    descripcion={a.descripcion}
                    email={a.email}
                    telefono={a.telefono}
                  />
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </section>
  );
}

interface PersonaCardProps {
  nombre: string;
  cargo: string;
  imageUrl?: string | null;
  comunidad?: string | null;
  santoFavorito?: string | null;
  citaBiblica?: string | null;
  descripcion?: string | null;
  email?: string | null;
  telefono?: string | null;
}

function PersonaCard(p: PersonaCardProps) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-line bg-surface p-5 shadow-card dark:border-white/15 dark:bg-white/5">
      <div className="flex items-center gap-4">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-line-strong bg-surface-sunken dark:bg-jmv-ink">
          {p.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={getOptimizedUrl(p.imageUrl, { w: 240 })}
              loading="lazy"
              decoding="async"
              width={80}
              height={80}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <User className="h-9 w-9 text-accent-gold" aria-hidden />
          )}
        </div>
        <div className="min-w-0">
          <h4 className="text-lg font-bold text-fg">{p.nombre}</h4>
          <p className="font-medium text-accent-gold">{p.cargo}</p>
        </div>
      </div>

      <dl className="mt-4 space-y-2 text-sm text-fg-muted dark:text-slate-200">
        {p.comunidad && (
          <div className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent-gold" aria-hidden />
            <dt className="text-fg-subtle dark:text-slate-300">Comunidad:</dt>
            <dd>{p.comunidad}</dd>
          </div>
        )}
        {p.santoFavorito && (
          <div className="flex items-start gap-2">
            <Star className="mt-0.5 h-4 w-4 shrink-0 text-accent-gold" aria-hidden />
            <dt className="text-fg-subtle dark:text-slate-300">Santo favorito:</dt>
            <dd>{p.santoFavorito}</dd>
          </div>
        )}
      </dl>

      {p.descripcion && <p className="mt-3 text-sm text-fg-muted">{p.descripcion}</p>}

      {p.citaBiblica && (
        <blockquote className="mt-3 flex items-start gap-2 rounded-lg border border-line bg-surface-2 p-3 dark:bg-white/5">
          <Quote className="mt-0.5 h-4 w-4 shrink-0 text-accent-gold" aria-hidden />
          <p className="text-sm italic leading-relaxed text-fg-muted dark:text-slate-200">{p.citaBiblica}</p>
        </blockquote>
      )}

      <ContactoLinks
        telefono={p.telefono}
        email={p.email}
        nombre={p.nombre}
        className="mt-auto -mx-2 pt-3"
      />
    </article>
  );
}
