'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calendar, MapPin, Clock, Users, ArrowRight, Filter } from 'lucide-react'
import ScrollReveal from '../ui/ScrollReveal'
import Card, { CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card'

const eventTypes = ['Todos', 'Encuentros', 'Retiros', 'Formación', 'Servicio']

const upcomingEvents = [
  {
    id: 1,
    title: "Encuentro Nacional de Juventudes",
    description: "Gran encuentro anual que reúne a jóvenes de todas las zonas del país para fortalecer la hermandad vicenciana.",
    date: "2024-03-15",
    time: "09:00",
    location: "Quito, Pichincha",
    type: "Encuentros",
    participants: 500,
    image: "/images/events/encuentro-nacional.jpg",
    featured: true
  },
  {
    id: 2,
    title: "Retiro Espiritual Zonal",
    description: "Jornada de reflexión y oración para profundizar en la espiritualidad vicenciana.",
    date: "2024-02-20",
    time: "08:00",
    location: "Cuenca, Azuay",
    type: "Retiros",
    participants: 80,
    image: "/images/events/retiro-espiritual.jpg"
  },
  {
    id: 3,
    title: "Jornada de Servicio Social",
    description: "Actividad de apoyo a familias vulnerables en sectores rurales de la provincia.",
    date: "2024-02-28",
    time: "07:00",
    location: "Ambato, Tungurahua",
    type: "Servicio",
    participants: 45,
    image: "/images/events/servicio-social.jpg"
  },
  {
    id: 4,
    title: "Formación: Santos Vicencianos",
    description: "Taller formativo sobre la vida y enseñanzas de San Vicente de Paúl y Santa Catalina Labouré.",
    date: "2024-03-05",
    time: "15:00",
    location: "Guayaquil, Guayas",
    type: "Formación",
    participants: 60,
    image: "/images/events/formacion-santos.jpg"
  },
  {
    id: 5,
    title: "Campamento Juvenil",
    description: "Experiencia de convivencia y crecimiento personal en un ambiente natural y fraterno.",
    date: "2024-03-22",
    time: "16:00",
    location: "Baños, Tungurahua",
    type: "Encuentros",
    participants: 120,
    image: "/images/events/campamento.jpg"
  },
  {
    id: 6,
    title: "Celebración de la Medalla Milagrosa",
    description: "Eucaristía especial y actividades marianas en honor a Nuestra Señora de la Medalla Milagrosa.",
    date: "2024-11-27",
    time: "10:00",
    location: "Loja, Loja",
    type: "Formación",
    participants: 200,
    image: "/images/events/medalla-milagrosa.jpg"
  }
]

export default function UpcomingEvents() {
  const [selectedType, setSelectedType] = useState('Todos')
  
  const filteredEvents = selectedType === 'Todos' 
    ? upcomingEvents 
    : upcomingEvents.filter(event => event.type === selectedType)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('es-EC', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date)
  }

  const getDaysUntil = (dateString: string) => {
    const eventDate = new Date(dateString)
    const today = new Date()
    const diffTime = eventDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <section className="py-20 bg-gradient-to-br from-jmv-blue-dark via-jmv-red to-jmv-gold relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23${encodeURIComponent('1D4E8A')}' fill-opacity='0.1'%3E%3Cpath d='M0 0h80v80H0V0zm20 20v40h40V20H20zm20 35a15 15 0 1 1 0-30 15 15 0 0 1 0 30z' fill-opacity='0.05'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-12">
          <ScrollReveal direction="up" delay={100}>
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-sm font-medium mb-6 border border-white/20">
              <Calendar className="w-4 h-4 mr-2" />
              Próximas Actividades
            </div>
          </ScrollReveal>
          
          <ScrollReveal direction="up" delay={200}>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Eventos y <span className="text-jmv-gold">Actividades</span>
            </h2>
          </ScrollReveal>
          
          <ScrollReveal direction="up" delay={300}>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Participa en nuestras actividades formativas, encuentros fraternos y jornadas de servicio. 
              Cada evento es una oportunidad de crecimiento y compromiso.
            </p>
          </ScrollReveal>
        </div>

        {/* Filter Buttons */}
        <ScrollReveal direction="up" delay={400}>
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            <div className="flex items-center text-white/70 mr-4">
              <Filter className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">Filtrar por:</span>
            </div>
            {eventTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedType === type
                    ? 'bg-white text-jmv-blue shadow-lg'
                    : 'bg-white/10 backdrop-blur-md border border-white/20 text-white/80 hover:bg-white/20 hover:text-white'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredEvents.map((event, index) => {
            const daysUntil = getDaysUntil(event.date)
            
            return (
              <ScrollReveal key={event.id} direction="up" delay={200 + index * 100}>
                <Card hover className={`h-full bg-white/10 backdrop-blur-md border border-white/20 ${event.featured ? 'ring-2 ring-jmv-gold' : ''}`}>
                  {/* Event Image */}
                  <div className="relative h-48 bg-gradient-jmv rounded-t-2xl flex items-center justify-center">
                    <div className="text-white text-center">
                      <Calendar className="w-12 h-12 mx-auto mb-2" />
                      <p className="font-semibold">{event.type}</p>
                    </div>
                    
                    {/* Days Until Badge */}
                    {daysUntil > 0 && (
                      <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md border border-white/30 px-3 py-1 rounded-full text-xs font-semibold text-white">
                        {daysUntil === 1 ? 'Mañana' : `${daysUntil} días`}
                      </div>
                    )}
                    
                    {/* Featured Badge */}
                    {event.featured && (
                      <div className="absolute top-4 left-4 bg-jmv-gold px-3 py-1 rounded-full text-xs font-semibold text-white">
                        Destacado
                      </div>
                    )}
                  </div>

                  <CardHeader>
                    <CardTitle className="line-clamp-2 text-white">{event.title}</CardTitle>
                    <CardDescription className="line-clamp-3 text-white/70">
                      {event.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    {/* Event Details */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-sm text-white/70">
                        <Calendar className="w-4 h-4 mr-2 text-white" />
                        {formatDate(event.date)}
                      </div>
                      <div className="flex items-center text-sm text-white/70">
                        <Clock className="w-4 h-4 mr-2 text-white" />
                        {event.time} hrs
                      </div>
                      <div className="flex items-center text-sm text-white/70">
                        <MapPin className="w-4 h-4 mr-2 text-white" />
                        {event.location}
                      </div>
                      <div className="flex items-center text-sm text-white/70">
                        <Users className="w-4 h-4 mr-2 text-white" />
                        {event.participants} participantes esperados
                      </div>
                    </div>

                    {/* Action Button */}
                    <button className="w-full bg-white text-jmv-blue py-3 rounded-xl font-medium hover:bg-white/90 transition-all duration-200 flex items-center justify-center group">
                      Ver Detalles
                      <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </CardContent>
                </Card>
              </ScrollReveal>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <ScrollReveal direction="up" delay={600}>
          <div className="text-center">
            <Link href="/actividades">
              <button className="bg-white text-jmv-blue px-8 py-4 rounded-xl font-semibold hover:bg-white/90 transition-all duration-200 transform hover:scale-105 shadow-lg">
                Ver Todos los Eventos
              </button>
            </Link>
            <p className="text-white/70 mt-4">
              ¿Tienes preguntas sobre algún evento? 
              <Link href="/contacto" className="text-white hover:text-jmv-gold font-medium ml-2">
                Contáctanos aquí
              </Link>
            </p>
          </div>
        </ScrollReveal>
      </div>
      
      {/* Gradient mask for smooth transition to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-jmv-red-dark z-10" />
    </section>
  )
}