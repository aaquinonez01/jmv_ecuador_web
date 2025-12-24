import { useState } from "react";
import { AdminImage } from "@/types/admin/image";
import { arrayMove } from "@dnd-kit/sortable";

export function useImageReorder(initialImages: AdminImage[]) {
  const [images, setImages] = useState<AdminImage[]>(initialImages);
  const [isReordering, setIsReordering] = useState(false);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    setImages((items) => {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      const reordered = arrayMove(items, oldIndex, newIndex);

      // Actualizar el campo 'orden' de cada imagen
      return reordered.map((item, index) => ({
        ...item,
        orden: index + 1,
      }));
    });
  };

  const saveOrder = () => {
    // TODO: Aquí se enviaría al backend el nuevo orden
    console.log("Guardando nuevo orden:", images.map((img) => img.id));
    setIsReordering(false);
    // Retornar las imágenes reordenadas para actualizar el estado padre
    return images;
  };

  const cancelReorder = () => {
    // Restaurar orden original
    setImages(initialImages);
    setIsReordering(false);
  };

  return {
    images,
    isReordering,
    setIsReordering,
    handleDragEnd,
    saveOrder,
    cancelReorder,
    setImages, // Para actualizar cuando cambien las imágenes iniciales
  };
}
