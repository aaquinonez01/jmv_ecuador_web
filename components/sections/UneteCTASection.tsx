"use client";

import Link from "next/link";
import {
  Heart,
  Users,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import Button from "../ui/Button";
import ScrollReveal from "../ui/ScrollReveal";

const pasos = [
  {
    numero: "01",
    titulo: "Contacta",
    descripcion: "Comunícate con el equipo JMV de tu zona",
    accion: "Encuentra tu zona pastoral más cercana",
  },
  {
    numero: "02",
    titulo: "Conoce",
    descripcion: "Participa en una actividad para conocer la comunidad",
    accion: "Asiste a un encuentro o actividad social",
  },
  {
    numero: "03",
    titulo: "Forma",
    descripcion: "Inicia tu proceso de formación vicenciana",
    accion: "Comienza el itinerario formativo JMV",
  },
  {
    numero: "04",
    titulo: "Compromete",
    descripcion: "Asume tu compromiso con los más necesitados",
    accion: "Participa activamente en proyectos sociales",
  },
];

const beneficios = [
  "Formación integral en liderazgo juvenil",
  "Comunidad de hermanos a nivel nacional",
  "Experiencias de servicio transformadoras",
  "Crecimiento espiritual y personal",
  "Red de contactos profesionales",
  "Oportunidades de desarrollo académico",
];

export default function UneteCTASection() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Previous section background that fades out */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom right, var(--jmv-blue-dark), #1e40af, #1d4ed8)",
          maskImage:
            "linear-gradient(to bottom, black 0%, black 35%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, black 35%, transparent 100%)",
        }}
      />
      {/* Current section background */}
      <div className="absolute inset-0 bg-gradient-to-br from-jmv-blue-dark via-blue-800 to-blue-700" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <ScrollReveal direction="up" delay={50}>
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white font-medium mb-6">
              <Heart className="w-5 h-5 mr-2" />
              ¡Tu Momento es Ahora!
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              <span className="text-jmv-gold">Únete</span> a Nuestra Familia
            </h2>
            <p className="text-xl text-white/80 max-w-4xl mx-auto leading-relaxed">
              Forma parte de una comunidad de jóvenes que transforman vidas. En
              JMV encontrarás propósito, hermandad y la oportunidad de hacer la
              diferencia.
            </p>
          </div>
        </ScrollReveal>

        {/* Steps to Join */}
        <div className="mb-20">
          <ScrollReveal direction="up" delay={100}>
            <h3 className="text-3xl font-bold text-white mb-12 text-center">
              ¿Cómo <span className="text-jmv-gold">Unirte</span>?
            </h3>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pasos.map((paso, index) => (
              <ScrollReveal key={index} direction="up" delay={150 + index * 50}>
                <div className="text-center group">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-jmv-gold to-jmv-gold-dark rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                      <span className="text-2xl font-bold text-white">
                        {paso.numero}
                      </span>
                    </div>
                    {index < pasos.length - 1 && (
                      <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-jmv-gold/50 to-transparent"></div>
                    )}
                  </div>

                  <h4 className="text-xl font-bold text-white mb-3">
                    {paso.titulo}
                  </h4>
                  <p className="text-white/70 mb-4">{paso.descripcion}</p>
                  <p className="text-jmv-gold text-sm font-medium">
                    {paso.accion}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* Benefits and CTA */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Benefits */}
          <ScrollReveal direction="left" delay={200}>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-6">
                Lo que <span className="text-jmv-gold">Ganarás</span>
              </h3>

              <div className="space-y-4">
                {beneficios.map((beneficio, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="w-6 h-6 text-jmv-gold mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-white/80">{beneficio}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-gradient-to-r from-jmv-gold/20 to-jmv-red/20 rounded-xl border border-jmv-gold/30">
                <h4 className="font-bold text-white mb-2">¿Sabías que...?</h4>
                <p className="text-white/80 text-sm">
                  El 95% de nuestros ex-jóvenes consideran que JMV fue
                  determinante en su desarrollo personal y profesional.
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Contact Form */}
          <ScrollReveal direction="right" delay={250}>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-6">
                <span className="text-jmv-gold">Contáctanos</span> Hoy
              </h3>

              <div className="space-y-6">
                <div className="flex items-center p-4 bg-white/5 rounded-lg border border-white/10">
                  <MapPin className="w-6 h-6 text-jmv-gold mr-3" />
                  <div>
                    <p className="font-medium text-white">Encuentra tu Zona</p>
                    <p className="text-white/70 text-sm">
                      Presencia en mas de 16 provincias
                    </p>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-white/5 rounded-lg border border-white/10">
                  <Phone className="w-6 h-6 text-jmv-gold mr-3" />
                  <div>
                    <p className="font-medium text-white">WhatsApp Nacional</p>
                    <p className="text-white/70 text-sm">+593 99 230 3481</p>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-white/5 rounded-lg border border-white/10">
                  <Mail className="w-6 h-6 text-jmv-gold mr-3" />
                  <div>
                    <p className="font-medium text-white">Email Nacional</p>
                    <p className="text-white/70 text-sm">
                      jmvecuador@gmail.com
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-4 flex gap-3">
                <Link href="/unete">
                  <Button
                    size="lg"
                    className="w-full bg-jmv-red text-white hover:bg-jmv-red-dark shadow-lg"
                  >
                    Quiero Unirme Ahora
                    <Heart className="ml-2 h-5 w-5" />
                  </Button>
                </Link>

                <Link href="/actividades">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full border-2 border-white/30 text-white hover:bg-white hover:text-jmv-blue"
                  >
                    Ver Próximas Actividades
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Final Message */}
        <ScrollReveal direction="up" delay={300}>
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-jmv-blue to-jmv-red rounded-2xl p-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-black/30"></div>
              <div className="relative">
                <Users className="w-16 h-16 text-jmv-gold mx-auto mb-6" />
                <blockquote className="text-2xl md:text-3xl font-light text-white mb-6 font-dancing leading-relaxed">
                  "No esperes más. El mundo necesita tu corazón generoso, tu
                  energía transformadora y tu compromiso con los que más
                  sufren."
                </blockquote>
                <cite className="text-jmv-gold font-semibold text-lg">
                  - JMV Ecuador, 30 años formando líderes
                </cite>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
