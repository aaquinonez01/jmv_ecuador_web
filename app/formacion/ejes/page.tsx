"use client";

import { useState } from "react";
import {
  BookOpen,
  Cross,
  Star,
  Heart,
  Users,
  ArrowLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";

const ejesFormativos = [
  {
    id: "humano",
    titulo: "Eje Humano",
    icono: BookOpen,
    color: "from-blue-600 to-blue-800",
    descripcion:
      "Desarrollo integral de la persona, potenciando valores, colaboración y solidaridad.",
    detalles: [
      "Formación en liderazgo y comunicación efectiva",
      "Desarrollo de habilidades interpersonales",
      "Potenciación de talentos individuales",
      "Construcción de valores sólidos",
      "Fomento del trabajo en equipo",
      "Crecimiento personal y autoconocimiento",
    ],
    objetivos: [
      "Formar líderes íntegros y comprometidos",
      "Desarrollar capacidades de comunicación",
      "Fortalecer la autoestima y confianza",
      "Promover la colaboración y solidaridad",
    ],
  },
  {
    id: "cristocentrico",
    titulo: "Eje Cristocéntrico",
    icono: Cross,
    color: "from-red-600 to-red-800",
    descripcion:
      "Encuentro personal con Cristo evangelizador de los pobres, viviendo las virtudes cristianas.",
    detalles: [
      "Encuentro personal con Jesucristo",
      "Vivencia de las virtudes de humildad y obediencia",
      "Práctica de la caridad y pureza",
      "Evangelización comprometida",
      "Oración y vida sacramental",
      "Testimonio cristiano en la sociedad",
    ],
    objetivos: [
      "Profundizar la relación personal con Cristo",
      "Vivir las virtudes cristianas auténticamente",
      "Ser evangelizadores de los pobres",
      "Integrar fe y vida cotidiana",
    ],
  },
  {
    id: "mariano",
    titulo: "Eje Mariano",
    icono: Star,
    color: "from-yellow-500 to-yellow-700",
    descripcion:
      "María como modelo de fe y seguimiento, espiritualidad basada en el Magnificat.",
    detalles: [
      "María como modelo de todos los creyentes",
      "Espiritualidad del Magnificat",
      'Consagración mariana "a Jesús con María"',
      "Virtudes marianas en la vida diaria",
      "Devoción a la Medalla Milagrosa",
      "Imitación de la fe y humildad de María",
    ],
    objetivos: [
      "Imitar las virtudes de María Santísima",
      "Vivir la espiritualidad del Magnificat",
      "Consagrarse totalmente a Jesús por María",
      "Ser testimonio de fe como María",
    ],
  },
  {
    id: "vicentino",
    titulo: "Eje Vicentino",
    icono: Heart,
    color: "from-green-600 to-green-800",
    descripcion:
      "Inspiración en el carisma de San Vicente de Paúl, servicio preferencial a los pobres.",
    detalles: [
      "Carisma de San Vicente de Paúl",
      "Servicio preferencial a los más pobres",
      "Evangelización y promoción humana",
      "Justicia social y transformación",
      "Creatividad en el servicio",
      "Amor efectivo y afectivo hacia los necesitados",
    ],
    objetivos: [
      "Vivir el carisma vicenciano auténticamente",
      "Servir preferencialmente a los pobres",
      "Promover la justicia social",
      "Ser agentes de transformación social",
    ],
  },
  {
    id: "eclesial",
    titulo: "Eje Eclesial",
    icono: Users,
    color: "from-purple-600 to-purple-800",
    descripcion:
      "Compromiso activo en la Iglesia, trabajando en comunión con pastores y laicos.",
    detalles: [
      "Participación activa en la vida eclesial",
      "Comunión con pastores y laicos",
      "Compromiso en diócesis y parroquias",
      "Formación en doctrina social de la Iglesia",
      "Apostolado laical comprometido",
      "Construcción del Reino de Dios",
    ],
    objetivos: [
      "Fortalecer la pertenencia eclesial",
      "Trabajar en comunión con la jerarquía",
      "Participar activamente en la misión de la Iglesia",
      "Construir el Reino de Dios en la sociedad",
    ],
  },
];

export default function EjesFormativosPage() {
  const [ejeSeleccionado, setEjeSeleccionado] = useState(0);

  return (
    <main>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24">
        {/* Background with Gradient Overlay */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-jmv z-10" />
          <div className="absolute inset-0 bg-[url('/images/pilares/formacion-hero.jpg')] bg-cover bg-center bg-no-repeat opacity-25" />
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-20">
          <div className="absolute top-32 left-16 w-40 h-40 bg-white/10 rounded-full blur-xl animate-float" />
          <div
            className="absolute bottom-40 right-20 w-56 h-56 bg-jmv-gold/20 rounded-full blur-2xl animate-float"
            style={{ animationDelay: "2s" }}
          />
          <div
            className="absolute top-2/3 left-1/3 w-32 h-32 bg-jmv-red/20 rounded-full blur-lg animate-float"
            style={{ animationDelay: "4s" }}
          />
        </div>

        {/* Main Content */}
        <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <ScrollReveal direction="fade" delay={50}>
            <div className="mb-8">
              <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium mb-8">
                <BookOpen className="w-4 h-4 mr-2 text-jmv-gold" />
                Formación Integral
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={100}>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-white via-jmv-gold to-white bg-clip-text text-transparent">
                Cinco Ejes
              </span>
              <br />
              <span className="text-white text-2xl md:text-3xl lg:text-4xl font-light">
                Formativos
              </span>
            </h1>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={150}>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-light mb-8 text-white/90 font-dancing max-w-5xl mx-auto">
              "Los cinco pilares que fundamentan la transformación integral de
              cada joven vicenciano en Ecuador"
            </h2>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={200}>
            <p className="text-lg md:text-xl text-white/80 mb-12 max-w-4xl mx-auto leading-relaxed">
              Descubre en profundidad cada una de las dimensiones que construyen
              la formación completa de nuestros jóvenes, desde lo humano hasta
              lo espiritual, siguiendo el carisma vicenciano.
            </p>
          </ScrollReveal>

          {/* Ejes Preview Stats */}
          <ScrollReveal direction="up" delay={250}>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-6 sm:gap-4 max-w-4xl mx-auto mb-12">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-jmv-gold mb-2">
                  <BookOpen className="w-8 h-8 mx-auto" />
                </div>
                <div className="text-white/70 text-xs sm:text-sm">
                  Eje Humano
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-jmv-gold mb-2">
                  <Cross className="w-8 h-8 mx-auto" />
                </div>
                <div className="text-white/70 text-xs sm:text-sm">
                  Eje Cristocéntrico
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-jmv-gold mb-2">
                  <Star className="w-8 h-8 mx-auto" />
                </div>
                <div className="text-white/70 text-xs sm:text-sm">
                  Eje Mariano
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-jmv-gold mb-2">
                  <Heart className="w-8 h-8 mx-auto" />
                </div>
                <div className="text-white/70 text-xs sm:text-sm">
                  Eje Vicentino
                </div>
              </div>
              <div className="text-center sm:col-span-1 col-span-2">
                <div className="text-2xl sm:text-3xl font-bold text-jmv-gold mb-2">
                  <Users className="w-8 h-8 mx-auto" />
                </div>
                <div className="text-white/70 text-xs sm:text-sm">
                  Eje Eclesial
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={300}>
            <div className="text-center">
              <p className="text-white/70 text-sm mb-4">
                Explora cada dimensión de nuestra formación
              </p>
              <div className="inline-flex items-center text-jmv-gold hover:text-white transition-colors cursor-pointer">
                <span className="mr-2">Comenzar el recorrido formativo</span>
                <ChevronDown className="w-5 h-5 animate-bounce" />
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
          <div className="animate-bounce">
            <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Pills */}
      <section className="relative pt-8 pb-8 bg-gradient-to-br from-jmv-blue-dark via-blue-800 to-blue-700">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up" delay={50}>
            <div className="flex items-center justify-center mb-8">
              <Link
                href="/formacion"
                className="inline-flex items-center text-white/80 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Volver a Formación
              </Link>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={100}>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8">
              {ejesFormativos.map((eje, index) => (
                <button
                  key={eje.id}
                  onClick={() => setEjeSeleccionado(index)}
                  className={`flex items-center px-4 py-2 sm:px-6 sm:py-3 rounded-full border border-white/20 backdrop-blur-md transition-all duration-300 ${
                    ejeSeleccionado === index
                      ? "bg-jmv-gold text-white border-jmv-gold shadow-lg"
                      : "bg-white/10 text-white/80 hover:bg-white/20"
                  }`}
                >
                  {(() => {
                    const IconoComponent = eje.icono;
                    return <IconoComponent className="w-4 h-4 mr-2" />;
                  })()}
                  <span className="text-sm font-medium">{eje.titulo}</span>
                </button>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Contenido del Eje Seleccionado */}
      <section className="relative pb-16 bg-gradient-to-br from-jmv-blue-dark via-blue-800 to-blue-700">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up" delay={150} key={ejeSeleccionado}>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 lg:p-12 border border-white/20 text-white mb-12">
              <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6 sm:mb-8">
                <div className="w-16 h-16 bg-jmv-gold/20 rounded-full flex items-center justify-center mb-4 sm:mb-0 sm:mr-6">
                  {(() => {
                    const IconoComponent =
                      ejesFormativos[ejeSeleccionado].icono;
                    return <IconoComponent className="w-8 h-8 text-jmv-gold" />;
                  })()}
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
                    {ejesFormativos[ejeSeleccionado].titulo}
                  </h2>
                  <p className="text-white/80 text-base sm:text-lg leading-relaxed">
                    {ejesFormativos[ejeSeleccionado].descripcion}
                  </p>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
                {/* Detalles */}
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-jmv-gold">
                    Aspectos Fundamentales
                  </h3>
                  <div className="space-y-3">
                    {ejesFormativos[ejeSeleccionado].detalles.map(
                      (detalle, index) => (
                        <div key={index} className="flex items-start">
                          <div className="w-2 h-2 bg-jmv-gold rounded-full mr-3 mt-2 flex-shrink-0"></div>
                          <span className="text-white/80 text-sm leading-relaxed">
                            {detalle}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Objetivos */}
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-jmv-gold">
                    Objetivos Principales
                  </h3>
                  <div className="space-y-3">
                    {ejesFormativos[ejeSeleccionado].objetivos.map(
                      (objetivo, index) => (
                        <div
                          key={index}
                          className="bg-white/5 rounded-xl p-4 border border-white/10"
                        >
                          <div className="flex items-start">
                            <div className="w-6 h-6 bg-jmv-gold/20 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                              <span className="text-xs font-bold text-jmv-gold">
                                {index + 1}
                              </span>
                            </div>
                            <span className="text-white/80 text-sm leading-relaxed">
                              {objetivo}
                            </span>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Navegación entre ejes */}
          <ScrollReveal direction="up" delay={200}>
            <div className="flex justify-between items-center">
              <button
                onClick={() =>
                  setEjeSeleccionado(
                    ejeSeleccionado > 0
                      ? ejeSeleccionado - 1
                      : ejesFormativos.length - 1
                  )
                }
                className="flex items-center px-4 py-2 sm:px-6 sm:py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white/20 transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span className="hidden sm:inline">Anterior</span>
              </button>

              <div className="text-white/60 text-xs sm:text-sm">
                {ejeSeleccionado + 1} de {ejesFormativos.length}
              </div>

              <button
                onClick={() =>
                  setEjeSeleccionado(
                    ejeSeleccionado < ejesFormativos.length - 1
                      ? ejeSeleccionado + 1
                      : 0
                  )
                }
                className="flex items-center px-4 py-2 sm:px-6 sm:py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white/20 transition-all duration-300"
              >
                <span className="hidden sm:inline">Siguiente</span>
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
