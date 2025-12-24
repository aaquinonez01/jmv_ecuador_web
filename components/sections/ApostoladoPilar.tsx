'use client'

import { useState } from 'react'
import { Hand, Heart, Users, MapPin, ChevronLeft, ChevronRight, Play } from 'lucide-react'
import ScrollReveal from '../ui/ScrollReveal'

const apostoladoActividades = [
  {
    titulo: 'Comedores Comunitarios',
    descripcion: 'Preparación y distribución de alimentos nutritivos para familias en situación de vulnerabilidad.',
    imagen: '/images/pilares/apostolado/comedor-comunitario.jpg',
    ubicacion: 'Zona Norte - Quito',
    beneficiarios: 150
  },
  {
    titulo: 'Brigadas Médicas',
    descripcion: 'Atención médica gratuita en comunidades rurales y urbano-marginales.',
    imagen: '/images/pilares/apostolado/brigada-medica.jpg',
    ubicacion: 'Zona Sur - Cuenca',
    beneficiarios: 200
  },
  {
    titulo: 'Apoyo Educativo',
    descripcion: 'Refuerzo escolar y talleres educativos para niños y adolescentes.',
    imagen: '/images/pilares/apostolado/apoyo-educativo.jpg',
    ubicacion: 'Zona Costa Centro - Guayaquil',
    beneficiarios: 120
  },
  {
    titulo: 'Construcción de Viviendas',
    descripcion: 'Mejoramiento y construcción de viviendas dignas para familias necesitadas.',
    imagen: '/images/pilares/apostolado/construccion-viviendas.jpg',
    ubicacion: 'Zona Centro - Ambato',
    beneficiarios: 50
  },
  {
    titulo: 'Cuidado de Adultos Mayores',
    descripcion: 'Acompañamiento y cuidado integral a personas de la tercera edad.',
    imagen: '/images/pilares/apostolado/adultos-mayores.jpg',
    ubicacion: 'Zona Costa Norte - Esmeraldas',
    beneficiarios: 80
  },
  {
    titulo: 'Programas de Capacitación',
    descripcion: 'Talleres de oficios y emprendimiento para jóvenes y adultos.',
    imagen: '/images/pilares/apostolado/capacitacion.jpg',
    ubicacion: 'Zona Oriente - Tena',
    beneficiarios: 90
  }
]

export default function ApostoladoPilar() {
  const [currentImage, setCurrentImage] = useState(0)

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % apostoladoActividades.length)
  }

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + apostoladoActividades.length) % apostoladoActividades.length)
  }

  return (
    <section id="apostolado" className="py-12 sm:py-16 lg:py-20 relative overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom right, var(--jmv-blue-dark), #1e40af, #1d4ed8)',
          maskImage: 'linear-gradient(to bottom, black 0%, black 35%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 35%, transparent 100%)'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-jmv-blue-dark to-blue-800" />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <ScrollReveal direction="up" delay={50}>
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white font-medium mb-6">
              <Hand className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Primer Pilar
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              <span className="text-jmv-gold">Apostolado</span> Social
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/80 max-w-4xl mx-auto leading-relaxed">
              Compromiso activo con los más necesitados siguiendo el ejemplo de San Vicente de Paúl. 
              Nuestros jóvenes transforman realidades a través del servicio directo y el amor concreto.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 mb-12 sm:mb-16">
          {/* Gallery Section */}
          <ScrollReveal direction="left" delay={100}>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 lg:p-6 border border-white/20">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 text-center">Galería de Actividades</h3>
              
              {/* Main Image */}
              <div className="relative mb-4 sm:mb-6">
                <div className="aspect-video bg-white/10 rounded-xl border border-white/20 flex items-center justify-center overflow-hidden group">
                  <div className="text-center p-3 sm:p-4">
                    <Play className="w-12 h-12 sm:w-16 sm:h-16 text-jmv-gold mb-3 sm:mb-4 group-hover:scale-110 transition-transform" />
                    <h4 className="text-sm sm:text-base lg:text-lg font-bold text-white mb-2">
                      {apostoladoActividades[currentImage].titulo}
                    </h4>
                    <p className="text-white/70 text-xs sm:text-sm px-2 sm:px-4 mb-3 line-clamp-2">
                      {apostoladoActividades[currentImage].descripcion}
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
                      <div className="flex items-center text-jmv-gold text-xs sm:text-sm">
                        <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        <span className="truncate max-w-[150px] sm:max-w-none">{apostoladoActividades[currentImage].ubicacion}</span>
                      </div>
                      <div className="flex items-center text-jmv-gold text-xs sm:text-sm">
                        <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        {apostoladoActividades[currentImage].beneficiarios} personas
                      </div>
                    </div>
                  </div>
                </div>

                {/* Navigation Arrows */}
                <button
                  onClick={prevImage}
                  className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-black/50 backdrop-blur-sm rounded-full p-2 sm:p-3 text-white hover:bg-black/70 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-black/50 backdrop-blur-sm rounded-full p-2 sm:p-3 text-white hover:bg-black/70 transition-colors"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                </button>
              </div>

              {/* Thumbnail Navigation */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/20">
                {apostoladoActividades.map((actividad, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={`flex-shrink-0 w-16 h-12 sm:w-20 sm:h-16 rounded-lg border-2 transition-all duration-300 ${
                      currentImage === index
                        ? 'border-jmv-gold bg-jmv-gold/20'
                        : 'border-white/20 bg-white/5 hover:border-white/40'
                    }`}
                  >
                    <div className="w-full h-full rounded-md bg-white/10 flex items-center justify-center">
                      <Hand className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-jmv-gold" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Content Section */}
          <ScrollReveal direction="right" delay={150}>
            <div className="space-y-6">
              {/* Description */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="flex items-center mb-4">
                  <Heart className="w-6 h-6 text-jmv-gold mr-3" />
                  <h3 className="text-xl font-bold text-white">¿Qué es el Apostolado?</h3>
                </div>
                <p className="text-white/80 leading-relaxed">
                  El apostolado es el corazón de nuestra misión vicenciana. A través del servicio 
                  directo a los más pobres y excluidos, nuestros jóvenes descubren el rostro de 
                  Cristo en cada hermano necesitado y experimentan la transformación que produce 
                  el amor concreto.
                </p>
              </div>

              {/* Key Statistics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-jmv-gold/10 rounded-xl p-4 border border-jmv-gold/20 text-center">
                  <div className="text-2xl font-bold text-jmv-gold mb-1">690</div>
                  <div className="text-white/70 text-sm">Beneficiarios Directos</div>
                </div>
                <div className="bg-jmv-gold/10 rounded-xl p-4 border border-jmv-gold/20 text-center">
                  <div className="text-2xl font-bold text-jmv-gold mb-1">6</div>
                  <div className="text-white/70 text-sm">Tipos de Actividades</div>
                </div>
              </div>

              {/* Values */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <h4 className="text-lg font-bold text-white mb-4">Valores que Desarrollamos</h4>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-jmv-gold rounded-full mr-3"></div>
                    <span className="text-white/80 text-sm">Amor efectivo y afectivo hacia los pobres</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-jmv-gold rounded-full mr-3"></div>
                    <span className="text-white/80 text-sm">Compromiso social y transformador</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-jmv-gold rounded-full mr-3"></div>
                    <span className="text-white/80 text-sm">Sensibilidad ante la injusticia</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-jmv-gold rounded-full mr-3"></div>
                    <span className="text-white/80 text-sm">Creatividad en el servicio</span>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Testimonial */}
        <ScrollReveal direction="up" delay={200}>
          <div className="text-center">
            <div className="bg-gradient-to-r from-jmv-red to-jmv-gold rounded-2xl p-8 relative overflow-hidden max-w-4xl mx-auto">
              <div className="absolute inset-0 bg-black/30"></div>
              <div className="relative">
                <Hand className="w-12 h-12 text-white mx-auto mb-4" />
                <blockquote className="text-xl md:text-2xl font-light text-white mb-4 italic">
                  "En cada rostro necesitado descubrimos a Cristo, 
                  y en cada acto de servicio encontramos nuestra verdadera vocación."
                </blockquote>
                <cite className="text-white/80 text-sm">
                  - Joven JMV participante en apostolado
                </cite>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}