"use client";

import Link from "next/link";
import { ChevronDown, Calendar, Clock, Star } from "lucide-react";
import ScrollReveal from "../ui/ScrollReveal";

export default function HistoriaPageHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24">
      {/* Background with Gradient Overlay */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-black z-10 opacity-60" />
        <div className="absolute inset-0 bg-[url('/images/historia/jmv-fundacion.jpg')] bg-cover bg-top bg-no-repeat opacity-80" />
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-20">
        <div className="absolute top-32 left-16 w-40 h-40 bg-white/10 rounded-full blur-xl animate-float" />
        <div
          className="absolute bottom-40 right-20 w-56 h-56 bg-jmv-gold/20 rounded-full blur-2xl animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-2/3 left-1/3 w-32 h-32 bg-jmv-red/20 rounded-full blur-lg animate-float"
          style={{ animationDelay: "4s" }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <ScrollReveal direction="fade" delay={50}>
          <div className="mb-8">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium mb-8">
              <Calendar className="w-4 h-4 mr-2 text-jmv-gold" />
              Nuestro Legado
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={100}>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-white via-jmv-gold to-white bg-clip-text text-transparent">
              Historia de
            </span>
            <br />
            <span className="text-white text-2xl md:text-3xl lg:text-4xl font-light">
              JMV Ecuador
            </span>
          </h1>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={150}>
          <h2 className="text-xl md:text-2xl lg:text-3xl font-light mb-8 text-white/90 font-dancing max-w-5xl mx-auto">
            "30 años construyendo historia, transformando vidas y sembrando
            esperanza en el corazón del Ecuador"
          </h2>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={200}>
          <p className="text-lg md:text-xl text-white/80 mb-12 max-w-4xl mx-auto leading-relaxed">
            Desde 1995 hasta hoy, conoce los momentos más importantes que han
            marcado el crecimiento y la consolidación de Juventudes Marianas
            Vicencianas en todo el territorio ecuatoriano.
          </p>
        </ScrollReveal>

        {/* Timeline Preview Stats */}
        <ScrollReveal direction="up" delay={250}>
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mb-12">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-jmv-gold mb-2">
                1995
              </div>
              <div className="text-white/70 text-sm">Año de Fundación</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-jmv-gold mb-2">
                8
              </div>
              <div className="text-white/70 text-sm">Hitos Históricos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-jmv-gold mb-2">
                30
              </div>
              <div className="text-white/70 text-sm">Años de Servicio</div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={300}>
          <div className="text-center">
            <p className="text-white/70 text-sm mb-4">
              Explora nuestra línea de tiempo interactiva
            </p>
            <Link href="#timeline">
              <div className="inline-flex items-center text-jmv-gold hover:text-white transition-colors cursor-pointer">
                <Clock className="mr-2 w-5 h-5" />
                <span className="mr-2">Comenzar el recorrido histórico</span>
                <ChevronDown className="w-5 h-5 animate-bounce" />
              </div>
            </Link>
          </div>
        </ScrollReveal>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
        <div className="animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
