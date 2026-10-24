import type { LucideIcon } from "lucide-react";
import { BookOpen, MessageCircle, Search, Users } from "lucide-react";

// Fuente única de los pasos y lo que ofrece JMV, para /unete y UneteCTASection.

export interface PasoUnete {
  numero: string;
  titulo: string;
  descripcion: string;
  icon: LucideIcon;
}

export const PASOS_UNETE: PasoUnete[] = [
  {
    numero: "1",
    titulo: "Encuentra tu comunidad",
    descripcion: "Busca el grupo JMV más cercano a tu ciudad o parroquia.",
    icon: Search,
  },
  {
    numero: "2",
    titulo: "Escríbele",
    descripcion: "Envía un WhatsApp o déjanos tus datos y te ponemos en contacto.",
    icon: MessageCircle,
  },
  {
    numero: "3",
    titulo: "Ve a tu primer encuentro",
    descripcion: "Conoce al grupo, comparte con ellos y resuelve tus dudas sin compromiso.",
    icon: Users,
  },
  {
    numero: "4",
    titulo: "Empieza tu camino",
    descripcion: "Inicia el itinerario de formación vicenciana a tu ritmo, acompañado.",
    icon: BookOpen,
  },
];

export const BENEFICIOS_JMV = [
  "Una comunidad de jóvenes con quienes compartir la fe",
  "Formación humana y cristiana al estilo de San Vicente de Paúl",
  "Experiencias de servicio junto a los más pobres",
  "Crecimiento espiritual con María como modelo",
  "Acompañamiento de asesores en tu proceso",
  "Una red de comunidades JMV en el Ecuador y en el mundo",
];
