import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { StarsRing } from "@/components/brand";
import StarField from "./StarField";

// Cabecera de /calendario: cielo nocturno con el anillo de la Medalla al fondo.
export default function CalendarioHero() {
  return (
    <section
      aria-labelledby="calendario-title"
      className="relative isolate overflow-hidden bg-[#070d1d] pb-14 pt-28 sm:pb-16 sm:pt-32"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-[radial-gradient(90%_70%_at_50%_0%,#1d4e8a_0%,#0f2547_45%,#070d1d_100%)]"
      />
      <StarField className="-z-10" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-[42%] text-jmv-gold-text opacity-[0.13]"
      >
        <StarsRing withCircle className="h-[34rem] w-[34rem] sm:h-[44rem] sm:w-[44rem]" />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-b from-transparent to-jmv-ink"
      />

      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "Año Vicenciano" }]} jsonLd className="mb-8 flex justify-center" />
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-jmv-gold-text">Calendario de JMV</p>
        <h1
          id="calendario-title"
          className="font-display text-5xl font-semibold leading-[1.02] text-white text-balance sm:text-7xl lg:text-8xl"
        >
          Año <span className="italic text-jmv-gold-text">Vicenciano</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-200 sm:text-xl">
          Las fechas que nos unen como JMV y Familia Vicenciana
        </p>
      </div>
    </section>
  );
}
