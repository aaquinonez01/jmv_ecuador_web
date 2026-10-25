import {
  BookOpen,
  Bus,
  Church,
  GraduationCap,
  HandHeart,
  HeartHandshake,
  House,
  Shirt,
  Sparkles,
  Tent,
  Users,
  Utensils,
  type LucideIcon,
} from "lucide-react";
import type { DonationPurposeIcon } from "@/types/donations";

// Lista corta y cerrada: el admin elige de aquí y la web nunca recibe un nombre desconocido.
export const PURPOSE_ICONS: Record<DonationPurposeIcon, { icon: LucideIcon; label: string }> = {
  "heart-handshake": { icon: HeartHandshake, label: "Servicio" },
  "hand-heart": { icon: HandHeart, label: "Caridad" },
  users: { icon: Users, label: "Encuentros" },
  "book-open": { icon: BookOpen, label: "Formación" },
  "graduation-cap": { icon: GraduationCap, label: "Becas" },
  church: { icon: Church, label: "Pastoral" },
  bus: { icon: Bus, label: "Transporte" },
  tent: { icon: Tent, label: "Campamentos" },
  utensils: { icon: Utensils, label: "Alimentación" },
  shirt: { icon: Shirt, label: "Ropa" },
  home: { icon: House, label: "Hogar" },
  sparkles: { icon: Sparkles, label: "Otros" },
};

export function purposeIcon(name: string): LucideIcon {
  return PURPOSE_ICONS[name as DonationPurposeIcon]?.icon ?? HeartHandshake;
}
