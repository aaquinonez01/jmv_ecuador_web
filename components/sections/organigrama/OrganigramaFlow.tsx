"use client";

import { memo, useMemo, useState, useCallback, useRef, useEffect } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type NodeMouseHandler,
  type NodeTypes,
  type ReactFlowInstance,
  type OnNodesChange,
  type OnEdgesChange,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import type { OrgEntidad } from "@/lib/data/organigrama";
import type { Asesor, ConsejoPeriod } from "@/types/consejo";
import {
  computeLayout,
  NODE_WIDTH,
  V_NODE_WIDTH,
  VERTICAL_CONTENT_WIDTH,
  type LayoutMode,
} from "./layout";
import OrgNode, { type OrgNodeData } from "./OrgNode";
import NodeDetailPanel from "./NodeDetailPanel";

const nodeTypes: NodeTypes = { org: OrgNode };
const EDGE_STYLE = { stroke: "rgba(217,143,6,0.6)", strokeWidth: 2 };
const PRO_OPTIONS = { hideAttribution: true };
const CONTROLS_CLASS =
  "!border-white/20 !bg-white/10 !backdrop-blur-md [&_button]:!border-white/10 [&_button]:!bg-white/10 [&_button]:!text-white [&_button:hover]:!bg-white/20";

interface OrganigramaFlowProps {
  nodos: OrgEntidad[];
  consejo: ConsejoPeriod | null;
  asesores: Asesor[];
}

export default function OrganigramaFlow({
  nodos: nodosData,
  consejo,
  asesores,
}: OrganigramaFlowProps) {
  const [selected, setSelected] = useState<OrgEntidad | null>(null);
  const [mode, setMode] = useState<LayoutMode>("horizontal");
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<ReactFlowInstance<
    Node<OrgNodeData>,
    Edge
  > | null>(null);

  // Modo responsive: vertical en pantallas pequeñas, horizontal en escritorio.
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const update = () => setMode(mq.matches ? "vertical" : "horizontal");
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const graph = useMemo(() => {
    const nodos = nodosData;
    const positions = computeLayout(nodos, mode);
    const byId = new Map(nodos.map((n) => [n.id, n]));
    const isVertical = mode === "vertical";
    const width = isVertical ? V_NODE_WIDTH : NODE_WIDTH;

    const rfNodes: Node<OrgNodeData>[] = nodos.map((entidad) => ({
      id: entidad.id,
      type: "org",
      position: positions[entidad.id],
      data: { entidad, width, compact: isVertical },
    }));

    const rfEdges = isVertical
      ? buildVerticalEdges(nodos)
      : buildHorizontalEdges(nodos);

    return { nodes: rfNodes, edges: rfEdges, entidadById: byId };
  }, [mode, nodosData]);

  const [nodes, setNodes, onNodesChange] = useNodesState(graph.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(graph.edges);

  // Al cambiar de modo (responsive) recalculamos nodos y aristas. Esta es la
  // ÚNICA vez que cambian los nodos: al hacer clic NO se tocan (así el diagrama
  // no se re-mide ni se mueve).
  useEffect(() => {
    setNodes(graph.nodes);
    setEdges(graph.edges);
  }, [graph, setNodes, setEdges]);

  const entidadById = graph.entidadById;

  // Ajusta la vista según el modo: en horizontal encuadra todo; en vertical
  // ancla arriba y usa un zoom que quepa a lo ancho (se navega con scroll).
  const applyView = useCallback(
    (inst: ReactFlowInstance<Node<OrgNodeData>, Edge>) => {
      if (mode === "vertical") {
        const w = containerRef.current?.clientWidth ?? 360;
        const zoom = Math.min(1, Math.max(0.45, (w - 24) / VERTICAL_CONTENT_WIDTH));
        inst.setViewport({ x: 14, y: 20, zoom });
      } else {
        inst.fitView({ padding: 0.12 });
      }
    },
    [mode]
  );

  useEffect(() => {
    const inst = instanceRef.current;
    if (!inst) return;
    const raf = requestAnimationFrame(() => applyView(inst));
    return () => cancelAnimationFrame(raf);
  }, [applyView]);

  // Al hacer clic SOLO abrimos el panel (estado local). No tocamos los nodos.
  const onNodeClick: NodeMouseHandler<Node<OrgNodeData>> = useCallback(
    (_event, node) => {
      setSelected(entidadById.get(node.id) ?? null);
    },
    [entidadById]
  );

  const onPaneClick = useCallback(() => setSelected(null), []);

  const onInit = useCallback(
    (inst: ReactFlowInstance<Node<OrgNodeData>, Edge>) => {
      instanceRef.current = inst;
      applyView(inst);
    },
    [applyView]
  );

  return (
    <div
      ref={containerRef}
      className="relative h-[82vh] min-h-[560px] w-full overflow-hidden bg-gradient-to-br from-jmv-blue-dark via-blue-900 to-jmv-blue"
    >
      {/* El lienzo está memoizado: abrir/cerrar el panel NO lo re-renderiza,
          por lo que el diagrama permanece totalmente quieto al hacer clic. */}
      <FlowCanvas
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onInit={onInit}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
      />

      <NodeDetailPanel
        entidad={selected}
        consejo={consejo}
        asesores={asesores}
        onClose={onPaneClick}
      />
    </div>
  );
}

interface FlowCanvasProps {
  nodes: Node<OrgNodeData>[];
  edges: Edge[];
  onNodesChange: OnNodesChange<Node<OrgNodeData>>;
  onEdgesChange: OnEdgesChange<Edge>;
  onInit: (inst: ReactFlowInstance<Node<OrgNodeData>, Edge>) => void;
  onNodeClick: NodeMouseHandler<Node<OrgNodeData>>;
  onPaneClick: () => void;
}

const FlowCanvas = memo(function FlowCanvas({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onInit,
  onNodeClick,
  onPaneClick,
}: FlowCanvasProps) {
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      onInit={onInit}
      onNodeClick={onNodeClick}
      onPaneClick={onPaneClick}
      minZoom={0.3}
      maxZoom={1.6}
      nodesDraggable={false}
      nodesConnectable={false}
      elementsSelectable={false}
      nodesFocusable={false}
      zoomOnScroll={false}
      preventScrolling={false}
      zoomOnDoubleClick={false}
      proOptions={PRO_OPTIONS}
    >
      <Background color="rgba(255,255,255,0.12)" gap={28} />
      <Controls showInteractive={false} className={CONTROLS_CLASS} />
    </ReactFlow>
  );
});

// Modo horizontal: árbol superior con handle TOP; los grupos se encadenan
// (zona → grupo0 → grupo1 …) para apilarse en una línea vertical limpia.
function buildHorizontalEdges(nodos: OrgEntidad[]): Edge[] {
  const edges: Edge[] = [];

  for (const nodo of nodos) {
    if (nodo.nivel === "grupo") continue;
    for (const parentId of nodo.parentIds) {
      edges.push(makeEdge(parentId, nodo.id, "top"));
    }
  }

  for (const zona of nodos.filter((n) => n.nivel === "zona")) {
    const grupos = nodos.filter(
      (n) => n.nivel === "grupo" && n.parentIds.includes(zona.id)
    );
    let prevId = zona.id;
    for (const grupo of grupos) {
      edges.push(makeEdge(prevId, grupo.id, "top"));
      prevId = grupo.id;
    }
  }

  return edges;
}

// Modo vertical: cada nodo se conecta con su padre real usando el handle
// IZQUIERDO, formando un riel de árbol indentado.
function buildVerticalEdges(nodos: OrgEntidad[]): Edge[] {
  const edges: Edge[] = [];
  for (const nodo of nodos) {
    for (const parentId of nodo.parentIds) {
      edges.push(makeEdge(parentId, nodo.id, "left"));
    }
  }
  return edges;
}

function makeEdge(source: string, target: string, targetHandle: string): Edge {
  return {
    id: `${source}->${target}`,
    source,
    target,
    sourceHandle: "bottom",
    targetHandle,
    type: "smoothstep",
    style: EDGE_STYLE,
  };
}
