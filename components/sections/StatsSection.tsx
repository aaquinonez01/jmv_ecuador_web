'use client'

import { Users, MapPin, Calendar, Heart, Award, Globe } from 'lucide-react'
import AnimatedCounter from '../ui/AnimatedCounter'
import ScrollReveal from '../ui/ScrollReveal'

const stats = [
  {
    icon: Users,
    value: 2500,
    label: "Jóvenes Activos",
    description: "En toda la República del Ecuador"
  },
  {
    icon: MapPin,
    value: 24,
    label: "Provincias",
    description: "Presencia nacional establecida"
  },
  {
    icon: Calendar,
    value: 30,
    suffix: "",
    label: "Años de Historia",
    description: "Formando jóvenes desde 1995"
  },
  {
    icon: Heart,
    value: 150,
    suffix: "+",
    label: "Proyectos Sociales",
    description: "Anuales de servicio comunitario"
  },
  {
    icon: Award,
    value: 8,
    label: "Zonas Pastorales",
    description: "Organizadas en todo el país"
  },
  {
    icon: Globe,
    value: 1000,
    suffix: "+",
    label: "Familias Beneficiadas",
    description: "Cada año a través de nuestros programas"
  }
]

export default function StatsSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-jmv-blue-dark via-jmv-blue to-jmv-blue-light relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23${encodeURIComponent('1D4E8A')}' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <ScrollReveal direction="up" delay={100}>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Impacto en <span className="text-jmv-gold">Números</span>
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Tres décadas formando jóvenes comprometidos con la transformación social 
              y el servicio a los más necesitados en todo Ecuador.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <ScrollReveal 
                key={index} 
                direction="up" 
                delay={200 + index * 100}
              >
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:-translate-y-2 group">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-jmv rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <div className="text-center">
                    <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                      <AnimatedCounter 
                        end={stat.value}
                        suffix={stat.suffix || ''}
                        duration={2000 + index * 200}
                      />
                    </div>
                    
                    <h3 className="text-xl font-semibold text-jmv-gold mb-3">
                      {stat.label}
                    </h3>
                    
                    <p className="text-white/70 leading-relaxed">
                      {stat.description}
                    </p>
                  </div>
                  
                  {/* Decorative Element */}
                  <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-jmv-soft rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </ScrollReveal>
            )
          })}
        </div>

        {/* Call to Action */}
        <ScrollReveal direction="up" delay={800}>
          <div className="text-center mt-16">
            <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full text-jmv-gold font-medium mb-6 border border-white/20">
              <Heart className="w-5 h-5 mr-2" />
              Únete a nuestra misión transformadora
            </div>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
              Estos números reflejan el compromiso y la dedicación de miles de jóvenes que han 
              elegido vivir el carisma vicenciano. ¡Tú también puedes ser parte de esta gran familia!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="bg-white text-jmv-blue px-8 py-4 rounded-xl font-semibold hover:bg-white/90 transition-all duration-200 transform hover:scale-105 shadow-lg">
                Conoce Nuestra Historia
              </button>
              <button className="text-white border-2 border-white/30 px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-jmv-blue transition-all duration-200">
                Ver Testimonios
              </button>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}