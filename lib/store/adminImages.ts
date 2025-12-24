import { create } from "zustand";
import { AdminImage } from "@/types/admin/image";
import { Section } from "@/types/admin/section";

interface AdminImagesStore {
  // State
  sections: Section[];
  images: Map<string, AdminImage[]>;
  loading: boolean;
  error: string | null;

  // Actions
  setSections: (sections: Section[]) => void;
  setImages: (sectionId: string, images: AdminImage[]) => void;
  loadImages: (sectionId: string) => void;
  addImage: (sectionId: string, image: AdminImage) => void;
  updateImage: (imageId: string, updates: Partial<AdminImage>) => void;
  deleteImage: (imageId: string) => void;
  reorderImages: (sectionId: string, newOrder: string[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAdminImagesStore = create<AdminImagesStore>((set, get) => ({
  // Initial state
  sections: [],
  images: new Map(),
  loading: false,
  error: null,

  // Actions
  setSections: (sections) => set({ sections }),

  setImages: (sectionId, images) =>
    set((state) => {
      const newImages = new Map(state.images);
      newImages.set(sectionId, images);
      return { images: newImages };
    }),

  loadImages: (sectionId) => {
    // TODO: En fase futura, cargar desde API
    // Por ahora, trabajamos con mock data
    console.log("Loading images for section:", sectionId);
  },

  addImage: (sectionId, image) =>
    set((state) => {
      const newImages = new Map(state.images);
      const currentImages = newImages.get(sectionId) || [];
      newImages.set(sectionId, [...currentImages, image]);
      return { images: newImages };
    }),

  updateImage: (imageId, updates) =>
    set((state) => {
      const newImages = new Map(state.images);

      // Encontrar y actualizar la imagen en la sección correcta
      for (const [sectionId, sectionImages] of newImages.entries()) {
        const imageIndex = sectionImages.findIndex((img) => img.id === imageId);
        if (imageIndex !== -1) {
          const updatedSectionImages = [...sectionImages];
          updatedSectionImages[imageIndex] = {
            ...updatedSectionImages[imageIndex],
            ...updates,
          };
          newImages.set(sectionId, updatedSectionImages);
          break;
        }
      }

      return { images: newImages };
    }),

  deleteImage: (imageId) =>
    set((state) => {
      const newImages = new Map(state.images);

      // Encontrar y eliminar la imagen de la sección correcta
      for (const [sectionId, sectionImages] of newImages.entries()) {
        const filteredImages = sectionImages.filter((img) => img.id !== imageId);
        if (filteredImages.length !== sectionImages.length) {
          newImages.set(sectionId, filteredImages);
          break;
        }
      }

      return { images: newImages };
    }),

  reorderImages: (sectionId, newOrder) =>
    set((state) => {
      const newImages = new Map(state.images);
      const currentImages = newImages.get(sectionId) || [];

      // Reordenar imágenes según el nuevo orden
      const reorderedImages = newOrder
        .map((id) => currentImages.find((img) => img.id === id))
        .filter((img): img is AdminImage => img !== undefined)
        .map((img, index) => ({ ...img, orden: index + 1 }));

      newImages.set(sectionId, reorderedImages);
      return { images: newImages };
    }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),
}));
