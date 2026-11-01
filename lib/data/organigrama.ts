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

import type { Asesor, ConsejoMember, ConsejoPeriod } from "@/types/consejo";

export type OrgNivel = "internacional" | "nacional" | "zona" | "grupo";

export interface OrgContacto {
  telefono?: string;
  email?: string;
}

/** Miembro o asesor del Consejo Nacional, tal como se muestra en el organigrama. */
export interface OrgPersona {
  id: string;
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

export interface OrgEntidad {
  id: string;
  nivel: OrgNivel;
  nombre: string;
  subtitulo?: string;
  coordinador?: string;
  provincias?: string[];
  contacto?: OrgContacto;
  descripcion?: string;
  /** Solo en el Consejo Nacional: quienes lo integran */
  miembros?: OrgPersona[];
  asesores?: OrgPersona[];
  /** Entidad sintética para abrir la ficha de una persona en el modal */
  persona?: OrgPersona;
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

function toPersona(p: ConsejoMember | Asesor): OrgPersona {
  return {
    id: p.id,
    nombre: p.nombre,
    cargo: p.cargo,
    imageUrl: p.imageUrl,
    comunidad: p.comunidad,
    santoFavorito: p.santoFavorito,
    citaBiblica: p.citaBiblica,
    descripcion: p.descripcion,
    email: p.email,
    telefono: p.telefono,
  };
}

export interface BuildOrganigramaInput {
  consejo: ConsejoPeriod | null;
  asesores: Asesor[];
  zonas: OrgZona[];
}

/**
 * Transforma los datos del backend en el árbol de nodos del organigrama:
 * Consejo Nacional (raíz, con sus miembros y asesores) → Zonas → Comunidades (grupos).
 */
export function buildOrganigrama({
  consejo,
  asesores,
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
    miembros: sortMembers((consejo?.miembros ?? []).filter((m) => m.active !== false)).map(toPersona),
    asesores: asesores.filter((a) => a.active).map(toPersona),
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
