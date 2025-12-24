"use client";

import { useState } from "react";
import { Search, ImageIcon } from "lucide-react";
import ImageSectionList from "@/components/admin/imagenes/ImageSectionList";
import { Section } from "@/types/admin/section";

interface ImagenesClientProps {
  sections: Section[];
}

export default function ImagenesClient({ sections }: ImagenesClientProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSections = sections.filter(
    (section) =>
      section.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-[#0066CC] to-[#004C99] rounded-xl">
              <ImageIcon className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Gestión de Imágenes
            </h1>
          </div>
          <p className="text-gray-600 ml-14">
            Selecciona una sección para administrar sus imágenes
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar sección..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:border-[#0066CC] focus:ring-4 focus:ring-[#0066CC]/10 outline-none transition-all text-gray-900 placeholder:text-gray-400"
        />
      </div>

      {/* Sections List */}
      {filteredSections.length > 0 ? (
        <ImageSectionList sections={filteredSections} />
      ) : (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No se encontraron secciones
          </h3>
          <p className="text-gray-600">
            Intenta con otros términos de búsqueda
          </p>
        </div>
      )}
    </div>
  );
}
