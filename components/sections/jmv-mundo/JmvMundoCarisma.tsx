"use client";

import Image from "next/image";
import { Star, Heart, HandHeart, BookOpen, Church } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";

const CARISMA = [
  {
    icon: Heart,
    titulo: "Espiritualidad mariana",
    texto:
      "María Inmaculada, la de la Medalla Milagrosa, es modelo y guía de cada joven de JMV.",
  },
  {
    icon: HandHeart,
    titulo: "Servicio a los pobres",
    texto:
      "Siguiendo a San Vicente de Paúl, la evangelización y el servicio a los más necesitados son el sello de JMV.",
  },
  {
    icon: BookOpen,
    titulo: "Formación integral",
    texto:
      "Acompaña el crecimiento humano, cristiano y vicenciano de los jóvenes a lo largo de las distintas etapas.",
  },
  {
    icon: Church,
    titulo: "Comunidad e Iglesia",
    texto:
      "Forma parte de la Familia Vicenciana y vive su misión en comunión con la Iglesia.",
  },
];

export default function JmvMundoCarisma() {
  return (
    <section
      id="carisma-internacional"
      className="relative overflow-hidden bg-gradient-to-b from-blue-900 via-jmv-blue-dark to-blue-900 py-20"
    >
      <div className="absolute right-20 top-20 h-80 w-80 rounded-full bg-jmv-gold/10 blur-3xl" />
      <div className="absolute bottom-20 left-10 h-64 w-64 rounded-full bg-white/5 blur-2xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" delay={50}>
          <div className="mb-12 grid items-center gap-10 lg:grid-cols-2">
            <div className="relative h-72 overflow-hidden rounded-3xl border border-white/20 shadow-2xl sm:h-96">
              <Image
                src="/images/gallery/adoracion_santisimo.jpeg"
                alt="Jóvenes de JMV en adoración"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-jmv-blue-dark/70 via-transparent to-transparent" />
            </div>

            <div>
              <div className="mb-6 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-6 py-3 font-medium text-white backdrop-blur-md">
                <Star className="mr-2 h-5 w-5 text-jmv-gold" />
                Nuestro carisma
              </div>
              <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
                ¿Qué <span className="text-jmv-gold">vive la JMV</span>?
              </h2>
              <p className="text-xl leading-relaxed text-white/80">
                La Juventud Mariana Vicenciana es la renovación de la antigua
                Asociación de Hijas e Hijos de María. Como parte de la Familia de
                San Vicente de Paúl, comparte un mismo carisma en todo el mundo:
                amor a María, servicio a los pobres y formación de los jóvenes.
              </p>
            </div>
          </div>
        </ScrollReveal>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {CARISMA.map((item, index) => {
            const Icon = item.icon;
            return (
              <ScrollReveal key={item.titulo} direction="up" delay={120 + index * 40}>
                <div className="h-full rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-md transition-all duration-300 hover:bg-white/15">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-jmv-gold/20 text-jmv-gold">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h4 className="mb-2 text-lg font-bold text-white">
                    {item.titulo}
                  </h4>
                  <p className="text-sm leading-relaxed text-white/75">
                    {item.texto}
                  </p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
