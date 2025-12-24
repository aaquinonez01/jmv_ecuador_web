'use client'

import { Crown, Heart, MapPin, Star, Quote, User } from 'lucide-react'
import ScrollReveal from '../ui/ScrollReveal'

interface ConsejoMember {
  nombre: string
  cargo: string
  edad: number
  comunidad: string
  santoFavorito: string
  citaBiblica: string
  imagen?: string
  descripcion?: string
}

const consejoNacional: ConsejoMember[] = [
  {
    nombre: 'Karlita Rosero',
    cargo: 'Coordinador Nacional',
    edad: 25,
    comunidad: 'Zona Norte - Quito',
    santoFavorito: 'San Vicente de Paúl',
    citaBiblica: '"Servir a Cristo en la persona de los pobres" - Mt 25:40',
    imagen: '/images/consejo/karlita-rosero.jpg',
    descripcion: 'Líder comprometida con la transformación social y la formación juvenil'
  },
  {
    nombre: 'Eliam',
    cargo: 'Vicecoordinador Nacional',
    edad: 24,
    comunidad: 'Zona Costa Centro - Guayaquil',
    santoFavorito: 'Santa Catalina Labouré',
    citaBiblica: '"Todo lo puedo en Cristo que me fortalece" - Fil 4:13',
    imagen: '/images/consejo/eliam.jpg',
    descripcion: 'Apasionado por el liderazgo juvenil y el servicio social'
  },
  {
    nombre: 'Ariana Burgos',
    cargo: 'Secretaria Nacional',
    edad: 23,
    comunidad: 'Zona Centro - Ambato',
    santoFavorito: 'Santa Luisa de Marillac',
    citaBiblica: '"Hágase en mí según tu palabra" - Lc 1:38',
    imagen: '/images/consejo/ariana-burgos.jpg',
    descripcion: 'Organizadora excepcional y promotora de la vida comunitaria'
  },
  {
    nombre: 'María de Ángeles',
    cargo: 'Tesorera Nacional',
    edad: 26,
    comunidad: 'Zona Sur - Cuenca',
    santoFavorito: 'San Vicente de Paúl',
    citaBiblica: '"Dad y se os dará" - Lc 6:38',
    imagen: '/images/consejo/maria-angeles.jpg',
    descripcion: 'Administradora responsable y defensora de la transparencia'
  },
  {
    nombre: 'Dayana Lachimba',
    cargo: 'Vocal de FAVIE',
    edad: 22,
    comunidad: 'Zona Costa Norte - Esmeraldas',
    santoFavorito: 'Santa Catalina Labouré',
    citaBiblica: '"El amor de Cristo nos apremia" - 2 Cor 5:14',
    imagen: '/images/consejo/dayana-lachimba.jpg',
    descripcion: 'Coordinadora de la Familia Vicenciana Ecuatoriana'
  },
  {
    nombre: 'Alexander Quiñonez',
    cargo: 'Vocal de Apostolado y Formación',
    edad: 25,
    comunidad: 'Zona Oriente - Tena',
    santoFavorito: 'San Vicente de Paúl',
    citaBiblica: '"Id y haced discípulos a todas las naciones" - Mt 28:19',
    imagen: '/images/consejo/alexander-quinonez.jpg',
    descripcion: 'Formador integral y promotor del apostolado juvenil'
  }
]

export default function ConsejoNacional() {
  return (
    <section id="consejo-nacional" className="py-20 relative overflow-hidden">
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

      {/* Background Elements */}
      <div className="absolute top-20 right-20 w-80 h-80 bg-jmv-gold/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-64 h-64 bg-white/5 rounded-full blur-2xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
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
              Los jóvenes líderes que guían JMV Ecuador con amor, dedicación y compromiso vicenciano
            </p>
          </div>
        </ScrollReveal>

        {/* Consejo Members Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {consejoNacional.map((miembro, index) => (
            <ScrollReveal key={index} direction="up" delay={100 + index * 50}>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 hover:scale-105 transition-all duration-300 group">
                {/* Member Photo */}
                <div className="relative mb-6">
                  <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-jmv-gold/20 to-jmv-red/20 border border-white/20 flex items-center justify-center overflow-hidden">
                    <div className="text-center">
                      <User className="w-16 h-16 text-jmv-gold mb-2" />
                      <p className="text-white/60 text-xs">Foto</p>
                      <p className="text-white/40 text-xs">Próximamente</p>
                    </div>
                  </div>
                  
                  {/* Cargo Badge */}
                  <div className="absolute -top-2 -right-2">
                    <div className="bg-gradient-to-r from-jmv-gold to-jmv-gold-dark rounded-full p-2 border border-white/30">
                      <Crown className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>

                {/* Member Info */}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-white mb-2">{miembro.nombre}</h3>
                  <p className="text-jmv-gold font-medium mb-1">{miembro.cargo}</p>
                  <p className="text-white/60 text-sm">{miembro.edad} años</p>
                </div>

                {/* Details */}
                <div className="space-y-4">
                  {/* Comunidad */}
                  <div className="flex items-start">
                    <MapPin className="w-4 h-4 text-jmv-gold mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-white/90 text-sm font-medium">Comunidad</p>
                      <p className="text-white/70 text-xs">{miembro.comunidad}</p>
                    </div>
                  </div>

                  {/* Santo Favorito */}
                  <div className="flex items-start">
                    <Star className="w-4 h-4 text-jmv-gold mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-white/90 text-sm font-medium">Santo Favorito</p>
                      <p className="text-white/70 text-xs">{miembro.santoFavorito}</p>
                    </div>
                  </div>

                  {/* Cita Bíblica */}
                  <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <div className="flex items-start">
                      <Quote className="w-4 h-4 text-jmv-gold mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-white/90 text-sm font-medium mb-1">Cita Bíblica</p>
                        <p className="text-white/70 text-xs italic leading-relaxed">
                          {miembro.citaBiblica}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hover Effect - Description */}
                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-jmv-gold/10 rounded-lg p-3 border border-jmv-gold/20">
                    <p className="text-white/80 text-xs text-center">
                      {miembro.descripcion}
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Inspirational Quote */}
        <ScrollReveal direction="up" delay={400}>
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-jmv-blue to-jmv-red rounded-2xl p-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-black/30"></div>
              <div className="relative">
                <Heart className="w-16 h-16 text-jmv-gold mx-auto mb-6" />
                <blockquote className="text-2xl md:text-3xl font-light text-white mb-6 font-dancing leading-relaxed">
                  "El verdadero liderazgo se ejerce sirviendo, 
                  y el mejor servicio es aquel que transforma corazones."
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