"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  Crown,
  Building,
  Map as MapIcon,
  Users,
  MapPin,
  Phone,
  Mail,
  Quote,
  type LucideIcon,
} from "lucide-react";
import type { OrgEntidad, OrgNivel } from "@/lib/data/organigrama";
import type { Asesor, ConsejoPeriod } from "@/types/consejo";

const NIVEL_ICON: Record<OrgNivel, LucideIcon> = {
  internacional: Crown,
  nacional: Building,
  zona: MapIcon,
  grupo: Users,
};

const NIVEL_LABEL: Record<OrgNivel, string> = {
  internacional: "Nivel Internacional",
  nacional: "Nivel Nacional",
  zona: "Zona Pastoral",
  grupo: "Grupo Local",
};

interface NodeDetailPanelProps {
  entidad: OrgEntidad | null;
  consejo: ConsejoPeriod | null;
  asesores: Asesor[];
  onClose: () => void;
}

export default function NodeDetailPanel({
  entidad,
  consejo,
  asesores,
  onClose,
}: NodeDetailPanelProps) {
  return (
    <AnimatePresence>
      {entidad && (
        <motion.aside
          key={entidad.id}
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 30 }}
          className="absolute right-0 top-0 z-20 h-full w-full max-w-sm overflow-y-auto border-l border-white/15 bg-jmv-blue-dark/95 p-6 text-white shadow-2xl backdrop-blur-md"
        >
          <PanelBody entidad={entidad} consejo={consejo} asesores={asesores} />

          <button
            onClick={onClose}
            aria-label="Cerrar panel"
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

function PanelBody({
  entidad,
  consejo,
  asesores,
}: {
  entidad: OrgEntidad;
  consejo: ConsejoPeriod | null;
  asesores: Asesor[];
}) {
  const Icon = NIVEL_ICON[entidad.nivel];

  return (
    <div className="space-y-6">
      <header className="pr-10">
        <span className="inline-flex items-center gap-1 rounded-full bg-jmv-gold/20 px-3 py-1 text-xs font-medium text-jmv-gold">
          {NIVEL_LABEL[entidad.nivel]}
        </span>
        <div className="mt-3 flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-jmv-gold/20 text-jmv-gold">
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold leading-tight">{entidad.nombre}</h3>
            {entidad.subtitulo && (
              <p className="text-sm text-white/70">{entidad.subtitulo}</p>
            )}
          </div>
        </div>
      </header>

      {entidad.descripcion && (
        <p className="text-sm leading-relaxed text-white/80">
          {entidad.descripcion}
        </p>
      )}

      {entidad.coordinador && (
        <InfoRow icon={Crown} label="Coordinador">
          {entidad.coordinador}
        </InfoRow>
      )}

      {entidad.provincias && entidad.provincias.length > 0 && (
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-white">
            <MapPin className="h-4 w-4 text-jmv-gold" />
            Provincias
          </div>
          <div className="flex flex-wrap gap-2">
            {entidad.provincias.map((p) => (
              <span
                key={p}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      )}

      {entidad.contacto && (entidad.contacto.telefono || entidad.contacto.email) && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <h4 className="mb-3 text-sm font-semibold text-white">Contacto</h4>
          <div className="space-y-2">
            {entidad.contacto.telefono && (
              <div className="flex items-center gap-3 text-sm text-white/75">
                <Phone className="h-4 w-4 text-jmv-gold" />
                {entidad.contacto.telefono}
              </div>
            )}
            {entidad.contacto.email && (
              <div className="flex items-center gap-3 text-sm text-white/75">
                <Mail className="h-4 w-4 text-jmv-gold" />
                {entidad.contacto.email}
              </div>
            )}
          </div>
        </div>
      )}

      {/* El nodo del Consejo Nacional muestra los miembros y asesores reales. */}
      {entidad.nivel === "nacional" && (
        <ConsejoNacionalDetalle consejo={consejo} asesores={asesores} />
      )}
    </div>
  );
}

function ConsejoNacionalDetalle({
  consejo,
  asesores,
}: {
  consejo: ConsejoPeriod | null;
  asesores: Asesor[];
}) {
  const miembros = consejo?.miembros?.filter((m) => m.active) ?? [];
  const asesoresActivos = asesores.filter((a) => a.active);

  if (miembros.length === 0 && asesoresActivos.length === 0) {
    return null;
  }

  return (
    <div className="space-y-5">
      {miembros.length > 0 && (
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-white">
            <Users className="h-4 w-4 text-jmv-gold" />
            Miembros del Consejo
          </div>
          <ul className="space-y-2">
            {miembros.map((m) => (
              <li
                key={m.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2"
              >
                <span className="text-sm font-medium text-white">{m.nombre}</span>
                <span className="shrink-0 text-xs text-jmv-gold">{m.cargo}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {asesoresActivos.length > 0 && (
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-white">
            <Quote className="h-4 w-4 text-jmv-gold" />
            Asesores
          </div>
          <ul className="space-y-2">
            {asesoresActivos.map((a) => (
              <li
                key={a.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2"
              >
                <span className="text-sm font-medium text-white">{a.nombre}</span>
                <span className="shrink-0 text-xs text-jmv-gold">{a.cargo}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  children,
}: {
  icon: LucideIcon;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-jmv-gold" />
      <div>
        <p className="text-xs uppercase tracking-wide text-white/50">{label}</p>
        <p className="text-sm font-medium text-white">{children}</p>
      </div>
    </div>
  );
}
