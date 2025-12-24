"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, Save, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import Modal from "@/components/admin/ui/Modal";
import Button from "@/components/admin/ui/Button";
import {
  AdminImage,
  AdminImageUpdateData,
  ImageSection,
} from "@/types/admin/image";
import { mockSections } from "@/data/admin/mockSections";
import InputField from "@/components/admin/ui/InputField";
import TextareaField from "@/components/admin/ui/TextareaField";
import SelectField from "@/components/admin/ui/SelectField";
import { getActivityCategoriesAPI } from "@/actions/activity-categories/get";
import dynamic from "next/dynamic";
const DropdownSelectComp = dynamic(
  () => import("@/components/admin/ui/DropdownSelect"),
  { ssr: false }
);

interface ImageEditorProps {
  isOpen: boolean;
  onClose: () => void;
  image: AdminImage;
  onSave: (data: AdminImageUpdateData) => Promise<void>;
  onDelete: () => Promise<void>;
}

export default function ImageEditor({
  isOpen,
  onClose,
  image,
  onSave,
  onDelete,
}: ImageEditorProps) {
  const [formData, setFormData] = useState<AdminImageUpdateData>({
    title: image.title || "",
    alt: image.alt,
    description: image.description || "",
    section: image.section as string,
    subsection: image.subsection,
    activo: image.activo,
    orden: image.orden,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const sectionConfig = mockSections.find((s) => s.id === formData.section);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const subsections =
    formData.section === ImageSection.GALERIA_ACTIVIDADES
      ? categories
      : sectionConfig?.subsections || [];

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!(formData.alt ?? "").trim()) {
      newErrors.alt = "El texto alternativo es obligatorio para accesibilidad";
    }

    if ((formData.orden ?? 0) < 0) {
      newErrors.orden = "El orden debe ser un número positivo";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setIsSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Error saving image:", error);
      setErrors({ general: "Error al guardar los cambios" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "¿Estás seguro de que deseas eliminar esta imagen? Esta acción no se puede deshacer."
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      await onDelete();
      onClose();
    } catch (error) {
      console.error("Error deleting image:", error);
      setErrors({ general: "Error al eliminar la imagen" });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOrderChange = (delta: number) => {
    setFormData((prev) => ({
      ...prev,
      orden: Math.max(0, (prev.orden ?? 0) + delta),
    }));
  };

  useEffect(() => {
    (async () => {
      if (formData.section === ImageSection.GALERIA_ACTIVIDADES) {
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
  }, [formData.section]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" title="Editar Imagen">
      {/* Container con padding */}
      <div className="p-6 space-y-6">
        {/* Error General */}
        {errors.general && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {errors.general}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Columna Izquierda - Vista Previa */}
          <div className="space-y-4">
            <div className="relative w-full aspect-video bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
              <Image
                src={image.url}
                alt={formData.alt || image.alt || ""}
                fill
                className="object-contain"
              />
            </div>

            {/* Info de archivo (solo lectura) */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
              <h3 className="text-sm font-semibold text-gray-700">
                Información del Archivo
              </h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div className="text-gray-600">Nombre:</div>
                <div
                  className="text-gray-900 font-medium truncate"
                  title={image.filename}
                >
                  {image.filename}
                </div>

                <div className="text-gray-600">Dimensiones:</div>
                <div className="text-gray-900 font-medium">
                  {image.metadata?.width ?? "-"} ×{" "}
                  {image.metadata?.height ?? "-"}px
                </div>

                <div className="text-gray-600">Tamaño:</div>
                <div className="text-gray-900 font-medium">
                  {image.metadata?.size ?? "-"}
                </div>

                <div className="text-gray-600">Formato:</div>
                <div className="text-gray-900 font-medium uppercase">
                  {image.metadata?.format ?? "-"}
                </div>
              </div>
            </div>
          </div>

          {/* Columna Derecha - Formulario */}
          <div className="space-y-4">
            <InputField
              label="Título"
              value={formData.title || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Título descriptivo de la imagen"
            />

            {/* Texto Alternativo (Obligatorio) */}
            <InputField
              label="Texto Alternativo"
              value={formData.alt || ""}
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

            {/* Descripción */}
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

            {/* Sección */}
            <DropdownSelectComp
              label="Sección"
              value={formData.section as string}
              options={mockSections.map((s) => ({ id: s.id, name: s.name }))}
              onChange={(id) =>
                setFormData((prev) => ({
                  ...prev,
                  section: id as ImageSection,
                  subsection: undefined,
                }))
              }
            />

            {/* Subsección (si aplica) */}
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

            {/* Estado y Orden */}
            <div className="grid grid-cols-2 gap-4">
              {/* Estado */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado
                </label>
                <div className="flex items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        activo: !prev.activo,
                      }))
                    }
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                      formData.activo ? "bg-[#0066CC]" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform ${
                        formData.activo ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                  <span
                    className={`text-sm font-medium ${
                      formData.activo ? "text-green-600" : "text-gray-500"
                    }`}
                  >
                    {formData.activo ? "Activa" : "Inactiva"}
                  </span>
                </div>
              </div>

              {/* Orden */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Orden
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    value={formData.orden ?? 0}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 0;
                      setFormData((prev) => ({ ...prev, orden: value }));
                      if (errors.orden) {
                        setErrors((prev) => ({ ...prev, orden: "" }));
                      }
                    }}
                    className={`w-20 px-3 py-2 border rounded-lg text-center focus:ring-2 focus:ring-[#0066CC] focus:border-transparent transition-all ${
                      errors.orden ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  <div className="flex flex-col gap-0.5">
                    <button
                      type="button"
                      onClick={() => handleOrderChange(1)}
                      className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                    >
                      <ChevronUp className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOrderChange(-1)}
                      className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                    >
                      <ChevronDown className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
                {errors.orden && (
                  <p className="mt-1.5 text-sm text-red-600">{errors.orden}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Acciones - Footer */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <Button
            variant="danger"
            icon={<Trash2 />}
            onClick={handleDelete}
            disabled={isDeleting || isSaving}
          >
            {isDeleting ? "Eliminando..." : "Eliminar"}
          </Button>

          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              onClick={onClose}
              disabled={isSaving || isDeleting}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              icon={<Save />}
              onClick={handleSave}
              disabled={isSaving || isDeleting}
            >
              {isSaving ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
