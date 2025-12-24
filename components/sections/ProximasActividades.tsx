"use client";

import { useState } from "react";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  ArrowRight,
  Heart,
  Star,
  Tent,
  Cross,
  BookOpen,
} from "lucide-react";
import ScrollReveal from "../ui/ScrollReveal";
import Link from "next/link";
import Image from "next/image";

const proximasActividades = [
  {
    id: 1,
    titulo: "Encuentro Nacional JMV 2025",
    descripcion:
      "Gran campamento nacional que reunirá a jóvenes de todo Ecuador para vivir tres días de formación, fraternidad y servicio en un ambiente natural.",
    fecha: "01 Nov - 03 Nov 2025",
    lugar: "¡Chone, Manabí! 🎉",
    participantes: "JMV Ecuador",
    tipo: "campamento",
    estado: "inscripciones_cerradas",
    icono: Tent,
    color: "from-jmv-blue to-jmv-blue-dark",
    imagen: "/images/events/evento_campamento.jpg",
    destacado: true,
  },
  {
    id: 2,
    titulo: "Fiesta de San Vicente de Paúl",
    descripcion:
      "Celebración especial en honor a nuestro padre espiritual con eucaristía solemne, actividades culturales y renovación de compromisos vicencianos.",
    fecha: "27 Septiembre 2025",
    lugar: "Santuario Nacional, Quito",
    participantes: "1200+ personas",
    tipo: "celebracion",
    estado: "inscripciones_cerradas",
    icono: Cross,
    color: "from-jmv-gold to-amber-600",
    imagen: "/images/actividades/san-vicente.jpg",
  },
  {
    id: 3,
    titulo: "Formación Virtual: Liderazgo Vicenciano",
    descripcion:
      "Ciclo de talleres virtuales sobre liderazgo juvenil desde la perspectiva vicenciana, dirigido a coordinadores y futuros líderes.",
    fecha: "Todo Abril 2025",
    lugar: "Plataforma Virtual JMV",
    participantes: "200 coordinadores",
    tipo: "formacion",
    estado: "proximo",
    icono: BookOpen,
    color: "from-purple-600 to-indigo-600",
    imagen: "/images/actividades/formacion-virtual.jpg",
  },
  {
    id: 4,
    titulo: "Jornada Nacional de Servicio",
    descripcion:
      "Actividad simultánea en todas las zonas pastorales del país para servir a comunidades vulnerables con alimentos, medicina y alegría.",
    fecha: "25 Mayo 2025",
    lugar: "Todas las zonas pastorales",
    participantes: "3000+ voluntarios",
    tipo: "servicio",
    estado: "programado",
    icono: Heart,
    color: "from-jmv-red to-red-600",
    imagen: "/images/actividades/jornada-servicio.jpg",
  },
  {
    id: 5,
    titulo: "Retiro Espiritual Zonal",
    descripcion:
      "Retiros espirituales por zonas para profundizar en la espiritualidad vicenciana y fortalecer la vida de oración personal y comunitaria.",
    fecha: "Junio-Agosto 2025",
    lugar: "Centros de retiro por zona",
    participantes: "100-150 por zona",
    tipo: "retiro",
    estado: "programado",
    icono: Star,
    color: "from-blue-600 to-blue-800",
    imagen: "/images/actividades/retiro-espiritual.jpg",
  },
  {
    id: 6,
    titulo: "Congreso Juvenil Vicenciano",
    descripcion:
      "Encuentro académico y pastoral que abordará temas actuales de la juventud desde la perspectiva del carisma vicenciano.",
    fecha: "20-22 Noviembre 2025",
    lugar: "Universidad Católica, Quito",
    participantes: "500 jóvenes",
    tipo: "congreso",
    estado: "programado",
    icono: Users,
    color: "from-emerald-600 to-teal-600",
    imagen: "/images/actividades/congreso-juvenil.jpg",
  },
];

const tiposActividad = {
  campamento: { nombre: "Campamento", color: "bg-jmv-blue" },
  celebracion: { nombre: "Celebración", color: "bg-jmv-gold" },
  formacion: { nombre: "Formación", color: "bg-purple-600" },
  servicio: { nombre: "Servicio Social", color: "bg-jmv-red" },
  retiro: { nombre: "Retiro", color: "bg-blue-600" },
  congreso: { nombre: "Congreso", color: "bg-emerald-600" },
};

const estadosActividad = {
  inscripciones_abiertas: {
    nombre: "¡Inscripciones Abiertas!",
    color: "bg-green-500",
    pulse: true,
  },
  inscripciones_cerradas: {
    nombre: "Inscripciones Cerradas",
    color: "bg-red-500",
    pulse: false,
  },
  programado: { nombre: "Programado", color: "bg-blue-500", pulse: false },
  proximo: { nombre: "Próximamente", color: "bg-orange-500", pulse: false },
};

interface Props {
  featuredImageUrl?: string;
}

export default function ProximasActividades({ featuredImageUrl }: Props) {
  const [actividadSeleccionada, setActividadSeleccionada] = useState(0);
  const [filtroTipo, setFiltroTipo] = useState("todos");

  const actividadesFiltradas =
    filtroTipo === "todos"
      ? proximasActividades
      : proximasActividades.filter(
          (actividad) => actividad.tipo === filtroTipo
        );

  const actividadDestacada = proximasActividades.find((a) => a.destacado);
  if (actividadDestacada && featuredImageUrl) {
    actividadDestacada.imagen = featuredImageUrl;
  }

  return (
    <section className="py-12 sm:py-16 lg:py-20 relative overflow-hidden">
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
      <div className="hidden sm:block absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-jmv-gold/20 rounded-full blur-3xl opacity-30 translate-x-1/2 -translate-y-1/2" />
      <div className="hidden sm:block absolute bottom-0 left-0 w-64 h-64 sm:w-96 sm:h-96 bg-blue-600/20 rounded-full blur-3xl opacity-30 -translate-x-1/2 translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <ScrollReveal direction="up" delay={50}>
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white font-medium mb-6">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              <span className="text-sm sm:text-base">
                Encuentro Nacional 2025
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              <span className="text-jmv-gold">Próximo</span> Gran Evento
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/80 max-w-4xl mx-auto leading-relaxed">
              No te pierdas el evento más esperado del año: nuestro Encuentro
              Nacional JMV 2025
            </p>
          </div>
        </ScrollReveal>

        {/* Actividad Destacada - Hero Visual */}
        {actividadDestacada && (
          <ScrollReveal direction="up" delay={100}>
            <div className="mb-16 relative overflow-hidden rounded-3xl">
              {/* Background Image */}
              <div className="absolute inset-0">
                <div className="w-full h-full bg-gradient-to-br from-jmv-blue/90 via-jmv-blue-dark/80 to-blue-900/90 relative">
                  {/* Placeholder for background pattern */}
                  <div className="absolute inset-0 bg-[url('/images/pattern-campamento.jpg')] bg-cover bg-center opacity-20"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-jmv-blue/80 to-transparent"></div>
                </div>
              </div>

              <div className="relative z-10 p-8 lg:p-16">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  {/* Content */}
                  <div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-6">
                      <div
                        className={`px-3 py-1.5 sm:px-4 sm:py-2 lg:px-6 lg:py-3 ${
                          estadosActividad[
                            actividadDestacada.estado as keyof typeof estadosActividad
                          ].color
                        } rounded-full text-white font-bold text-xs sm:text-sm lg:text-base ${
                          estadosActividad[
                            actividadDestacada.estado as keyof typeof estadosActividad
                          ].pulse
                            ? "animate-pulse"
                            : ""
                        } shadow-lg`}
                      >
                        {
                          estadosActividad[
                            actividadDestacada.estado as keyof typeof estadosActividad
                          ].nombre
                        }
                      </div>
                      <div
                        className={`px-3 py-1 sm:px-4 sm:py-2 ${
                          tiposActividad[
                            actividadDestacada.tipo as keyof typeof tiposActividad
                          ].color
                        } rounded-full text-white text-xs sm:text-sm font-medium`}
                      >
                        {
                          tiposActividad[
                            actividadDestacada.tipo as keyof typeof tiposActividad
                          ].nombre
                        }
                      </div>
                    </div>

                    <h3 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                      {actividadDestacada.titulo}
                    </h3>

                    <p className="text-xl text-white/90 mb-8 leading-relaxed">
                      {actividadDestacada.descripcion}
                    </p>

                    <div className="grid sm:grid-cols-2 gap-6 mb-8">
                      <div className="flex items-center text-white bg-white/10 backdrop-blur-sm p-3 sm:p-4 rounded-xl">
                        <Calendar className="w-6 h-6 mr-3 text-jmv-gold" />
                        <span className="font-semibold">
                          {actividadDestacada.fecha}
                        </span>
                      </div>
                      <div className="flex items-center text-white bg-white/10 backdrop-blur-sm p-3 sm:p-4 rounded-xl">
                        <MapPin className="w-6 h-6 mr-3 text-jmv-gold" />
                        <span className="font-semibold">
                          {actividadDestacada.lugar}
                        </span>
                      </div>
                      <div className="flex items-center text-white bg-white/10 backdrop-blur-sm p-3 sm:p-4 rounded-xl">
                        <Users className="w-6 h-6 mr-3 text-jmv-gold" />
                        <span className="font-semibold">
                          {actividadDestacada.participantes}
                        </span>
                      </div>
                      <div className="flex items-center text-white bg-white/10 backdrop-blur-sm p-3 sm:p-4 rounded-xl">
                        <Clock className="w-6 h-6 mr-3 text-jmv-gold" />
                        <span className="font-semibold">3 días / 2 noches</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      {actividadDestacada.estado ===
                        "inscripciones_abiertas" && (
                        <button className="bg-jmv-gold text-jmv-blue px-10 py-5 rounded-xl font-bold text-lg hover:bg-jmv-gold/90 transition-all duration-200 transform hover:scale-105 shadow-xl">
                          Inscríbete Ahora
                        </button>
                      )}
                      {actividadDestacada.estado ===
                        "inscripciones_cerradas" && (
                        <button className="bg-red-500 text-white px-10 py-5 rounded-xl font-bold text-lg cursor-not-allowed opacity-75">
                          Inscripciones Cerradas
                        </button>
                      )}
                      <button className="bg-white/10 backdrop-blur-sm text-white px-10 py-5 rounded-xl font-semibold border border-white/20 hover:bg-white/20 transition-all duration-200">
                        Más Información
                      </button>
                    </div>
                  </div>

                  {/* Visual Element */}
                  <div className="relative">
                    <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
                      <div
                        className={`w-full h-full bg-gradient-to-br ${actividadDestacada.color} flex items-center justify-center relative overflow-hidden`}
                      >
                        {/* Background Image */}
                        <Image
                          src={actividadDestacada.imagen}
                          alt={actividadDestacada.titulo}
                          fill
                          className="object-cover opacity-60"
                        />
                        {/* Gradient Overlay */}
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${actividadDestacada.color} opacity-30`}
                        ></div>

                        {/* Main Visual */}
                        <div className="text-center text-white relative z-10">
                          <div className="w-32 h-32 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-6 border border-white/30">
                            <actividadDestacada.icono className="w-16 h-16 text-white" />
                          </div>
                        </div>
                        {/* Decorative elements */}
                        <div className="absolute top-8 left-8 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                        <div className="absolute bottom-8 right-8 w-32 h-32 bg-jmv-gold/20 rounded-full blur-2xl"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* CTA Section */}
        <ScrollReveal direction="up" delay={400}>
          <div className="text-center bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-4">
              ¿Quieres conocer todas las actividades que hacemos en JMV?
            </h3>
            <p className="text-white/70 mb-6 max-w-2xl mx-auto">
              Únete a JMV Ecuador y vive momentos inolvidables de formación,
              fraternidad y servicio junto a jóvenes de todo el país.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/actividades">
                <button className="bg-white/10 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all duration-200 transform hover:scale-105 border border-white/20">
                  Ver Todas las Actividades
                </button>
              </Link>
              <Link href="/unete">
                <button className="bg-jmv-gold text-jmv-blue px-8 py-4 rounded-xl font-semibold hover:bg-jmv-gold/90 transition-all duration-200 transform hover:scale-105 shadow-lg">
                  Únete a JMV
                </button>
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
