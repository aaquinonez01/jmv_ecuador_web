"use client";

import type { ReactNode } from "react";
import { Dialog } from "radix-ui";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

// Modal accesible sobre Radix Dialog: role="dialog", aria-modal, título asociado,
// foco atrapado y devuelto al cerrar, Escape y clic fuera.
// Tema: panel blanco en ambos modos (isla data-tone="light": los tokens dentro son claros).
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  /** Texto de apoyo bajo el título (aria-describedby) */
  description?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  className?: string;
  footer?: ReactNode;
  /** Nombre accesible cuando no hay título visible */
  ariaLabel?: string;
}

const sizes = {
  sm: "max-w-md",
  md: "max-w-2xl",
  lg: "max-w-4xl",
  xl: "max-w-6xl",
  full: "max-w-[calc(100vw-2rem)]",
};

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = "md",
  showCloseButton = true,
  closeOnOverlayClick = true,
  className,
  footer,
  ariaLabel,
}: ModalProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
        <Dialog.Content
          data-tone="light"
          data-surface="light"
          {...(!description && { "aria-describedby": undefined })}
          onPointerDownOutside={(e) => {
            if (!closeOnOverlayClick) e.preventDefault();
          }}
          className={cn(
            "fixed left-1/2 top-1/2 z-50 flex max-h-[92svh] w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl bg-surface text-fg shadow-jmv-lg",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
            sizes[size],
            className,
          )}
        >
          {(title || showCloseButton) && (
            <div className="flex items-start justify-between gap-4 border-b border-gray-200 p-6">
              <div className="min-w-0">
                {title ? (
                  <Dialog.Title className="text-2xl font-semibold text-jmv-blue">
                    {title}
                  </Dialog.Title>
                ) : (
                  <Dialog.Title className="sr-only">{ariaLabel ?? "Ventana"}</Dialog.Title>
                )}
                {description && (
                  <Dialog.Description className="mt-1 text-sm text-slate-600">
                    {description}
                  </Dialog.Description>
                )}
              </div>
              {showCloseButton && (
                <Dialog.Close
                  aria-label="Cerrar"
                  className="-m-2 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-slate-600 hover:bg-gray-100 hover:text-slate-900"
                >
                  <X className="h-5 w-5" aria-hidden />
                </Dialog.Close>
              )}
            </div>
          )}
          {!title && !showCloseButton && (
            <Dialog.Title className="sr-only">{ariaLabel ?? "Ventana"}</Dialog.Title>
          )}

          <div className="flex-1 overflow-y-auto p-6">{children}</div>

          {footer && (
            <div className="flex justify-end gap-2 border-t border-gray-200 bg-slate-50 px-6 py-4">
              {footer}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
