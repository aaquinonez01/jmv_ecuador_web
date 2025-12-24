'use client'

import Link from 'next/link'
import { ArrowRight, Cross, Users2, BookOpen, HeartHandshake } from 'lucide-react'
import ScrollReveal from '../ui/ScrollReveal'
import Card, { CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card'

const pillars = [
  {
    icon: Cross,
    title: "Formación Espiritual",
    description: "Crecimiento en la fe católica y vivencia del carisma vicenciano, siguiendo el ejemplo de San Vicente de Paúl y Santa Catalina Labouré.",
    color: "from-jmv-blue to-jmv-blue-light"
  },
  {
    icon: Users2,
    title: "Vida Comunitaria",
    description: "Construcción de vínculos fraternos y espacios de encuentro que fortalecen la identidad y pertenencia a la familia vicenciana.",
    color: "from-jmv-red to-jmv-red-light"
  },
  {
    icon: HeartHandshake,
    title: "Servicio Social",
    description: "Compromiso activo con los más necesitados, llevando esperanza y transformación a las comunidades vulnerables de Ecuador.",
    color: "from-jmv-gold to-jmv-gold-light"
  },
  {
    icon: BookOpen,
    title: "Formación Integral",
    description: "Desarrollo de capacidades humanas, liderazgo y compromiso social para formar agentes de cambio en la sociedad.",
    color: "from-purple-500 to-purple-600"
  }
]

export default function AboutSection() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Hero background that fades out */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, var(--jmv-blue) 0%, var(--jmv-blue-dark) 100%)',
          maskImage: 'linear-gradient(to bottom, black 0%, black 40%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 40%, transparent 100%)'
        }}
      />
      {/* Current section background */}
      <div className="absolute inset-0 bg-gradient-to-br from-jmv-blue-dark via-jmv-blue to-blue-800" />
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-jmv-blue/20 rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl opacity-30 translate-x-1/2 translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header Section */}
        <div className="text-center mb-20">
          <ScrollReveal direction="up" delay={100}>
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6 border border-white/30">
              <Cross className="w-4 h-4 mr-2" />
              Carisma Vicenciano
            </div>
          </ScrollReveal>
          
          <ScrollReveal direction="up" delay={200}>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              ¿Quiénes Somos las
              <br />
              <span className="text-jmv-gold">
                Juventudes Marianas Vicencianas?
              </span>
            </h2>
          </ScrollReveal>
          
          <ScrollReveal direction="up" delay={300}>
            <p className="text-xl text-white/80 max-w-4xl mx-auto leading-relaxed">
              Somos una organización de jóvenes católicos que viven y comparten el carisma 
              vicenciano a través de la formación integral, la vida comunitaria y el servicio 
              a los más necesitados, bajo la protección maternal de María.
            </p>
          </ScrollReveal>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Left Content */}
          <div>
            <ScrollReveal direction="left" delay={200}>
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Nuestra Misión
                </h3>
                <p className="text-lg text-white/70 leading-relaxed">
                  Formar integralmente a jóvenes comprometidos con la fe católica y el servicio 
                  a los pobres, siguiendo el ejemplo de San Vicente de Paúl y el amor maternal 
                  de María, Madre de la Medalla Milagrosa.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="left" delay={400}>
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Nuestra Visión
                </h3>
                <p className="text-lg text-white/70 leading-relaxed">
                  Ser una organización juvenil referente en Ecuador por la vivencia auténtica 
                  del carisma vicenciano, contribuyendo a la transformación social y la 
                  evangelización de las nuevas generaciones.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="left" delay={600}>
              <Link 
                href="/quienes-somos"
                className="inline-flex items-center text-jmv-blue hover:text-jmv-blue-dark font-semibold group"
              >
                Conoce nuestra historia completa
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </ScrollReveal>
          </div>

          {/* Right Image */}
          <ScrollReveal direction="right" delay={300}>
            <div className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden shadow-jmv-lg">
                <div className="w-full h-full bg-gradient-jmv flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                      <Cross className="w-12 h-12" />
                    </div>
                    <h4 className="text-2xl font-bold mb-2">JMV Ecuador</h4>
                    <p className="text-lg opacity-90">Desde 1995</p>
                  </div>
                </div>
              </div>
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-jmv-gold/20 rounded-full blur-xl animate-float" />
              <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-jmv-red/20 rounded-full blur-lg animate-float" style={{ animationDelay: '2s' }} />
            </div>
          </ScrollReveal>
        </div>

        {/* Pillars Section */}
        <div>
          <ScrollReveal direction="up" delay={100}>
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-bold text-jmv-blue mb-4">
                Nuestros Pilares Fundamentales
              </h3>
              <p className="text-lg text-jmv-gray max-w-3xl mx-auto">
                Cuatro dimensiones esenciales que guían nuestro caminar como jóvenes vicencianos
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((pillar, index) => {
              const Icon = pillar.icon
              return (
                <ScrollReveal key={index} direction="up" delay={200 + index * 100}>
                  <Card hover className="h-full group">
                    <CardHeader className="text-center">
                      <div className={`w-16 h-16 bg-gradient-to-r ${pillar.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="text-lg">{pillar.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-center">
                        {pillar.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              )
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <ScrollReveal direction="up" delay={600}>
          <div className="text-center mt-16 p-8 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20">
            <h4 className="text-2xl font-bold text-white mb-4">
              ¿Te sientes llamado a vivir el carisma vicenciano?
            </h4>
            <p className="text-lg text-white/70 mb-6 max-w-2xl mx-auto">
              Descubre cómo puedes ser parte de esta gran familia que transforma vidas 
              a través del amor y el servicio.
            </p>
            <Link href="/unete">
              <button className="bg-white text-jmv-blue px-8 py-4 rounded-xl font-semibold hover:bg-white/90 transition-all duration-200 transform hover:scale-105 shadow-lg">
                Únete a JMV Ecuador
              </button>
            </Link>
          </div>
        </ScrollReveal>
      </div>

    </section>
  )
}