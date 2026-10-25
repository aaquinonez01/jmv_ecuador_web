"use client";

import Link from "next/link";
import { BookOpen, Play } from "lucide-react";
import { libraryHref, readerHref } from "@/lib/biblioteca";
import { buttonVariants, type ButtonSize, type ButtonVariant } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import type { LibraryCardDoc } from "./shared";
import { useDocProgress } from "./useLibraryProgress";

/**
 * Botón principal para leer: "Empezar a leer" o "Continuar en la página N"
 * según el progreso de este teléfono. Enlaces, videos y PDFs para miembros
 * van a la ficha (allí se abren o se pide iniciar sesión).
 */
export default function ReadButton({
  doc,
  variant = "gold",
  size = "lg",
  className,
}: {
  doc: Pick<LibraryCardDoc, "slug" | "title" | "kind" | "visibility">;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}) {
  const progress = useDocProgress(doc.slug);
  const toReader = doc.kind === "pdf" && doc.visibility === "publico";
  const resume = toReader && progress && !progress.finished && progress.page > 1 ? progress.page : null;

  const label = !toReader
    ? doc.kind === "video"
      ? "Ver el video"
      : doc.kind === "enlace"
        ? "Abrir el recurso"
        : "Empezar a leer"
    : resume
      ? `Continuar en la página ${resume}`
      : progress?.finished
        ? "Leer de nuevo"
        : "Empezar a leer";

  return (
    <Link
      href={toReader ? readerHref(doc.slug, resume ?? undefined) : libraryHref(doc.slug)}
      className={buttonVariants({ variant, size, className: cn("gap-2.5 rounded-full", className) })}
    >
      {resume ? <Play className="h-5 w-5 fill-current" aria-hidden /> : <BookOpen className="h-5 w-5" aria-hidden />}
      {label}
      <span className="sr-only">: {doc.title}</span>
    </Link>
  );
}
