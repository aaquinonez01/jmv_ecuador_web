import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import StarsRing from "@/components/brand/StarsRing";
import { buttonVariants } from "@/components/ui/button-variants";
import { SITE, yearsSinceFoundation } from "@/lib/site";

interface Props {
  backgroundUrl?: string;
  backgroundAlt?: string;
}

// Server Component: el h1 se pinta sin esperar JS (LCP) y sin animaciones infinitas.
export default function HeroSection({
  backgroundUrl = "/images/hero/hero.jpg",
  backgroundAlt = "Jóvenes de JMV de distintas zonas del Ecuador con sus banderas frente a la gruta de la Virgen",
}: Props) {
  const years = yearsSinceFoundation();

  return (
    <section
      aria-labelledby="home-hero-title"
      className="relative isolate flex min-h-[88svh] items-end overflow-hidden bg-jmv-ink pt-24 pb-14 sm:pt-28 sm:pb-20 lg:min-h-[90vh]"
    >
      <Image
        src={backgroundUrl}
        alt={backgroundAlt}
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        className="-z-20 object-cover object-[50%_40%]"
      />
      {/* Velo inferior y lateral: protege el texto y deja ver a los jóvenes */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-jmv-ink via-jmv-ink/75 via-45% to-jmv-ink/0"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 hidden bg-gradient-to-r from-jmv-ink/70 via-jmv-ink/20 to-transparent md:block"
      />
      <StarsRing
        withCircle
        className="pointer-events-none absolute -right-20 top-24 -z-10 hidden h-[26rem] w-[26rem] text-jmv-gold-text/20 lg:block"
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl text-white">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-jmv-ink/40 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
            <span aria-hidden className="h-2 w-2 rounded-full bg-jmv-gold-text" />
            Desde {SITE.foundedYear} en Ecuador · {years} años
          </p>

          <h1
            id="home-hero-title"
            className="text-4xl font-bold leading-[1.05] text-balance sm:text-6xl lg:text-7xl"
          >
            Juventudes Marianas Vicencianas
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-100 sm:text-xl">
            Una comunidad católica para jóvenes de 15 a 30 años que viven la fe,
            se forman y sirven a los más pobres, en grupos de todo Ecuador.
          </p>

          <p className="mt-4 hidden font-display text-xl italic text-jmv-gold-text sm:block">
            “{SITE.tagline}”
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/unete" className={buttonVariants({ variant: "gold", size: "lg" })}>
              Encuentra tu grupo
              <ArrowRight className="ml-2 h-5 w-5" aria-hidden />
            </Link>
            <Link href="/quienes-somos" className={buttonVariants({ variant: "outlineLight", size: "lg" })}>
              Conoce JMV
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
