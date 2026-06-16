// Layout jerárquico para el organigrama, con dos modos responsive. Deriva toda
// la estructura del array `nodos` recibido (nivel + parentIds); no depende de
// datos estáticos, así funciona con cualquier cantidad de zonas/grupos del backend.
//
// - "horizontal" (computadora): árbol clásico de arriba→abajo. Las zonas se
//   reparten en columnas y sus grupos se apilan verticalmente bajo cada zona.
// - "vertical" (móvil/tablet): árbol indentado tipo "lista" (outline). Cada nodo
//   ocupa su propia fila y se conecta con su padre mediante un riel a la
//   izquierda. Es angosto y se navega con scroll vertical.

import type { OrgEntidad, OrgNivel } from "@/lib/data/organigrama";

export type LayoutMode = "horizontal" | "vertical";

export const NODE_WIDTH = 230;
export const NODE_HEIGHT = 72;

// --- Modo horizontal (desktop) ---
const COLUMN_SPACING = 268;
const INTERNACIONAL_GAP = 90;
const GRUPO_START_OFFSET = 132;
const GRUPO_ROW_HEIGHT = 86;

const LEVEL_Y: Record<Exclude<OrgNivel, "grupo">, number> = {
  internacional: 0,
  nacional: 210,
  zona: 430,
};

// --- Modo vertical (móvil) ---
export const V_NODE_WIDTH = 190;
const V_INDENT = 108;
const V_ROW_HEIGHT = 82;
const V_DEPTH: Record<OrgNivel, number> = {
  internacional: 0,
  nacional: 1,
  zona: 2,
  grupo: 3,
};
/** Ancho total del árbol vertical (para encajar el zoom en móvil). */
export const VERTICAL_CONTENT_WIDTH = 3 * V_INDENT + V_NODE_WIDTH;

export type Positions = Record<string, { x: number; y: number }>;

function gruposDe(nodos: OrgEntidad[], zonaId: string): OrgEntidad[] {
  return nodos.filter(
    (n) => n.nivel === "grupo" && n.parentIds.includes(zonaId)
  );
}

export function computeLayout(
  nodos: OrgEntidad[],
  mode: LayoutMode
): Positions {
  return mode === "vertical"
    ? computeVerticalLayout(nodos)
    : computeHorizontalLayout(nodos);
}

function computeHorizontalLayout(nodos: OrgEntidad[]): Positions {
  const centerX: Record<string, number> = {};
  const positions: Positions = {};

  const zonas = nodos.filter((n) => n.nivel === "zona");
  const internacionales = nodos.filter((n) => n.nivel === "internacional");
  const nacional = nodos.find((n) => n.nivel === "nacional");

  zonas.forEach((zona, i) => {
    centerX[zona.id] = i * COLUMN_SPACING;
    positions[zona.id] = { x: centerX[zona.id] - NODE_WIDTH / 2, y: LEVEL_Y.zona };
  });

  for (const zona of zonas) {
    gruposDe(nodos, zona.id).forEach((g, j) => {
      centerX[g.id] = centerX[zona.id];
      positions[g.id] = {
        x: centerX[zona.id] - NODE_WIDTH / 2,
        y: LEVEL_Y.zona + GRUPO_START_OFFSET + j * GRUPO_ROW_HEIGHT,
      };
    });
  }

  const zonaCenters = zonas.map((z) => centerX[z.id] ?? 0);
  const nacionalCenter = zonaCenters.length
    ? zonaCenters.reduce((a, b) => a + b, 0) / zonaCenters.length
    : 0;

  if (nacional) {
    centerX[nacional.id] = nacionalCenter;
    positions[nacional.id] = {
      x: nacionalCenter - NODE_WIDTH / 2,
      y: LEVEL_Y.nacional,
    };
  }

  // Fila internacional (0, 1 o varios nodos) centrada sobre el Consejo Nacional.
  const n = internacionales.length;
  if (n > 0) {
    const totalWidth = n * NODE_WIDTH + (n - 1) * INTERNACIONAL_GAP;
    const startCenter = nacionalCenter - totalWidth / 2 + NODE_WIDTH / 2;
    internacionales.forEach((ent, i) => {
      const cx = startCenter + i * (NODE_WIDTH + INTERNACIONAL_GAP);
      positions[ent.id] = { x: cx - NODE_WIDTH / 2, y: LEVEL_Y.internacional };
    });
  }

  return positions;
}

function computeVerticalLayout(nodos: OrgEntidad[]): Positions {
  const positions: Positions = {};
  let row = 0;

  const place = (entidad: OrgEntidad) => {
    positions[entidad.id] = {
      x: V_DEPTH[entidad.nivel] * V_INDENT,
      y: row * V_ROW_HEIGHT,
    };
    row += 1;
  };

  for (const ent of nodos.filter((n) => n.nivel === "internacional")) place(ent);
  const nacional = nodos.find((n) => n.nivel === "nacional");
  if (nacional) place(nacional);
  for (const zona of nodos.filter((n) => n.nivel === "zona")) {
    place(zona);
    for (const grupo of gruposDe(nodos, zona.id)) place(grupo);
  }

  return positions;
}
