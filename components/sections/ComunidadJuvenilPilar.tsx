'use client'

import { useState } from 'react'
import { Users, Heart, Music, Camera, ChevronLeft, ChevronRight, Play } from 'lucide-react'
import ScrollReveal from '../ui/ScrollReveal'

const comunidadActividades = [
  {
    titulo: 'Encuentros Zonales',
    descripcion: 'Reuniones fraternales que fortalecen vínculos entre jóvenes de toda la zona.',
    imagen: '/images/pilares/comunidad/encuentros-zonales.jpg',
    ubicacion: 'Centros Juveniles por Zona',
    participantes: 250
  },
  {
    titulo: 'Convivencias',
    descripcion: 'Fines de semana de hermandad, juegos y actividades recreativas.',
    imagen: '/images/pilares/comunidad/convivencias.jpg',
    ubicacion: 'Casas de Retiro JMV',
    participantes: 180
  },
  {
    titulo: 'Actividades Recreativas',
    descripcion: 'Deportes, juegos, competencias y torneos que unen a la comunidad.',
    imagen: '/images/pilares/comunidad/recreativas.jpg',
    ubicacion: 'Instalaciones Deportivas',
    participantes: 200
  },
  {
    titulo: 'Intercambio Cultural',
    descripcion: 'Festivales, presentaciones artísticas y celebraciones tradicionales.',
    imagen: '/images/pilares/comunidad/intercambio-cultural.jpg',
    ubicacion: 'Espacios Culturales',
    participantes: 150
  },
  {
    titulo: 'Noches de Talento',
    descripcion: 'Espacios para compartir habilidades artísticas y talentos creativos.',
    imagen: '/images/pilares/comunidad/talentos.jpg',
    ubicacion: 'Auditorios JMV',
    participantes: 120
  },
  {
    titulo: 'Celebraciones Especiales',
    descripcion: 'Fiestas de aniversario, graduaciones y celebraciones comunitarias.',
    imagen: '/images/pilares/comunidad/celebraciones.jpg',
    ubicacion: 'Salones Comunitarios',
    participantes: 300
  }
]

export default function ComunidadJuvenilPilar() {
  const [currentImage, setCurrentImage] = useState(0)

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % comunidadActividades.length)
  }

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + comunidadActividades.length) % comunidadActividades.length)
  }

  return (
    <section id="comunidad" className="py-12 sm:py-16 lg:py-20 relative overflow-hidden">
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
              <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Tercer Pilar
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              Comunidad <span className="text-jmv-gold">Juvenil</span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/80 max-w-4xl mx-auto leading-relaxed">
              Construcción de vínculos fraternos y experiencia de familia vicenciana. 
              Creamos un ambiente de alegría, amistad y crecimiento mutuo entre jóvenes.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 mb-12 sm:mb-16">
          {/* Gallery Section */}
          <ScrollReveal direction="left" delay={100}>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 lg:p-6 border border-white/20">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 text-center">Galería Comunitaria</h3>
              
              {/* Main Image */}
              <div className="relative mb-4 sm:mb-6">
                <div className="aspect-video bg-white/10 rounded-xl border border-white/20 flex items-center justify-center overflow-hidden group">
                  <div className="text-center p-3 sm:p-4">
                    <Play className="w-12 h-12 sm:w-16 sm:h-16 text-jmv-gold mb-3 sm:mb-4 group-hover:scale-110 transition-transform" />
                    <h4 className="text-sm sm:text-base lg:text-lg font-bold text-white mb-2">
                      {comunidadActividades[currentImage].titulo}
                    </h4>
                    <p className="text-white/70 text-xs sm:text-sm px-2 sm:px-4 mb-3 line-clamp-2">
                      {comunidadActividades[currentImage].descripcion}
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
                      <div className="flex items-center text-jmv-gold text-xs sm:text-sm">
                        <Camera className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        <span className="truncate max-w-[150px] sm:max-w-none">{comunidadActividades[currentImage].ubicacion}</span>
                      </div>
                      <div className="flex items-center text-jmv-gold text-xs sm:text-sm">
                        <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        {comunidadActividades[currentImage].participantes} jóvenes
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
                {comunidadActividades.map((actividad, index) => (
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
                      <Users className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-jmv-gold" />
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
                  <h3 className="text-xl font-bold text-white">¿Qué es la Comunidad Juvenil?</h3>
                </div>
                <p className="text-white/80 leading-relaxed">
                  Es el espacio donde los jóvenes experimentan la alegría de pertenecer a una familia. 
                  A través de actividades recreativas, culturales y sociales, fortalecemos lazos de 
                  amistad que duran toda la vida y construimos una red de apoyo mutuo.
                </p>
              </div>

              {/* Community Values */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <h4 className="text-lg font-bold text-white mb-4">Valores que Desarrollamos</h4>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Heart className="w-5 h-5 text-jmv-gold mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-white font-medium text-sm">Fraternidad</p>
                      <p className="text-white/70 text-xs">Vínculos profundos de hermandad cristiana</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Music className="w-5 h-5 text-jmv-gold mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-white font-medium text-sm">Alegría</p>
                      <p className="text-white/70 text-xs">Celebración de la vida y la fe compartida</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Users className="w-5 h-5 text-jmv-gold mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-white font-medium text-sm">Inclusión</p>
                      <p className="text-white/70 text-xs">Acogida a todos sin excepción ni discriminación</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Camera className="w-5 h-5 text-jmv-gold mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-white font-medium text-sm">Creatividad</p>
                      <p className="text-white/70 text-xs">Expresión artística y cultural juvenil</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Statistics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-jmv-gold/10 rounded-xl p-4 border border-jmv-gold/20 text-center">
                  <div className="text-2xl font-bold text-jmv-gold mb-1">1,200</div>
                  <div className="text-white/70 text-sm">Jóvenes Participantes</div>
                </div>
                <div className="bg-jmv-gold/10 rounded-xl p-4 border border-jmv-gold/20 text-center">
                  <div className="text-2xl font-bold text-jmv-gold mb-1">6</div>
                  <div className="text-white/70 text-sm">Tipos de Encuentros</div>
                </div>
              </div>

              {/* Special Features */}
              <div className="bg-jmv-red/10 rounded-xl p-4 border border-jmv-red/20">
                <h4 className="text-white font-bold mb-3">✨ Lo que nos hace especiales</h4>
                <div className="space-y-2 text-sm">
                  <div className="text-white/80">🎵 Grupos musicales y corales JMV</div>
                  <div className="text-white/80">🎭 Teatro y expresión artística</div>
                  <div className="text-white/80">⚽ Ligas deportivas inter-zonales</div>
                  <div className="text-white/80">🎨 Talleres de creatividad y manualidades</div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Testimonial */}
        <ScrollReveal direction="up" delay={200}>
          <div className="text-center">
            <div className="bg-gradient-to-r from-jmv-blue to-jmv-gold rounded-2xl p-8 relative overflow-hidden max-w-4xl mx-auto">
              <div className="absolute inset-0 bg-black/30"></div>
              <div className="relative">
                <Users className="w-12 h-12 text-white mx-auto mb-4" />
                <blockquote className="text-xl md:text-2xl font-light text-white mb-4 italic">
                  "En JMV encontré no solo amigos, sino hermanos que me acompañan 
                  en cada momento de mi vida. Aquí aprendí el valor de la comunidad."
                </blockquote>
                <cite className="text-white/80 text-sm">
                  - Joven JMV participante en convivencias
                </cite>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}