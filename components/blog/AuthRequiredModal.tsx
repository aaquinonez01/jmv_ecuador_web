"use client";

import Link from "next/link";
import { useRef, useEffect } from "react";
import { X, Lock, UserPlus, LogIn, Share2, Camera, Heart } from "lucide-react";

interface AuthRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthRequiredModal({
  isOpen,
  onClose,
}: AuthRequiredModalProps) {
  if (!isOpen) return null;

  const modalRef = useRef<HTMLDivElement>(null);
  const prevFocusedEl = useRef<HTMLElement | null>(null);

  useEffect(() => {
    prevFocusedEl.current = document.activeElement as HTMLElement;
    setTimeout(() => {
      const closeBtn = modalRef.current?.querySelector<HTMLElement>('button[aria-label="Cerrar"]');
      closeBtn?.focus();
    }, 0);
    return () => {
      if (prevFocusedEl.current) {
        prevFocusedEl.current.focus();
      }
    };
  }, []);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      onClose();
      return;
    }
    if (e.key === "Tab") {
      const container = modalRef.current;
      if (!container) return;
      const focusable = container.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-required-title"
      tabIndex={-1}
      ref={modalRef}
      onKeyDown={onKeyDown}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-jmv-blue to-jmv-blue-dark p-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors z-10"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 mx-auto">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h2 id="auth-required-title" className="text-2xl font-bold text-center mb-2">
              Inicia Sesión para Continuar
            </h2>
            <p className="text-sm text-white/90 text-center">
              Únete a nuestra comunidad y comparte tus experiencias
            </p>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-6">
          {/* Mensaje principal */}
          <div className="bg-jmv-blue/5 border border-jmv-blue/20 rounded-xl p-4">
            <p className="text-gray-700 text-center text-sm">
              Para publicar y compartir momentos necesitas ser parte de la
              comunidad JMV
            </p>
          </div>

          {/* Beneficios */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-gray-900 text-center mb-3">
              Con una cuenta puedes:
            </p>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-jmv-blue/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Camera className="w-5 h-5 text-jmv-blue" />
              </div>
              <p className="text-sm text-gray-700">
                Compartir momentos y fotos de actividades
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-jmv-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Share2 className="w-5 h-5 text-jmv-gold" />
              </div>
              <p className="text-sm text-gray-700">
                Publicar documentos y recursos formativos
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-jmv-red/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Heart className="w-5 h-5 text-jmv-red" />
              </div>
              <p className="text-sm text-gray-700">
                Interactuar con publicaciones de otros miembros
              </p>
            </div>
          </div>

          {/* Separador */}
          <div className="border-t border-gray-200" />

          {/* Botones de acción */}
          <div className="space-y-3">
            <Link
              href="/auth/signin"
              className="w-full bg-gradient-to-r from-jmv-blue to-jmv-blue-dark text-white px-4 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 group"
              onClick={onClose}
            >
              <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              <span>Iniciar Sesión</span>
            </Link>

            <Link
              href="/unete"
              className="w-full bg-white text-jmv-blue px-4 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2 border-2 border-jmv-blue group"
              onClick={onClose}
            >
              <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Únete a JMV</span>
            </Link>

            <button
              onClick={onClose}
              className="w-full text-gray-600 px-4 py-2 rounded-xl font-medium hover:bg-gray-100 transition-colors text-sm"
            >
              Continuar explorando
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
