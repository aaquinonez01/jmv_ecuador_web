'use client';

import { Camera, ChevronDown } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function ActividadesHero({ heroUrl }: { heroUrl?: string }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-jmv z-10" />
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
          style={{ backgroundImage: `url('${heroUrl || "/images/actividades/actividades-hero.jpg"}')` }}
        />
      </div>
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
      <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <ScrollReveal direction="fade" delay={50}>
          <div className="mb-8">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium mb-8">
              <Camera className="w-4 h-4 mr-2 text-jmv-gold" />
              Nuestras Experiencias
            </div>
          </div>
        </ScrollReveal>
        <ScrollReveal direction="up" delay={100}>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-white via-jmv-gold to-white bg-clip-text text-transparent">
              Actividades
            </span>
            <br />
            <span className="text-white text-2xl md:text-3xl lg:text-4xl font-light">
              JMV Ecuador
            </span>
          </h1>
        </ScrollReveal>
        <ScrollReveal direction="up" delay={150}>
          <h2 className="text-xl md:text-2xl lg:text-3xl font-light mb-8 text-white/90 font-dancing max-w-5xl mx-auto">
            "Vivencias que transforman y construyen comunidad"
          </h2>
        </ScrollReveal>
        <ScrollReveal direction="up" delay={200}>
          <p className="text-lg md:text-xl text-white/80 mb-12 max-w-4xl mx-auto leading-relaxed">
            Explora las actividades realizadas por nuestras comunidades a lo largo del año.
          </p>
        </ScrollReveal>
        <ScrollReveal direction="up" delay={300}>
          <div className="text-center">
            <p className="text-white/70 text-sm mb-4">
              Ver álbumes de actividades
            </p>
            <div className="inline-flex items-center text-jmv-gold hover:text-white transition-colors cursor-pointer">
              <span className="mr-2">Comenzar</span>
              <ChevronDown className="w-5 h-5 animate-bounce" />
            </div>
          </div>
        </ScrollReveal>
      </div>
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

