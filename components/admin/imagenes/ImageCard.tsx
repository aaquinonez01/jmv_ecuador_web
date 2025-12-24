"use client";

import Image from "next/image";
import { AdminImage } from "@/types/admin/image";
import { Edit2, Trash2, Eye, GripVertical } from "lucide-react";

export interface ImageCardProps {
  image: AdminImage;
  onEdit: (image: AdminImage) => void;
  onDelete: (image: AdminImage) => void;
  onPreview: (image: AdminImage) => void;
  isDragging?: boolean;
}

export default function ImageCard({
  image,
  onEdit,
  onDelete,
  onPreview,
  isDragging = false,
}: ImageCardProps) {
  return (
    <div
      className={`bg-white rounded-2xl border-2 border-gray-200 overflow-hidden group hover:border-[#0066CC] hover:shadow-lg transition-all ${
        isDragging ? "opacity-50 scale-95" : ""
      }`}
    >
      {/* Drag Handle */}
      <div className="flex items-center justify-center py-2 bg-gray-50 border-b border-gray-200 cursor-move hover:bg-gray-100 transition-colors">
        <GripVertical className="w-5 h-5 text-gray-400" />
      </div>

      {/* Image Preview */}
      <div className="relative aspect-video bg-gray-100">
        {image.url ? (
          <Image
            src={image.url}
            alt={image.alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl opacity-20">📷</span>
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-2 right-2">
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full ${
              image.activo
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {image.activo ? "Activa" : "Inactiva"}
          </span>
        </div>

        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            onClick={() => onPreview(image)}
            className="p-2.5 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Vista previa"
          >
            <Eye className="w-5 h-5" />
          </button>
          <button
            onClick={() => onEdit(image)}
            className="p-2.5 bg-white text-[#0066CC] rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Editar"
          >
            <Edit2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete(image)}
            className="p-2.5 bg-white text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            aria-label="Eliminar"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Image Info */}
      <div className="p-4">
        <h4 className="font-semibold text-gray-900 mb-1 truncate">
          {image.title || image.filename}
        </h4>
        {image.subsection && (
          <p className="text-xs text-gray-500 mb-2">
            Subsección: <span className="font-medium">{image.subsection}</span>
          </p>
        )}
        <p className="text-xs text-gray-600 truncate">{image.alt}</p>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-500">
            {(image.metadata.size / 1024 / 1024).toFixed(2)} MB
          </span>
          <span className="text-xs text-gray-500">
            {image.metadata.width} × {image.metadata.height}
          </span>
        </div>
      </div>
    </div>
  );
}
