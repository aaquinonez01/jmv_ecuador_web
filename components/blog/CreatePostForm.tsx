"use client";

import { useState, useEffect } from "react";
import {
  Image as ImageIcon,
  Video,
  FileText,
  X,
  Plus,
  ChevronRight,
  Camera,
} from "lucide-react";
import { usePostCategories } from "@/lib/hooks/usePostCategories";

interface CreatePostFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (post: {
    title?: string;
    content: string;
    scope: string;
    activityType: string;
    subtype?: string;
    typePost: "moments" | "documents";
    attachments: File[];
  }) => Promise<void>;
}

export default function CreatePostForm({
  isOpen,
  onClose,
  onSubmit,
}: CreatePostFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [typePost, setTypePost] = useState<"moments" | "documents">("moments");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar categorías del backend con manejo dinámico de subtypes
  const {
    scopes,
    activityTypes,
    subtypes,
    scopeId,
    activityTypeId,
    subtypeId,
    setScopeId,
    setActivityTypeId,
    setSubtypeId,
  } = usePostCategories();

  // Alias para mantener compatibilidad con el formulario
  const scope = scopeId || "";
  const activityType = activityTypeId || "";
  const subtype = subtypeId || "";

  const setScope = (id: string) => setScopeId(id || undefined);
  const setActivityType = (id: string) => setActivityTypeId(id || undefined);
  const setSubtype = (id: string) => setSubtypeId(id || undefined);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar campos requeridos
    if (!content.trim() || !scope || !activityType) {
      setError("Por favor completa los campos requeridos");
      return;
    }

    // Validar que haya al menos una imagen
    if (attachments.length === 0) {
      setError("Debes agregar al menos una imagen");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit({
        title: title.trim() || undefined,
        content,
        scope,
        activityType,
        subtype: subtype || undefined,
        typePost,
        attachments,
      });

      // Reset form solo si el submit fue exitoso
      setTitle("");
      setContent("");
      setTypePost("moments");
      setScopeId(undefined);
      setActivityTypeId(undefined);
      setSubtypeId(undefined);
      setAttachments([]);
      previewUrls.forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
      setPreviewUrls([]);
      onClose();
    } catch (err: any) {
      setError(err.message || "Error al crear la publicación");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // Validar que no exceda 10 archivos en total
    if (attachments.length + files.length > 10) {
      setError(`Máximo 10 archivos permitidos. Actualmente tienes ${attachments.length} archivo(s)`);
      return;
    }

    // Filtrar solo imágenes y validar tamaño
    const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    const maxFileSize = 10 * 1024 * 1024; // 10MB
    const validFiles: File[] = [];

    for (const file of files) {
      // Validar tipo
      if (!allowedMimeTypes.includes(file.type)) {
        setError(`"${file.name}" no es un tipo de imagen válido. Solo se permiten: JPEG, PNG, WebP, GIF`);
        continue;
      }

      // Validar tamaño
      if (file.size > maxFileSize) {
        const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
        setError(`"${file.name}" (${sizeMB}MB) excede el límite de 10MB`);
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    setAttachments((prev) => [...prev, ...validFiles]);
    setError(null);

    const newPreviewUrls = validFiles.map((file) => {
      return URL.createObjectURL(file);
    });
    setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
  };

  const removeAttachment = (index: number) => {
    if (previewUrls[index]) {
      URL.revokeObjectURL(previewUrls[index]);
    }
    setAttachments((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [previewUrls]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const canSubmit = content.trim() && scope && activityType && attachments.length > 0 && !isSubmitting;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 z-[9999] pt-20 sm:pt-24 md:pt-0 md:mt-20">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[80vh] flex flex-col overflow-hidden animate-modal-in">
        {/* Header con gradiente */}
        <div className="bg-gradient-to-r from-jmv-blue to-jmv-blue-dark text-white p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold">
                Crear Nueva Publicación
              </h3>
              <p className="text-sm text-blue-100 mt-1">
                Comparte con la comunidad JMV Ecuador
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-5 sm:p-6 space-y-6">
            {/* Selector de 3 Niveles */}
            <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-xl p-5 border border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-jmv-blue text-white rounded-full flex items-center justify-center text-xs">
                  1
                </span>
                Clasificación de la Actividad
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Columna 1: Alcance */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2.5 uppercase tracking-wide">
                    Alcance
                  </label>
                  <div className="space-y-2">
                    {scopes.map((s: any) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setScope(s.id)}
                        className={`w-full p-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-3 border-2 ${
                          scope === s.id
                            ? `bg-jmv-blue text-white border-transparent shadow-lg scale-105`
                            : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:shadow-md"
                        }`}
                      >
                        <span className="text-xl">{s.icon}</span>
                        <span className="flex-1 text-left">{s.name}</span>
                        {scope === s.id && <ChevronRight className="w-4 h-4" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Columna 2: Tipo de Actividad */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2.5 uppercase tracking-wide">
                    Tipo de Actividad
                  </label>
                  {scope ? (
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                      {activityTypes.map((type: any) => (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => setActivityType(type.id)}
                          className={`w-full p-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-3 border-2 ${
                            activityType === type.id
                              ? "bg-jmv-blue text-white border-transparent shadow-lg scale-105"
                              : "bg-white text-gray-700 border-gray-200 hover:border-jmv-blue/30 hover:bg-jmv-blue/5"
                          }`}
                        >
                          <span className="text-xl">{type.icon}</span>
                          <span className="flex-1 text-left text-sm">
                            {type.name}
                          </span>
                          {activityType === type.id && (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                      <p className="text-sm text-gray-400 text-center px-4">
                        Selecciona un alcance primero
                      </p>
                    </div>
                  )}
                </div>

                {/* Columna 3: Subtipo */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2.5 uppercase tracking-wide">
                    Subtipo{" "}
                    <span className="text-gray-400 font-normal">
                      (Opcional)
                    </span>
                  </label>
                  {activityType ? (
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                      {subtypes.map((sub: any) => (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() =>
                            setSubtype(subtype === sub.id ? "" : sub.id)
                          }
                          className={`w-full p-2.5 rounded-lg font-medium transition-all duration-200 text-left text-sm border ${
                            subtype === sub.id
                              ? "bg-jmv-gold text-white border-transparent shadow-md"
                              : "bg-white text-gray-700 border-gray-200 hover:border-jmv-gold/30 hover:bg-jmv-gold/5"
                          }`}
                        >
                          {sub.name}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                      <p className="text-sm text-gray-400 text-center px-4">
                        Selecciona un tipo de actividad primero
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Preview de selección */}
              {scope && activityType && (
                <div className="mt-4 p-3 bg-white rounded-lg border border-blue-200 flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold text-gray-500">
                    Selección:
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium bg-jmv-blue text-white`}
                  >
                    {scopes.find((s: any) => s.id === scope)?.name}
                  </span>
                  <span className="text-gray-300">→</span>
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-jmv-blue text-white">
                    {
                      activityTypes.find((a: any) => a.id === activityType)
                        ?.name
                    }
                  </span>
                  {subtype && (
                    <>
                      <span className="text-gray-300">→</span>
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-jmv-gold text-white">
                        {subtypes.find((s: any) => s.id === subtype)?.name}
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Tipo de Post */}
            <div className="bg-gradient-to-br from-gray-50 to-green-50/30 rounded-xl p-5 border border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-jmv-blue text-white rounded-full flex items-center justify-center text-xs">
                  2
                </span>
                Tipo de Publicación
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setTypePost("moments")}
                  className={`p-4 rounded-xl font-medium transition-all duration-200 flex flex-col items-center gap-2 border-2 ${
                    typePost === "moments"
                      ? "bg-jmv-blue text-white border-transparent shadow-lg scale-105"
                      : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:shadow-md"
                  }`}
                >
                  <Camera className="w-6 h-6" />
                  <span>Momentos</span>
                  <span className="text-xs opacity-80">Fotos de eventos y actividades</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTypePost("documents")}
                  className={`p-4 rounded-xl font-medium transition-all duration-200 flex flex-col items-center gap-2 border-2 ${
                    typePost === "documents"
                      ? "bg-jmv-blue text-white border-transparent shadow-lg scale-105"
                      : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:shadow-md"
                  }`}
                >
                  <FileText className="w-6 h-6" />
                  <span>Documentos</span>
                  <span className="text-xs opacity-80">Guías, manuales y recursos</span>
                </button>
              </div>
            </div>

            {/* Título (opcional) */}
            <div>
              <label htmlFor="post-title" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 bg-jmv-blue text-white rounded-full flex items-center justify-center text-xs">
                  3
                </span>
                Título (Opcional)
              </label>
              <input
                id="post-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej: Retiro Juvenil 2024"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-jmv-blue focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
                maxLength={100}
              />
            </div>

            {/* Contenido */}
            <div>
              <label htmlFor="post-content" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 bg-jmv-blue text-white rounded-full flex items-center justify-center text-xs">
                  4
                </span>
                ¿Qué quieres compartir?
              </label>
              <textarea
                id="post-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Comparte tu experiencia, reflexiones o aprendizajes con la comunidad JMV..."
                className="w-full p-4 border-2 border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-jmv-blue focus:border-transparent transition-all duration-200 text-sm"
                rows={4}
                maxLength={1000}
                required
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500">
                  {content.length}/1000 caracteres
                </span>
              </div>
            </div>

            {/* Mensaje de error */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Adjuntos */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 bg-jmv-blue text-white rounded-full flex items-center justify-center text-xs">
                  5
                </span>
                Imágenes{" "}
                <span className="text-red-500 font-normal">(Requerido)</span>
                <span className="text-xs text-gray-500 font-normal ml-auto">
                  {attachments.length}/10 archivos
                </span>
              </label>

              <div className="flex flex-wrap gap-3 mb-4">
                <label className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all cursor-pointer border border-blue-200 font-medium text-sm">
                  <ImageIcon className="w-4 h-4" />
                  Agregar Imágenes
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={attachments.length >= 10}
                  />
                </label>
                <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-500 rounded-lg border border-gray-200 font-medium text-sm cursor-not-allowed opacity-60">
                  <Video className="w-4 h-4" />
                  Video (No disponible)
                </div>
                <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-500 rounded-lg border border-gray-200 font-medium text-sm cursor-not-allowed opacity-60">
                  <FileText className="w-4 h-4" />
                  Documento (No disponible)
                </div>
              </div>

              {/* Preview de archivos */}
              {attachments.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                  {attachments.map((file, index) =>
                    file.type.startsWith("image/") && previewUrls[index] ? (
                      <div
                        key={index}
                        className="relative group aspect-square rounded-lg overflow-hidden border-2 border-gray-200"
                      >
                        <img
                          src={previewUrls[index]}
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeAttachment(index)}
                          className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all shadow-lg opacity-0 group-hover:opacity-100"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : null
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Footer con botones */}
          <div className="border-t border-gray-200 p-5 sm:p-6 bg-gray-50 flex flex-col-reverse sm:flex-row justify-between items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2.5 text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full sm:w-auto bg-gradient-to-r from-jmv-blue to-jmv-blue-dark text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Publicando...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Publicar
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        @keyframes modal-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-modal-in {
          animation: modal-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
