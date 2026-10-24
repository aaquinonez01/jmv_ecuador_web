import Link from "next/link";
import { StarsRing } from "@/components/brand";
import { buttonVariants } from "@/components/ui/button-variants";

export default function CalendarDateNotFound() {
  return (
    <section className="flex min-h-[70vh] items-center bg-jmv-ink px-4 pt-24 text-center">
      <div className="mx-auto max-w-xl">
        <StarsRing withCircle className="mx-auto h-24 w-24 text-jmv-gold-text/60" />
        <h1 className="mt-6 font-display text-4xl font-semibold text-white">No encontramos esta fecha</h1>
        <p className="mt-4 text-lg text-slate-300">
          Puede que haya cambiado de nombre. Búscala en el anillo de las 12 estrellas.
        </p>
        <Link href="/calendario" className={buttonVariants({ variant: "gold", size: "md", className: "mt-8" })}>
          Ir al Año Vicenciano
        </Link>
      </div>
    </section>
  );
}
