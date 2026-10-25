"use client";

import { useCallback, useState, useSyncExternalStore, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { List, Network } from "lucide-react";
import type { OrgEntidad } from "@/lib/data/organigrama";
import NodeDetailModal from "./NodeDetailModal";

const OrganigramaFlow = dynamic(() => import("./OrganigramaFlow"), {
  ssr: false,
  loading: () => (
    <div
      role="status"
      className="flex h-full items-center justify-center"
    >
      <div className="h-24 w-64 animate-pulse rounded-2xl bg-fg/10 motion-reduce:animate-none" />
      <span className="sr-only">Cargando el organigrama…</span>
    </div>
  ),
});

const QUERY = "(min-width: 1024px)";

function subscribe(callback: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function useEsEscritorio() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}

interface Props {
  nodos: OrgEntidad[];
  /** Acordeón renderizado en el servidor (OrganigramaLista) */
  lista: ReactNode;
}

// En móvil y tablet se muestra siempre la lista. En escritorio, el diagrama de
// React Flow (cargado en diferido) con un conmutador "Ver como lista".
export default function OrganigramaInteractivo({ nodos, lista }: Props) {
  const esEscritorio = useEsEscritorio();
  const [vista, setVista] = useState<"diagrama" | "lista">("diagrama");
  const [selected, setSelected] = useState<OrgEntidad | null>(null);
  const onSelect = useCallback((entidad: OrgEntidad) => setSelected(entidad), []);
  const onClose = useCallback(() => setSelected(null), []);

  const hayDiagrama = nodos.some((n) => n.nivel === "zona");
  const mostrarDiagrama = esEscritorio && hayDiagrama && vista === "diagrama";

  const opcion = (valor: "diagrama" | "lista", label: string, Icon: typeof List) => (
    <button
      type="button"
      aria-pressed={vista === valor}
      onClick={() => setVista(valor)}
      className={`inline-flex min-h-11 items-center gap-2 rounded-lg px-4 text-sm font-semibold transition-colors ${
        vista === valor ? "bg-jmv-gold text-jmv-ink" : "text-fg hover:bg-surface-2"
      }`}
    >
      <Icon className="h-4 w-4" aria-hidden />
      {label}
    </button>
  );

  return (
    <>
      {esEscritorio && hayDiagrama && (
        <div className="mx-auto mb-6 flex max-w-7xl justify-end px-4 sm:px-6 lg:px-8">
          <div
            role="group"
            aria-label="Forma de ver el organigrama"
            className="inline-flex gap-1 rounded-xl border border-line bg-surface p-1 shadow-card dark:border-white/15 dark:bg-white/5"
          >
            {opcion("diagrama", "Ver diagrama", Network)}
            {opcion("lista", "Ver como lista", List)}
          </div>
        </div>
      )}

      {mostrarDiagrama ? (
        // Colores del lienzo de React Flow (aristas y puntos) como variables del tema
        <div
          className="relative h-[75vh] min-h-[560px] w-full border-y border-line bg-page [--org-dots:rgb(15_23_42/0.14)] [--org-edge:rgb(138_90_0/0.55)] dark:[--org-dots:rgb(255_255_255/0.12)] dark:[--org-edge:rgb(245_184_61/0.7)]">
          <OrganigramaFlow nodos={nodos} onSelect={onSelect} />
        </div>
      ) : (
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">{lista}</div>
      )}

      <NodeDetailModal entidad={selected} onClose={onClose} />
    </>
  );
}
