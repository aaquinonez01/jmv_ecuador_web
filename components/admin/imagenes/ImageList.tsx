"use client";

import { AdminImage } from "@/types/admin/image";
import ImageRow from "./ImageRow";
import SortableImageRow from "./SortableImageRow";
import DragDropReorder from "./DragDropReorder";
import { DragEndEvent } from "@dnd-kit/core";

export interface ImageListProps {
  images: AdminImage[];
  onEdit: (image: AdminImage) => void;
  onDelete: (image: AdminImage) => void;
  onPreview: (image: AdminImage) => void;
  isReordering?: boolean;
  onDragEnd?: (event: DragEndEvent) => void;
}

export default function ImageList({
  images,
  onEdit,
  onDelete,
  onPreview,
  isReordering = false,
  onDragEnd,
}: ImageListProps) {
  if (images.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-4xl opacity-50">📷</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No hay imágenes en esta sección
        </h3>
        <p className="text-gray-600">
          Comienza subiendo tu primera imagen
        </p>
      </div>
    );
  }

  const content = (
    <div className="space-y-3">
      {images.map((image) =>
        isReordering ? (
          <SortableImageRow
            key={image.id}
            image={image}
            onEdit={onEdit}
            onDelete={onDelete}
            onPreview={onPreview}
          />
        ) : (
          <ImageRow
            key={image.id}
            image={image}
            onEdit={onEdit}
            onDelete={onDelete}
            onPreview={onPreview}
          />
        )
      )}
    </div>
  );

  if (isReordering && onDragEnd) {
    return (
      <DragDropReorder
        items={images}
        onDragEnd={onDragEnd}
        strategy="vertical"
      >
        {content}
      </DragDropReorder>
    );
  }

  return content;
}
