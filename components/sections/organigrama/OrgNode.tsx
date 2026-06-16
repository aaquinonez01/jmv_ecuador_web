"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Crown, Building, Map, Users, type LucideIcon } from "lucide-react";
import type { OrgEntidad, OrgNivel } from "@/lib/data/organigrama";
import { NODE_WIDTH } from "./layout";

export interface OrgNodeData extends Record<string, unknown> {
  entidad: OrgEntidad;
  width?: number;
  compact?: boolean;
  isSelected?: boolean;
}

interface NivelStyle {
  icon: LucideIcon;
  card: string;
  iconWrap: string;
  subtitle: string;
}

const NIVEL_STYLES: Record<OrgNivel, NivelStyle> = {
  internacional: {
    icon: Crown,
    card: "bg-gradient-to-br from-jmv-gold to-jmv-gold-dark text-white border-jmv-gold",
    iconWrap: "bg-white/20 text-white",
    subtitle: "text-white/80",
  },
  nacional: {
    icon: Building,
    card: "bg-gradient-to-br from-jmv-blue to-jmv-blue-dark text-white border-jmv-blue-light",
    iconWrap: "bg-white/20 text-jmv-gold",
    subtitle: "text-white/80",
  },
  zona: {
    icon: Map,
    card: "bg-white text-jmv-blue border-jmv-red/40",
    iconWrap: "bg-jmv-red/10 text-jmv-red",
    subtitle: "text-jmv-blue/60",
  },
  grupo: {
    icon: Users,
    card: "bg-white/95 text-jmv-blue border-jmv-blue/15",
    iconWrap: "bg-jmv-blue/10 text-jmv-blue",
    subtitle: "text-jmv-blue/50",
  },
};

// Handles invisibles: solo sirven como punto de anclaje de las aristas.
const handleClass = "!h-1 !w-1 !border-0 !bg-transparent !opacity-0";

function OrgNodeComponent({ data }: NodeProps) {
  const { entidad, width, compact, isSelected } = data as OrgNodeData;
  const style = NIVEL_STYLES[entidad.nivel];
  const Icon = style.icon;
  const isRoot = entidad.nivel === "internacional";

  return (
    <div
      className={`relative rounded-xl border-2 shadow-lg transition-all duration-200 ${
        compact ? "px-3 py-2" : "px-4 py-3"
      } ${style.card} ${
        isSelected ? "ring-4 ring-jmv-gold/60 scale-[1.03]" : "hover:scale-[1.02]"
      }`}
      style={{ width: width ?? NODE_WIDTH }}
    >
      {!isRoot && (
        <>
          <Handle id="top" type="target" position={Position.Top} className={handleClass} />
          <Handle id="left" type="target" position={Position.Left} className={handleClass} />
        </>
      )}

      <div className={`flex items-center ${compact ? "gap-2" : "gap-3"}`}>
        <div
          className={`flex shrink-0 items-center justify-center rounded-lg ${
            compact ? "h-8 w-8" : "h-10 w-10"
          } ${style.iconWrap}`}
        >
          <Icon className={compact ? "h-4 w-4" : "h-5 w-5"} />
        </div>
        <div className="min-w-0">
          <p
            className={`truncate font-bold leading-tight ${
              compact ? "text-xs" : "text-sm"
            }`}
          >
            {entidad.nombre}
          </p>
          {entidad.subtitulo && (
            <p className={`truncate text-xs ${style.subtitle}`}>
              {entidad.subtitulo}
            </p>
          )}
          {entidad.coordinador && (
            <p className={`truncate text-xs ${style.subtitle}`}>
              {entidad.coordinador}
            </p>
          )}
        </div>
      </div>

      <Handle id="bottom" type="source" position={Position.Bottom} className={handleClass} />
    </div>
  );
}

export default memo(OrgNodeComponent);
