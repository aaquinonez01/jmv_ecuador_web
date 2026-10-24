"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Crown, Building, Map, Users, type LucideIcon } from "lucide-react";
import type { OrgEntidad, OrgNivel } from "@/lib/data/organigrama";
import { NODE_WIDTH } from "./layout";

export interface OrgNodeData extends Record<string, unknown> {
  entidad: OrgEntidad;
  onSelect: (entidad: OrgEntidad) => void;
}

interface NivelStyle {
  icon: LucideIcon;
  label: string;
  card: string;
  iconWrap: string;
  subtitle: string;
}

// Colores con contraste AA (texto ≥ 4.5:1 sobre el fondo de cada tarjeta)
const NIVEL_STYLES: Record<OrgNivel, NivelStyle> = {
  internacional: {
    icon: Crown,
    label: "Nivel internacional",
    card: "bg-jmv-gold text-jmv-ink border-jmv-gold-text",
    iconWrap: "bg-white/40 text-jmv-ink",
    subtitle: "text-jmv-ink",
  },
  nacional: {
    icon: Building,
    label: "Nivel nacional",
    card: "bg-jmv-blue text-white border-jmv-gold-text",
    iconWrap: "bg-white/15 text-jmv-gold-text",
    subtitle: "text-slate-100",
  },
  zona: {
    icon: Map,
    label: "Zona pastoral",
    card: "bg-white text-jmv-blue border-jmv-red/50",
    iconWrap: "bg-jmv-red/10 text-jmv-red",
    subtitle: "text-slate-600",
  },
  grupo: {
    icon: Users,
    label: "Grupo",
    card: "bg-white text-jmv-blue border-jmv-blue/20",
    iconWrap: "bg-jmv-blue/10 text-jmv-blue",
    subtitle: "text-slate-600",
  },
};

// Handles invisibles: solo sirven como punto de anclaje de las aristas.
const handleClass = "!h-1 !w-1 !border-0 !bg-transparent !opacity-0";

// El nodo es un <button> real: se alcanza con Tab y se abre con Enter o Espacio.
function OrgNodeComponent({ data }: NodeProps) {
  const { entidad, onSelect } = data as OrgNodeData;
  const style = NIVEL_STYLES[entidad.nivel];
  const Icon = style.icon;
  const isRoot = entidad.nivel === "internacional";
  const detalle = [entidad.subtitulo, entidad.coordinador].filter(Boolean).join(", ");

  return (
    <div style={{ width: NODE_WIDTH }}>
      {!isRoot && (
        <Handle id="top" type="target" position={Position.Top} className={handleClass} />
      )}

      <button
        type="button"
        onClick={() => onSelect(entidad)}
        aria-haspopup="dialog"
        aria-label={`${style.label}: ${entidad.nombre}${detalle ? `, ${detalle}` : ""}. Ver detalles`}
        className={`nodrag nopan flex w-full items-center gap-3 rounded-xl border-2 px-4 py-3 text-left shadow-lg transition-transform motion-safe:hover:scale-[1.02] ${style.card}`}
      >
        <span
          aria-hidden
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${style.iconWrap}`}
        >
          <Icon className="h-5 w-5" />
        </span>
        <span className="min-w-0" aria-hidden>
          <span className="block truncate text-sm font-bold leading-tight">
            {entidad.nombre}
          </span>
          {entidad.subtitulo && (
            <span className={`block truncate text-xs ${style.subtitle}`}>
              {entidad.subtitulo}
            </span>
          )}
          {entidad.coordinador && (
            <span className={`block truncate text-xs ${style.subtitle}`}>
              {entidad.coordinador}
            </span>
          )}
        </span>
      </button>

      <Handle id="bottom" type="source" position={Position.Bottom} className={handleClass} />
    </div>
  );
}

export default memo(OrgNodeComponent);
