// Modelo del organigrama (organizador gráfico) de JMV Ecuador.
//
// Los datos vienen del BACKEND (DB), no son estáticos:
//   - Consejo Nacional  → /consejo-nacional/actual (miembros) + /asesores/actuales
//   - Zonas             → /zonas
//   - Grupos locales     → las "comunidades" de cada zona (/zonas las trae anidadas)
//
// Este módulo solo define los tipos y un transformador puro (`buildOrganigrama`)
// que convierte la respuesta del backend en el árbol de nodos que consume React
// Flow. No realiza fetch (eso lo hacen los server components / lib/api).

import type { ConsejoPeriod } from "@/types/consejo";

export type OrgNivel = "internacional" | "nacional" | "zona" | "grupo";

export interface OrgContacto {
  telefono?: string;
  email?: string;
}

export interface OrgEntidad {
  id: string;
  nivel: OrgNivel;
  nombre: string;
  subtitulo?: string;
  coordinador?: string;
  provincias?: string[];
  contacto?: OrgContacto;
  descripcion?: string;
  /** IDs de las entidades de las que cuelga este nodo (de las que recibe una arista). */
  parentIds: string[];
}

// --- Formas de los datos del backend que necesita el organigrama ---

/** Comunidad de una zona (equivale a un "grupo" local). */
export interface OrgComunidad {
  id: string;
  nombre: string;
  ciudad?: string | null;
  correoElectronico?: string | null;
  telefono?: string | null;
  direccion?: string | null;
}

/** Zona pastoral con sus comunidades (tal como llega de GET /api/zonas). */
export interface OrgZona {
  id: string;
  nombre: string;
  nombreCoordinador?: string | null;
  ciudades?: string[] | null;
  comunidades?: OrgComunidad[] | null;
}

export const CONSEJO_NACIONAL_ID = "consejo-nacional";

export interface BuildOrganigramaInput {
  consejo: ConsejoPeriod | null;
  zonas: OrgZona[];
}

/**
 * Transforma los datos del backend en el árbol de nodos del organigrama:
 * Consejo Nacional (raíz) → Zonas → Comunidades (grupos).
 *
 * El detalle de miembros y asesores del Consejo Nacional NO se incrusta aquí:
 * se muestra en el panel a partir de los datos en vivo (ver NodeDetailPanel).
 */
export function buildOrganigrama({
  consejo,
  zonas,
}: BuildOrganigramaInput): OrgEntidad[] {
  const nodos: OrgEntidad[] = [];

  nodos.push({
    id: CONSEJO_NACIONAL_ID,
    nivel: "nacional",
    nombre: "Consejo Nacional",
    subtitulo: consejo?.nombre ?? "JMV Ecuador",
    descripcion:
      consejo?.descripcion ??
      "Liderazgo nacional que anima y coordina la JMV en todo el Ecuador.",
    parentIds: [],
  });

  for (const zona of zonas) {
    const zonaNodeId = `zona-${zona.id}`;
    nodos.push({
      id: zonaNodeId,
      nivel: "zona",
      nombre: zona.nombre,
      coordinador: zona.nombreCoordinador ?? undefined,
      provincias: zona.ciudades ?? undefined,
      parentIds: [CONSEJO_NACIONAL_ID],
    });

    for (const com of zona.comunidades ?? []) {
      const contacto: OrgContacto = {
        telefono: com.telefono ?? undefined,
        email: com.correoElectronico ?? undefined,
      };
      const tieneContacto = Boolean(contacto.telefono || contacto.email);

      nodos.push({
        id: `grupo-${com.id}`,
        nivel: "grupo",
        nombre: com.nombre,
        subtitulo: com.ciudad ?? zona.nombre,
        contacto: tieneContacto ? contacto : undefined,
        descripcion: com.direccion ?? undefined,
        parentIds: [zonaNodeId],
      });
    }
  }

  return nodos;
}
