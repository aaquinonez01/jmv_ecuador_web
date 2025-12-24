import { Section } from "@/types/admin/section";
import { ImageSection } from "@/types/admin/image";

/**
 * Mock data para las 4 secciones prioritarias de Fase 1
 */
export const mockSections: Section[] = [
  {
    id: ImageSection.HERO_BACKGROUNDS,
    name: "Hero & Backgrounds",
    description: "Imágenes de fondo para páginas principales del sitio web",
    icon: "🎭",
    totalImages: 7,
    maxImages: 7,
    hasSubsections: true,
    subsections: [
      { id: "home", name: "Home", imageCount: 1 },
      { id: "quienes-somos", name: "Quiénes Somos", imageCount: 1 },
      { id: "historia", name: "Historia", imageCount: 1 },
      { id: "estructura", name: "Estructura", imageCount: 0 },
      { id: "pilares", name: "Pilares", imageCount: 1 },
      { id: "actividades", name: "Actividades", imageCount: 1 },
      { id: "unete", name: "Únete", imageCount: 1 },
    ],
    uploadedImages: 6,
  },
  {
    id: ImageSection.GALERIA_ACTIVIDADES,
    name: "Galería de Actividades",
    description: "Galería masonry de actividades en la página principal",
    icon: "📸",
    totalImages: 8,
    maxImages: 8,
    hasSubsections: false,
    uploadedImages: 1,
  },
  {
    id: ImageSection.PROXIMAS_ACTIVIDADES,
    name: "Próximas Actividades",
    description: "Imágenes de eventos próximos y actividades programadas",
    icon: "📅",
    totalImages: 6,
    maxImages: 6,
    hasSubsections: false,
    uploadedImages: 1,
  },
  {
    id: ImageSection.PILARES_APOSTOLADO,
    name: "Pilar: Apostolado",
    description: "Imágenes de acciones sociales y apostólicas",
    icon: "🤝",
    totalImages: 6,
    maxImages: 6,
    hasSubsections: false,
    uploadedImages: 0,
  },
  {
    id: ImageSection.PILARES_ESPIRITUALIDAD,
    name: "Pilar: Espiritualidad",
    description: "Imágenes de actividades espirituales y de oración",
    icon: "🙏",
    totalImages: 6,
    maxImages: 6,
    hasSubsections: false,
    uploadedImages: 0,
  },
  {
    id: ImageSection.PILARES_COMUNIDAD,
    name: "Pilar: Comunidad Juvenil",
    description: "Imágenes de vida comunitaria y encuentros juveniles",
    icon: "👥",
    totalImages: 6,
    maxImages: 6,
    hasSubsections: false,
    uploadedImages: 0,
  },
  {
    id: ImageSection.PILARES_FORMACION,
    name: "Pilar: Formación",
    description: "Imágenes de formación integral y talleres educativos",
    icon: "📚",
    totalImages: 6,
    maxImages: 6,
    hasSubsections: false,
    uploadedImages: 0,
  },
];

/**
 * Obtener estadísticas generales de todas las secciones
 */
export function getSectionsStats() {
  const total = mockSections.reduce(
    (sum, section) => sum + section.totalImages,
    0
  );
  const uploaded = mockSections.reduce(
    (sum, section) => sum + (section.uploadedImages || 0),
    0
  );

  return {
    totalImages: total,
    uploadedImages: uploaded,
    pendingImages: total - uploaded,
    activeSections: mockSections.length,
  };
}
