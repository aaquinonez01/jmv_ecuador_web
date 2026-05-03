'use client'

import { Sparkles, MapPin, Star, Quote, User, Calendar } from 'lucide-react'
import ScrollReveal from '../ui/ScrollReveal'
import type { Asesor } from '@/types/consejo'

interface Props {
  asesores: Asesor[]
}

function formatDate(value?: string | null) {
  if (!value) return null
  try {
    return new Date(value).toLocaleDateString('es-EC', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return value
  }
}

export default function AsesoresNacionalesClient({ asesores }: Props) {
  return (
    <section
      id="asesores-nacionales"
      className="py-20 relative overflow-hidden bg-gradient-to-b from-blue-800 via-jmv-blue to-blue-900"
    >
      <div className="absolute top-10 left-10 w-72 h-72 bg-jmv-gold/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-white/5 rounded-full blur-2xl" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <ScrollReveal direction="up" delay={50}>
          <div className="text-center mb-14">
            <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white font-medium mb-6">
              <Sparkles className="w-5 h-5 mr-2" />
              Acompañamiento Espiritual
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Asesores <span className="text-jmv-gold">Nacionales</span>
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Acompañan al Consejo Nacional en el discernimiento, la formación
              y la fidelidad al carisma vicenciano.
            </p>
          </div>
        </ScrollReveal>

        {asesores.length === 0 ? (
          <ScrollReveal direction="up" delay={100}>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-10 border border-white/20 text-center max-w-2xl mx-auto">
              <Sparkles className="w-16 h-16 text-jmv-gold mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">
                Próximamente publicaremos a nuestros Asesores
              </h3>
              <p className="text-white/70">
                Pronto compartiremos quiénes acompañan espiritualmente al
                Consejo Nacional.
              </p>
            </div>
          </ScrollReveal>
        ) : (
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {asesores.map((asesor, index) => (
              <ScrollReveal
                key={asesor.id}
                direction="up"
                delay={100 + index * 80}
              >
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 h-full flex flex-col">
                  <div className="flex items-center gap-5 mb-5">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-jmv-gold/20 to-jmv-red/20 border border-white/20 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {asesor.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={asesor.imageUrl}
                          alt={asesor.nombre}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-12 h-12 text-jmv-gold" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {asesor.nombre}
                      </h3>
                      <p className="text-jmv-gold font-medium">
                        {asesor.cargo}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 flex-1">
                    {asesor.comunidad && (
                      <div className="flex items-start text-white/80 text-sm">
                        <MapPin className="w-4 h-4 text-jmv-gold mt-0.5 mr-2 flex-shrink-0" />
                        <span>{asesor.comunidad}</span>
                      </div>
                    )}

                    {asesor.santoFavorito && (
                      <div className="flex items-start text-white/80 text-sm">
                        <Star className="w-4 h-4 text-jmv-gold mt-0.5 mr-2 flex-shrink-0" />
                        <span>{asesor.santoFavorito}</span>
                      </div>
                    )}

                    {(asesor.fechaInicio || asesor.fechaFin) && (
                      <div className="flex items-start text-white/70 text-xs">
                        <Calendar className="w-4 h-4 text-jmv-gold mt-0.5 mr-2 flex-shrink-0" />
                        <span>
                          Período: {formatDate(asesor.fechaInicio)} —{' '}
                          {formatDate(asesor.fechaFin)}
                        </span>
                      </div>
                    )}

                    {asesor.descripcion && (
                      <p className="text-white/80 text-sm pt-2">
                        {asesor.descripcion}
                      </p>
                    )}

                    {asesor.citaBiblica && (
                      <div className="bg-white/5 rounded-lg p-3 border border-white/10 mt-3">
                        <div className="flex items-start">
                          <Quote className="w-4 h-4 text-jmv-gold mt-0.5 mr-2 flex-shrink-0" />
                          <p className="text-white/70 text-xs italic">
                            {asesor.citaBiblica}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
