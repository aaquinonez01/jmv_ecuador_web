'use client'

import { useState } from 'react'
import { Cross, Heart, Star, BookOpen, Users, Sparkles } from 'lucide-react'
import ScrollReveal from '../ui/ScrollReveal'

const carismaSections = [
  {
    id: 'vicente',
    title: 'San Vicente de Paúl',
    subtitle: 'El Padre de los Pobres',
    years: '1581 - 1660',
    description: 'Sacerdote francés que dedicó su vida al servicio de los más necesitados. Fundador de la Congregación de la Misión y las Hijas de la Caridad.',
    teachings: [
      'El amor es inventivo hasta el infinito',
      'Hay que servir a los pobres como a nuestros amos y señores',
      'La humildad es la base de toda virtud',
      'Dios es amor, caridad y compasión'
    ],
    modernApplication: 'Su ejemplo nos inspira a ver en cada persona necesitada el rostro de Cristo, motivándonos al servicio desinteresado y la entrega generosa.',
    icon: Cross,
    image: '/images/santos/san-vicente.jpg'
  },
  {
    id: 'catalina',
    title: 'Santa Catalina Labouré',
    subtitle: 'Vidente de la Medalla Milagrosa',
    years: '1806 - 1876',
    description: 'Religiosa francesa a quien la Virgen María se apareció en 1830, entregándole la devoción de la Medalla Milagrosa que une a toda la Familia Vicenciana.',
    teachings: [
      'María es nuestra Madre y Mediadora',
      'La oración transforma los corazones',
      'La sencillez abre el corazón a Dios',
      'El silencio es fuente de santidad'
    ],
    modernApplication: 'Su devoción mariana nos enseña a vivir bajo la protección de María, fortaleciendo nuestra fe y compromiso con los más necesitados.',
    icon: Star,
    image: '/images/santos/santa-catalina.jpg'
  }
]

const carismaValues = [
  {
    icon: Heart,
    title: 'Amor Efectivo y Afectivo',
    description: 'No solo sentir compasión, sino actuar concretamente para transformar la realidad de quien sufre.',
    example: 'Programas de alimentación, salud y educación para familias vulnerables.'
  },
  {
    icon: Users,
    title: 'Simplicidad y Humildad',
    description: 'Acercarnos a los demás sin pretensiones, con corazón sencillo y espíritu de servicio.',
    example: 'Convivencia directa con comunidades en situación de pobreza.'
  },
  {
    icon: Sparkles,
    title: 'Creatividad en el Servicio',
    description: 'Buscar constantemente nuevas formas de responder a las necesidades emergentes.',
    example: 'Adaptación digital durante la pandemia para mantener el acompañamiento.'
  },
  {
    icon: BookOpen,
    title: 'Formación Integral',
    description: 'Crecimiento continuo en todas las dimensiones de la persona humana.',
    example: 'Talleres de liderazgo, espiritualidad y compromiso social.'
  }
]

export default function CarismaVicenciano() {
  const [activeSection, setActiveSection] = useState('vicente')

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Previous section background that fades out */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom right, #1e3a8a, var(--jmv-blue-dark), var(--jmv-blue))',
          maskImage: 'linear-gradient(to bottom, black 0%, black 35%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 35%, transparent 100%)'
        }}
      />
      {/* Current section background */}
      <div className="absolute inset-0 bg-gradient-to-br from-jmv-blue-dark via-blue-800 to-blue-700" />

      {/* Background Elements */}
      <div className="absolute top-20 right-20 w-80 h-80 bg-jmv-gold/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-64 h-64 bg-white/5 rounded-full blur-2xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <ScrollReveal direction="up" delay={50}>
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white font-medium mb-6">
              <Cross className="w-5 h-5 mr-2" />
              Nuestras Raíces
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Carisma <span className="text-jmv-gold">Vicenciano</span>
            </h2>
            <p className="text-xl text-white/80 max-w-4xl mx-auto">
              Conoce a nuestros santos fundadores y cómo su legado inspira nuestra misión 
              de servicio a los más necesitados en el Ecuador de hoy.
            </p>
          </div>
        </ScrollReveal>

        {/* Saints Section Selector */}
        <ScrollReveal direction="up" delay={100}>
          <div className="flex justify-center mb-12">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-2 border border-white/20">
              {carismaSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                    activeSection === section.id
                      ? 'bg-white text-jmv-blue shadow-lg'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {section.title}
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Saints Details */}
        {carismaSections.map((saint) => (
          <div
            key={saint.id}
            className={`transition-all duration-500 ${
              activeSection === saint.id ? 'opacity-100' : 'opacity-0 absolute pointer-events-none'
            }`}
          >
            <ScrollReveal direction="up" delay={150}>
              <div className="grid lg:grid-cols-2 gap-12 mb-16">
                {/* Saint Info */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-jmv-gold to-jmv-gold-dark rounded-full flex items-center justify-center mr-4">
                      <saint.icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">{saint.title}</h3>
                      <p className="text-jmv-gold font-medium">{saint.subtitle}</p>
                      <p className="text-white/60 text-sm">{saint.years}</p>
                    </div>
                  </div>
                  
                  <p className="text-white/80 text-lg leading-relaxed mb-6">
                    {saint.description}
                  </p>

                  <div className="mb-6">
                    <h4 className="text-xl font-bold text-white mb-4">Enseñanzas Principales</h4>
                    <ul className="space-y-2">
                      {saint.teachings.map((teaching, index) => (
                        <li key={index} className="flex items-start">
                          <Star className="w-4 h-4 text-jmv-gold mt-1 mr-3 flex-shrink-0" />
                          <span className="text-white/70 italic">"{teaching}"</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <h5 className="text-lg font-semibold text-jmv-gold mb-2">Aplicación Moderna</h5>
                    <p className="text-white/80">{saint.modernApplication}</p>
                  </div>
                </div>

                {/* Saint Image Placeholder */}
                <div className="flex items-center justify-center">
                  <div className="w-full max-w-md h-96 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex items-center justify-center">
                    <div className="text-center">
                      <saint.icon className="w-16 h-16 text-jmv-gold mx-auto mb-4" />
                      <p className="text-white/70">Imagen de {saint.title}</p>
                      <p className="text-white/50 text-sm mt-2">Próximamente</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        ))}

        {/* Carisma Values */}
        <ScrollReveal direction="up" delay={200}>
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Viviendo el <span className="text-jmv-gold">Carisma Hoy</span>
            </h3>
            <p className="text-white/70 text-lg max-w-3xl mx-auto">
              Así traducimos las enseñanzas de nuestros santos en acciones concretas
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-8">
          {carismaValues.map((value, index) => {
            const Icon = value.icon
            return (
              <ScrollReveal key={index} direction="up" delay={250 + index * 50}>
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-gradient-to-r from-jmv-blue to-jmv-gold rounded-full flex items-center justify-center mr-4 flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-white mb-2">{value.title}</h4>
                      <p className="text-white/70 mb-4 leading-relaxed">{value.description}</p>
                      <div className="bg-jmv-gold/10 rounded-lg p-3 border border-jmv-gold/20">
                        <p className="text-jmv-gold text-sm font-medium">Ejemplo práctico:</p>
                        <p className="text-white/80 text-sm">{value.example}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}