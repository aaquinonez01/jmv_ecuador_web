import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { StarsRing } from "@/components/brand";
import { HeroBackdrop } from "@/components/media/HeroMedia";
import type { SlotPhoto } from "@/lib/site-images";
import StarField from "./StarField";

// Cabecera de /calendario: foto (espacio calendario.hero) con cielo estrellado y
// el anillo de la Medalla encima. Es corta a propósito: el protagonista es el
// anillo interactivo que viene justo debajo. Isla oscura en ambos modos.
export default function CalendarioHero({ images }: { images: readonly SlotPhoto[] }) {
  return (
    <section
      aria-labelledby="calendario-title"
      data-tone="dark"
      className="relative isolate flex min-h-[44svh] items-end overflow-hidden bg-jmv-ink pb-8 pt-24 sm:min-h-[52vh] sm:pb-12 sm:pt-28"
    >
      <HeroBackdrop images={images} carouselLabel="Fotos del Año Vicenciano" />
      <StarField count={36} className="-z-10 opacity-70" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-1/2 -z-10 -translate-y-1/2 text-jmv-gold-text opacity-30 sm:right-[6%]"
      >
        <StarsRing withCircle className="h-[22rem] w-[22rem] sm:h-[30rem] sm:w-[30rem]" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* La ruta se ve desde sm; en móvil solo queda su JSON-LD para buscadores */}
        <Breadcrumbs items={[{ label: "Año Vicenciano" }]} jsonLd className="mb-6 hidden sm:block" />
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-jmv-gold-text sm:text-sm">
          Calendario de JMV
        </p>
        <h1
          id="calendario-title"
          className="font-display text-5xl font-semibold leading-[1.02] text-white text-balance [text-shadow:0_2px_16px_rgb(15_23_42/0.45)] sm:text-7xl lg:text-8xl"
        >
          Año <span className="italic text-jmv-gold-text">Vicenciano</span>
        </h1>
        <p className="mt-3 max-w-xl text-base leading-snug text-slate-100 [text-shadow:0_1px_10px_rgb(15_23_42/0.6)] sm:mt-4 sm:text-xl">
          Las fechas que nos unen como JMV y Familia Vicenciana
        </p>
      </div>
    </section>
  );
}
