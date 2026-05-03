"use client";

import { useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Crown,
  Globe,
  Heart,
  Quote,
  Shield,
  Sparkles,
  Star,
} from "lucide-react";
import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";

interface Santo {
  id: string;
  nombre: string;
  titulo: string;
  fechas: string;
  icono: typeof Crown;
  color: string;
  descripcion: string;
  cita: string;
  legado: string[];
  virtudes: string[];
}

const santosVicencianos: Santo[] = [
  {
    id: "san-vicente",
    nombre: "San Vicente de Paúl",
    titulo: "Padre y Apóstol de la Caridad",
    fechas: "1581 — 1660",
    icono: Crown,
    color: "from-red-600 to-red-800",
    descripcion:
      "Sacerdote francés, fundador de la Congregación de la Misión y, junto con Santa Luisa de Marillac, de las Hijas de la Caridad. Dedicó su vida al servicio de los pobres y a la formación del clero. Su carisma transformó la Iglesia y dio origen a toda la Familia Vicenciana.",
    cita: '"La caridad es inventiva hasta el infinito."',
    legado: [
      "Fundador de la Congregación de la Misión (Padres Paúles)",
      "Cofundador de las Hijas de la Caridad junto a Santa Luisa",
      "Promotor de las Damas de la Caridad y las Conferencias",
      "Reformador del clero a través de retiros y seminarios",
      "Defensor de los expósitos, galeotes y víctimas de la guerra",
      "Patrono universal de las obras caritativas",
    ],
    virtudes: [
      "Sencillez en el trato y la palabra",
      "Humildad como fundamento de toda virtud",
      "Mansedumbre frente a la adversidad",
      "Mortificación en el propio servicio",
      "Celo apostólico por las almas y los pobres",
    ],
  },
  {
    id: "santa-luisa",
    nombre: "Santa Luisa de Marillac",
    titulo: "Cofundadora de las Hijas de la Caridad",
    fechas: "1591 — 1660",
    icono: Heart,
    color: "from-blue-600 to-blue-800",
    descripcion:
      "Mujer de profunda vida interior y formación intelectual. Bajo la dirección de San Vicente de Paúl, organizó y formó a las primeras Hijas de la Caridad como una nueva forma de vida consagrada al servicio de los más pobres en hospitales, escuelas y barrios.",
    cita:
      '"Servid a los pobres con alegría, ellos son nuestros amos y señores."',
    legado: [
      "Primera Superiora de las Hijas de la Caridad",
      "Organizadora de la atención a enfermos en hospitales",
      "Pionera en la educación de niñas pobres en Francia",
      "Modelo de mujer laica, esposa, madre y consagrada",
      "Patrona de los trabajadores sociales (proclamada en 1960)",
    ],
    virtudes: [
      "Caridad concreta y práctica con los más pobres",
      "Discernimiento y prudencia en el gobierno",
      "Vida de oración profundamente trinitaria",
      "Fortaleza ante la enfermedad y el sufrimiento",
      "Maternidad espiritual hacia sus hermanas",
    ],
  },
  {
    id: "santa-catalina",
    nombre: "Santa Catalina Labouré",
    titulo: "Vidente de la Medalla Milagrosa",
    fechas: "1806 — 1876",
    icono: Star,
    color: "from-yellow-500 to-yellow-700",
    descripcion:
      "Hija de la Caridad francesa a quien la Virgen María se apareció en la Capilla de la rue du Bac en París en 1830. De estas apariciones nació la Medalla Milagrosa, signo de la maternal protección de María. Vivió escondida 46 años trabajando con los ancianos, fiel y silenciosa.",
    cita: '"¡Oh María sin pecado concebida, rogad por nosotros que recurrimos a vos!"',
    legado: [
      "Vidente de las apariciones de la Virgen Inmaculada (1830)",
      'Origen de la Medalla Milagrosa, "regalo de María al mundo"',
      "Inspiradora de la JMV (Juventudes Marianas Vicencianas)",
      "Servidora silenciosa de ancianos durante 46 años",
      "Cuerpo incorrupto venerado en la rue du Bac, París",
    ],
    virtudes: [
      "Humildad escondida, sin buscar protagonismo",
      "Obediencia heroica a sus superiores",
      "Devoción mariana profunda y filial",
      "Sencillez en lo cotidiano del servicio",
      "Fidelidad silenciosa a la misión recibida",
    ],
  },
  {
    id: "sor-rosalia",
    nombre: "Beata Sor Rosalía Rendu",
    titulo: "Madre de los Pobres de París",
    fechas: "1786 — 1856",
    icono: Shield,
    color: "from-purple-600 to-purple-800",
    descripcion:
      "Hija de la Caridad que dedicó más de 50 años al servicio de los pobres del barrio Mouffetard de París. Inspiró a Federico Ozanam y a los primeros miembros de las Conferencias de San Vicente de Paúl. Su mirada compasiva atravesaba clases sociales y guerras civiles.",
    cita:
      '"Nunca ha sido tan necesario ser bueno como ahora, para hacer amar a Dios."',
    legado: [
      "Atendió a los pobres del barrio Mouffetard 54 años",
      "Mentora de Federico Ozanam y la Sociedad de S. Vicente de Paúl",
      "Mediadora de paz durante las revoluciones de 1830 y 1848",
      "Fundadora de dispensarios, escuelas y casas de ancianos",
      "Beatificada por San Juan Pablo II el 9 de noviembre de 2003",
    ],
    virtudes: [
      "Compasión universal sin distinción de credo o partido",
      "Coraje en medio de barricadas y conflictos sociales",
      "Maternidad espiritual con jóvenes apóstoles",
      "Discreción y eficacia en la organización del servicio",
      "Amor preferencial por los más abandonados",
    ],
  },
  {
    id: "san-justino",
    nombre: "San Justino de Jacobis",
    titulo: "Apóstol de Etiopía",
    fechas: "1800 — 1860",
    icono: Globe,
    color: "from-green-600 to-green-800",
    descripcion:
      "Sacerdote vicentino italiano, misionero en Etiopía, donde impulsó la unidad con la Iglesia Católica respetando los ritos y la cultura locales. Fue ordenado obispo y vivió la persecución y el destierro con paz evangélica. Modelo de inculturación misionera.",
    cita:
      '"Yo prefiero ser pequeño en Cristo, antes que grande sin Él."',
    legado: [
      "Pionero del diálogo con la Iglesia copta de Etiopía",
      "Fundador del Colegio de la Inmaculada en Adwa",
      "Modelo de inculturación misionera y respeto litúrgico",
      "Padeció persecución, cárcel y exilio por la fe",
      "Canonizado por Pablo VI en 1975",
    ],
    virtudes: [
      "Celo apostólico universal y respetuoso",
      "Paciencia heroica ante la persecución",
      "Sencillez y pobreza evangélica",
      "Espíritu ecuménico antes de tiempo",
      "Confianza filial en la Providencia",
    ],
  },
  {
    id: "federico-ozanam",
    nombre: "Beato Federico Ozanam",
    titulo: "Fundador de las Conferencias de S. Vicente de Paúl",
    fechas: "1813 — 1853",
    icono: BookOpen,
    color: "from-amber-600 to-amber-800",
    descripcion:
      "Laico francés, profesor de la Sorbona, esposo y padre de familia. A los 20 años fundó con un grupo de estudiantes la Sociedad de San Vicente de Paúl, llevando el pan y la fe a las familias pobres de París. Modelo de laico apóstol y de inteligencia puesta al servicio de la caridad.",
    cita:
      '"El que ayuda a los pobres da más al amor que al dolor."',
    legado: [
      "Cofundador de la Sociedad de San Vicente de Paúl (1833)",
      "Pionero del catolicismo social en el siglo XIX",
      "Profesor universitario, periodista e investigador literario",
      "Modelo de matrimonio cristiano y de paternidad responsable",
      "Beatificado por San Juan Pablo II en 1997",
    ],
    virtudes: [
      "Caridad encarnada en la visita a los pobres",
      "Inteligencia al servicio de la fe y la justicia",
      "Coherencia entre vida pública, familiar y espiritual",
      "Espíritu de comunidad y trabajo en equipo",
      "Esperanza activa frente a las heridas de la sociedad",
    ],
  },
];

export default function SantosVicencianosPage() {
  const [santoSeleccionado, setSantoSeleccionado] = useState(0);
  const santo = santosVicencianos[santoSeleccionado];

  return (
    <main>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-jmv z-10" />
          <div className="absolute inset-0 bg-[url('/images/pilares/formacion-hero.jpg')] bg-cover bg-center bg-no-repeat opacity-25" />
        </div>

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

        <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <ScrollReveal direction="fade" delay={50}>
            <div className="mb-8">
              <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium mb-8">
                <Sparkles className="w-4 h-4 mr-2 text-jmv-gold" />
                Familia Vicenciana
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={100}>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-white via-jmv-gold to-white bg-clip-text text-transparent">
                Santos Vicencianos
              </span>
              <br />
              <span className="text-white text-2xl md:text-3xl lg:text-4xl font-light">
                Modelos de Caridad y Servicio
              </span>
            </h1>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={150}>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-light mb-8 text-white/90 font-dancing max-w-5xl mx-auto">
              &ldquo;Los santos no son superhombres, sino hombres y mujeres que
              dejaron actuar a Dios en sus vidas&rdquo;
            </h2>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={200}>
            <p className="text-lg md:text-xl text-white/80 mb-12 max-w-4xl mx-auto leading-relaxed">
              Conoce a quienes inspiran nuestro caminar como JMV: santos, beatos
              y testigos del carisma vicenciano que dieron su vida por Cristo en
              los pobres y por la Iglesia.
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={250}>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 sm:gap-3 max-w-5xl mx-auto mb-12">
              {santosVicencianos.map((s) => {
                const Icono = s.icono;
                return (
                  <div key={s.id} className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-jmv-gold mb-2">
                      <Icono className="w-7 h-7 sm:w-8 sm:h-8 mx-auto" />
                    </div>
                    <div className="text-white/70 text-[10px] sm:text-xs leading-tight">
                      {s.nombre}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={300}>
            <div className="text-center">
              <p className="text-white/70 text-sm mb-4">
                Descubre la vida y el legado de cada uno
              </p>
              <div className="inline-flex items-center text-jmv-gold hover:text-white transition-colors cursor-pointer">
                <span className="mr-2">Comenzar el recorrido</span>
                <ChevronDown className="w-5 h-5 animate-bounce" />
              </div>
            </div>
          </ScrollReveal>
        </div>

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
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8">
              {santosVicencianos.map((s, index) => {
                const Icono = s.icono;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSantoSeleccionado(index)}
                    className={`flex items-center px-4 py-2 sm:px-5 sm:py-3 rounded-full border border-white/20 backdrop-blur-md transition-all duration-300 ${
                      santoSeleccionado === index
                        ? "bg-jmv-gold text-white border-jmv-gold shadow-lg"
                        : "bg-white/10 text-white/80 hover:bg-white/20"
                    }`}
                  >
                    <Icono className="w-4 h-4 mr-2" />
                    <span className="text-xs sm:text-sm font-medium">
                      {s.nombre}
                    </span>
                  </button>
                );
              })}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Contenido del Santo Seleccionado */}
      <section className="relative pb-16 bg-gradient-to-br from-jmv-blue-dark via-blue-800 to-blue-700">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up" delay={150} key={santoSeleccionado}>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 lg:p-12 border border-white/20 text-white mb-12">
              <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6 sm:mb-8">
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${santo.color} rounded-full flex items-center justify-center mb-4 sm:mb-0 sm:mr-6 shadow-lg`}
                >
                  {(() => {
                    const Icono = santo.icono;
                    return <Icono className="w-8 h-8 text-white" />;
                  })()}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1">
                    {santo.nombre}
                  </h2>
                  <p className="text-jmv-gold font-semibold text-base sm:text-lg mb-2">
                    {santo.titulo}
                  </p>
                  <p className="text-white/60 text-sm mb-3">
                    {santo.fechas}
                  </p>
                  <p className="text-white/80 text-base sm:text-lg leading-relaxed">
                    {santo.descripcion}
                  </p>
                </div>
              </div>

              {/* Cita */}
              <div className="bg-white/5 rounded-2xl p-5 sm:p-6 border border-jmv-gold/30 mb-8">
                <div className="flex items-start">
                  <Quote className="w-6 h-6 text-jmv-gold mr-3 flex-shrink-0 mt-1" />
                  <blockquote className="text-white/90 text-base sm:text-lg italic font-dancing leading-relaxed">
                    {santo.cita}
                  </blockquote>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
                {/* Legado */}
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-jmv-gold">
                    Legado e Impacto
                  </h3>
                  <div className="space-y-3">
                    {santo.legado.map((item, index) => (
                      <div key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-jmv-gold rounded-full mr-3 mt-2 flex-shrink-0"></div>
                        <span className="text-white/80 text-sm leading-relaxed">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Virtudes */}
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-jmv-gold">
                    Virtudes que nos inspiran
                  </h3>
                  <div className="space-y-3">
                    {santo.virtudes.map((virtud, index) => (
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
                            {virtud}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Navegación entre santos */}
          <ScrollReveal direction="up" delay={200}>
            <div className="flex justify-between items-center">
              <button
                onClick={() =>
                  setSantoSeleccionado(
                    santoSeleccionado > 0
                      ? santoSeleccionado - 1
                      : santosVicencianos.length - 1
                  )
                }
                className="flex items-center px-4 py-2 sm:px-6 sm:py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white/20 transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span className="hidden sm:inline">Anterior</span>
              </button>

              <div className="text-white/60 text-xs sm:text-sm">
                {santoSeleccionado + 1} de {santosVicencianos.length}
              </div>

              <button
                onClick={() =>
                  setSantoSeleccionado(
                    santoSeleccionado < santosVicencianos.length - 1
                      ? santoSeleccionado + 1
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
