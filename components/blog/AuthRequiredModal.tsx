"use client";

import Link from "next/link";
import { BookOpen, Camera, LogIn, UserPlus } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { buttonVariants } from "@/components/ui/button-variants";
import { SIGN_IN_FROM_BLOG } from "./WelcomeCard";

interface AuthRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Aviso al intentar publicar sin sesión (Radix Dialog vía Modal compartido)
export default function AuthRequiredModal({ isOpen, onClose }: AuthRequiredModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Inicia sesión para publicar"
      description="Para compartir con la comunidad necesitas tu cuenta de JMV Ecuador."
      size="sm"
    >
      <ul className="space-y-3">
        <li className="flex items-center gap-3 text-sm text-gray-800">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-jmv-blue/10">
            <Camera className="h-5 w-5 text-jmv-blue" aria-hidden="true" />
          </span>
          Comparte momentos y fotos de tus actividades.
        </li>
        <li className="flex items-center gap-3 text-sm text-gray-800">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-jmv-blue/10">
            <BookOpen className="h-5 w-5 text-jmv-blue" aria-hidden="true" />
          </span>
          Publica documentos y recursos de formación.
        </li>
      </ul>

      <div className="mt-6 space-y-2">
        <Link
          href={SIGN_IN_FROM_BLOG}
          onClick={onClose}
          className={buttonVariants({ variant: "primary", className: "w-full gap-2" })}
        >
          <LogIn className="h-5 w-5" aria-hidden="true" />
          Iniciar sesión
        </Link>
        <Link
          href="/unete"
          onClick={onClose}
          className={buttonVariants({ variant: "outline", className: "w-full gap-2" })}
        >
          <UserPlus className="h-5 w-5" aria-hidden="true" />
          ¿Aún no eres parte? Únete
        </Link>
        <button
          type="button"
          onClick={onClose}
          className={buttonVariants({ variant: "ghost", size: "sm", className: "w-full" })}
        >
          Seguir explorando
        </button>
      </div>
    </Modal>
  );
}
