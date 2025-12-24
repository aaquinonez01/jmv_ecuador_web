"use client";

import Image from "next/image";
import Modal from "@/components/admin/ui/Modal";
import { AdminImage } from "@/types/admin/image";
import { Download, ExternalLink } from "lucide-react";
import Button from "@/components/admin/ui/Button";

export interface ImagePreviewProps {
  isOpen: boolean;
  onClose: () => void;
  image: AdminImage | null;
}

export default function ImagePreview({
  isOpen,
  onClose,
  image,
}: ImagePreviewProps) {
  if (!image) return null;

  const handleDownload = () => {
    // TODO: Implementar descarga
    console.log("Downloading image:", image.filename);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" title="Vista Previa">
      <div className="p-6">
        {/* Image Preview */}
        <div className="relative w-full aspect-video bg-gray-100 rounded-xl overflow-hidden mb-6">
          <Image
            src={image.url}
            alt={image.alt}
            fill
            className="object-contain"
            sizes="(max-width: 1280px) 100vw, 1280px"
          />
        </div>

        {/* Image Info */}
        <div className="grid grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Nombre de Archivo
              </label>
              <p className="text-sm font-medium text-gray-900 mt-1">
                {image.filename}
              </p>
            </div>

            {image.title && (
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Título
                </label>
                <p className="text-sm font-medium text-gray-900 mt-1">
                  {image.title}
                </p>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Texto Alternativo
              </label>
              <p className="text-sm text-gray-700 mt-1">{image.alt}</p>
            </div>

            {image.description && (
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Descripción
                </label>
                <p className="text-sm text-gray-700 mt-1">
                  {image.description}
                </p>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Dimensiones
              </label>
              <p className="text-sm font-medium text-gray-900 mt-1">
                {image.metadata.width} × {image.metadata.height} px
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Tamaño
              </label>
              <p className="text-sm font-medium text-gray-900 mt-1">
                {(image.metadata.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Formato
              </label>
              <p className="text-sm font-medium text-gray-900 mt-1 uppercase">
                {image.metadata.format}
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Estado
              </label>
              <p className="mt-1">
                <span
                  className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${
                    image.activo
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {image.activo ? "Activa" : "Inactiva"}
                </span>
              </p>
            </div>

            {image.subsection && (
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Subsección
                </label>
                <p className="text-sm font-medium text-gray-900 mt-1">
                  {image.subsection}
                </p>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Subida
              </label>
              <p className="text-sm text-gray-700 mt-1">
                {new Date(image.metadata.uploadedAt).toLocaleDateString(
                  "es-EC",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                Por {image.metadata.uploadedBy}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
          <Button
            variant="secondary"
            icon={<Download className="w-4 h-4" />}
            onClick={handleDownload}
          >
            Descargar
          </Button>
          <a
            href={image.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex"
          >
            <Button
              variant="secondary"
              icon={<ExternalLink className="w-4 h-4" />}
            >
              Abrir Original
            </Button>
          </a>
        </div>
      </div>
    </Modal>
  );
}
