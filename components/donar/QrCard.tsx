"use client";

import { useState } from "react";
import { Maximize2, QrCode } from "lucide-react";
import Modal from "@/components/ui/Modal";

// QR sin transformaciones de Cloudinary: la compresión puede volverlo ilegible.
export default function QrCard({ src, label }: { src: string; label?: string | null }) {
  const [open, setOpen] = useState(false);
  const alt = `Código QR para donar a JMV Ecuador${label ? ` (${label})` : ""}`;

  return (
    <article
      aria-labelledby="donar-qr-titulo"
      className="flex flex-col rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6"
    >
      <header className="flex items-start gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-jmv-blue/10 text-jmv-blue">
          <QrCode className="h-6 w-6" aria-hidden />
        </span>
        <div className="min-w-0">
          <h3 id="donar-qr-titulo" className="text-xl font-bold leading-tight text-slate-900">
            Paga con QR
          </h3>
          {label ? <p className="mt-1 text-sm font-medium text-jmv-gold-ink">{label}</p> : null}
        </div>
      </header>

      <div className="mx-auto mt-5 w-full max-w-72 rounded-2xl bg-white p-3 ring-1 ring-slate-200">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} width={480} height={480} className="aspect-square h-auto w-full object-contain" />
      </div>

      <p className="mt-4 text-center text-base text-slate-700">Escanéalo desde la app de tu banco.</p>

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mx-auto mt-3 inline-flex min-h-11 items-center gap-2 rounded-xl px-4 text-sm font-semibold text-jmv-blue ring-1 ring-jmv-blue/25 hover:bg-jmv-blue/10"
      >
        <Maximize2 className="h-4 w-4" aria-hidden />
        Ampliar QR
      </button>

      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Código QR para donar"
        description={label ? `${label}. Escanéalo desde la app de tu banco.` : "Escanéalo desde la app de tu banco."}
        size="sm"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="mx-auto aspect-square h-auto w-full max-w-md object-contain" />
      </Modal>
    </article>
  );
}
