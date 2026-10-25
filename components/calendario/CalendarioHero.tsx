import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { StarsRing } from "@/components/brand";
import StarField from "./StarField";
import { SkyBackdrop } from "./SkyBackdrop";

// Cabecera de /calendario con el anillo de la Medalla al fondo: cielo nocturno en
// oscuro y cielo de amanecer en claro (los dos solo con CSS).
export default function CalendarioHero() {
  return (
    <section
      aria-labelledby="calendario-title"
      className="relative isolate overflow-hidden bg-page-deep pb-14 pt-28 sm:pb-16 sm:pt-32"
    >
      <SkyBackdrop />
      <StarField className="-z-10" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-[42%] text-accent-gold opacity-[0.2] dark:opacity-[0.13]"
      >
        <StarsRing withCircle className="h-[34rem] w-[34rem] sm:h-[44rem] sm:w-[44rem]" />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-b from-transparent to-page"
      />

      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "Año Vicenciano" }]} jsonLd className="mb-8 flex justify-center" />
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-accent-gold">Calendario de JMV</p>
        <h1
          id="calendario-title"
          className="font-display text-5xl font-semibold leading-[1.02] text-fg text-balance sm:text-7xl lg:text-8xl"
        >
          Año <span className="italic text-accent-gold">Vicenciano</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-fg-muted sm:text-xl">
          Las fechas que nos unen como JMV y Familia Vicenciana
        </p>
      </div>
    </section>
  );
}
