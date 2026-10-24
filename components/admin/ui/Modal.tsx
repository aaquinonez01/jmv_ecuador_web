"use client";

import React from "react";
import { Dialog } from "radix-ui";
import { X } from "lucide-react";

// Sobre Radix Dialog: foco atrapado y devuelto, Escape, clic fuera y título asociado.
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  showCloseButton?: boolean;
  footer?: React.ReactNode;
  /** Nombre accesible cuando no hay título visible */
  ariaLabel?: string;
}

const sizeStyles = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-2xl",
  xl: "max-w-3xl",
  full: "max-w-5xl sm:mx-4",
};

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = "md",
  showCloseButton = true,
  footer,
  ariaLabel,
}: ModalProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm animate-fade-in" />
        <Dialog.Content
          data-surface="light"
          {...(!description && { "aria-describedby": undefined })}
          className={`fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[95vh] w-full flex-col overflow-hidden rounded-t-2xl border border-slate-200 bg-white text-slate-900 shadow-2xl animate-scale-in sm:inset-x-4 sm:bottom-auto sm:top-1/2 sm:max-h-[92vh] sm:-translate-y-1/2 sm:rounded-xl ${sizeStyles[size]}`}
        >
          {(title || showCloseButton) && (
            <div className="flex items-start justify-between gap-3 px-5 pt-4 pb-3 border-b border-slate-100">
              <div className="min-w-0">
                {title ? (
                  <Dialog.Title className="text-base font-bold text-slate-900 leading-tight">
                    {title}
                  </Dialog.Title>
                ) : (
                  <Dialog.Title className="sr-only">{ariaLabel ?? "Ventana"}</Dialog.Title>
                )}
                {description && (
                  <Dialog.Description className="text-xs text-slate-500 mt-0.5">
                    {description}
                  </Dialog.Description>
                )}
              </div>
              {showCloseButton && (
                <Dialog.Close
                  className="shrink-0 -mr-2 -mt-2 inline-flex h-10 w-10 items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
                  aria-label="Cerrar"
                >
                  <X className="h-4 w-4" aria-hidden />
                </Dialog.Close>
              )}
            </div>
          )}
          {!title && !showCloseButton && (
            <Dialog.Title className="sr-only">{ariaLabel ?? "Ventana"}</Dialog.Title>
          )}

          {/* Body */}
          <div className="flex-1 overflow-y-auto">{children}</div>

          {/* Footer */}
          {footer && (
            <div className="flex justify-end gap-2 px-5 py-3 border-t border-slate-100 bg-slate-50/50">
              {footer}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
