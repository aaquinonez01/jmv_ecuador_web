"use client";

import { useRef } from "react";
import { Dialog } from "radix-ui";
import {
  X,
  Crown,
  Building,
  Map as MapIcon,
  Users,
  MapPin,
  ArrowDown,
  type LucideIcon,
} from "lucide-react";
import type { OrgEntidad, OrgNivel } from "@/lib/data/organigrama";
import ContactoLinks from "./contacto";

const NIVEL_ICON: Record<OrgNivel, LucideIcon> = {
  internacional: Crown,
  nacional: Building,
  zona: MapIcon,
  grupo: Users,
};

const NIVEL_LABEL: Record<OrgNivel, string> = {
  internacional: "Nivel internacional",
  nacional: "Nivel nacional",
  zona: "Zona pastoral",
  grupo: "Grupo local",
};

interface NodeDetailModalProps {
  entidad: OrgEntidad | null;
  onClose: () => void;
}

// Detalle de un nodo del organigrama sobre Radix Dialog: título asociado, foco
// atrapado y devuelto al nodo, Escape y clic fuera.
export default function NodeDetailModal({ entidad, onClose }: NodeDetailModalProps) {
  // Al ir al Consejo Nacional no se devuelve el foco al nodo (evita volver a subir)
  const irAlConsejo = useRef(false);

  return (
    <Dialog.Root open={Boolean(entidad)} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 motion-safe:data-[state=open]:animate-in motion-safe:data-[state=open]:fade-in-0" />
        <Dialog.Content
          {...(!entidad?.descripcion && { "aria-describedby": undefined })}
          onCloseAutoFocus={(e) => {
            if (!irAlConsejo.current) return;
            irAlConsejo.current = false;
            e.preventDefault();
            const destino = document.getElementById("consejo-nacional");
            destino?.scrollIntoView({ block: "start" });
            destino?.focus({ preventScroll: true });
          }}
          className="fixed left-1/2 top-1/2 z-50 flex max-h-[90svh] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border border-white/15 bg-jmv-ink text-white shadow-2xl motion-safe:data-[state=open]:animate-in motion-safe:data-[state=open]:fade-in-0 motion-safe:data-[state=open]:zoom-in-95"
        >
          {entidad && (
            <Contenido
              entidad={entidad}
              onIrAlConsejo={() => {
                irAlConsejo.current = true;
                onClose();
              }}
            />
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function Contenido({
  entidad,
  onIrAlConsejo,
}: {
  entidad: OrgEntidad;
  onIrAlConsejo: () => void;
}) {
  const Icon = NIVEL_ICON[entidad.nivel];
  return (
    <>
      <div className="flex items-start gap-4 border-b border-white/10 px-6 py-5">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-jmv-gold-text">
          <Icon className="h-6 w-6" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-jmv-gold-text">{NIVEL_LABEL[entidad.nivel]}</p>
          <Dialog.Title className="text-2xl font-bold text-white">{entidad.nombre}</Dialog.Title>
          {entidad.subtitulo && <p className="text-sm text-slate-300">{entidad.subtitulo}</p>}
        </div>
        <Dialog.Close
          aria-label="Cerrar"
          className="-m-1 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
        >
          <X className="h-5 w-5" aria-hidden />
        </Dialog.Close>
      </div>

      <div className="space-y-6 overflow-y-auto px-6 py-6">
        {entidad.descripcion && (
          <Dialog.Description className="leading-relaxed text-slate-200">
            {entidad.descripcion}
          </Dialog.Description>
        )}

        {entidad.coordinador && (
          <p className="flex items-start gap-3">
            <Crown className="mt-0.5 h-5 w-5 shrink-0 text-jmv-gold-text" aria-hidden />
            <span>
              <span className="block text-sm text-slate-300">Coordinación</span>
              <span className="font-medium">{entidad.coordinador}</span>
            </span>
          </p>
        )}

        {entidad.provincias && entidad.provincias.length > 0 && (
          <div>
            <h3 className="mb-3 flex items-center gap-2 font-semibold">
              <MapPin className="h-5 w-5 text-jmv-gold-text" aria-hidden />
              {entidad.nivel === "zona" ? "Ciudades" : "Provincias"}
            </h3>
            <ul className="flex flex-wrap gap-2">
              {entidad.provincias.map((p) => (
                <li key={p} className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-200">
                  {p}
                </li>
              ))}
            </ul>
          </div>
        )}

        {entidad.contacto && (
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <h3 className="mb-1 text-sm font-semibold">Contacto</h3>
            <ContactoLinks
              telefono={entidad.contacto.telefono}
              email={entidad.contacto.email}
              nombre={entidad.nombre}
              className="-mx-2"
            />
          </div>
        )}

        {entidad.nivel === "nacional" && (
          <a
            href="#consejo-nacional"
            onClick={(e) => {
              e.preventDefault();
              onIrAlConsejo();
            }}
            className="inline-flex min-h-11 items-center gap-2 font-semibold text-jmv-gold-text underline underline-offset-4 hover:text-white"
          >
            Ver miembros y asesores del Consejo Nacional
            <ArrowDown className="h-4 w-4" aria-hidden />
          </a>
        )}
      </div>
    </>
  );
}
