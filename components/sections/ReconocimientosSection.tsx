'use client'

import { Award, Church, Users, Handshake, Star, Calendar, Trophy } from 'lucide-react'
import ScrollReveal from '../ui/ScrollReveal'

const reconocimientos = [
  {
    año: '1998',
    titulo: 'Reconocimiento Episcopal',
    descripcion: 'La Conferencia Episcopal Ecuatoriana reconoce a JMV como movimiento oficial de pastoral juvenil',
    otorgante: 'Conferencia Episcopal Ecuatoriana',
    tipo: 'Eclesiástico',
    icon: Church
  },
  {
    año: '2005',
    titulo: 'Premio Nacional de Juventud',
    descripcion: 'Reconocimiento por la labor social y formativa con jóvenes en situación de vulnerabilidad',
    otorgante: 'Ministerio de Inclusión Social',
    tipo: 'Gubernamental',
    icon: Award
  },
  {
    año: '2010',
    titulo: 'Certificación Internacional',
    descripcion: 'Acreditación como organización miembro de la Familia Vicenciana Mundial',
    otorgante: 'Familia Vicenciana Internacional',
    tipo: 'Internacional',
    icon: Trophy
  },
  {
    año: '2015',
    titulo: 'Medalla al Mérito Social',
    descripcion: 'Por 20 años de servicio ininterrumpido a las comunidades más necesitadas del Ecuador',
    otorgante: 'Municipio de Quito',
    tipo: 'Municipal',
    icon: Star
  }
]

const alianzas = [
  {
    nombre: 'CELAM',
    descripcion: 'Consejo Episcopal Latinoamericano',
    tipo: 'Pastoral',
    logo: '/images/alianzas/celam.jpg'
  },
  {
    nombre: 'Cáritas Ecuador',
    descripcion: 'Organismo de pastoral social',
    tipo: 'Social',
    logo: '/images/alianzas/caritas.jpg'
  },
  {
    nombre: 'MIES',
    descripcion: 'Ministerio de Inclusión Económica y Social',
    tipo: 'Gubernamental',
    logo: '/images/alianzas/mies.jpg'
  },
  {
    nombre: 'Cruz Roja Ecuatoriana',
    descripcion: 'Organización humanitaria',
    tipo: 'Humanitaria',
    logo: '/images/alianzas/cruz-roja.jpg'
  }
]

export default function ReconocimientosSection() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Previous section background that fades out */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom right, #1e3a8a, var(--jmv-blue-dark), #1e40af)',
          maskImage: 'linear-gradient(to bottom, black 0%, black 35%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 35%, transparent 100%)'
        }}
      />
      {/* Current section background */}
      <div className="absolute inset-0 bg-gradient-to-br from-jmv-blue-dark via-blue-800 to-blue-700" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <ScrollReveal direction="up" delay={50}>
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white font-medium mb-6">
              <Award className="w-5 h-5 mr-2" />
              Trayectoria Reconocida
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              <span className="text-jmv-gold">Reconocimientos</span> y Alianzas
            </h2>
            <p className="text-xl text-white/80 max-w-4xl mx-auto">
              30 años de trabajo comprometido respaldado por reconocimientos institucionales y alianzas estratégicas
            </p>
          </div>
        </ScrollReveal>

        {/* Reconocimientos */}
        <div className="mb-20">
          <ScrollReveal direction="up" delay={100}>
            <h3 className="text-3xl font-bold text-white mb-12 text-center">
              Reconocimientos Institucionales
            </h3>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-8">
            {reconocimientos.map((reconocimiento, index) => {
              const Icon = reconocimiento.icon
              return (
                <ScrollReveal key={index} direction="up" delay={150 + index * 50}>
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                    <div className="flex items-start">
                      <div className="w-16 h-16 bg-gradient-to-r from-jmv-gold to-jmv-gold-dark rounded-2xl flex items-center justify-center mr-4 flex-shrink-0 group-hover:scale-110 transition-transform">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <span className="text-2xl font-bold text-jmv-gold mr-3">{reconocimiento.año}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            reconocimiento.tipo === 'Eclesiástico' ? 'bg-purple-500/20 text-purple-200' :
                            reconocimiento.tipo === 'Gubernamental' ? 'bg-blue-500/20 text-blue-200' :
                            reconocimiento.tipo === 'Internacional' ? 'bg-green-500/20 text-green-200' :
                            'bg-yellow-500/20 text-yellow-200'
                          }`}>
                            {reconocimiento.tipo}
                          </span>
                        </div>
                        
                        <h4 className="text-xl font-bold text-white mb-3">
                          {reconocimiento.titulo}
                        </h4>
                        
                        <p className="text-white/70 leading-relaxed mb-4">
                          {reconocimiento.descripcion}
                        </p>
                        
                        <p className="text-jmv-gold font-medium text-sm">
                          Otorgado por: {reconocimiento.otorgante}
                        </p>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              )
            })}
          </div>
        </div>

        {/* Alianzas */}
        <div>
          <ScrollReveal direction="up" delay={200}>
            <h3 className="text-3xl font-bold text-white mb-12 text-center">
              Alianzas Estratégicas
            </h3>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {alianzas.map((alianza, index) => (
              <ScrollReveal key={index} direction="up" delay={250 + index * 40}>
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 text-center group">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Handshake className="w-8 h-8 text-jmv-gold" />
                  </div>
                  
                  <h4 className="text-lg font-bold text-white mb-2">
                    {alianza.nombre}
                  </h4>
                  
                  <p className="text-white/70 text-sm leading-relaxed mb-3">
                    {alianza.descripcion}
                  </p>
                  
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    alianza.tipo === 'Pastoral' ? 'bg-purple-500/20 text-purple-200' :
                    alianza.tipo === 'Social' ? 'bg-red-500/20 text-red-200' :
                    alianza.tipo === 'Gubernamental' ? 'bg-blue-500/20 text-blue-200' :
                    'bg-green-500/20 text-green-200'
                  }`}>
                    {alianza.tipo}
                  </span>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <ScrollReveal direction="up" delay={300}>
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-jmv-gold to-jmv-red rounded-2xl p-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-black/30"></div>
              <div className="relative">
                <Trophy className="w-16 h-16 text-white mx-auto mb-6" />
                <h3 className="text-3xl font-bold text-white mb-6">
                  30 Años de Excelencia
                </h3>
                <p className="text-white/90 text-lg max-w-3xl mx-auto leading-relaxed">
                  Estos reconocimientos y alianzas respaldan nuestro compromiso con la 
                  formación juvenil de calidad y el servicio social transformador. 
                  Únete a una organización con trayectoria comprobada.
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}