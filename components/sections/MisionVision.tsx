'use client'

import { Target, Eye, Heart, Cross, Users, Sparkles } from 'lucide-react'
import ScrollReveal from '../ui/ScrollReveal'

const values = [
  {
    icon: Heart,
    title: 'Servicio',
    description: 'Compromiso activo con los más necesitados, siguiendo el ejemplo de San Vicente de Paúl.',
    color: 'from-jmv-red to-jmv-red-dark'
  },
  {
    icon: Cross,
    title: 'Fe',
    description: 'Crecimiento espiritual centrado en Cristo y bajo la protección de María Santísima.',
    color: 'from-jmv-gold to-jmv-gold-dark'
  },
  {
    icon: Users,
    title: 'Comunidad',
    description: 'Vida fraterna que fortalece vínculos y construye la familia vicenciana.',
    color: 'from-blue-600 to-blue-800'
  },
  {
    icon: Sparkles,
    title: 'Transformación',
    description: 'Agentes de cambio que impactan positivamente en la sociedad ecuatoriana.',
    color: 'from-green-600 to-green-800'
  }
]

export default function MisionVision() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Previous section background that fades out */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom right, var(--jmv-blue-dark), var(--jmv-blue), #1e40af)',
          maskImage: 'linear-gradient(to bottom, black 0%, black 35%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 35%, transparent 100%)'
        }}
      />
      {/* Current section background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-jmv-blue-dark to-blue-800" />

      {/* Background Elements */}
      <div className="absolute top-1/4 left-0 w-72 h-72 bg-white/5 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-jmv-gold/10 rounded-full blur-3xl opacity-30" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <ScrollReveal direction="up" delay={50}>
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white font-medium mb-6">
              <Target className="w-5 h-5 mr-2" />
              Nuestra Identidad
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Misión y <span className="text-jmv-gold">Visión</span>
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Los pilares fundamentales que guían nuestro camino como Juventudes Marianas Vicencianas
            </p>
          </div>
        </ScrollReveal>

        {/* Mission and Vision Grid */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* Mission */}
          <ScrollReveal direction="left" delay={100}>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-jmv-red to-jmv-red-dark rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-white">Misión</h3>
              </div>
              <p className="text-white/80 text-lg leading-relaxed mb-6">
                Formar integralmente a jóvenes comprometidos con la fe católica y el servicio 
                a los pobres, viviendo el carisma vicenciano bajo la protección maternal de 
                María Santísima, para ser agentes de transformación en la sociedad ecuatoriana.
              </p>
              <div className="flex items-center text-jmv-gold font-medium">
                <Heart className="w-5 h-5 mr-2" />
                <span>Servir con amor como San Vicente</span>
              </div>
            </div>
          </ScrollReveal>

          {/* Vision */}
          <ScrollReveal direction="right" delay={150}>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-jmv-gold to-jmv-gold-dark rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                  <Eye className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-white">Visión</h3>
              </div>
              <p className="text-white/80 text-lg leading-relaxed mb-6">
                Ser una organización juvenil referente en Ecuador por la vivencia auténtica 
                del carisma vicenciano, contribuyendo a la transformación social y la 
                evangelización de las nuevas generaciones a través del testimonio y el servicio.
              </p>
              <div className="flex items-center text-jmv-gold font-medium">
                <Sparkles className="w-5 h-5 mr-2" />
                <span>Líderes en pastoral juvenil</span>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Values Section */}
        <ScrollReveal direction="up" delay={200}>
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Nuestros <span className="text-jmv-gold">Valores</span>
            </h3>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Los principios fundamentales que guían cada una de nuestras acciones
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => {
            const Icon = value.icon
            return (
              <ScrollReveal key={index} direction="up" delay={250 + index * 50}>
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 group text-center">
                  <div className={`w-16 h-16 bg-gradient-to-r ${value.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-3">{value.title}</h4>
                  <p className="text-white/70 text-sm leading-relaxed">{value.description}</p>
                </div>
              </ScrollReveal>
            )
          })}
        </div>

        {/* Quote Section */}
        <ScrollReveal direction="up" delay={300}>
          <div className="mt-20 text-center">
            <div className="bg-gradient-to-r from-jmv-blue to-jmv-red rounded-2xl p-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-black/30"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Cross className="w-8 h-8 text-white" />
                </div>
                <blockquote className="text-2xl md:text-3xl font-light text-white mb-6 font-dancing leading-relaxed">
                  "Entreguemos a Dios nuestras personas y nuestros bienes; 
                  Él cuidará de nosotros como cuida de las flores del campo y de las aves del cielo."
                </blockquote>
                <cite className="text-jmv-gold font-semibold text-lg">
                  - San Vicente de Paúl
                </cite>
                <p className="text-white/80 text-sm mt-2">
                  Fundador de la Familia Vicenciana
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}