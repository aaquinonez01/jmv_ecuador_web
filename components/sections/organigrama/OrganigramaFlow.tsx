"use client";

import { useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  type Node,
  type Edge,
  type NodeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import type { OrgEntidad } from "@/lib/data/organigrama";
import { computeLayout } from "./layout";
import OrgNode, { type OrgNodeData } from "./OrgNode";

const nodeTypes: NodeTypes = { org: OrgNode };
// Los colores salen de variables CSS del contenedor (OrganigramaInteractivo): cambian con el tema sin re-render
const EDGE_STYLE = { stroke: "var(--org-edge)", strokeWidth: 2 };
const PRO_OPTIONS = { hideAttribution: true };
const FIT_VIEW_OPTIONS = { padding: 0.12 };
const CONTROLS_CLASS =
  "!border-line-strong !bg-surface-raised !shadow-card [&_button]:!h-9 [&_button]:!w-9 [&_button]:!border-line [&_button]:!bg-surface-raised [&_button]:!fill-fg [&_button]:!text-fg [&_button:hover]:!bg-surface-2 " +
  "dark:!border-white/20 dark:!bg-jmv-ink dark:[&_button]:!border-white/10 dark:[&_button]:!bg-jmv-ink dark:[&_button]:!fill-white dark:[&_button]:!text-white dark:[&_button:hover]:!bg-white/20";

interface OrganigramaFlowProps {
  nodos: OrgEntidad[];
  onSelect: (entidad: OrgEntidad) => void;
}

// Diagrama de escritorio (se carga en diferido con next/dynamic). Los nodos son
// botones accesibles; el lienzo no es arrastrable para no robar el scroll.
export default function OrganigramaFlow({ nodos, onSelect }: OrganigramaFlowProps) {
  const { nodes, edges } = useMemo(() => {
    const positions = computeLayout(nodos);
    const rfNodes: Node<OrgNodeData>[] = nodos.map((entidad) => ({
      id: entidad.id,
      type: "org",
      position: positions[entidad.id],
      data: { entidad, onSelect },
    }));
    return { nodes: rfNodes, edges: buildEdges(nodos) };
  }, [nodos, onSelect]);

  return (
    <ReactFlow
      defaultNodes={nodes}
      defaultEdges={edges}
      nodeTypes={nodeTypes}
      fitView
      fitViewOptions={FIT_VIEW_OPTIONS}
      minZoom={0.3}
      maxZoom={1.6}
      nodesDraggable={false}
      nodesConnectable={false}
      elementsSelectable={false}
      nodesFocusable={false}
      edgesFocusable={false}
      zoomOnScroll={false}
      preventScrolling={false}
      zoomOnDoubleClick={false}
      proOptions={PRO_OPTIONS}
    >
      <Background color="var(--org-dots)" gap={28} />
      <Controls showInteractive={false} className={CONTROLS_CLASS} />
    </ReactFlow>
  );
}

// Árbol con handle superior; los grupos se encadenan (zona → grupo0 → grupo1 …)
// para apilarse en una línea vertical limpia bajo su zona.
function buildEdges(nodos: OrgEntidad[]): Edge[] {
  const edges: Edge[] = [];

  for (const nodo of nodos) {
    if (nodo.nivel === "grupo") continue;
    for (const parentId of nodo.parentIds) {
      edges.push(makeEdge(parentId, nodo.id));
    }
  }

  for (const zona of nodos.filter((n) => n.nivel === "zona")) {
    let prevId = zona.id;
    for (const grupo of nodos.filter(
      (n) => n.nivel === "grupo" && n.parentIds.includes(zona.id)
    )) {
      edges.push(makeEdge(prevId, grupo.id));
      prevId = grupo.id;
    }
  }

  return edges;
}

function makeEdge(source: string, target: string): Edge {
  return {
    id: `${source}->${target}`,
    source,
    target,
    sourceHandle: "bottom",
    targetHandle: "top",
    type: "smoothstep",
    style: EDGE_STYLE,
  };
}
