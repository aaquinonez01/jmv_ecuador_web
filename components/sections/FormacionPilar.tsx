"use client";

import { useState } from "react";
import {
  BookOpen,
  Lightbulb,
  Target,
  Award,
  ChevronLeft,
  ChevronRight,
  Play,
} from "lucide-react";
import ScrollReveal from "../ui/ScrollReveal";

const formacionActividades = [
  {
    titulo: "Talleres de Liderazgo",
    descripcion:
      "Desarrollo de habilidades directivas y capacidades de liderazgo juvenil.",
    imagen: "/images/pilares/formacion/liderazgo.jpg",
    ubicacion: "Centros de Formación JMV",
    participantes: 180,
  },
  {
    titulo: "Formación Académica",
    descripcion: "Becas de estudio, apoyo académico y orientación vocacional.",
    imagen: "/images/pilares/formacion/academica.jpg",
    ubicacion: "Universidades Aliadas",
    participantes: 95,
  },
  {
    titulo: "Capacitación Laboral",
    descripcion: "Cursos técnicos, oficios y habilidades para el trabajo.",
    imagen: "/images/pilares/formacion/laboral.jpg",
    ubicacion: "Centros Técnicos",
    participantes: 150,
  },
  {
    titulo: "Desarrollo Personal",
    descripcion: "Talleres de autoconocimiento, inteligencia emocional y vida.",
    imagen: "/images/pilares/formacion/personal.jpg",
    ubicacion: "Espacios Formativos",
    participantes: 220,
  },
  {
    titulo: "Emprendimiento Social",
    descripcion: "Proyectos de negocio con impacto social y sostenibilidad.",
    imagen: "/images/pilares/formacion/emprendimiento.jpg",
    ubicacion: "Incubadoras Sociales",
    participantes: 80,
  },
  {
    titulo: "Formación Integral",
    descripcion: "Seminarios sobre ética, valores y proyecto de vida.",
    imagen: "/images/pilares/formacion/integral.jpg",
    ubicacion: "Aulas de Formación JMV",
    participantes: 200,
  },
];

export default function FormacionPilar() {
  const [currentImage, setCurrentImage] = useState(0);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % formacionActividades.length);
  };

  const prevImage = () => {
    setCurrentImage(
      (prev) =>
        (prev - 1 + formacionActividades.length) % formacionActividades.length
    );
  };

  return (
    <section
      id="formacion"
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
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Cuarto Pilar
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              <span className="text-jmv-gold">Formación</span>
            </h2>
            <p className="text-xl text-white/80 max-w-4xl mx-auto leading-relaxed">
              Desarrollo de capacidades humanas, liderazgo y compromiso social.
              Formamos jóvenes preparados para transformar la sociedad con
              competencia y valores.
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
                  <Lightbulb className="w-6 h-6 text-jmv-gold mr-3" />
                  <h3 className="text-xl font-bold text-white">
                    ¿Qué es la Formación?
                  </h3>
                </div>
                <p className="text-white/80 leading-relaxed">
                  Es el proceso continuo de crecimiento en todas las dimensiones
                  de la persona. Desarrollamos competencias técnicas,
                  habilidades blandas, liderazgo ético y compromiso social para
                  formar jóvenes íntegros y transformadores.
                </p>
              </div>

              {/* Formation Areas */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <h4 className="text-lg font-bold text-white mb-4">
                  Áreas de Formación
                </h4>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Target className="w-5 h-5 text-jmv-gold mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-white font-medium text-sm">
                        Liderazgo Transformacional
                      </p>
                      <p className="text-white/70 text-xs">
                        Capacidades directivas con enfoque social
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Award className="w-5 h-5 text-jmv-gold mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-white font-medium text-sm">
                        Competencias Técnicas
                      </p>
                      <p className="text-white/70 text-xs">
                        Habilidades laborales y profesionales
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Lightbulb className="w-5 h-5 text-jmv-gold mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-white font-medium text-sm">
                        Innovación Social
                      </p>
                      <p className="text-white/70 text-xs">
                        Emprendimiento con impacto comunitario
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <BookOpen className="w-5 h-5 text-jmv-gold mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-white font-medium text-sm">
                        Desarrollo Humano
                      </p>
                      <p className="text-white/70 text-xs">
                        Crecimiento personal y emocional
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Statistics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-jmv-gold/10 rounded-xl p-4 border border-jmv-gold/20 text-center">
                  <div className="text-2xl font-bold text-jmv-gold mb-1">
                    925
                  </div>
                  <div className="text-white/70 text-sm">Jóvenes Formados</div>
                </div>
                <div className="bg-jmv-gold/10 rounded-xl p-4 border border-jmv-gold/20 text-center">
                  <div className="text-2xl font-bold text-jmv-gold mb-1">6</div>
                  <div className="text-white/70 text-sm">Programas Activos</div>
                </div>
              </div>

              {/* Success Indicators */}
              <div className="bg-jmv-green/10 rounded-xl p-4 border border-green-500/20">
                <h4 className="text-white font-bold mb-3">
                  🏆 Logros Destacados
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="text-white/80">
                    📚 85% completa estudios superiores
                  </div>
                  <div className="text-white/80">
                    💼 78% consigue empleo digno
                  </div>
                  <div className="text-white/80">
                    🌟 92% mantiene compromiso social
                  </div>
                  <div className="text-white/80">
                    🚀 65% emprende proyectos propios
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Gallery Section */}
          <ScrollReveal direction="right" delay={150}>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 lg:p-6 border border-white/20">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 text-center">
                Galería Formativa
              </h3>

              {/* Main Image */}
              <div className="relative mb-4 sm:mb-6">
                <div className="aspect-video bg-white/10 rounded-xl border border-white/20 flex items-center justify-center overflow-hidden group">
                  <div className="text-center p-3 sm:p-4">
                    <Play className="w-12 h-12 sm:w-16 sm:h-16 text-jmv-gold mb-3 sm:mb-4 group-hover:scale-110 transition-transform" />
                    <h4 className="text-sm sm:text-base lg:text-lg font-bold text-white mb-2">
                      {formacionActividades[currentImage].titulo}
                    </h4>
                    <p className="text-white/70 text-xs sm:text-sm px-2 sm:px-4 mb-3 line-clamp-2">
                      {formacionActividades[currentImage].descripcion}
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
                      <div className="flex items-center text-jmv-gold text-xs sm:text-sm">
                        <Target className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        <span className="truncate max-w-[150px] sm:max-w-none">
                          {formacionActividades[currentImage].ubicacion}
                        </span>
                      </div>
                      <div className="flex items-center text-jmv-gold text-xs sm:text-sm">
                        <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        {formacionActividades[currentImage].participantes}{" "}
                        estudiantes
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
                {formacionActividades.map((actividad, index) => (
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
                      <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-jmv-gold" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Testimonial & Final CTA */}
        <ScrollReveal direction="up" delay={200}>
          <div className="text-center">
            <div className="bg-gradient-to-r from-jmv-gold to-jmv-red rounded-2xl p-8 relative overflow-hidden max-w-4xl mx-auto mb-12">
              <div className="absolute inset-0 bg-black/30"></div>
              <div className="relative">
                <BookOpen className="w-12 h-12 text-white mx-auto mb-4" />
                <blockquote className="text-xl md:text-2xl font-light text-white mb-4 italic">
                  "La formación que recibí en JMV no solo cambió mi futuro
                  profesional, sino que transformó mi manera de ver y servir al
                  mundo."
                </blockquote>
                <cite className="text-white/80 text-sm">
                  - Ex-joven JMV, ahora líder empresarial
                </cite>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
