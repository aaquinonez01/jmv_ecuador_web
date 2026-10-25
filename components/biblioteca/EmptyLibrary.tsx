import Link from "next/link";
import { BookHeart } from "lucide-react";
import { StarsRing } from "@/components/brand";
import { buttonVariants } from "@/components/ui/button-variants";

// Estado vacío digno para el lanzamiento, mientras el admin sube las primeras lecturas.
export default function EmptyLibrary() {
  return (
    <section aria-labelledby="biblioteca-vacia" className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
      <div className="relative mx-auto h-28 w-28">
        <StarsRing withCircle className="absolute inset-0 h-full w-full text-accent-gold/50" />
        <BookHeart className="absolute inset-0 m-auto h-10 w-10 text-accent-gold" aria-hidden />
      </div>
      <h2 id="biblioteca-vacia" className="mt-6 font-display text-3xl font-semibold text-fg sm:text-4xl">
        Estamos llenando los estantes
      </h2>
      <p className="mt-4 text-lg leading-relaxed text-fg-muted">
        Muy pronto encontrarás aquí libros, documentos y guías para tus reuniones, tu oración y tu formación en JMV.
        Mientras tanto, conoce los ejes que nos forman.
      </p>
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link href="/formacion/ejes" className={buttonVariants({ variant: "gold", size: "md", className: "rounded-full" })}>
          Ver los ejes de formación
        </Link>
        <Link href="/unete" className={buttonVariants({ variant: "outlineAuto", size: "md", className: "rounded-full" })}>
          Únete a JMV
        </Link>
      </div>
    </section>
  );
}
