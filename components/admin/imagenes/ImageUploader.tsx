"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { Upload, X, ImagePlus, FileImage, AlertCircle } from "lucide-react";
import Modal from "@/components/admin/ui/Modal";
import Button from "@/components/admin/ui/Button";
import InputField from "@/components/admin/ui/InputField";
import TextareaField from "@/components/admin/ui/TextareaField";
import SelectField from "@/components/admin/ui/SelectField";
import dynamic from "next/dynamic";
const DropdownSelectComp = dynamic(
  () => import("@/components/admin/ui/DropdownSelect"),
  { ssr: false }
);
import { AdminImageFormData, ImageSection } from "@/types/admin/image";
import { mockSections } from "@/data/admin/mockSections";
import { getActivityCategoriesAPI } from "@/actions/activity-categories/get";

interface ImageUploaderProps {
  isOpen: boolean;
  onClose: () => void;
  section: ImageSection;
  subsection?: string;
  onUpload: (data: AdminImageFormData, file: File) => Promise<void>;
}

interface FilePreview {
  file: File;
  preview: string;
  width: number;
  height: number;
  size: string;
}

export default function ImageUploader({
  isOpen,
  onClose,
  section,
  subsection,
  onUpload,
}: ImageUploaderProps) {
  const [filePreviews, setFilePreviews] = useState<FilePreview[]>([]);
  const [formData, setFormData] = useState<Omit<AdminImageFormData, "file">>({
    title: "",
    alt: "",
    description: "",
    section,
    subsection,
  });
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [batchId, setBatchId] = useState<string | null>(null);

  const sectionConfig = mockSections.find((s) => s.id === section);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const subsections =
    section === ImageSection.GALERIA_ACTIVIDADES
      ? categories
      : sectionConfig?.subsections || [];

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  useEffect(() => {
    (async () => {
      if (section === ImageSection.GALERIA_ACTIVIDADES) {
        try {
          const list = await getActivityCategoriesAPI();
          setCategories(
            list
              .filter((c) => c.active)
              .map((c) => ({ id: c.slug, name: c.name }))
          );
        } catch {
          setCategories([]);
        }
      } else {
        setCategories([]);
      }
    })();
  }, [section]);

  const handleFileSelect = useCallback(
    (file: File) => {
      // Validar tipo de archivo
      if (!file.type.startsWith("image/")) {
        setErrors({ file: "Por favor selecciona un archivo de imagen válido" });
        return;
      }

      // Limpiar errores
      setErrors({});

      // Crear preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new window.Image();
        img.onload = () => {
          if (!batchId) {
            const id = `album-${Date.now()}-${Math.random()
              .toString(36)
              .slice(2, 8)}`;
            setBatchId(id);
          }
          setFilePreviews((prev) => [
            ...prev,
            {
              file,
              preview: e.target?.result as string,
              width: img.width,
              height: img.height,
              size: formatFileSize(file.size),
            },
          ]);

          // Auto-generar alt text basado en el nombre del archivo si está vacío
          if (!formData.alt) {
            const altFromFileName = file.name
              .replace(/\.[^/.]+$/, "")
              .replace(/[-_]/g, " ")
              .replace(/\b\w/g, (char) => char.toUpperCase());

            setFormData((prev) => ({ ...prev, alt: altFromFileName }));
          }
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    },
    [formData.alt]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files || []);
      files.forEach((f) => handleFileSelect(f));
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((f) => handleFileSelect(f));
  };

  const handleRemoveFile = () => {
    setFilePreviews([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!filePreviews.length) {
      newErrors.file = "Debes seleccionar una imagen";
    }

    if (!formData.alt.trim()) {
      newErrors.alt = "El texto alternativo es obligatorio para accesibilidad";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpload = async () => {
    if (!validate() || !filePreviews.length) return;

    setIsUploading(true);
    try {
      const pickPreset = (sec: ImageSection) => {
        if (sec === ImageSection.HERO_BACKGROUNDS)
          return { maxW: 2560, maxH: 1440, mime: "image/webp", quality: 0.85 };
        if (sec === ImageSection.GALERIA_ACTIVIDADES)
          return { maxW: 1600, maxH: 1200, mime: "image/webp", quality: 0.8 };
        if (sec === ImageSection.PROXIMAS_ACTIVIDADES)
          return { maxW: 1920, maxH: 1080, mime: "image/webp", quality: 0.85 };
        return { maxW: 1600, maxH: 1200, mime: "image/webp", quality: 0.8 };
      };
      const preset = pickPreset(formData.section as ImageSection);

      for (const fp of filePreviews) {
        const original = fp.file;
        let fileToSend = original;

        const needsCompress =
          original.size > 10 * 1024 * 1024 ||
          fp.width > preset.maxW ||
          fp.height > preset.maxH;

        if (
          needsCompress &&
          original.type.startsWith("image/") &&
          original.type !== "image/gif"
        ) {
          const bitmap = await createImageBitmap(original);
          const canvas = document.createElement("canvas");
          const ratio = Math.min(
            preset.maxW / bitmap.width,
            preset.maxH / bitmap.height,
            1
          );
          canvas.width = Math.max(1, Math.floor(bitmap.width * ratio));
          canvas.height = Math.max(1, Math.floor(bitmap.height * ratio));
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
            const blob: Blob | null = await new Promise((resolve) =>
              canvas.toBlob(
                resolve,
                original.type === "image/png" ? "image/png" : preset.mime,
                original.type === "image/png" ? undefined : preset.quality
              )
            );
            if (blob) {
              fileToSend = new File(
                [blob],
                original.name.replace(/\.[^/.]+$/, "") + ".webp",
                {
                  type: (original.type === "image/png"
                    ? "image/png"
                    : preset.mime) as any,
                }
              );
            }
          }
        }

        const uploadData: AdminImageFormData = {
          ...formData,
          alt:
            formData.alt ||
            original.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
          file: fileToSend,
          groupId: batchId || undefined,
        };

        await onUpload(uploadData, fileToSend);
      }

      // Reset form
      setFilePreviews([]);
      setBatchId(null);
      setFormData({
        title: "",
        alt: "",
        description: "",
        section,
        subsection,
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      onClose();
    } catch (error) {
      console.error("Error uploading image:", error);
      setErrors({
        general: "Error al subir la imagen. Por favor intenta de nuevo.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    if (!isUploading) {
      handleRemoveFile();
      setFormData({
        title: "",
        alt: "",
        description: "",
        section,
        subsection,
      });
      setErrors({});
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="xl"
      title="Subir Nueva Imagen"
    >
      {/* Container con padding */}
      <div className="p-6 space-y-6">
        {/* Error General */}
        {errors.general && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{errors.general}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Columna Izquierda - Selección de Archivo */}
          <div className="space-y-4">
            {filePreviews.length === 0 ? (
              <div>
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={`relative border-2 border-dashed rounded-xl p-10 text-center transition-all cursor-pointer ${
                    isDragging
                      ? "border-[#0066CC] bg-[#0066CC]/5 scale-[1.02]"
                      : errors.file
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300 bg-gray-50 hover:border-[#0066CC] hover:bg-[#0066CC]/5"
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    className="hidden"
                    multiple
                  />

                  <div className="flex flex-col items-center gap-4">
                    <div className="p-4 bg-white rounded-full shadow-sm border border-gray-200">
                      <ImagePlus className="w-10 h-10 text-[#0066CC]" />
                    </div>

                    <div className="space-y-2">
                      <p className="text-lg font-semibold text-gray-900">
                        Arrastra una imagen aquí
                      </p>
                      <p className="text-sm text-gray-500">
                        o haz clic para seleccionar
                      </p>
                    </div>

                    <div className="text-xs text-gray-500 font-medium">
                      JPG, PNG, WebP • Se optimiza automáticamente
                    </div>
                  </div>
                </div>
                {errors.file && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {errors.file}
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {/* Vista Previa */}
                <div className="relative w-full aspect-video bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                  <Image
                    src={filePreviews[0].preview}
                    alt="Vista previa"
                    fill
                    className="object-contain"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="absolute top-3 right-3 p-2 bg-white/95 hover:bg-white rounded-lg shadow-lg transition-all hover:scale-105"
                  >
                    <X className="w-5 h-5 text-gray-700" />
                  </button>
                </div>

                {/* Info del Archivo */}
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2 text-[#0066CC]">
                    <FileImage className="w-5 h-5" />
                    <h3 className="text-sm font-semibold">
                      Archivos Seleccionados
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div className="text-gray-600">Cantidad:</div>
                    <div className="text-gray-900 font-medium">
                      {filePreviews.length}
                    </div>

                    <div className="text-gray-600">Dimensiones:</div>
                    <div className="text-gray-900 font-medium">
                      {filePreviews[0].width} × {filePreviews[0].height}px
                    </div>

                    <div className="text-gray-600">Tamaño:</div>
                    <div className="text-gray-900 font-medium">
                      {filePreviews[0].size}
                    </div>

                    <div className="text-gray-600">Formato:</div>
                    <div className="text-gray-900 font-medium uppercase">
                      {filePreviews[0].file.type.split("/")[1]}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Columna Derecha - Metadatos */}
          <div className="space-y-4">
            <InputField
              label="Título"
              value={formData.title || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Título descriptivo de la imagen"
            />

            <InputField
              label="Texto Alternativo"
              value={formData.alt}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, alt: e.target.value }));
                if (errors.alt) {
                  setErrors((prev) => ({ ...prev, alt: "" }));
                }
              }}
              placeholder="Descripción para accesibilidad"
              error={errors.alt}
              required
            />

            <TextareaField
              label="Descripción"
              value={formData.description || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              rows={3}
              placeholder="Descripción adicional (opcional)"
            />

            <DropdownSelectComp
              label="Sección"
              value={formData.section}
              options={mockSections.map((s) => ({ id: s.id, name: s.name }))}
              onChange={(id) =>
                setFormData((prev) => ({
                  ...prev,
                  section: id as ImageSection,
                  subsection: undefined,
                }))
              }
            />

            {subsections.length > 0 && (
              <DropdownSelectComp
                label={
                  formData.section === ImageSection.GALERIA_ACTIVIDADES
                    ? "Categoría"
                    : "Subsección"
                }
                value={formData.subsection || ""}
                options={[{ id: "", name: "Sin subsección" }, ...subsections]}
                onChange={(id) =>
                  setFormData((prev) => ({
                    ...prev,
                    subsection: id || undefined,
                  }))
                }
              />
            )}
          </div>
        </div>

        {/* Acciones - Footer */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
          <Button
            variant="secondary"
            onClick={handleClose}
            disabled={isUploading}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            icon={<Upload />}
            onClick={handleUpload}
            disabled={isUploading || !filePreviews.length}
          >
            {isUploading ? "Subiendo..." : "Subir Imagen"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
