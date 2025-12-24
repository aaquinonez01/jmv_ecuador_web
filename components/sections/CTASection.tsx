'use client'

import Link from 'next/link'
import { ArrowRight, Users, Heart, Star, Sparkles } from 'lucide-react'
import ScrollReveal from '../ui/ScrollReveal'

const ctaOptions = [
  {
    icon: Users,
    title: "Únete a JMV",
    description: "Forma parte de nuestra familia vicenciana",
    link: "/unete",
    color: "from-blue-700 to-blue-600"
  },
  {
    icon: Heart,
    title: "Conoce Nuestra Historia",
    description: "Descubre 30 años de historia (1995-2025)",
    link: "/quienes-somos",
    color: "from-blue-700 to-blue-600"
  },
  {
    icon: Star,
    title: "Próximas Actividades",
    description: "Participa en nuestros eventos",
    link: "/actividades",
    color: "from-blue-600 to-blue-600"
  }
]

export default function CTASection() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 relative overflow-hidden">
      {/* Previous section background that fades out */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom right, #1e3a8a, var(--jmv-blue-dark), var(--jmv-blue))',
          maskImage: 'linear-gradient(to bottom, black 0%, black 35%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 35%, transparent 100%)'
        }}
      />
      {/* Current section background */}
      <div className="absolute inset-0 bg-gradient-to-br from-jmv-blue-dark via-blue-800 to-blue-700" />
      
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="hidden sm:block absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-white/3 rounded-full blur-3xl" />
        <div className="hidden sm:block absolute bottom-0 left-0 w-48 h-48 sm:w-80 sm:h-80 bg-white/5 rounded-full blur-3xl" />
        <div className="hidden lg:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/3 rounded-full blur-2xl" />
      </div>

      {/* Floating Icons */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="hidden sm:block absolute top-20 left-10 text-white/10 animate-float">
          <Heart className="w-12 h-12 sm:w-16 sm:h-16" />
        </div>
        <div className="hidden md:block absolute top-40 right-16 text-white/10 animate-float" style={{ animationDelay: '2s' }}>
          <Star className="w-16 h-16 sm:w-20 sm:h-20" />
        </div>
        <div className="hidden lg:block absolute bottom-32 left-1/4 text-white/10 animate-float" style={{ animationDelay: '4s' }}>
          <Sparkles className="w-10 h-10 sm:w-12 sm:h-12" />
        </div>
        <div className="hidden sm:block absolute top-60 left-1/3 text-white/10 animate-float" style={{ animationDelay: '1s' }}>
          <Users className="w-10 h-10 sm:w-14 sm:h-14" />
        </div>
        <div className="hidden md:block absolute bottom-48 right-1/4 text-white/10 animate-float" style={{ animationDelay: '3s' }}>
          <Heart className="w-8 h-8 sm:w-10 sm:h-10" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Main CTA */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <ScrollReveal direction="up" delay={100}>
            <div className="inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 bg-white/10 backdrop-blur-md rounded-full text-white text-xs sm:text-sm font-medium mb-6 sm:mb-8 border border-white/20">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Tu llamado te espera
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={200}>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 sm:mb-8 leading-tight">
              ¿Estás listo para
              <br />
              <span className="text-white/90">
                transformar vidas?
              </span>
            </h2>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={300}>
            <p className="text-xl md:text-2xl text-white/80 max-w-4xl mx-auto mb-12 leading-relaxed">
              En JMV Ecuador creemos que cada joven tiene el potencial de ser un agente de cambio. 
              Únete a nuestra misión de servir a los más necesitados y vivir el carisma vicenciano 
              con alegría y esperanza.
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={400}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
              <Link href="/unete">
                <button className="bg-white text-blue-800 px-10 py-5 rounded-2xl text-lg font-bold hover:bg-white/90 transition-all duration-300 transform hover:scale-105 shadow-2xl group">
                  Únete Ahora
                  <ArrowRight className="inline ml-3 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </button>
              </Link>
              <Link href="/contacto">
                <button className="border-2 border-white/20 bg-white/10 backdrop-blur-md text-white px-10 py-5 rounded-2xl text-lg font-bold hover:bg-white/20 hover:border-white/40 transition-all duration-300 transform hover:scale-105">
                  Más Información
                </button>
              </Link>
            </div>
          </ScrollReveal>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {ctaOptions.map((option, index) => {
            const Icon = option.icon
            return (
              <ScrollReveal key={index} direction="up" delay={500 + index * 100}>
                <Link href={option.link}>
                  <div className="group cursor-pointer">
                    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-500 transform group-hover:-translate-y-4 relative overflow-hidden">
                      {/* Background Gradient */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${option.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                      
                      {/* Icon */}
                      <div className={`w-16 h-16 bg-gradient-to-br ${option.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>

                      {/* Content */}
                      <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-white/90 transition-colors duration-300">
                        {option.title}
                      </h3>
                      <p className="text-white/70 mb-6 leading-relaxed">
                        {option.description}
                      </p>

                      {/* Arrow */}
                      <div className="flex items-center text-white group-hover:text-white/90 transition-colors duration-300">
                        <span className="font-semibold mr-2">Explorar</span>
                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
                      </div>

                      {/* Decorative Element */}
                      <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            )
          })}
        </div>

        {/* Bottom Quote */}
        <ScrollReveal direction="up" delay={800}>
          <div className="text-center bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-12">
            <div className="max-w-4xl mx-auto">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <blockquote className="text-2xl md:text-3xl font-light text-white mb-6 italic font-dancing">
                "Si amas a Cristo, ayuda al pobre, porque en él encontrarás a Cristo"
              </blockquote>
              <cite className="text-lg font-semibold text-white/80">
                — San Vicente de Paúl
              </cite>
            </div>
          </div>
        </ScrollReveal>

        {/* Final Encouragement */}
        <ScrollReveal direction="up" delay={1000}>
          <div className="text-center mt-16">
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Cada historia de transformación comienza con una decisión. 
              <br />
              <span className="font-semibold text-white">
                La tuya puede empezar hoy.
              </span>
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}