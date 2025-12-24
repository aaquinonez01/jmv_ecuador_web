// Nivel 1: Alcance
export interface Scope {
  id: string;
  name: string;
  icon: string;
  color: string;
}

// Nivel 2: Tipo de Actividad
export interface ActivityType {
  id: string;
  name: string;
  icon: string;
  subtypes: Subtype[];
}

// Nivel 3: Subtipo
export interface Subtype {
  id: string;
  name: string;
}

export const SCOPES: Scope[] = [
  {
    id: "local",
    name: "Local",
    icon: "🏠",
    color: "from-blue-500 to-blue-600",
  },
  {
    id: "zonal",
    name: "Zonal",
    icon: "🌆",
    color: "from-purple-500 to-purple-600",
  },
  {
    id: "nacional",
    name: "Nacional",
    icon: "🇪🇨",
    color: "from-red-500 to-red-600",
  },
];

export const ACTIVITY_TYPES: Record<string, ActivityType[]> = {
  // Tipos comunes para todos los alcances
  common: [
    {
      id: "formacion",
      name: "Formación",
      icon: "📚",
      subtypes: [
        { id: "espiritual", name: "Espiritual" },
        { id: "liderazgo", name: "Liderazgo" },
        { id: "metodologia", name: "Metodología" },
        { id: "doctrina", name: "Doctrina Social" },
        { id: "pastoral", name: "Pastoral Juvenil" },
        { id: "vicenciana", name: "Espiritualidad Vicenciana" },
        { id: "biblica", name: "Bíblica" },
        { id: "taller", name: "Taller" },
        { id: "charla", name: "Charla" },
      ],
    },
    {
      id: "comunidad-juvenil",
      name: "Comunidad Juvenil",
      icon: "👥",
      subtypes: [
        { id: "convivencia", name: "Convivencia" },
        { id: "encuentro", name: "Encuentro" },
        { id: "reunion", name: "Reunión" },
        { id: "asamblea", name: "Asamblea" },
        { id: "integracion", name: "Integración" },
        { id: "dinamica", name: "Dinámica" },
        { id: "compartir", name: "Compartir" },
      ],
    },
    {
      id: "apostolado",
      name: "Apostolado",
      icon: "🤝",
      subtypes: [
        { id: "servicio-social", name: "Servicio Social" },
        { id: "visita-enfermos", name: "Visita a Enfermos" },
        { id: "ayuda-necesitados", name: "Ayuda a Necesitados" },
        { id: "evangelizacion", name: "Evangelización" },
        { id: "catequesis", name: "Catequesis" },
        { id: "mision", name: "Misión" },
        { id: "voluntariado", name: "Voluntariado" },
      ],
    },
    {
      id: "espiritualidad",
      name: "Espiritualidad",
      icon: "🙏",
      subtypes: [
        { id: "retiro", name: "Retiro" },
        { id: "oracion", name: "Oración" },
        { id: "eucaristia", name: "Eucaristía" },
        { id: "adoracion", name: "Adoración" },
        { id: "peregrinacion", name: "Peregrinación" },
        { id: "via-crucis", name: "Vía Crucis" },
        { id: "rosario", name: "Rosario" },
        { id: "lectio-divina", name: "Lectio Divina" },
      ],
    },
    {
      id: "celebracion",
      name: "Celebración",
      icon: "🎉",
      subtypes: [
        { id: "aniversario", name: "Aniversario" },
        { id: "fiesta-patronal", name: "Fiesta Patronal" },
        { id: "cumpleanos", name: "Cumpleaños" },
        { id: "liturgica", name: "Litúrgica" },
        { id: "especial", name: "Especial" },
      ],
    },
    {
      id: "documentos",
      name: "Documentos",
      icon: "📄",
      subtypes: [
        { id: "manual", name: "Manual" },
        { id: "guia", name: "Guía" },
        { id: "acta", name: "Acta" },
        { id: "reglamento", name: "Reglamento" },
        { id: "planificacion", name: "Planificación" },
        { id: "informe", name: "Informe" },
        { id: "convocatoria", name: "Convocatoria" },
      ],
    },
  ],
};

export function getScopeById(id: string): Scope | undefined {
  return SCOPES.find((scope) => scope.id === id);
}

export function getActivityTypeById(id: string): ActivityType | undefined {
  return ACTIVITY_TYPES.common.find((type) => type.id === id);
}

export function getSubtypeById(
  activityTypeId: string,
  subtypeId: string
): Subtype | undefined {
  const activityType = getActivityTypeById(activityTypeId);
  return activityType?.subtypes.find((sub) => sub.id === subtypeId);
}

export function getSubtypeName(
  activityTypeId: string,
  subtypeId: string
): string {
  const subtype = getSubtypeById(activityTypeId, subtypeId);
  return subtype?.name || subtypeId;
}

export function getAllActivityTypes(): ActivityType[] {
  return ACTIVITY_TYPES.common;
}
