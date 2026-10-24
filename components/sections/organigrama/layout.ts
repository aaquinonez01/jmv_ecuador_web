// Layout jerárquico del organigrama de escritorio (árbol de arriba hacia abajo).
// Deriva toda la estructura del array `nodos` recibido (nivel + parentIds); no
// depende de datos estáticos, así funciona con cualquier cantidad de zonas/grupos.
// En pantallas pequeñas no se usa React Flow: se muestra OrganigramaLista.

import type { OrgEntidad, OrgNivel } from "@/lib/data/organigrama";

export const NODE_WIDTH = 230;

const COLUMN_SPACING = 268;
const INTERNACIONAL_GAP = 90;
const GRUPO_START_OFFSET = 132;
const GRUPO_ROW_HEIGHT = 86;

const LEVEL_Y: Record<Exclude<OrgNivel, "grupo">, number> = {
  internacional: 0,
  nacional: 210,
  zona: 430,
};

export type Positions = Record<string, { x: number; y: number }>;

export function gruposDe(nodos: OrgEntidad[], zonaId: string): OrgEntidad[] {
  return nodos.filter(
    (n) => n.nivel === "grupo" && n.parentIds.includes(zonaId)
  );
}

export function computeLayout(nodos: OrgEntidad[]): Positions {
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
