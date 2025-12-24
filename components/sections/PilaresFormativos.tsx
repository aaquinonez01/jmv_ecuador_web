"use client";

import {
  Cross,
  Users,
  Hand,
  BookOpen,
  Heart,
  Star,
  Lightbulb,
  Target,
} from "lucide-react";
import ScrollReveal from "../ui/ScrollReveal";

const pilares = [
  {
    icon: Cross,
    title: "Formación Espiritual",
    description:
      "Crecimiento en la fe católica y vivencia del carisma vicenciano",
    activities: [
      "Retiros espirituales",
      "Jornadas de oración",
      "Formación bíblica",
      "Celebraciones litúrgicas",
    ],
    color: "from-jmv-blue to-jmv-blue-dark",
  },
  {
    icon: Users,
    title: "Vida Comunitaria",
    description:
      "Construcción de vínculos fraternos y experiencia de familia vicenciana",
    activities: [
      "Encuentros zonales",
      "Convivencias",
      "Actividades recreativas",
      "Intercambio cultural",
    ],
    color: "from-jmv-red to-jmv-red-dark",
  },
  {
    icon: Hand,
    title: "Servicio Social",
    description:
      "Compromiso activo con los más necesitados siguiendo a San Vicente",
    activities: [
      "Comedores comunitarios",
      "Brigadas médicas",
      "Apoyo educativo",
      "Construcción de viviendas",
    ],
    color: "from-jmv-gold to-jmv-gold-dark",
  },
  {
    icon: BookOpen,
    title: "Formación Integral",
    description:
      "Desarrollo de capacidades humanas, liderazgo y compromiso social",
    activities: [
      "Talleres de liderazgo",
      "Formación académica",
      "Capacitación laboral",
      "Desarrollo personal",
    ],
    color: "from-green-600 to-green-800",
  },
];

export default function PilaresFormativos() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Previous section background that fades out */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom right, #1e3a8a, var(--jmv-blue-dark), #1e40af)",
          maskImage:
            "linear-gradient(to bottom, black 0%, black 35%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, black 35%, transparent 100%)",
        }}
      />
      {/* Current section background */}
      <div className="absolute inset-0 bg-gradient-to-br from-jmv-blue-dark via-blue-800 to-blue-700" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <ScrollReveal direction="up" delay={50}>
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white font-medium mb-6">
              <Target className="w-5 h-5 mr-2" />
              Metodología JMV
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Pilares <span className="text-jmv-gold">Formativos</span>
            </h2>
            <p className="text-xl text-white/80 max-w-4xl mx-auto">
              Nuestra formación se sustenta en cuatro pilares fundamentales que
              desarrollan integralmente a cada joven
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {pilares.map((pilar, index) => {
            const Icon = pilar.icon;
            return (
              <ScrollReveal key={index} direction="up" delay={100 + index * 50}>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6">
                    <div
                      className={`w-14 h-14 md:w-16 md:h-16 bg-gradient-to-r ${pilar.color} rounded-2xl flex items-center justify-center mb-4 sm:mb-0 sm:mr-4 group-hover:scale-110 transition-transform flex-shrink-0`}
                    >
                      <Icon className="w-7 h-7 md:w-8 md:h-8 text-white" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-white leading-tight">
                      {pilar.title}
                    </h3>
                  </div>

                  <p className="text-white/80 text-base md:text-lg leading-relaxed mb-6">
                    {pilar.description}
                  </p>

                  <div>
                    <h4 className="text-base md:text-lg font-semibold text-jmv-gold mb-4">
                      Actividades Principales
                    </h4>
                    <ul className="space-y-2">
                      {pilar.activities.map((activity, idx) => (
                        <li key={idx} className="flex items-start">
                          <Star className="w-4 h-4 text-jmv-gold mr-3 flex-shrink-0 mt-0.5" />
                          <span className="text-white/70 text-sm md:text-base leading-relaxed">
                            {activity}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Methodology Overview */}
        <ScrollReveal direction="up" delay={200}>
          <div className="mt-12 md:mt-16 bg-gradient-to-r from-jmv-blue to-jmv-red rounded-2xl p-6 md:p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/30"></div>
            <div className="relative text-center">
              <Lightbulb className="w-12 h-12 md:w-16 md:h-16 text-jmv-gold mx-auto mb-4 md:mb-6" />
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-6">
                Metodología Integral
              </h3>
              <p className="text-white/90 text-base md:text-lg max-w-4xl mx-auto leading-relaxed">
                Cada pilar se desarrolla de manera complementaria e integrada,
                asegurando que nuestros jóvenes crezcan en todas las
                dimensiones: espiritual, comunitaria, social y humana, formando
                líderes comprometidos con la transformación de nuestra sociedad.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
