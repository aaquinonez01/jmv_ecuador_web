"use client";

import Image from "next/image";
import { AdminImage } from "@/types/admin/image";
import { Edit2, Trash2, Eye, GripVertical } from "lucide-react";

export interface ImageRowProps {
  image: AdminImage;
  onEdit: (image: AdminImage) => void;
  onDelete: (image: AdminImage) => void;
  onPreview: (image: AdminImage) => void;
  isDragging?: boolean;
}

export default function ImageRow({
  image,
  onEdit,
  onDelete,
  onPreview,
  isDragging = false,
}: ImageRowProps) {
  return (
    <div
      className={`bg-white rounded-xl border-2 border-gray-200 p-4 hover:border-[#0066CC] hover:shadow-md transition-all ${
        isDragging ? "opacity-50 scale-95" : ""
      }`}
    >
      <div className="flex items-center gap-4">
        {/* Drag Handle */}
        <div className="flex-shrink-0 cursor-move hover:text-[#0066CC] transition-colors">
          <GripVertical className="w-5 h-5 text-gray-400" />
        </div>

        {/* Image Thumbnail */}
        <div className="relative w-24 h-16 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
          {image.url ? (
            <Image
              src={image.url}
              alt={image.alt}
              fill
              className="object-cover"
              sizes="96px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-2xl opacity-20">📷</span>
            </div>
          )}
        </div>

        {/* Image Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 truncate mb-1">
            {image.title || image.filename}
          </h4>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            {image.subsection && (
              <span>
                <span className="font-medium">{image.subsection}</span>
              </span>
            )}
            <span>{(image.metadata.size / 1024 / 1024).toFixed(2)} MB</span>
            <span>
              {image.metadata.width} × {image.metadata.height}
            </span>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex-shrink-0">
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full ${
              image.activo
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {image.activo ? "Activa" : "Inactiva"}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => onPreview(image)}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Vista previa"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(image)}
            className="p-2 text-[#0066CC] hover:bg-[#0066CC]/10 rounded-lg transition-colors"
            aria-label="Editar"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(image)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            aria-label="Eliminar"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
