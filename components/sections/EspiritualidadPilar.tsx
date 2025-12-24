"use client";

import { useState } from "react";
import {
  Cross,
  Heart,
  Star,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Play,
} from "lucide-react";
import ScrollReveal from "../ui/ScrollReveal";

const espiritualidadActividades = [
  {
    titulo: "Retiros Espirituales",
    descripcion:
      "Encuentros intensivos de oración, reflexión y crecimiento en la fe vicenciana.",
    imagen: "/images/pilares/espiritualidad/retiros.jpg",
    ubicacion: "Casa de Retiros San Vicente",
    participantes: 80,
  },
  {
    titulo: "Jornadas de Oración",
    descripcion:
      "Espacios de encuentro con Dios a través de la adoración eucarística y el rosario.",
    imagen: "/images/pilares/espiritualidad/oracion.jpg",
    ubicacion: "Parroquias JMV Nacional",
    participantes: 200,
  },
  {
    titulo: "Formación Bíblica",
    descripcion:
      "Círculos bíblicos y talleres para profundizar en la Palabra de Dios.",
    imagen: "/images/pilares/espiritualidad/biblia.jpg",
    ubicacion: "Centros Formativos JMV",
    participantes: 150,
  },
  {
    titulo: "Celebraciones Litúrgicas",
    descripcion: "Misas especiales y celebraciones de los santos vicencianos.",
    imagen: "/images/pilares/espiritualidad/liturgia.jpg",
    ubicacion: "Santuarios Vicencianos",
    participantes: 300,
  },
  {
    titulo: "Novenas y Triduos",
    descripcion:
      "Preparación espiritual para las fiestas de San Vicente y Santa Catalina.",
    imagen: "/images/pilares/espiritualidad/novenas.jpg",
    ubicacion: "Comunidades JMV",
    participantes: 180,
  },
  {
    titulo: "Peregrinaciones",
    descripcion: "Caminos de fe hacia santuarios marianos y lugares santos.",
    imagen: "/images/pilares/espiritualidad/peregrinacion.jpg",
    ubicacion: "El Quinche, La Dolorosa",
    participantes: 120,
  },
];

export default function EspiritualidadPilar() {
  const [currentImage, setCurrentImage] = useState(0);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % espiritualidadActividades.length);
  };

  const prevImage = () => {
    setCurrentImage(
      (prev) =>
        (prev - 1 + espiritualidadActividades.length) %
        espiritualidadActividades.length
    );
  };

  return (
    <section
      id="espiritualidad"
      className="py-12 sm:py-16 lg:py-20 relative overflow-hidden"
    >
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom right, #1e3a8a, var(--jmv-blue-dark), var(--jmv-blue))",
          maskImage:
            "linear-gradient(to bottom, black 0%, black 35%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, black 35%, transparent 100%)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-jmv-blue-dark via-blue-800 to-blue-700" />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <ScrollReveal direction="up" delay={50}>
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white font-medium mb-6">
              <Cross className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Segundo Pilar
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              <span className="text-jmv-gold">Espiritualidad</span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/80 max-w-4xl mx-auto leading-relaxed">
              Crecimiento en la fe católica y vivencia del carisma vicenciano
              bajo la protección maternal de María Santísima. Formamos jóvenes
              con una profunda vida espiritual.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 mb-12 sm:mb-16">
          {/* Content Section */}
          <ScrollReveal direction="left" delay={100}>
            <div className="space-y-6">
              {/* Description */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="flex items-center mb-4">
                  <Heart className="w-6 h-6 text-jmv-gold mr-3" />
                  <h3 className="text-xl font-bold text-white">
                    ¿Qué es la Espiritualidad Vicenciana?
                  </h3>
                </div>
                <p className="text-white/80 leading-relaxed">
                  Es el encuentro personal con Dios que nos lleva a descubrir su
                  presencia en los pobres. Siguiendo a San Vicente de Paúl y
                  Santa Catalina Labouré, cultivamos una espiritualidad mariana,
                  eucarística y comprometida con la justicia social.
                </p>
              </div>

              {/* Spiritual Elements */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <h4 className="text-lg font-bold text-white mb-4">
                  Elementos Espirituales Fundamentales
                </h4>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Cross className="w-5 h-5 text-jmv-gold mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-white font-medium text-sm">
                        Eucaristía
                      </p>
                      <p className="text-white/70 text-xs">
                        Centro de nuestra vida espiritual y fuente de fortaleza
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Star className="w-5 h-5 text-jmv-gold mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-white font-medium text-sm">
                        Devoción Mariana
                      </p>
                      <p className="text-white/70 text-xs">
                        Amor especial a María, Madre de la Medalla Milagrosa
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <BookOpen className="w-5 h-5 text-jmv-gold mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-white font-medium text-sm">
                        Palabra de Dios
                      </p>
                      <p className="text-white/70 text-xs">
                        Lectio divina y meditación bíblica constante
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Heart className="w-5 h-5 text-jmv-gold mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-white font-medium text-sm">
                        Oración Personal
                      </p>
                      <p className="text-white/70 text-xs">
                        Diálogo íntimo con Dios en el silencio del corazón
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Statistics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-jmv-gold/10 rounded-xl p-4 border border-jmv-gold/20 text-center">
                  <div className="text-2xl font-bold text-jmv-gold mb-1">
                    1,030
                  </div>
                  <div className="text-white/70 text-sm">
                    Participantes Anuales
                  </div>
                </div>
                <div className="bg-jmv-gold/10 rounded-xl p-4 border border-jmv-gold/20 text-center">
                  <div className="text-2xl font-bold text-jmv-gold mb-1">6</div>
                  <div className="text-white/70 text-sm">
                    Tipos de Actividades
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Gallery Section */}
          <ScrollReveal direction="right" delay={150}>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 lg:p-6 border border-white/20">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 text-center">
                Galería Espiritual
              </h3>

              {/* Main Image */}
              <div className="relative mb-4 sm:mb-6">
                <div className="aspect-video bg-white/10 rounded-xl border border-white/20 flex items-center justify-center overflow-hidden group">
                  <div className="text-center p-3 sm:p-4">
                    <Play className="w-12 h-12 sm:w-16 sm:h-16 text-jmv-gold mb-3 sm:mb-4 group-hover:scale-110 transition-transform" />
                    <h4 className="text-sm sm:text-base lg:text-lg font-bold text-white mb-2">
                      {espiritualidadActividades[currentImage].titulo}
                    </h4>
                    <p className="text-white/70 text-xs sm:text-sm px-2 sm:px-4 mb-3 line-clamp-2">
                      {espiritualidadActividades[currentImage].descripcion}
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
                      <div className="flex items-center text-jmv-gold text-xs sm:text-sm">
                        <Cross className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        <span className="truncate max-w-[150px] sm:max-w-none">
                          {espiritualidadActividades[currentImage].ubicacion}
                        </span>
                      </div>
                      <div className="flex items-center text-jmv-gold text-xs sm:text-sm">
                        <Heart className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        {
                          espiritualidadActividades[currentImage].participantes
                        }{" "}
                        personas
                      </div>
                    </div>
                  </div>
                </div>

                {/* Navigation Arrows */}
                <button
                  onClick={prevImage}
                  className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-black/50 backdrop-blur-sm rounded-full p-2 sm:p-3 text-white hover:bg-black/70 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-black/50 backdrop-blur-sm rounded-full p-2 sm:p-3 text-white hover:bg-black/70 transition-colors"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                </button>
              </div>

              {/* Thumbnail Navigation */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/20">
                {espiritualidadActividades.map((actividad, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={`flex-shrink-0 w-16 h-12 sm:w-20 sm:h-16 rounded-lg border-2 transition-all duration-300 ${
                      currentImage === index
                        ? "border-jmv-gold bg-jmv-gold/20"
                        : "border-white/20 bg-white/5 hover:border-white/40"
                    }`}
                  >
                    <div className="w-full h-full rounded-md bg-white/10 flex items-center justify-center">
                      <Cross className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-jmv-gold" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Saints Section */}
        <ScrollReveal direction="up" delay={200}>
          <div className="bg-gradient-to-r from-jmv-blue to-jmv-red rounded-2xl p-8 relative overflow-hidden max-w-6xl mx-auto mb-12">
            <div className="absolute inset-0 bg-black/30"></div>
            <div className="relative">
              <h3 className="text-2xl font-bold text-white mb-8 text-center">
                Nuestros Santos Guías
              </h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Cross className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">
                    San Vicente de Paúl
                  </h4>
                  <p className="text-white/80 text-sm mb-3">
                    "Padre de los Pobres"
                  </p>
                  <p className="text-white/70 text-sm italic">
                    "Dios es amor, caridad y compasión"
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">
                    Santa Catalina Labouré
                  </h4>
                  <p className="text-white/80 text-sm mb-3">
                    "Vidente de la Medalla Milagrosa"
                  </p>
                  <p className="text-white/70 text-sm italic">
                    "María es nuestra Madre y Mediadora"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Testimonial */}
        <ScrollReveal direction="up" delay={250}>
          <div className="text-center">
            <div className="bg-gradient-to-r from-jmv-gold to-jmv-blue rounded-2xl p-8 relative overflow-hidden max-w-4xl mx-auto">
              <div className="absolute inset-0 bg-black/30"></div>
              <div className="relative">
                <Cross className="w-12 h-12 text-white mx-auto mb-4" />
                <blockquote className="text-xl md:text-2xl font-light text-white mb-4 italic">
                  "En la oración encontramos la fuerza para servir, y en el
                  servicio descubrimos el rostro orante de Dios."
                </blockquote>
                <cite className="text-white/80 text-sm">
                  - Joven JMV en retiro espiritual
                </cite>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
