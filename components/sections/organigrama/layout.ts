// Layout jerárquico del organigrama de escritorio (árbol de arriba hacia abajo).
// Deriva toda la estructura del array `nodos` recibido (nivel + parentIds); no
// depende de datos estáticos, así funciona con cualquier cantidad de zonas/grupos.
// En pantallas pequeñas no se usa React Flow: se muestra OrganigramaLista.

import type { OrgEntidad } from "@/lib/data/organigrama";

export const NODE_WIDTH = 230;

// Panel del Consejo Nacional: alturas fijas para ubicar las zonas sin medir el DOM
export const CONSEJO_COLUMNAS = 5;
export const CONSEJO_CELDA = 176;
const CONSEJO_GAP = 8;
const CONSEJO_PADDING = 16;
const CONSEJO_BORDE = 2;
const CONSEJO_CABECERA = 72;
const CONSEJO_ETIQUETA = 32;
const CONSEJO_FILA = 136;
const CONSEJO_ZONA_GAP = 110;

export const CONSEJO_WIDTH =
  CONSEJO_COLUMNAS * CONSEJO_CELDA + (CONSEJO_COLUMNAS - 1) * CONSEJO_GAP + (CONSEJO_PADDING + CONSEJO_BORDE) * 2;

export function consejoHeight(nacional: OrgEntidad): number {
  const bloque = (personas: number) =>
    personas ? CONSEJO_ETIQUETA + Math.ceil(personas / CONSEJO_COLUMNAS) * CONSEJO_FILA : 0;
  return (
    CONSEJO_CABECERA +
    bloque(nacional.miembros?.length ?? 0) +
    bloque(nacional.asesores?.length ?? 0) +
    CONSEJO_PADDING +
    CONSEJO_BORDE * 2
  );
}

const COLUMN_SPACING = 268;
const INTERNACIONAL_GAP = 90;
const GRUPO_START_OFFSET = 132;
const GRUPO_ROW_HEIGHT = 86;

const LEVEL_Y: Record<"internacional" | "nacional", number> = {
  internacional: 0,
  nacional: 210,
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
  const zonaY = LEVEL_Y.nacional + (nacional ? consejoHeight(nacional) : 0) + CONSEJO_ZONA_GAP;

  zonas.forEach((zona, i) => {
    centerX[zona.id] = i * COLUMN_SPACING;
    positions[zona.id] = { x: centerX[zona.id] - NODE_WIDTH / 2, y: zonaY };
  });

  for (const zona of zonas) {
    gruposDe(nodos, zona.id).forEach((g, j) => {
      centerX[g.id] = centerX[zona.id];
      positions[g.id] = {
        x: centerX[zona.id] - NODE_WIDTH / 2,
        y: zonaY + GRUPO_START_OFFSET + j * GRUPO_ROW_HEIGHT,
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
      x: nacionalCenter - CONSEJO_WIDTH / 2,
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
