"use client";

import { useState } from "react";
import { Calendar, MapPin, Users, Award, Heart, Star } from "lucide-react";
import ScrollReveal from "../ui/ScrollReveal";

const timelineEvents = [
  {
    year: "1995",
    title: "Fundación de JMV Ecuador",
    description:
      "Nace oficialmente Juventudes Marianas Vicencianas en Ecuador, inspirada en el carisma de San Vicente de Paúl y la espiritualidad de la Medalla Milagrosa.",
    icon: Star,
    color: "from-jmv-blue to-jmv-blue-dark",
    image: "/images/historia/fundacion-1995.jpg",
  },
  {
    year: "1998",
    title: "Primera Expansión Nacional",
    description:
      "JMV se extiende a las principales ciudades del país: Guayaquil, Cuenca y Ambato, estableciendo las bases de la organización nacional.",
    icon: MapPin,
    color: "from-jmv-red to-jmv-red-dark",
    image: "/images/historia/expansion-1998.jpg",
  },
  {
    year: "2002",
    title: "Reconocimiento Eclesiástico",
    description:
      "La Conferencia Episcopal Ecuatoriana reconoce oficialmente a JMV como movimiento de pastoral juvenil, consolidando su misión evangelizadora.",
    icon: Award,
    color: "from-jmv-gold to-jmv-gold-dark",
    image: "/images/historia/reconocimiento-2002.jpg",
  },
  {
    year: "2005",
    title: "Estructura de Zonas Pastorales",
    description:
      "Se establece la organización en 8 zonas pastorales, fortaleciendo la coordinación nacional y el acompañamiento local a los jóvenes.",
    icon: Users,
    color: "from-blue-600 to-blue-800",
    image: "/images/historia/zonas-2005.jpg",
  },
  {
    year: "2010",
    title: "Consolidación del Servicio Social",
    description:
      "Se intensifican los proyectos de servicio social, estableciendo programas permanentes de apoyo a comunidades vulnerables en todo el país.",
    icon: Heart,
    color: "from-green-600 to-green-800",
    image: "/images/historia/servicio-2010.jpg",
  },
  {
    year: "2015",
    title: "20 Años de Compromiso",
    description:
      "JMV Ecuador celebra dos décadas de formación juvenil, con más de 15,000 jóvenes formados y presencia consolidada en las 24 provincias.",
    icon: Calendar,
    color: "from-purple-600 to-purple-800",
    image: "/images/historia/20años-2015.jpg",
  },
  {
    year: "2020",
    title: "Adaptación Digital",
    description:
      "Durante la pandemia, JMV se adapta al mundo digital, manteniendo la formación y el servicio a través de plataformas virtuales innovadoras.",
    icon: Star,
    color: "from-indigo-600 to-indigo-800",
    image: "/images/historia/digital-2020.jpg",
  },
  {
    year: "2025",
    title: "30 Años Transformando Vidas",
    description:
      "JMV Ecuador celebra tres décadas de compromiso vicenciano, consolidándose como referente en pastoral juvenil y servicio social.",
    icon: Award,
    color: "from-jmv-blue to-jmv-red",
    image: "/images/historia/30años-2025.jpg",
  },
];

export default function HistoriaTimeline() {
  const [selectedEvent, setSelectedEvent] = useState(0);

  return (
    <section id="historia" className="py-20 relative overflow-hidden">
      {/* Hero background that fades out */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, var(--jmv-blue) 0%, var(--jmv-blue-dark) 100%)",
          maskImage:
            "linear-gradient(to bottom, black 0%, black 40%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, black 40%, transparent 100%)",
        }}
      />
      {/* Current section background */}
      <div className="absolute inset-0 bg-gradient-to-br from-jmv-blue-dark via-jmv-blue to-blue-800" />

      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-jmv-blue/20 rounded-full blur-3xl opacity-30 translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl opacity-30 -translate-x-1/2 translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <ScrollReveal direction="up" delay={50}>
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white font-medium mb-6">
              <Calendar className="w-5 h-5 mr-2" />
              Nuestra Historia
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              <span className="text-jmv-gold">30 Años</span> de Compromiso
              Vicenciano
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Un recorrido por las etapas más significativas de JMV Ecuador,
              desde nuestra fundación hasta convertirnos en referente de
              pastoral juvenil.
            </p>
          </div>
        </ScrollReveal>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line - Desktop: center, Mobile: left */}
          <div className="absolute left-8 md:left-1/2 transform md:-translate-x-0.5 w-1 h-full bg-gradient-to-b from-jmv-gold via-white to-jmv-gold opacity-30"></div>

          {/* Timeline Events */}
          <div className="space-y-8 md:space-y-16">
            {timelineEvents.map((event, index) => {
              const Icon = event.icon;
              const isLeft = index % 2 === 0;

              return (
                <ScrollReveal
                  key={index}
                  direction="up"
                  delay={100 + index * 30}
                >
                  <div
                    className="relative cursor-pointer group"
                    onClick={() => setSelectedEvent(index)}
                  >
                    {/* Mobile Layout */}
                    <div className="block md:hidden">
                      <div className="flex items-start pl-16">
                        <div
                          className={`flex-1 p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 ${
                            selectedEvent === index
                              ? "ring-2 ring-jmv-gold shadow-2xl"
                              : ""
                          }`}
                        >
                          <div className="flex items-center mb-3">
                            <div
                              className={`w-10 h-10 bg-gradient-to-r ${event.color} rounded-full flex items-center justify-center mr-3`}
                            >
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-jmv-gold">
                              {event.year}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-white mb-2">
                            {event.title}
                          </h3>
                          <p className="text-white/70 text-sm leading-relaxed">
                            {event.description}
                          </p>
                        </div>
                      </div>

                      {/* Mobile Timeline Node */}
                      <div className="absolute left-6 top-4 transform -translate-x-1/2 z-10">
                        <div
                          className={`w-5 h-5 bg-gradient-to-r ${
                            event.color
                          } rounded-full border-3 border-white shadow-lg transition-all duration-300 ${
                            selectedEvent === index
                              ? "scale-125 shadow-xl"
                              : "group-hover:scale-110"
                          }`}
                        ></div>
                      </div>
                    </div>

                    {/* Desktop Layout */}
                    <div
                      className={`hidden md:flex items-center justify-between ${
                        isLeft ? "flex-row" : "flex-row-reverse"
                      }`}
                    >
                      {/* Content Card */}
                      <div
                        className={`w-5/12 ${isLeft ? "pr-8" : "pl-8"} flex`}
                      >
                        <div
                          className={`flex-1 p-6 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 ${
                            selectedEvent === index
                              ? "ring-2 ring-jmv-gold shadow-2xl scale-105"
                              : ""
                          }`}
                        >
                          <div className="flex items-center mb-4">
                            <div
                              className={`w-12 h-12 bg-gradient-to-r ${event.color} rounded-full flex items-center justify-center mr-4`}
                            >
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold text-jmv-gold">
                              {event.year}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold text-white mb-3">
                            {event.title}
                          </h3>
                          <p className="text-white/70 leading-relaxed">
                            {event.description}
                          </p>
                        </div>
                      </div>

                      {/* Image on the opposite side from content */}
                      <div
                        className={`w-5/12 ${
                          isLeft ? "pl-8" : "pr-8"
                        } flex items-center`}
                      >
                        <div
                          className={`relative flex-1 h-60 rounded-xl overflow-hidden border border-white/20 shadow-lg transition-all duration-300 ${
                            selectedEvent === index
                              ? "ring-2 ring-jmv-gold scale-105"
                              : ""
                          }`}
                        >
                          <div
                            className={`absolute inset-0 bg-gradient-to-br ${event.color} opacity-60`}
                          ></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Icon className="w-16 h-16 text-white/40" />
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                            <p className="text-white/80 text-sm font-medium">
                              {event.year}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Desktop Timeline Node */}
                    <div className="hidden md:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                      <div
                        className={`w-6 h-6 bg-gradient-to-r ${
                          event.color
                        } rounded-full border-4 border-white shadow-lg transition-all duration-300 ${
                          selectedEvent === index
                            ? "scale-150 shadow-xl"
                            : "group-hover:scale-125"
                        }`}
                      ></div>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>

        {/* Selected Event Details */}
        <ScrollReveal direction="up" delay={300}>
          <div className="mt-16 text-center">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-4xl mx-auto">
              <h4 className="text-2xl font-bold text-white mb-4">
                Evento Destacado: {timelineEvents[selectedEvent].year}
              </h4>
              <h5 className="text-xl text-jmv-gold mb-4">
                {timelineEvents[selectedEvent].title}
              </h5>
              <p className="text-white/80 text-lg leading-relaxed">
                {timelineEvents[selectedEvent].description}
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
