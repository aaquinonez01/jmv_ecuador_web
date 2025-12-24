"use client";

import { Camera, BookOpen, FileText, Grid3X3 } from "lucide-react";

interface BlogCategoriesProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  {
    id: "momentos",
    name: "Momentos",
    icon: Camera,
    color: "bg-jmv-gold/20 text-jmv-gold hover:bg-jmv-gold/30",
    activeColor: "bg-jmv-gold text-white",
  },
  {
    id: "formacion",
    name: "Formación",
    icon: BookOpen,
    color: "bg-jmv-blue/20 text-jmv-blue hover:bg-jmv-blue/30",
    activeColor: "bg-jmv-blue text-white",
  },
  {
    id: "documentos",
    name: "Documentos",
    icon: FileText,
    color: "bg-jmv-red/20 text-jmv-red hover:bg-jmv-red/30",
    activeColor: "bg-jmv-red text-white",
  },
];

export default function BlogCategories({
  selectedCategory,
  onCategoryChange,
}: BlogCategoriesProps) {
  return (
    <div className="w-full">
      <div className="flex flex-nowrap sm:flex-wrap gap-2 sm:gap-3 justify-center overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
        {categories.map((category) => {
          const Icon = category.icon;
          const isActive = selectedCategory === category.id;

          return (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`px-2.5 sm:px-3 md:px-4 lg:px-5 py-1.5 sm:py-2 md:py-2.5 rounded-lg sm:rounded-xl font-medium transition-all duration-200 flex items-center gap-1 sm:gap-1.5 md:gap-2 shadow-sm hover:shadow-md text-xs sm:text-sm lg:text-base flex-shrink-0 cursor-pointer ${
                isActive ? category.activeColor : category.color
              }`}
            >
              <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5" />
              <span className="whitespace-nowrap">{category.name}</span>
            </button>
          );
        })}
      </div>

      {/* Descripción de la categoría seleccionada */}
      <div className="mt-3 sm:mt-4 text-center sm:text-left">
        {selectedCategory === "all" && (
          <p className="text-xs sm:text-sm lg:text-base text-gray-600">
            Todas las publicaciones de la comunidad JMV
          </p>
        )}
        {selectedCategory === "momentos" && (
          <p className="text-xs sm:text-sm lg:text-base text-gray-600">
            Comparte los momentos especiales, retiros, actividades y
            experiencias
          </p>
        )}
        {selectedCategory === "formacion" && (
          <p className="text-xs sm:text-sm lg:text-base text-gray-600">
            Libros, recursos formativos y contenido educativo
          </p>
        )}
        {selectedCategory === "documentos" && (
          <p className="text-xs sm:text-sm lg:text-base text-gray-600">
            Documentos oficiales, metodologías y recursos de trabajo
          </p>
        )}
      </div>
    </div>
  );
}
