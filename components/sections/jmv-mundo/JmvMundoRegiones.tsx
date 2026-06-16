"use client";

import Link from "next/link";
import Image from "next/image";
import { Globe2, Map, MapPin, ArrowRight, Users } from "lucide-react";
import Button from "@/components/ui/Button";
import ScrollReveal from "@/components/ui/ScrollReveal";

const CONTINENTES = [
  { region: "África", consejera: "Maria Sfeir", pais: "Líbano", emoji: "🌍" },
  { region: "América", consejera: "Catarina Érika Morais", pais: "Brasil", emoji: "🌎" },
  {
    region: "Asia-Oceanía",
    consejera: "Marie Claire Solon Balo",
    pais: "Filipinas",
    emoji: "🌏",
  },
  { region: "Europa", consejera: "Martha Araújo", pais: "Portugal", emoji: "🌍" },
];

const PAISES_ANDINA = [
  "Colombia",
  "Ecuador",
  "Perú",
  "Bolivia",
  "Venezuela",
];

export default function JmvMundoRegiones() {
  return (
    <section
      id="regiones"
      className="relative overflow-hidden bg-gradient-to-b from-blue-900 via-jmv-blue-dark to-jmv-blue py-20"
    >
      <div className="absolute right-10 top-20 h-72 w-72 rounded-full bg-jmv-gold/10 blur-3xl" />
      <div className="absolute bottom-20 left-10 h-64 w-64 rounded-full bg-white/5 blur-2xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" delay={50}>
          <div className="mb-16 text-center">
            <div className="mb-6 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-6 py-3 font-medium text-white backdrop-blur-md">
              <Globe2 className="mr-2 h-5 w-5 text-jmv-gold" />
              Presencia mundial
            </div>
            <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
              Una JMV por <span className="text-jmv-gold">continentes</span>
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-white/80">
              El Consejo Internacional cuenta con un consejero o consejera para
              cada continente, que acompaña y articula la vida de la JMV en su
              región.
            </p>
          </div>
        </ScrollReveal>

        {/* Consejeros continentales */}
        <div className="mb-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CONTINENTES.map((c, index) => (
            <ScrollReveal key={c.region} direction="up" delay={80 + index * 40}>
              <div className="h-full rounded-2xl border border-white/20 bg-white/10 p-6 text-center backdrop-blur-md transition-all duration-300 hover:bg-white/15">
                <div className="mb-3 text-4xl">{c.emoji}</div>
                <h3 className="mb-3 text-xl font-bold text-jmv-gold">
                  {c.region}
                </h3>
                <div className="flex items-center justify-center gap-2 text-white">
                  <Users className="h-4 w-4 text-jmv-gold" />
                  <span className="font-medium">{c.consejera}</span>
                </div>
                <p className="mt-1 text-sm text-white/60">{c.pais}</p>
                <p className="mt-2 text-xs uppercase tracking-wide text-white/40">
                  Consejera continental
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Foto de encuentro */}
        <ScrollReveal direction="up" delay={90}>
          <div className="relative mb-12 h-64 overflow-hidden rounded-3xl border border-white/20 shadow-2xl sm:h-80">
            <Image
              src="/images/gallery/encuentro_nacional_2025.jpg"
              alt="Encuentro de jóvenes de JMV"
              fill
              sizes="(max-width: 1280px) 100vw, 1200px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-jmv-blue-dark/85 via-jmv-blue-dark/20 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 sm:p-8">
              <p className="max-w-xl text-lg font-medium text-white sm:text-xl">
                Los encuentros regionales unen a los jóvenes vicencianos de toda
                la familia mundial.
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* Latinoamérica y Región Andina */}
        <ScrollReveal direction="up" delay={100}>
          <div className="rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-md">
            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <div className="mb-4 inline-flex items-center rounded-full border border-jmv-gold/30 bg-jmv-gold/10 px-4 py-2 text-sm font-medium text-jmv-gold">
                  <Map className="mr-2 h-4 w-4" />
                  JMV Latinoamericana · Región Andina
                </div>
                <h3 className="mb-4 text-2xl font-bold text-white md:text-3xl">
                  El lugar de <span className="text-jmv-gold">JMV Ecuador</span>
                </h3>
                <p className="mb-4 leading-relaxed text-white/80">
                  Dentro del continente americano, la JMV se articula también por
                  zonas. JMV Ecuador forma parte de la <strong>Región Andina</strong>,
                  que reúne a las JMV de los países que comparten la cordillera de
                  los Andes y un mismo camino pastoral y vicenciano.
                </p>
                <p className="leading-relaxed text-white/70">
                  Esta cercanía permite compartir encuentros, formación y misión
                  entre los jóvenes de la región, fortaleciendo los lazos de la
                  gran familia mariana vicenciana en Latinoamérica.
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                <h4 className="mb-4 flex items-center text-lg font-semibold text-white">
                  <MapPin className="mr-2 h-5 w-5 text-jmv-gold" />
                  Países de la Región Andina
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {PAISES_ANDINA.map((pais) => (
                    <div
                      key={pais}
                      className={`rounded-lg border px-4 py-3 text-center font-medium ${
                        pais === "Ecuador"
                          ? "border-jmv-gold/50 bg-jmv-gold/15 text-jmv-gold"
                          : "border-white/10 bg-white/5 text-white/80"
                      }`}
                    >
                      {pais}
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-center text-xs text-white/50">
                  La conformación de la región puede variar según los encuentros y
                  la organización pastoral de cada periodo.
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* CTA */}
        <ScrollReveal direction="up" delay={150}>
          <div className="relative mt-16 overflow-hidden rounded-2xl bg-gradient-to-r from-jmv-blue to-jmv-red p-12 text-center">
            <div className="absolute inset-0 bg-black/30" />
            <div className="relative">
              <Globe2 className="mx-auto mb-6 h-14 w-14 text-jmv-gold" />
              <h3 className="mb-4 text-3xl font-bold text-white">
                De la familia mundial a tu comunidad
              </h3>
              <p className="mx-auto mb-8 max-w-2xl text-white/80">
                JMV Ecuador es la expresión local de esta gran familia presente en
                más de 78 países. Conoce cómo nos organizamos en el país y súmate.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="/estructura">
                  <Button
                    size="lg"
                    className="bg-white text-jmv-blue shadow-2xl hover:bg-white/90"
                  >
                    Estructura de JMV Ecuador
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/contacto">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/40 text-white hover:bg-white/10"
                  >
                    Quiero participar
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
