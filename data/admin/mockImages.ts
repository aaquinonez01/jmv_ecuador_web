import { AdminImage, ImageSection } from "@/types/admin/image";

/**
 * Mock data para imágenes de las secciones prioritarias
 * Solo incluye las pocas imágenes que ya existen físicamente
 */
export const mockImages: AdminImage[] = [
  // Hero Backgrounds - Home (existe)
  {
    id: "img-hero-home",
    section: ImageSection.HERO_BACKGROUNDS,
    subsection: "home",
    filename: "hero.jpg",
    url: "/images/hero/hero.jpg",
    alt: "Juventudes Marianas Vicencianas Ecuador - Transformando vidas",
    title: "Hero Página Principal",
    description: "Imagen de fondo de la página principal del sitio web JMV Ecuador",
    orden: 1,
    activo: true,
    metadata: {
      size: 2457600, // ~2.3 MB
      width: 1920,
      height: 1080,
      format: "jpg",
      uploadedAt: "2024-12-01T10:00:00Z",
      uploadedBy: "Admin User",
    },
  },
  // Hero Backgrounds - Quiénes Somos
  {
    id: "img-hero-quienes",
    section: ImageSection.HERO_BACKGROUNDS,
    subsection: "quienes-somos",
    filename: "jmv-community.jpg",
    url: "/images/quienes-somos/jmv-community.jpg",
    alt: "Comunidad JMV Ecuador",
    title: "Hero Quiénes Somos",
    description: "Imagen de fondo para la sección Quiénes Somos",
    orden: 2,
    activo: true,
    metadata: {
      size: 1800000,
      width: 1920,
      height: 1080,
      format: "jpg",
      uploadedAt: "2024-12-01T10:30:00Z",
      uploadedBy: "Admin User",
    },
  },
  // Hero Backgrounds - Historia (existe)
  {
    id: "img-hero-historia",
    section: ImageSection.HERO_BACKGROUNDS,
    subsection: "historia",
    filename: "jmv-fundacion.jpg",
    url: "/images/historia/jmv-fundacion.jpg",
    alt: "Historia de JMV Ecuador",
    title: "Hero Historia",
    description: "Imagen de fondo para la página de historia",
    orden: 3,
    activo: true,
    metadata: {
      size: 2100000,
      width: 1920,
      height: 1080,
      format: "jpg",
      uploadedAt: "2024-12-01T11:00:00Z",
      uploadedBy: "Admin User",
    },
  },
  // Hero Backgrounds - Pilares
  {
    id: "img-hero-pilares",
    section: ImageSection.HERO_BACKGROUNDS,
    subsection: "pilares",
    filename: "pilares-hero.jpg",
    url: "/images/pilares/pilares-hero.jpg",
    alt: "Pilares Formativos JMV",
    title: "Hero Pilares",
    description: "Imagen de fondo para la página de pilares formativos",
    orden: 5,
    activo: true,
    metadata: {
      size: 1950000,
      width: 1920,
      height: 1080,
      format: "jpg",
      uploadedAt: "2024-12-01T11:30:00Z",
      uploadedBy: "Admin User",
    },
  },
  // Hero Backgrounds - Actividades
  {
    id: "img-hero-actividades",
    section: ImageSection.HERO_BACKGROUNDS,
    subsection: "actividades",
    filename: "actividades-hero.jpg",
    url: "/images/actividades/actividades-hero.jpg",
    alt: "Actividades JMV Ecuador",
    title: "Hero Actividades",
    description: "Imagen de fondo para la página de actividades",
    orden: 6,
    activo: true,
    metadata: {
      size: 2200000,
      width: 1920,
      height: 1080,
      format: "jpg",
      uploadedAt: "2024-12-01T12:00:00Z",
      uploadedBy: "Admin User",
    },
  },
  // Hero Backgrounds - Únete
  {
    id: "img-hero-unete",
    section: ImageSection.HERO_BACKGROUNDS,
    subsection: "unete",
    filename: "jmv-comunidad.jpg",
    url: "/images/unete/jmv-comunidad.jpg",
    alt: "Únete a JMV Ecuador",
    title: "Hero Únete",
    description: "Imagen de fondo para la página de inscripción",
    orden: 7,
    activo: true,
    metadata: {
      size: 1850000,
      width: 1920,
      height: 1080,
      format: "jpg",
      uploadedAt: "2024-12-01T12:30:00Z",
      uploadedBy: "Admin User",
    },
  },
  // Galería Actividades - Campamento (existe)
  {
    id: "img-galeria-campamento",
    section: ImageSection.GALERIA_ACTIVIDADES,
    filename: "evento_campamento.jpg",
    url: "/images/events/evento_campamento.jpg",
    alt: "Campamento Juvenil JMV",
    title: "Campamento Nacional",
    description: "Fotografía del campamento juvenil anual",
    orden: 1,
    activo: true,
    metadata: {
      size: 1700000,
      width: 1200,
      height: 800,
      format: "jpg",
      uploadedAt: "2024-12-02T10:00:00Z",
      uploadedBy: "Admin User",
    },
  },
  // Próximas Actividades - Campamento (existe - mismo que galería)
  {
    id: "img-proxima-campamento",
    section: ImageSection.PROXIMAS_ACTIVIDADES,
    filename: "evento_campamento.jpg",
    url: "/images/events/evento_campamento.jpg",
    alt: "Próximo Encuentro Nacional",
    title: "Encuentro Nacional JMV 2025",
    description: "Inscripciones para el próximo encuentro nacional",
    orden: 1,
    activo: true,
    metadata: {
      size: 1700000,
      width: 1200,
      height: 800,
      format: "jpg",
      uploadedAt: "2024-12-02T10:00:00Z",
      uploadedBy: "Admin User",
    },
    eventData: {
      date: "2025-03-15",
      location: "Quito, Ecuador",
      status: "Inscripciones Cerradas",
    },
  },
];

/**
 * Obtener imágenes por sección
 */
export function getImagesBySection(
  sectionId: string
): AdminImage[] {
  return mockImages.filter((img) => img.section === sectionId);
}

/**
 * Obtener imágenes por subsección
 */
export function getImagesBySubsection(
  sectionId: string,
  subsection: string
): AdminImage[] {
  return mockImages.filter(
    (img) => img.section === sectionId && img.subsection === subsection
  );
}

/**
 * Obtener una imagen por ID
 */
export function getImageById(imageId: string): AdminImage | undefined {
  return mockImages.find((img) => img.id === imageId);
}
