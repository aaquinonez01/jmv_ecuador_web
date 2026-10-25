import { FileText, Link2, PlayCircle, type LucideProps } from "lucide-react";
import type { LibraryKind } from "@/types/library";

// Icono del formato: PDF, enlace o video. Decorativo (el texto lo nombra aparte).
export default function KindIcon({ kind, ...props }: { kind: LibraryKind } & LucideProps) {
  const Icon = kind === "video" ? PlayCircle : kind === "enlace" ? Link2 : FileText;
  return <Icon aria-hidden {...props} />;
}
