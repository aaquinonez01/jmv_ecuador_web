import Link from "next/link";
import { StarsRing } from "@/components/brand";
import { buttonVariants } from "@/components/ui/button-variants";

// Estado vacío digno mientras el admin aún no carga fechas.
export default function EmptyState() {
  return (
    <section aria-labelledby="calendario-vacio" className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
      <StarsRing className="mx-auto h-24 w-24 text-jmv-gold-text/60" withCircle />
      <h2 id="calendario-vacio" className="mt-6 font-display text-3xl font-semibold text-white sm:text-4xl">
        Estamos preparando el Año Vicenciano
      </h2>
      <p className="mt-4 text-lg leading-relaxed text-slate-300">
        Muy pronto encontrarás aquí las fiestas de María, de nuestros fundadores y de toda la Familia Vicenciana.
        Mientras tanto, mira lo que se viene en JMV Ecuador.
      </p>
      <Link href="/actividades#proximas" className={buttonVariants({ variant: "gold", size: "md", className: "mt-8" })}>
        Ver próximas actividades
      </Link>
    </section>
  );
}
