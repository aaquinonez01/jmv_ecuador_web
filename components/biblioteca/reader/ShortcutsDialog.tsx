"use client";

import { Dialog } from "radix-ui";
import { X } from "lucide-react";
import { IconButton } from "./ReaderBars";

const SHORTCUTS: { keys: string[]; label: string }[] = [
  { keys: ["←", "→"], label: "Página anterior o siguiente" },
  { keys: ["RePág", "AvPág"], label: "Página anterior o siguiente (modo una página)" },
  { keys: ["Inicio", "Fin"], label: "Primera o última página" },
  { keys: ["+", "−"], label: "Acercar o alejar" },
  { keys: ["0"], label: "Ajustar a la pantalla" },
  { keys: ["M"], label: "Cambiar el modo de lectura" },
  { keys: ["T"], label: "Cambiar el tema" },
  { keys: ["F"], label: "Pantalla completa" },
  { keys: ["?"], label: "Mostrar estos atajos" },
];

type Props = { open: boolean; onOpenChange: (open: boolean) => void; container: HTMLElement | null };

export default function ShortcutsDialog({ open, onOpenChange, container }: Props) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal container={container}>
        <Dialog.Overlay className="fixed inset-0 z-[90] bg-black/50 data-[state=open]:motion-safe:animate-in data-[state=open]:motion-safe:fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[95] max-h-[85dvh] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl border border-(--r-line) bg-(--r-bar) p-6 text-(--r-fg) shadow-2xl backdrop-blur-md">
          <div className="mb-4 flex items-center justify-between gap-4">
            <Dialog.Title className="font-display text-xl font-semibold">Atajos y gestos</Dialog.Title>
            <Dialog.Close asChild>
              <IconButton label="Cerrar">
                <X className="size-5" aria-hidden="true" />
              </IconButton>
            </Dialog.Close>
          </div>
          <Dialog.Description className="sr-only">Teclas para moverte por el documento sin usar el ratón.</Dialog.Description>
          <dl className="divide-y divide-(--r-line)">
            {SHORTCUTS.map((s) => (
              <div key={s.label} className="flex items-center justify-between gap-4 py-2.5 text-sm">
                <dt className="text-(--r-muted)">{s.label}</dt>
                <dd className="flex shrink-0 gap-1">
                  {s.keys.map((k) => (
                    <kbd
                      key={k}
                      className="min-w-8 rounded-lg border border-(--r-line) bg-(--r-soft) px-2 py-1 text-center font-sans text-xs font-semibold"
                    >
                      {k}
                    </kbd>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-xs text-(--r-muted)">
            En el celular: toca la página para mostrar u ocultar los controles, pellizca o toca dos veces para acercar y, en
            el modo una página, desliza a los lados para pasar de página.
          </p>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
