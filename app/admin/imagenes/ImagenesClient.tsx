"use client";

import { useState } from "react";
import { ImageIcon, Search } from "lucide-react";
import ImageSectionList from "@/components/admin/imagenes/ImageSectionList";
import PageHeader from "@/components/admin/layout/PageHeader";
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
    <>
      <PageHeader
        title="Gestión de imágenes"
        description="Selecciona una sección para administrar sus imágenes."
        icon={<ImageIcon className="h-[18px] w-[18px]" strokeWidth={2.1} />}
        breadcrumbs={[{ label: "Contenido" }, { label: "Imágenes" }]}
        actions={
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar sección..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-64 rounded-md border border-slate-200 bg-slate-50 pl-8 pr-3 text-[13px] text-slate-900 placeholder-slate-400 transition-colors focus:border-jmv-blue focus:bg-white focus:outline-none focus:ring-2 focus:ring-jmv-blue/15"
            />
          </div>
        }
      />

      <div className="flex-1 space-y-6 overflow-auto px-6 py-6">
        {filteredSections.length > 0 ? (
          <ImageSectionList sections={filteredSections} />
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <Search className="h-7 w-7 text-slate-400" />
            </div>
            <h3 className="mb-1 text-base font-semibold text-slate-900">
              No se encontraron secciones
            </h3>
            <p className="text-sm text-slate-500">
              Intenta con otros términos de búsqueda
            </p>
          </div>
        )}
      </div>
    </>
  );
}
