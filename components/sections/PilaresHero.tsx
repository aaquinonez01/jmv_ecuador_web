'use client'

import Link from 'next/link'
import { ChevronDown, Target, Cross, Users, Hand, BookOpen } from 'lucide-react'
import ScrollReveal from '../ui/ScrollReveal'

interface Props {
  backgroundUrl?: string;
}

export default function PilaresHero({ backgroundUrl = "/images/pilares/pilares-hero.jpg" }: Props) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 sm:pt-24 lg:pt-16">
      {/* Background with Gradient Overlay */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-jmv z-10" />
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
          style={{ backgroundImage: `url('${backgroundUrl}')` }}
        />
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-20">
        <div className="hidden sm:block absolute top-32 left-10 sm:left-16 w-32 h-32 sm:w-40 sm:h-40 bg-white/10 rounded-full blur-xl animate-float" />
        <div
          className="hidden md:block absolute bottom-40 right-16 sm:right-20 w-40 h-40 sm:w-56 sm:h-56 bg-jmv-gold/20 rounded-full blur-2xl animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="hidden lg:block absolute top-2/3 left-1/4 sm:left-1/3 w-24 h-24 sm:w-32 sm:h-32 bg-jmv-red/20 rounded-full blur-lg animate-float"
          style={{ animationDelay: "4s" }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-30 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white py-8 sm:py-12 lg:py-0">
        <ScrollReveal direction="fade" delay={50}>
          <div className="mb-6 sm:mb-8">
            <div className="inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-xs sm:text-sm font-medium mb-6 sm:mb-8">
              <Target className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-jmv-gold" />
              Metodología JMV
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={100}>
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 sm:mb-8 leading-tight">
            <span className="bg-gradient-to-r from-white via-jmv-gold to-white bg-clip-text text-transparent">
              Nuestros Pilares
            </span>
            <br />
            <span className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light">
              Formativos
            </span>
          </h1>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={150}>
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light mb-6 sm:mb-8 text-white/90 font-dancing max-w-5xl mx-auto">
            "Los cuatro pilares que sostienen la formación integral 
            de cada joven vicenciano en Ecuador"
          </h2>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={200}>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/80 mb-8 sm:mb-10 lg:mb-12 max-w-4xl mx-auto leading-relaxed">
            Descubre cómo desarrollamos integralmente a nuestros jóvenes a través 
            de cuatro dimensiones fundamentales que forman líderes comprometidos 
            con la transformación social y el servicio a los más necesitados.
          </p>
        </ScrollReveal>

        {/* Pillar Preview Cards */}
        <ScrollReveal direction="up" delay={250}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-12 max-w-4xl mx-auto">
            <Link href="#apostolado" className="group">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <Hand className="w-6 h-6 sm:w-8 sm:h-8 text-jmv-gold mx-auto mb-1 sm:mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-white text-xs sm:text-sm font-medium">Apostolado</p>
              </div>
            </Link>
            <Link href="#espiritualidad" className="group">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <Cross className="w-6 h-6 sm:w-8 sm:h-8 text-jmv-gold mx-auto mb-1 sm:mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-white text-xs sm:text-sm font-medium">Espiritualidad</p>
              </div>
            </Link>
            <Link href="#comunidad" className="group">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-jmv-gold mx-auto mb-1 sm:mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-white text-xs sm:text-sm font-medium">Comunidad</p>
              </div>
            </Link>
            <Link href="#formacion" className="group">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-jmv-gold mx-auto mb-1 sm:mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-white text-xs sm:text-sm font-medium">Formación</p>
              </div>
            </Link>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={300}>
          <div className="text-center">
            <p className="text-white/70 text-sm mb-4">Explora cada pilar en detalle</p>
            <Link href="#apostolado">
              <div className="inline-flex items-center text-jmv-gold hover:text-white transition-colors cursor-pointer">
                <span className="mr-2">Comenzar el recorrido</span>
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
  )
}
