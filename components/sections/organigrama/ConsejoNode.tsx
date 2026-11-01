"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Building, User } from "lucide-react";
import type { OrgEntidad, OrgPersona } from "@/lib/data/organigrama";
import { getOptimizedUrl } from "@/lib/helpers/cloudinary";
import { CONSEJO_CELDA, CONSEJO_WIDTH, consejoHeight } from "./layout";
import type { OrgNodeData } from "./OrgNode";

const handleClass = "!h-1 !w-1 !border-0 !bg-transparent !opacity-0";

function Personas({
  titulo,
  personas,
  onPersona,
}: {
  titulo: string;
  personas?: OrgPersona[];
  onPersona: (persona: OrgPersona) => void;
}) {
  if (!personas?.length) return null;
  return (
    <>
      <p className="flex h-8 items-end justify-center pb-1 text-xs font-semibold uppercase tracking-wide text-jmv-gold-text">
        {titulo}
      </p>
      <ul className="flex flex-wrap justify-center gap-x-2">
        {personas.map((p) => (
          <li key={p.id} className="h-[136px]" style={{ width: CONSEJO_CELDA }}>
            <button
              type="button"
              onClick={() => onPersona(p)}
              aria-haspopup="dialog"
              aria-label={`${p.nombre}, ${p.cargo}. Ver detalles`}
              className="nodrag nopan flex h-full w-full flex-col items-center rounded-lg px-1 py-1.5 text-center transition-colors hover:bg-white/10"
            >
              <span
                aria-hidden
                className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-jmv-gold-text/70 bg-white/10"
              >
                {p.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={getOptimizedUrl(p.imageUrl, { w: 160 })}
                    loading="lazy"
                    decoding="async"
                    width={64}
                    height={64}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-7 w-7 text-jmv-gold-text" />
                )}
              </span>
              <span aria-hidden className="mt-1.5 line-clamp-2 text-sm font-bold leading-tight text-white">
                {p.nombre}
              </span>
              <span aria-hidden className="line-clamp-2 text-xs leading-tight text-slate-100">
                {p.cargo}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

// Consejo Nacional dentro del diagrama: panel con sus miembros y asesores. Cada
// persona es un botón que abre su ficha; de la base del panel cuelgan las zonas.
function ConsejoNodeComponent({ data }: NodeProps) {
  const { entidad, onSelect } = data as OrgNodeData;
  const onPersona = (persona: OrgPersona) => {
    const ficha: OrgEntidad = {
      id: persona.id,
      nivel: "nacional",
      nombre: persona.nombre,
      subtitulo: persona.cargo,
      descripcion: persona.descripcion ?? undefined,
      contacto:
        persona.telefono || persona.email
          ? { telefono: persona.telefono ?? undefined, email: persona.email ?? undefined }
          : undefined,
      persona,
      parentIds: [],
    };
    onSelect(ficha);
  };

  return (
    <div
      data-tone="dark"
      style={{ width: CONSEJO_WIDTH, height: consejoHeight(entidad) }}
      className="rounded-2xl border-2 border-jmv-gold-text bg-jmv-blue px-4 shadow-lg"
    >
      <Handle id="top" type="target" position={Position.Top} className={handleClass} />

      <button
        type="button"
        onClick={() => onSelect(entidad)}
        aria-haspopup="dialog"
        aria-label={`Nivel nacional: ${entidad.nombre}${entidad.subtitulo ? `, ${entidad.subtitulo}` : ""}. Ver detalles`}
        className="nodrag nopan flex h-[72px] w-full items-center justify-center gap-3 rounded-lg text-left"
      >
        <span
          aria-hidden
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/15 text-jmv-gold-text"
        >
          <Building className="h-5 w-5" />
        </span>
        <span aria-hidden className="min-w-0">
          <span className="block truncate font-bold leading-tight text-white">{entidad.nombre}</span>
          {entidad.subtitulo && (
            <span className="block truncate text-xs text-slate-100">{entidad.subtitulo}</span>
          )}
        </span>
      </button>

      <Personas titulo="Miembros" personas={entidad.miembros} onPersona={onPersona} />
      <Personas titulo="Asesores nacionales" personas={entidad.asesores} onPersona={onPersona} />

      <Handle id="bottom" type="source" position={Position.Bottom} className={handleClass} />
    </div>
  );
}

export default memo(ConsejoNodeComponent);
