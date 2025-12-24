'use client'

import { useState } from 'react'
import { Quote, ChevronLeft, ChevronRight, Star, Heart } from 'lucide-react'
import ScrollReveal from '../ui/ScrollReveal'

const testimonios = [
  {
    nombre: 'María José Pérez',
    edad: 24,
    ciudad: 'Quito',
    rol: 'Ex-JMV, ahora Asesora',
    testimonio: 'JMV transformó mi vida completamente. Me enseñó que el verdadero liderazgo se ejerce sirviendo a otros. Hoy soy trabajadora social y cada día aplico lo que aprendí en JMV: ver en cada persona necesitada el rostro de Cristo.',
    años: '6 años en JMV',
    foto: '/images/testimonios/maria-jose.jpg'
  },
  {
    nombre: 'Carlos Andrade',
    edad: 22,
    ciudad: 'Guayaquil', 
    rol: 'Coordinador Zonal',
    testimonio: 'Llegué a JMV siendo muy tímido y con poca confianza en mí mismo. A través de la formación integral y el acompañamiento constante, descubrí mis talentos y ahora lidero proyectos que impactan a cientos de familias.',
    años: '5 años en JMV',
    foto: '/images/testimonios/carlos-andrade.jpg'
  },
  {
    nombre: 'Ana Lucía Torres',
    edad: 20,
    ciudad: 'Cuenca',
    rol: 'Joven JMV Activa',
    testimonio: 'La experiencia comunitaria de JMV me ha enseñado el valor de la hermandad. Aquí encontré una segunda familia que me acompaña en mi crecimiento personal y espiritual. No puedo imaginar mi vida sin esta comunidad.',
    años: '4 años en JMV',
    foto: '/images/testimonios/ana-lucia.jpg'
  },
  {
    nombre: 'Diego Morales',
    edad: 26,
    ciudad: 'Ambato',
    rol: 'Ex-JMV, Profesional',
    testimonio: 'JMV me formó como persona íntegra. Los valores vicencianos que aprendí me han acompañado en mi carrera profesional. Sigo colaborando porque creo firmemente en la misión transformadora de esta organización.',
    años: '7 años en JMV',
    foto: '/images/testimonios/diego-morales.jpg'
  },
  {
    nombre: 'Sofía Guerrero',
    edad: 21,
    ciudad: 'Loja',
    rol: 'Coordinadora Local',
    testimonio: 'A través del servicio social en JMV descubrí mi vocación. Ahora estudio medicina y sueño con crear un centro de salud comunitario. JMV me enseñó que los sueños grandes se construyen sirviendo a los demás.',
    años: '5 años en JMV',
    foto: '/images/testimonios/sofia-guerrero.jpg'
  }
]

export default function TestimoniosQuienesSomos() {
  const [currentTestimonio, setCurrentTestimonio] = useState(0)

  const nextTestimonio = () => {
    setCurrentTestimonio((prev) => (prev + 1) % testimonios.length)
  }

  const prevTestimonio = () => {
    setCurrentTestimonio((prev) => (prev - 1 + testimonios.length) % testimonios.length)
  }

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Previous section background that fades out */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom right, var(--jmv-blue-dark), #1e40af, #1d4ed8)',
          maskImage: 'linear-gradient(to bottom, black 0%, black 35%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 35%, transparent 100%)'
        }}
      />
      {/* Current section background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-jmv-blue-dark to-blue-800" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <ScrollReveal direction="up" delay={50}>
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white font-medium mb-6">
              <Heart className="w-5 h-5 mr-2" />
              Voces de Transformación
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              <span className="text-jmv-gold">Testimonios</span> de Vida
            </h2>
            <p className="text-xl text-white/80 max-w-4xl mx-auto">
              Escucha las historias de jóvenes que han sido transformados por la experiencia JMV
            </p>
          </div>
        </ScrollReveal>

        {/* Main Testimony */}
        <ScrollReveal direction="up" delay={100}>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 lg:p-12 border border-white/20 mb-8 relative overflow-hidden">
            <div className="absolute top-6 left-6">
              <Quote className="w-12 h-12 text-jmv-gold/30" />
            </div>
            
            <div className="grid lg:grid-cols-3 gap-8 items-center">
              {/* Photo Placeholder */}
              <div className="lg:col-span-1 flex justify-center">
                <div className="w-48 h-48 bg-white/10 rounded-full border border-white/20 flex items-center justify-center">
                  <div className="text-center">
                    <Heart className="w-12 h-12 text-jmv-gold mx-auto mb-2" />
                    <p className="text-white/70 text-sm">Foto</p>
                    <p className="text-white/50 text-xs">Próximamente</p>
                  </div>
                </div>
              </div>

              {/* Testimony Content */}
              <div className="lg:col-span-2">
                <p className="text-white/90 text-lg lg:text-xl leading-relaxed mb-6 italic">
                  "{testimonios[currentTestimonio].testimonio}"
                </p>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xl font-bold text-white">
                      {testimonios[currentTestimonio].nombre}
                    </h4>
                    <p className="text-jmv-gold font-medium">
                      {testimonios[currentTestimonio].rol}
                    </p>
                    <p className="text-white/60 text-sm">
                      {testimonios[currentTestimonio].ciudad} • {testimonios[currentTestimonio].edad} años • {testimonios[currentTestimonio].años}
                    </p>
                  </div>

                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-jmv-gold fill-current" />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            <div className="flex justify-between items-center mt-8">
              <button
                onClick={prevTestimonio}
                className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors border border-white/20"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>

              <div className="flex space-x-2">
                {testimonios.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonio(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentTestimonio
                        ? 'bg-jmv-gold scale-125'
                        : 'bg-white/30 hover:bg-white/50'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextTestimonio}
                className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors border border-white/20"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Testimonies Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonios.map((testimonio, index) => (
            <ScrollReveal key={index} direction="up" delay={150 + index * 50}>
              <button
                onClick={() => setCurrentTestimonio(index)}
                className={`p-4 rounded-xl border transition-all duration-300 text-left w-full ${
                  currentTestimonio === index
                    ? 'bg-jmv-gold/20 border-jmv-gold shadow-lg scale-105'
                    : 'bg-white/5 border-white/20 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center mb-3">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mr-3">
                    <Heart className="w-6 h-6 text-jmv-gold" />
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-sm">{testimonio.nombre}</h5>
                    <p className="text-white/60 text-xs">{testimonio.ciudad}</p>
                  </div>
                </div>
                <p className="text-white/70 text-sm line-clamp-3">
                  {testimonio.testimonio.substring(0, 100)}...
                </p>
              </button>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}