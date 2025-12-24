"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  rectSortingStrategy,
} from "@dnd-kit/sortable";

export interface DragDropReorderProps {
  children: React.ReactNode;
  items: Array<{ id: string }>;
  onDragEnd: (event: DragEndEvent) => void;
  strategy?: "vertical" | "grid";
}

export default function DragDropReorder({
  children,
  items,
  onDragEnd,
  strategy = "grid",
}: DragDropReorderProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px de movimiento para activar el drag
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const sortingStrategy =
    strategy === "vertical" ? verticalListSortingStrategy : rectSortingStrategy;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
    >
      <SortableContext items={items} strategy={sortingStrategy}>
        {children}
      </SortableContext>
    </DndContext>
  );
}
