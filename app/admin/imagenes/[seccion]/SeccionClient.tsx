"use client";

import { useState, useMemo, useEffect } from "react";
import {
  ChevronLeft,
  Plus,
  ArrowUpDown,
  Filter,
  ImagePlus,
  Save,
  X,
} from "lucide-react";
import Link from "next/link";
import ViewToggle, { ViewMode } from "@/components/admin/imagenes/ViewToggle";
import ImageGallery from "@/components/admin/imagenes/ImageGallery";
import ImageList from "@/components/admin/imagenes/ImageList";
import ImagePreview from "@/components/admin/imagenes/ImagePreview";
import ImageEditor from "@/components/admin/imagenes/ImageEditor";
import ImageUploader from "@/components/admin/imagenes/ImageUploader";
import Button from "@/components/admin/ui/Button";
import { AdminImage, AdminImageUpdateData, AdminImageFormData, ImageSection } from "@/types/admin/image";
import { useImageReorder } from "@/lib/hooks/useImageReorder";
import { useToast } from "@/lib/hooks/useToast";
import { Section } from "@/types/admin/section";
import { deleteAdminImage } from "@/actions/admin-images/delete";
import { updateAdminImage } from "@/actions/admin-images/update";
import { uploadAdminImage } from "@/actions/admin-images/upload";
import { reorderAdminImages } from "@/actions/admin-images/reorder";

interface SeccionClientProps {
  section: Section;
  sectionId: string;
  initialImages: AdminImage[];
}

export default function SeccionClient({
  section,
  sectionId,
  initialImages,
}: SeccionClientProps) {
  const toast = useToast();

  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedSubsection, setSelectedSubsection] = useState<string>("all");

  // Modal states
  const [previewImage, setPreviewImage] = useState<AdminImage | null>(null);
  const [editImage, setEditImage] = useState<AdminImage | null>(null);
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);

  // Hook para reordenamiento
  const {
    images: allImages,
    isReordering,
    setIsReordering,
    handleDragEnd,
    saveOrder: saveOrderOriginal,
    cancelReorder,
    setImages,
  } = useImageReorder(initialImages);

  const saveOrder = async () => {
    try {
      const reordered = await saveOrderOriginal();
      await reorderAdminImages(
        sectionId,
        reordered.map((img) => img.id),
        selectedSubsection === "all" ? undefined : selectedSubsection
      );
      toast.success("Orden guardado correctamente");
    } catch (error) {
      toast.error("Error al guardar el orden");
    }
  };

  // Actualizar imágenes cuando cambien las iniciales
  useEffect(() => {
    setImages(initialImages);
  }, [initialImages, setImages]);

  // Filtrar por subsección
  const filteredImages = useMemo(() => {
    if (selectedSubsection === "all") return allImages;
    return allImages.filter((img) => img.subsection === selectedSubsection);
  }, [allImages, selectedSubsection]);

  // Handlers
  const handleEdit = (image: AdminImage) => {
    setEditImage(image);
  };

  const handleDelete = async (image: AdminImage) => {
    await deleteAdminImage(image.id);
    setImages(allImages.filter((i) => i.id !== image.id));
  };

  const handlePreview = (image: AdminImage) => {
    setPreviewImage(image);
  };

  const handleUploadClick = () => {
    setIsUploaderOpen(true);
  };

  const handleSaveEdit = async (data: AdminImageUpdateData) => {
    try {
      if (!editImage) return;
      const updated = await updateAdminImage(editImage.id, data);
      setImages(
        allImages.map((i) => (i.id === updated.id ? { ...i, ...updated } : i))
      );
      toast.success("Imagen actualizada correctamente");
      setEditImage(null);
    } catch (error) {
      toast.error("Error al actualizar la imagen");
      throw error;
    }
  };

  const handleDeleteFromEditor = async () => {
    try {
      if (!editImage) return;
      await deleteAdminImage(editImage.id);
      setImages(allImages.filter((i) => i.id !== editImage.id));
      toast.success("Imagen eliminada correctamente");
      setEditImage(null);
    } catch (error) {
      toast.error("Error al eliminar la imagen");
      throw error;
    }
  };

  const handleUpload = async (data: AdminImageFormData, file: File) => {
    try {
      const created = await uploadAdminImage({
        ...data,
        section: sectionId,
        subsection:
          selectedSubsection === "all" ? data.subsection : selectedSubsection,
        file,
      });
      setImages([...allImages, created]);
      toast.success("Imagen subida correctamente");
      setIsUploaderOpen(false);
    } catch (error) {
      toast.error("Error al subir la imagen");
      throw error;
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link
            href="/admin/imagenes"
            className="inline-flex items-center gap-2 text-[#0066CC] hover:text-[#004C99] mb-3 group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Volver a Secciones</span>
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-[#0066CC]/10 to-[#004C99]/10 rounded-2xl text-3xl">
              {section.icon}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {section.name}
              </h1>
              <p className="text-gray-600 mt-1">{section.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-3 ml-14">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-[#0066CC]">
                {filteredImages.length}
              </span>
              <span className="text-sm text-gray-500">
                de {section.totalImages} imágenes
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white rounded-xl border-2 border-gray-200 p-4">
        <div className="flex flex-wrap items-center gap-3">
          {!isReordering ? (
            <>
              <Button
                variant="primary"
                icon={<ImagePlus className="w-5 h-5" />}
                size="md"
                onClick={handleUploadClick}
              >
                Subir Imagen
              </Button>
              <Button
                variant="secondary"
                icon={<ArrowUpDown className="w-4 h-4" />}
                size="md"
                onClick={() => setIsReordering(true)}
              >
                Reordenar
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="primary"
                icon={<Save className="w-4 h-4" />}
                size="md"
                onClick={saveOrder}
              >
                Guardar Orden
              </Button>
              <Button
                variant="danger"
                icon={<X className="w-4 h-4" />}
                size="md"
                onClick={cancelReorder}
              >
                Cancelar
              </Button>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Subsection Filter */}
          {section.hasSubsections && section.subsections && (
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={selectedSubsection}
                onChange={(e) => setSelectedSubsection(e.target.value)}
                className="px-3 py-2 bg-white border-2 border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:border-[#0066CC] focus:ring-2 focus:ring-[#0066CC]/20 outline-none transition-all"
              >
                <option value="all">Todas las subsecciones</option>
                {section.subsections.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <ViewToggle view={viewMode} onViewChange={setViewMode} />
        </div>
      </div>

      {/* Images Grid/List */}
      {isReordering && (
        <div className="bg-gradient-to-r from-[#0066CC]/10 to-[#004C99]/10 border-2 border-[#0066CC]/30 rounded-xl p-4 flex items-center gap-3">
          <ArrowUpDown className="w-5 h-5 text-[#0066CC]" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">
              Modo Reordenamiento Activo
            </p>
            <p className="text-xs text-gray-600">
              Arrastra las imágenes para cambiar su orden. Haz clic en "Guardar
              Orden" cuando termines.
            </p>
          </div>
        </div>
      )}

      {viewMode === "grid" ? (
        <ImageGallery
          images={filteredImages}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onPreview={handlePreview}
          isReordering={isReordering}
          onDragEnd={handleDragEnd}
        />
      ) : (
        <ImageList
          images={filteredImages}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onPreview={handlePreview}
          isReordering={isReordering}
          onDragEnd={handleDragEnd}
        />
      )}

      {/* Placeholder para imágenes faltantes */}
      {filteredImages.length < section.totalImages && (
        <div className="bg-gradient-to-r from-[#0066CC]/5 to-[#004C99]/5 rounded-xl border-2 border-dashed border-[#0066CC]/30 p-8 text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Plus className="w-8 h-8 text-[#0066CC]" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Faltan{" "}
            {section.totalImages -
              filteredImages.length}{" "}
            imágenes por subir
          </h3>
          <p className="text-gray-600 mb-4">
            Completa esta sección subiendo las imágenes restantes
          </p>
          <Button variant="primary" icon={<ImagePlus className="w-5 h-5" />} onClick={handleUploadClick}>
            Subir Imágenes
          </Button>
        </div>
      )}

      {/* Modals */}
      {previewImage && (
        <ImagePreview
          isOpen={true}
          onClose={() => setPreviewImage(null)}
          image={previewImage}
        />
      )}

      {editImage && (
        <ImageEditor
          isOpen={true}
          onClose={() => setEditImage(null)}
          image={editImage}
          onSave={handleSaveEdit}
          onDelete={handleDeleteFromEditor}
        />
      )}

      <ImageUploader
        isOpen={isUploaderOpen}
        onClose={() => setIsUploaderOpen(false)}
        section={sectionId as ImageSection}
        subsection={selectedSubsection === "all" ? undefined : selectedSubsection}
        onUpload={handleUpload}
      />
    </div>
  );
}
