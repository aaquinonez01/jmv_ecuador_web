'use client'

import { useState } from 'react'
import { Quote, ChevronLeft, ChevronRight, Star, Heart } from 'lucide-react'
import ScrollReveal from '../ui/ScrollReveal'
import type { TestimonialItem } from '@/types/activity-management'

interface Props {
  testimonios: TestimonialItem[]
}

export default function TestimoniosQuienesSomosClient({ testimonios }: Props) {
  const [currentTestimonio, setCurrentTestimonio] = useState(0)

  if (!testimonios.length) {
    return (
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-jmv-blue-dark to-blue-800" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <ScrollReveal direction="up" delay={50}>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-10 border border-white/20 text-center">
              <Heart className="w-12 h-12 text-jmv-gold mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">
                Próximamente compartiremos testimonios
              </h3>
              <p className="text-white/70">
                Estamos recogiendo las voces de quienes han sido transformados
                por la experiencia JMV.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>
    )
  }

  const safeIndex = Math.min(currentTestimonio, testimonios.length - 1)
  const actual = testimonios[safeIndex]

  const nextTestimonio = () => {
    setCurrentTestimonio((prev) => (prev + 1) % testimonios.length)
  }

  const prevTestimonio = () => {
    setCurrentTestimonio(
      (prev) => (prev - 1 + testimonios.length) % testimonios.length,
    )
  }

  return (
    <section className="py-20 relative overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom right, var(--jmv-blue-dark), #1e40af, #1d4ed8)',
          maskImage:
            'linear-gradient(to bottom, black 0%, black 35%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, black 0%, black 35%, transparent 100%)',
        }}
      />
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
              Escucha las historias de quienes han sido transformados por la
              experiencia JMV
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={100}>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 lg:p-12 border border-white/20 mb-8 relative overflow-hidden">
            <div className="absolute top-6 left-6">
              <Quote className="w-12 h-12 text-jmv-gold/30" />
            </div>

            <div className="grid lg:grid-cols-3 gap-8 items-center">
              {/* Foto */}
              <div className="lg:col-span-1 flex justify-center">
                <div className="w-40 h-40 sm:w-48 sm:h-48 bg-white/10 rounded-full border border-white/20 flex items-center justify-center overflow-hidden">
                  {actual.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={actual.imageUrl}
                      alt={actual.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center">
                      <Heart className="w-12 h-12 text-jmv-gold mx-auto mb-2" />
                      <p className="text-white/70 text-sm">Foto</p>
                      <p className="text-white/50 text-xs">Próximamente</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Contenido */}
              <div className="lg:col-span-2">
                <p className="text-white/90 text-base sm:text-lg lg:text-xl leading-relaxed mb-6 italic">
                  &ldquo;{actual.quote}&rdquo;
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h4 className="text-xl font-bold text-white">
                      {actual.name}
                    </h4>
                    <p className="text-jmv-gold font-medium">{actual.role}</p>
                    {actual.location && (
                      <p className="text-white/60 text-sm">{actual.location}</p>
                    )}
                  </div>

                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < (actual.rating ?? 5)
                            ? 'text-jmv-gold fill-current'
                            : 'text-white/20'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {testimonios.length > 1 && (
              <div className="flex justify-between items-center mt-8">
                <button
                  onClick={prevTestimonio}
                  className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors border border-white/20"
                  aria-label="Anterior"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>

                <div className="flex space-x-2">
                  {testimonios.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonio(index)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        index === safeIndex
                          ? 'bg-jmv-gold scale-125'
                          : 'bg-white/30 hover:bg-white/50'
                      }`}
                      aria-label={`Ir al testimonio ${index + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={nextTestimonio}
                  className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors border border-white/20"
                  aria-label="Siguiente"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              </div>
            )}
          </div>
        </ScrollReveal>

        {testimonios.length > 1 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonios.map((t, index) => (
              <ScrollReveal key={t.id} direction="up" delay={150 + index * 50}>
                <button
                  onClick={() => setCurrentTestimonio(index)}
                  className={`p-4 rounded-xl border transition-all duration-300 text-left w-full ${
                    safeIndex === index
                      ? 'bg-jmv-gold/20 border-jmv-gold shadow-lg scale-105'
                      : 'bg-white/5 border-white/20 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center mb-3">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mr-3 overflow-hidden">
                      {t.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={t.imageUrl}
                          alt={t.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Heart className="w-6 h-6 text-jmv-gold" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h5 className="font-bold text-white text-sm truncate">
                        {t.name}
                      </h5>
                      {t.location && (
                        <p className="text-white/60 text-xs truncate">
                          {t.location}
                        </p>
                      )}
                    </div>
                  </div>
                  <p className="text-white/70 text-sm line-clamp-3">
                    {t.quote}
                  </p>
                </button>
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
