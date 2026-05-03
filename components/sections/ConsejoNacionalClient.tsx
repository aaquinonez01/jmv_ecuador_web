'use client'

import { Crown, Heart, MapPin, Star, Quote, User } from 'lucide-react'
import ScrollReveal from '../ui/ScrollReveal'
import type { ConsejoMember, ConsejoPeriod } from '@/types/consejo'

interface Props {
  period: ConsejoPeriod | null
}

const ORDEN_CARGOS: Record<string, number> = {
  coordinador: 1,
  vicecoordinador: 2,
  secretario: 3,
  tesorero: 4,
  vocal: 5,
}

function sortMembers(members: ConsejoMember[]): ConsejoMember[] {
  return [...members].sort((a, b) => {
    const orderA = ORDEN_CARGOS[a.tipoCargo] ?? 99
    const orderB = ORDEN_CARGOS[b.tipoCargo] ?? 99
    if (orderA !== orderB) return orderA - orderB
    return (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
  })
}

export default function ConsejoNacionalClient({ period }: Props) {
  const miembros = period ? sortMembers(period.miembros || []) : []

  return (
    <section id="consejo-nacional" className="py-20 relative overflow-hidden">
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

      <div className="absolute top-20 right-20 w-80 h-80 bg-jmv-gold/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-64 h-64 bg-white/5 rounded-full blur-2xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <ScrollReveal direction="up" delay={50}>
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white font-medium mb-6">
              <Crown className="w-5 h-5 mr-2" />
              Liderazgo Nacional
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Consejo <span className="text-jmv-gold">Nacional</span>
            </h2>
            <p className="text-xl text-white/80 max-w-4xl mx-auto">
              {period?.nombre ??
                'Los jóvenes líderes que guían JMV Ecuador con amor, dedicación y compromiso vicenciano'}
            </p>
            {period?.descripcion && (
              <p className="text-white/60 max-w-3xl mx-auto mt-4">
                {period.descripcion}
              </p>
            )}
          </div>
        </ScrollReveal>

        {miembros.length === 0 ? (
          <ScrollReveal direction="up" delay={100}>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-10 border border-white/20 text-center max-w-2xl mx-auto">
              <Crown className="w-16 h-16 text-jmv-gold mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">
                Próximamente publicaremos al Consejo Nacional
              </h3>
              <p className="text-white/70">
                Estamos preparando la información de nuestro nuevo equipo de
                liderazgo. ¡Vuelve pronto!
              </p>
            </div>
          </ScrollReveal>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {miembros.map((miembro, index) => (
              <ScrollReveal
                key={miembro.id}
                direction="up"
                delay={100 + index * 50}
              >
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 hover:scale-105 transition-all duration-300 group h-full flex flex-col">
                  <div className="relative mb-6">
                    <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-jmv-gold/20 to-jmv-red/20 border border-white/20 flex items-center justify-center overflow-hidden">
                      {miembro.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={miembro.imageUrl}
                          alt={miembro.nombre}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center">
                          <User className="w-16 h-16 text-jmv-gold mb-2" />
                          <p className="text-white/60 text-xs">Foto</p>
                          <p className="text-white/40 text-xs">Próximamente</p>
                        </div>
                      )}
                    </div>

                    <div className="absolute -top-2 -right-2">
                      <div className="bg-gradient-to-r from-jmv-gold to-jmv-gold-dark rounded-full p-2 border border-white/30">
                        <Crown className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>

                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-white mb-2">
                      {miembro.nombre}
                    </h3>
                    <p className="text-jmv-gold font-medium mb-1">
                      {miembro.cargo}
                    </p>
                    {miembro.edad ? (
                      <p className="text-white/60 text-sm">
                        {miembro.edad} años
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-4 flex-1">
                    {miembro.comunidad && (
                      <div className="flex items-start">
                        <MapPin className="w-4 h-4 text-jmv-gold mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                          <p className="text-white/90 text-sm font-medium">
                            Comunidad
                          </p>
                          <p className="text-white/70 text-xs">
                            {miembro.comunidad}
                          </p>
                        </div>
                      </div>
                    )}

                    {miembro.santoFavorito && (
                      <div className="flex items-start">
                        <Star className="w-4 h-4 text-jmv-gold mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                          <p className="text-white/90 text-sm font-medium">
                            Santo Favorito
                          </p>
                          <p className="text-white/70 text-xs">
                            {miembro.santoFavorito}
                          </p>
                        </div>
                      </div>
                    )}

                    {miembro.citaBiblica && (
                      <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                        <div className="flex items-start">
                          <Quote className="w-4 h-4 text-jmv-gold mt-0.5 mr-2 flex-shrink-0" />
                          <div>
                            <p className="text-white/90 text-sm font-medium mb-1">
                              Cita Bíblica
                            </p>
                            <p className="text-white/70 text-xs italic leading-relaxed">
                              {miembro.citaBiblica}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {miembro.descripcion && (
                    <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-jmv-gold/10 rounded-lg p-3 border border-jmv-gold/20">
                        <p className="text-white/80 text-xs text-center">
                          {miembro.descripcion}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}

        <ScrollReveal direction="up" delay={400}>
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-jmv-blue to-jmv-red rounded-2xl p-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-black/30"></div>
              <div className="relative">
                <Heart className="w-16 h-16 text-jmv-gold mx-auto mb-6" />
                <blockquote className="text-2xl md:text-3xl font-light text-white mb-6 font-dancing leading-relaxed">
                  &ldquo;El verdadero liderazgo se ejerce sirviendo, y el mejor
                  servicio es aquel que transforma corazones.&rdquo;
                </blockquote>
                <cite className="text-jmv-gold font-semibold text-lg">
                  - Consejo Nacional JMV Ecuador
                </cite>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
