"use client";

import Link from "next/link";
import { useEffect } from "react";
import { RotateCcw } from "lucide-react";
import StarsRing from "@/components/brand/StarsRing";
import { buttonVariants } from "@/components/ui/Button";
import { whatsappLink } from "@/lib/whatsapp";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="relative flex min-h-[70svh] flex-col items-center justify-center overflow-hidden px-4 pb-16 pt-28 text-center">
      <StarsRing className="pointer-events-none absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 text-jmv-gold-text/15" />
      <div className="relative max-w-xl">
        <p className="font-display text-lg italic text-jmv-gold-text">Algo no salió bien</p>
        <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
          No pudimos cargar esta página
        </h1>
        <p className="mt-4 text-slate-300">
          Puede ser un problema temporal. Intenta de nuevo en unos segundos; si
          sigue pasando, escríbenos y lo revisamos.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button type="button" onClick={reset} className={buttonVariants({ variant: "gold" })}>
            <RotateCcw className="mr-2 h-5 w-5" aria-hidden />
            Reintentar
          </button>
          <Link href="/" className={buttonVariants({ variant: "outlineLight" })}>
            Ir al inicio
          </Link>
        </div>
        <p className="mt-6 text-sm text-slate-400">
          ¿Necesitas ayuda?{" "}
          <a
            href={whatsappLink("Hola, tuve un problema al cargar una página del sitio de JMV Ecuador.")}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-jmv-gold-text underline underline-offset-4"
          >
            Escríbenos por WhatsApp
            <span className="sr-only"> (se abre en una pestaña nueva)</span>
          </a>
        </p>
      </div>
    </section>
  );
}
