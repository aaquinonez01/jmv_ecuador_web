import Link from "next/link";
import { BookX } from "lucide-react";
import { StarsRing } from "@/components/brand";
import { buttonVariants } from "@/components/ui/button-variants";

export default function LibraryNotFound() {
  return (
    <section className="flex min-h-[70vh] items-center bg-page px-4 pt-24 text-center">
      <div className="mx-auto max-w-xl">
        <div className="relative mx-auto h-24 w-24">
          <StarsRing withCircle className="absolute inset-0 h-full w-full text-accent-gold/50" />
          <BookX className="absolute inset-0 m-auto h-9 w-9 text-accent-gold" aria-hidden />
        </div>
        <h1 className="mt-6 font-display text-4xl font-semibold text-fg">No encontramos esta lectura</h1>
        <p className="mt-4 text-lg text-fg-muted">
          Puede que haya cambiado de nombre o que ya no esté publicada. Búscala en la biblioteca.
        </p>
        <Link href="/biblioteca" className={buttonVariants({ variant: "gold", size: "md", className: "mt-8 rounded-full" })}>
          Ir a la biblioteca
        </Link>
      </div>
    </section>
  );
}
