import {
  BookOpen,
  Church,
  Gift,
  Globe,
  GraduationCap,
  HandHeart,
  Heart,
  Sparkles,
  Tent,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { DonationPurposeIcon } from "@/types/donations";

// Lista corta y cerrada: el admin elige de aquí y la web nunca recibe un nombre desconocido.
export const PURPOSE_ICONS: Record<DonationPurposeIcon, { icon: LucideIcon; label: string }> = {
  Heart: { icon: Heart, label: "Servicio" },
  HandHeart: { icon: HandHeart, label: "Caridad" },
  Users: { icon: Users, label: "Encuentros" },
  BookOpen: { icon: BookOpen, label: "Formación" },
  Tent: { icon: Tent, label: "Campamentos" },
  Church: { icon: Church, label: "Pastoral" },
  GraduationCap: { icon: GraduationCap, label: "Becas" },
  Gift: { icon: Gift, label: "Solidaridad" },
  Globe: { icon: Globe, label: "Misiones" },
  Sparkles: { icon: Sparkles, label: "Otros" },
};

export function purposeIcon(name: string): LucideIcon {
  return PURPOSE_ICONS[name as DonationPurposeIcon]?.icon ?? Heart;
}
