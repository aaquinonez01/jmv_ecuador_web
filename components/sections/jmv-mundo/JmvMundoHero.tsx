"use client";

import Link from "next/link";
import { Globe, ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";
import ScrollReveal from "@/components/ui/ScrollReveal";

const STATS = [
  { value: "1830", label: "Nuestro origen" },
  { value: "+78", label: "Países" },
  { value: "+30.000", label: "Miembros" },
  { value: "5", label: "Continentes" },
];

export default function JmvMundoHero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-24">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/images/hero/hero.jpg')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-br from-jmv-blue-dark/95 via-blue-900/90 to-jmv-blue/90" />
      </div>

      <div className="absolute inset-0 z-20">
        <div className="animate-float absolute left-16 top-32 h-40 w-40 rounded-full bg-white/10 blur-xl" />
        <div
          className="animate-float absolute bottom-40 right-20 h-56 w-56 rounded-full bg-jmv-gold/20 blur-2xl"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="animate-float absolute left-1/3 top-2/3 h-32 w-32 rounded-full bg-jmv-red/20 blur-lg"
          style={{ animationDelay: "4s" }}
        />
      </div>

      <div className="relative z-30 mx-auto max-w-7xl px-4 text-center text-white sm:px-6 lg:px-8">
        <ScrollReveal direction="fade" delay={50}>
          <div className="mb-8 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-medium backdrop-blur-sm">
            <Globe className="mr-2 h-4 w-4 text-jmv-gold" />
            Juventud Mariana Vicenciana Internacional
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={100}>
          <h1 className="mb-8 text-4xl font-bold leading-tight md:text-6xl lg:text-7xl">
            <span className="bg-gradient-to-r from-white via-jmv-gold to-white bg-clip-text text-transparent">
              JMV en el Mundo
            </span>
            <br />
            <span className="text-2xl font-light text-white md:text-3xl lg:text-4xl">
              Una familia joven en cinco continentes
            </span>
          </h1>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={150}>
          <h2 className="font-dancing mx-auto mb-8 max-w-5xl text-xl font-light text-white/90 md:text-2xl lg:text-3xl">
            &ldquo;Comprometidos con los jóvenes, el mundo, la Iglesia y los
            pobres&rdquo;
          </h2>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={200}>
          <p className="mx-auto mb-12 max-w-4xl text-lg leading-relaxed text-white/80 md:text-xl">
            La Juventud Mariana Vicenciana (JMV) es una asociación internacional
            de la Familia de San Vicente de Paúl. Nacida de las apariciones de la
            Virgen de la Medalla Milagrosa en 1830, hoy reúne a miles de jóvenes
            en más de 78 países. JMV Ecuador es parte de esta gran familia
            mundial.
          </p>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={250}>
          <div className="mb-16 flex flex-col items-center justify-center gap-6 sm:flex-row">
            <Link href="#gobierno-internacional">
              <Button
                size="lg"
                className="bg-white text-jmv-blue shadow-2xl hover:bg-white/90"
              >
                Conoce su gobierno
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/estructura">
              <Button
                size="lg"
                variant="outline"
                className="border-white/40 text-white hover:bg-white/10"
              >
                Estructura en Ecuador
              </Button>
            </Link>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={300}>
          <div className="mx-auto grid max-w-3xl grid-cols-2 gap-8 md:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="mb-2 text-3xl font-bold text-jmv-gold md:text-4xl">
                  {stat.value}
                </div>
                <div className="text-sm text-white/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>

      <div className="absolute bottom-8 left-1/2 z-30 -translate-x-1/2">
        <div className="animate-bounce">
          <div className="flex h-10 w-6 justify-center rounded-full border-2 border-white/50">
            <div className="mt-2 h-3 w-1 animate-pulse rounded-full bg-white/50" />
          </div>
        </div>
      </div>
    </section>
  );
}
