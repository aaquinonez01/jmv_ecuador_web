"use client";

import { useEffect } from "react";
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
  Star,
  Quote,
  User,
  Calendar,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import type { OrgEntidad, OrgNivel } from "@/lib/data/organigrama";
import type { Asesor, ConsejoMember, ConsejoPeriod } from "@/types/consejo";

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
  grupo: "Grupo / Comunidad",
};

const ORDEN_CARGOS: Record<string, number> = {
  coordinador: 1,
  vicecoordinador: 2,
  secretario: 3,
  tesorero: 4,
  vocal: 5,
};

function sortMembers(members: ConsejoMember[]): ConsejoMember[] {
  return [...members].sort((a, b) => {
    const orderA = ORDEN_CARGOS[a.tipoCargo] ?? 99;
    const orderB = ORDEN_CARGOS[b.tipoCargo] ?? 99;
    if (orderA !== orderB) return orderA - orderB;
    return (a.displayOrder ?? 0) - (b.displayOrder ?? 0);
  });
}

function formatDate(value?: string | null) {
  if (!value) return null;
  try {
    return new Date(value).toLocaleDateString("es-EC", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return value;
  }
}

interface NodeDetailModalProps {
  entidad: OrgEntidad | null;
  consejo: ConsejoPeriod | null;
  asesores: Asesor[];
  onClose: () => void;
}

export default function NodeDetailModal({
  entidad,
  consejo,
  asesores,
  onClose,
}: NodeDetailModalProps) {
  // Cerrar con Escape y bloquear el scroll del fondo mientras está abierto.
  useEffect(() => {
    if (!entidad) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [entidad, onClose]);

  const isNacional = entidad?.nivel === "nacional";

  return (
    <AnimatePresence>
      {entidad && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            className={`relative my-auto w-full overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br from-jmv-blue-dark via-blue-900 to-jmv-blue shadow-2xl ${
              isNacional ? "max-w-5xl" : "max-w-xl"
            }`}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
          >
            <ModalHeader entidad={entidad} onClose={onClose} />

            <div className="max-h-[72vh] overflow-y-auto px-6 py-6 sm:px-8">
              <ModalBody
                entidad={entidad}
                consejo={consejo}
                asesores={asesores}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ModalHeader({
  entidad,
  onClose,
}: {
  entidad: OrgEntidad;
  onClose: () => void;
}) {
  const Icon = NIVEL_ICON[entidad.nivel];
  return (
    <div className="sticky top-0 z-10 flex items-center gap-4 border-b border-white/10 bg-jmv-blue-dark/80 px-6 py-5 backdrop-blur-md sm:px-8">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-jmv-gold/20 text-jmv-gold">
        <Icon className="h-7 w-7" />
      </div>
      <div className="min-w-0 flex-1">
        <span className="inline-flex items-center rounded-full bg-jmv-gold/20 px-3 py-0.5 text-xs font-medium text-jmv-gold">
          {NIVEL_LABEL[entidad.nivel]}
        </span>
        <h3 className="mt-1 truncate text-2xl font-bold text-white">
          {entidad.nombre}
        </h3>
        {entidad.subtitulo && (
          <p className="truncate text-sm text-white/70">{entidad.subtitulo}</p>
        )}
      </div>
      <button
        onClick={onClose}
        aria-label="Cerrar"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}

function ModalBody({
  entidad,
  consejo,
  asesores,
}: {
  entidad: OrgEntidad;
  consejo: ConsejoPeriod | null;
  asesores: Asesor[];
}) {
  return (
    <div className="space-y-8">
      {entidad.descripcion && (
        <p className="text-base leading-relaxed text-white/80">
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
          <SectionTitle icon={MapPin}>
            {entidad.nivel === "zona" ? "Ciudades" : "Provincias"}
          </SectionTitle>
          <div className="flex flex-wrap gap-2">
            {entidad.provincias.map((p) => (
              <span
                key={p}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/80"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      )}

      {entidad.contacto &&
        (entidad.contacto.telefono || entidad.contacto.email) && (
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

      {/* El Consejo Nacional muestra miembros y asesores reales con fotos. */}
      {entidad.nivel === "nacional" && (
        <ConsejoDetalle consejo={consejo} asesores={asesores} />
      )}
    </div>
  );
}

function ConsejoDetalle({
  consejo,
  asesores,
}: {
  consejo: ConsejoPeriod | null;
  asesores: Asesor[];
}) {
  const miembros = consejo ? sortMembers(consejo.miembros ?? []) : [];
  const asesoresActivos = asesores.filter((a) => a.active);

  return (
    <div className="space-y-10">
      <div>
        <SectionTitle icon={Crown}>Miembros del Consejo</SectionTitle>
        {miembros.length === 0 ? (
          <EmptyHint>Aún no se ha publicado el Consejo Nacional.</EmptyHint>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {miembros.map((m) => (
              <MemberCard key={m.id} miembro={m} />
            ))}
          </div>
        )}
      </div>

      <div>
        <SectionTitle icon={Sparkles}>Asesores Nacionales</SectionTitle>
        {asesoresActivos.length === 0 ? (
          <EmptyHint>Aún no se han publicado los asesores.</EmptyHint>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2">
            {asesoresActivos.map((a) => (
              <AsesorCard key={a.id} asesor={a} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MemberCard({ miembro }: { miembro: ConsejoMember }) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-md">
      <div className="relative mb-4">
        <div className="mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-gradient-to-r from-jmv-gold/20 to-jmv-red/20">
          {miembro.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={miembro.imageUrl}
              alt={miembro.nombre}
              className="h-full w-full object-cover"
            />
          ) : (
            <User className="h-14 w-14 text-jmv-gold" />
          )}
        </div>
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 translate-y-0">
          <div className="rounded-full border border-white/30 bg-gradient-to-r from-jmv-gold to-jmv-gold-dark p-1.5">
            <Crown className="h-3.5 w-3.5 text-white" />
          </div>
        </div>
      </div>

      <div className="mb-3 text-center">
        <h4 className="text-lg font-bold text-white">{miembro.nombre}</h4>
        <p className="font-medium text-jmv-gold">{miembro.cargo}</p>
        {miembro.edad ? (
          <p className="text-sm text-white/60">{miembro.edad} años</p>
        ) : null}
      </div>

      <div className="flex-1 space-y-2.5 text-sm">
        {miembro.comunidad && (
          <CardRow icon={MapPin} label="Comunidad">
            {miembro.comunidad}
          </CardRow>
        )}
        {miembro.santoFavorito && (
          <CardRow icon={Star} label="Santo favorito">
            {miembro.santoFavorito}
          </CardRow>
        )}
        {miembro.email && (
          <CardRow icon={Mail} label="Email">
            <span className="break-all">{miembro.email}</span>
          </CardRow>
        )}
        {miembro.telefono && (
          <CardRow icon={Phone} label="Teléfono">
            {miembro.telefono}
          </CardRow>
        )}
        {miembro.citaBiblica && (
          <div className="rounded-lg border border-white/10 bg-white/5 p-3">
            <div className="flex items-start gap-2">
              <Quote className="mt-0.5 h-4 w-4 shrink-0 text-jmv-gold" />
              <p className="text-xs italic leading-relaxed text-white/70">
                {miembro.citaBiblica}
              </p>
            </div>
          </div>
        )}
        {miembro.descripcion && (
          <p className="pt-1 text-xs text-white/70">{miembro.descripcion}</p>
        )}
      </div>
    </div>
  );
}

function AsesorCard({ asesor }: { asesor: Asesor }) {
  const periodo =
    asesor.fechaInicio || asesor.fechaFin
      ? `${formatDate(asesor.fechaInicio) ?? "—"} — ${
          formatDate(asesor.fechaFin) ?? "—"
        }`
      : null;

  return (
    <div className="flex h-full flex-col rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-md">
      <div className="mb-4 flex items-center gap-4">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-gradient-to-r from-jmv-gold/20 to-jmv-red/20">
          {asesor.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={asesor.imageUrl}
              alt={asesor.nombre}
              className="h-full w-full object-cover"
            />
          ) : (
            <User className="h-10 w-10 text-jmv-gold" />
          )}
        </div>
        <div className="min-w-0">
          <h4 className="text-lg font-bold text-white">{asesor.nombre}</h4>
          <p className="font-medium text-jmv-gold">{asesor.cargo}</p>
        </div>
      </div>

      <div className="flex-1 space-y-2.5 text-sm">
        {asesor.comunidad && (
          <CardRow icon={MapPin} label="Comunidad">
            {asesor.comunidad}
          </CardRow>
        )}
        {asesor.santoFavorito && (
          <CardRow icon={Star} label="Santo favorito">
            {asesor.santoFavorito}
          </CardRow>
        )}
        {periodo && (
          <CardRow icon={Calendar} label="Período">
            {periodo}
          </CardRow>
        )}
        {asesor.email && (
          <CardRow icon={Mail} label="Email">
            <span className="break-all">{asesor.email}</span>
          </CardRow>
        )}
        {asesor.descripcion && (
          <p className="pt-1 text-xs text-white/70">{asesor.descripcion}</p>
        )}
        {asesor.citaBiblica && (
          <div className="rounded-lg border border-white/10 bg-white/5 p-3">
            <div className="flex items-start gap-2">
              <Quote className="mt-0.5 h-4 w-4 shrink-0 text-jmv-gold" />
              <p className="text-xs italic leading-relaxed text-white/70">
                {asesor.citaBiblica}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SectionTitle({
  icon: Icon,
  children,
}: {
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
      <Icon className="h-5 w-5 text-jmv-gold" />
      {children}
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
      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-jmv-gold" />
      <div>
        <p className="text-xs uppercase tracking-wide text-white/50">{label}</p>
        <p className="font-medium text-white">{children}</p>
      </div>
    </div>
  );
}

function CardRow({
  icon: Icon,
  label,
  children,
}: {
  icon: LucideIcon;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2 text-white/80">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-jmv-gold" />
      <div className="min-w-0">
        <span className="text-white/50">{label}: </span>
        {children}
      </div>
    </div>
  );
}

function EmptyHint({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-5 text-center text-sm text-white/60">
      {children}
    </div>
  );
}
