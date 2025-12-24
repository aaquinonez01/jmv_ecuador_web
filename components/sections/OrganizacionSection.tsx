'use client'

import { useState } from 'react'
import { MapPin, Users, Crown, Building, Phone, Mail } from 'lucide-react'
import ScrollReveal from '../ui/ScrollReveal'

const zonasData = [
  { nombre: 'Zona Norte', provincias: ['Carchi', 'Imbabura', 'Pichincha'], coordinador: 'María González', jóvenes: 350 },
  { nombre: 'Zona Centro Norte', provincias: ['Cotopaxi', 'Tungurahua', 'Chimborazo'], coordinador: 'Carlos Pérez', jóvenes: 280 },
  { nombre: 'Zona Centro', provincias: ['Bolívar', 'Los Ríos', 'Cañar'], coordinador: 'Ana Rodríguez', jóvenes: 220 },
  { nombre: 'Zona Sur', provincias: ['Azuay', 'Loja', 'El Oro'], coordinador: 'Diego Mora', jóvenes: 310 },
  { nombre: 'Zona Costa Norte', provincias: ['Esmeraldas', 'Manabí', 'Santo Domingo'], coordinador: 'Lucia Torres', jóvenes: 200 },
  { nombre: 'Zona Costa Centro', provincias: ['Guayas', 'Santa Elena'], coordinador: 'Roberto Silva', jóvenes: 420 },
  { nombre: 'Zona Oriente Norte', provincias: ['Sucumbíos', 'Orellana', 'Napo'], coordinador: 'Patricia Vega', jóvenes: 150 },
  { nombre: 'Zona Oriente Sur', provincias: ['Pastaza', 'Morona Santiago', 'Zamora Chinchipe'], coordinador: 'Miguel Castro', jóvenes: 180 }
]

export default function OrganizacionSection() {
  const [selectedZona, setSelectedZona] = useState(0)

  return (
    <section id="organizacion" className="py-20 relative overflow-hidden">
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
              <Building className="w-5 h-5 mr-2" />
              Nuestra Estructura
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              <span className="text-jmv-gold">Organización</span> Nacional
            </h2>
            <p className="text-xl text-white/80 max-w-4xl mx-auto">
              JMV Ecuador se organiza en 8 zonas pastorales que abarcan las 24 provincias del país
            </p>
          </div>
        </ScrollReveal>

        {/* Zones Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {zonasData.map((zona, index) => (
            <ScrollReveal key={index} direction="up" delay={100 + index * 30}>
              <button
                onClick={() => setSelectedZona(index)}
                className={`p-4 rounded-xl border transition-all duration-300 text-left w-full ${
                  selectedZona === index
                    ? 'bg-white text-jmv-blue border-jmv-gold shadow-lg scale-105'
                    : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                }`}
              >
                <h3 className="font-bold mb-2">{zona.nombre}</h3>
                <div className="flex items-center mb-1">
                  <Users className="w-4 h-4 mr-2" />
                  <span className="text-sm">{zona.jóvenes} jóvenes</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="text-sm">{zona.provincias.length} provincias</span>
                </div>
              </button>
            </ScrollReveal>
          ))}
        </div>

        {/* Selected Zone Details */}
        <ScrollReveal direction="up" delay={200}>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-3xl font-bold text-white mb-4">
                  {zonasData[selectedZona].nombre}
                </h3>
                <div className="space-y-4 mb-6">
                  <div className="flex items-center">
                    <Crown className="w-5 h-5 text-jmv-gold mr-3" />
                    <div>
                      <p className="text-white font-medium">Coordinador Zonal</p>
                      <p className="text-white/70">{zonasData[selectedZona].coordinador}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-jmv-gold mr-3" />
                    <div>
                      <p className="text-white font-medium">Jóvenes Activos</p>
                      <p className="text-white/70">{zonasData[selectedZona].jóvenes} miembros</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 text-jmv-gold mr-3" />
                    <div>
                      <p className="text-white font-medium">Provincias</p>
                      <p className="text-white/70">{zonasData[selectedZona].provincias.join(', ')}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button className="flex items-center px-4 py-2 bg-jmv-blue text-white rounded-lg hover:bg-jmv-blue-dark transition-colors">
                    <Phone className="w-4 h-4 mr-2" />
                    Contactar
                  </button>
                  <button className="flex items-center px-4 py-2 bg-jmv-gold text-white rounded-lg hover:bg-jmv-gold-dark transition-colors">
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </button>
                </div>
              </div>
              
              {/* Ecuador Map Placeholder */}
              <div className="flex items-center justify-center">
                <div className="w-full h-80 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-jmv-gold mx-auto mb-4" />
                    <p className="text-white/70">Mapa Interactivo</p>
                    <p className="text-white/50 text-sm">de Ecuador</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}