"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  Heart,
  Users,
  MapPin,
  Phone,
  Mail,
  ChevronDown,
  CheckCircle,
  Star,
  Calendar,
} from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { motion } from "framer-motion";

// Importación dinámica del mapa para evitar problemas de SSR
const MapaInteractivo = dynamic(
  () => import("@/components/ui/MapaInteractivo"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-96 bg-jmv-blue/20 rounded-2xl flex items-center justify-center">
        <div className="text-white/80">Cargando mapa interactivo...</div>
      </div>
    ),
  }
);

const pasos = [
  {
    numero: "01",
    titulo: "Explora el Mapa",
    descripcion: "Encuentra la comunidad JMV más cercana a tu ubicación",
    accion: "Haz clic en los marcadores del mapa interactivo",
    icon: MapPin,
  },
  {
    numero: "02",
    titulo: "Contacta",
    descripcion: "Comunícate directamente con el coordinador local",
    accion: "Utiliza los datos de contacto proporcionados",
    icon: Phone,
  },
  {
    numero: "03",
    titulo: "Participa",
    descripcion: "Asiste a una actividad para conocer la comunidad",
    accion: "Únete a encuentros, misiones o actividades sociales",
    icon: Users,
  },
  {
    numero: "04",
    titulo: "Forma Parte",
    descripcion: "Inicia tu proceso de formación vicenciana",
    accion: "Comienza el itinerario formativo JMV",
    icon: Heart,
  },
];

const beneficios = [
  "Formación integral en liderazgo juvenil cristiano",
  "Red de hermanos vicencianos a nivel nacional",
  "Experiencias de servicio que transforman vidas",
  "Crecimiento espiritual y desarrollo personal",
  "Oportunidades de intercambio internacional",
  "Desarrollo de habilidades profesionales",
  "Acompañamiento personalizado en tu proceso",
  "Acceso a actividades exclusivas y retiros",
];

const testimonios = [
  {
    nombre: "María José Vásquez",
    edad: 24,
    ciudad: "Quito",
    cargo: "Ex-Coordinadora Nacional",
    testimonio:
      "JMV cambió completamente mi perspectiva de vida. Aquí aprendí que el verdadero liderazgo se construye desde el servicio a los más necesitados.",
    años: "8 años en JMV",
  },
  {
    nombre: "Carlos Andrade",
    edad: 26,
    ciudad: "Guayaquil",
    cargo: "Coordinador Zonal Costa",
    testimonio:
      "La hermandad vicenciana trasciende fronteras. Los valores que aprendí aquí guían cada decisión de mi vida profesional y personal.",
    años: "10 años en JMV",
  },
  {
    nombre: "Ana Lucía Torres",
    edad: 22,
    ciudad: "Cuenca",
    cargo: "Coordinadora de Misiones",
    testimonio:
      "Cada misión me enseña algo nuevo sobre la generosidad y la solidaridad. JMV me ayudó a descubrir mi vocación de servicio.",
    años: "5 años en JMV",
  },
];

export default function UneteClient() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % pasos.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24">
        {/* Background with Gradient Overlay */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-jmv z-10" />
          <div className="absolute inset-0 bg-[url('/images/unete/jmv-comunidad.jpg')] bg-cover bg-center bg-no-repeat opacity-25" />
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
                <Heart className="w-4 h-4 mr-2 text-jmv-gold" />
                ¡Tu Momento es Ahora!
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={100}>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-white via-jmv-gold to-white bg-clip-text text-transparent">
                Únete a la
              </span>
              <br />
              <span className="text-white text-2xl md:text-3xl lg:text-4xl font-light">
                Familia Vicenciana
              </span>
            </h1>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={150}>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-light mb-8 text-white/90 font-dancing max-w-5xl mx-auto">
              "Si deseas ser parte de nuestra asociación, comunícate con alguna
              comunidad que esté cerca de donde vives"
            </h2>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={200}>
            <p className="text-lg md:text-xl text-white/80 mb-12 max-w-4xl mx-auto leading-relaxed">
              Forma parte de una red nacional de jóvenes comprometidos con la
              transformación social. Encuentra tu comunidad local y comienza tu
              camino de servicio vicenciano.
            </p>
          </ScrollReveal>

          {/* Stats Preview */}
          <ScrollReveal direction="up" delay={250}>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-jmv-gold mb-2">
                  24
                </div>
                <div className="text-white/70 text-sm">Provincias</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-jmv-gold mb-2">
                  150+
                </div>
                <div className="text-white/70 text-sm">Comunidades</div>
              </div>
              <div className="text-center sm:col-span-1 col-span-2">
                <div className="text-3xl md:text-4xl font-bold text-jmv-gold mb-2">
                  5,000+
                </div>
                <div className="text-white/70 text-sm">Jóvenes Activos</div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={300}>
            <div className="text-center">
              <p className="text-white/70 text-sm mb-4">
                Explora el mapa interactivo para encontrar tu comunidad
              </p>
              <div className="inline-flex items-center text-jmv-gold hover:text-white transition-colors cursor-pointer">
                <MapPin className="mr-2 w-5 h-5" />
                <span className="mr-2">Encuentra tu comunidad más cercana</span>
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

      {/* Interactive Map Section */}
      <section
        id="mapa"
        className="relative py-20 bg-gradient-to-br from-jmv-blue-dark via-blue-800 to-blue-700"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up" delay={50}>
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium mb-6 text-white">
                <MapPin className="w-4 h-4 mr-2 text-jmv-gold" />
                Mapa Interactivo
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                Encuentra tu <span className="text-jmv-gold">Comunidad</span>
              </h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
                Haz clic en cualquier marcador para conocer los detalles de
                contacto y las actividades de cada comunidad JMV en Ecuador.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={100}>
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
              <MapaInteractivo />
            </div>
          </ScrollReveal>

          {/* Map Legend */}
          <ScrollReveal direction="up" delay={150}>
            <div className="mt-8 flex flex-wrap justify-center gap-6">
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                <div className="w-4 h-4 bg-jmv-red rounded-full mr-2"></div>
                <span className="text-white/80 text-sm">
                  Comunidades Activas
                </span>
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                <div className="w-4 h-4 bg-jmv-gold rounded-full mr-2"></div>
                <span className="text-white/80 text-sm">Sedes Zonales</span>
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                <div className="w-4 h-4 bg-blue-400 rounded-full mr-2"></div>
                <span className="text-white/80 text-sm">
                  Comunidades en Formación
                </span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Steps to Join */}
      <section className="relative py-20 bg-gradient-to-br from-blue-700 via-blue-800 to-jmv-blue-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up" delay={50}>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                ¿Cómo <span className="text-jmv-gold">Unirte</span>?
              </h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                Sigue estos sencillos pasos para comenzar tu camino en JMV
                Ecuador
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pasos.map((paso, index) => {
              const Icon = paso.icon;
              return (
                <ScrollReveal
                  key={index}
                  direction="up"
                  delay={100 + index * 50}
                >
                  <motion.div
                    className={`text-center group p-6 rounded-2xl transition-all duration-300 ${
                      activeStep === index
                        ? "bg-white/20 backdrop-blur-md border-2 border-jmv-gold"
                        : "bg-white/10 backdrop-blur-sm border border-white/20"
                    }`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="relative mb-6">
                      <div
                        className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto transition-all duration-300 ${
                          activeStep === index
                            ? "bg-gradient-to-r from-jmv-gold to-jmv-gold-dark scale-110"
                            : "bg-gradient-to-r from-jmv-gold/70 to-jmv-gold-dark/70 group-hover:scale-110"
                        }`}
                      >
                        <span className="text-2xl font-bold text-white">
                          {paso.numero}
                        </span>
                      </div>
                      {index < pasos.length - 1 && (
                        <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-jmv-gold/50 to-transparent"></div>
                      )}
                    </div>

                    <Icon className="w-8 h-8 text-jmv-gold mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-3">
                      {paso.titulo}
                    </h3>
                    <p className="text-white/70 mb-4">{paso.descripcion}</p>
                    <p className="text-jmv-gold text-sm font-medium">
                      {paso.accion}
                    </p>
                  </motion.div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative py-20 bg-gradient-to-br from-jmv-blue-dark via-blue-800 to-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Benefits */}
            <ScrollReveal direction="left" delay={100}>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                <h3 className="text-3xl font-bold text-white mb-8">
                  Lo que <span className="text-jmv-gold">Ganarás</span>
                </h3>

                <div className="grid sm:grid-cols-2 gap-4">
                  {beneficios.map((beneficio, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start p-3 rounded-lg bg-white/5 border border-white/10"
                      whileHover={{ scale: 1.02 }}
                    >
                      <CheckCircle className="w-5 h-5 text-jmv-gold mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-white/80 text-sm">{beneficio}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 p-6 bg-gradient-to-r from-jmv-gold/20 to-jmv-red/20 rounded-xl border border-jmv-gold/30">
                  <div className="flex items-center mb-3">
                    <Star className="w-5 h-5 text-jmv-gold mr-2" />
                    <h4 className="font-bold text-white">Dato Destacado</h4>
                  </div>
                  <p className="text-white/80 text-sm">
                    El 95% de nuestros ex-jóvenes consideran que JMV fue
                    determinante en su desarrollo personal y profesional. ¡Únete
                    a esta gran familia!
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Contact Info */}
            <ScrollReveal direction="right" delay={150}>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                <h3 className="text-3xl font-bold text-white mb-8">
                  <span className="text-jmv-gold">Contacto</span> Nacional
                </h3>

                <div className="space-y-6">
                  <motion.div
                    className="flex items-center p-4 bg-white/5 rounded-lg border border-white/10"
                    whileHover={{ scale: 1.02 }}
                  >
                    <MapPin className="w-6 h-6 text-jmv-gold mr-4 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-white">Oficina Nacional</p>
                      <p className="text-white/70 text-sm">
                        Av. 12 de Octubre N24-563 y Cordero, Quito
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-center p-4 bg-white/5 rounded-lg border border-white/10"
                    whileHover={{ scale: 1.02 }}
                  >
                    <Phone className="w-6 h-6 text-jmv-gold mr-4 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-white">
                        WhatsApp Nacional
                      </p>
                      <p className="text-white/70 text-sm">+593 99 123 4567</p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-center p-4 bg-white/5 rounded-lg border border-white/10"
                    whileHover={{ scale: 1.02 }}
                  >
                    <Mail className="w-6 h-6 text-jmv-gold mr-4 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-white">Email Nacional</p>
                      <p className="text-white/70 text-sm">
                        contacto@jmvecuador.org
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-center p-4 bg-white/5 rounded-lg border border-white/10"
                    whileHover={{ scale: 1.02 }}
                  >
                    <Calendar className="w-6 h-6 text-jmv-gold mr-4 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-white">
                        Horario de Atención
                      </p>
                      <p className="text-white/70 text-sm">
                        Lun - Vie: 9:00 AM - 6:00 PM
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative py-20 bg-gradient-to-br from-blue-700 via-blue-800 to-jmv-blue-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up" delay={50}>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                <span className="text-jmv-gold">Testimonios</span> que Inspiran
              </h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                Conoce las experiencias de jóvenes que encontraron en JMV su
                propósito de vida
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonios.map((testimonio, index) => (
              <ScrollReveal key={index} direction="up" delay={100 + index * 50}>
                <motion.div
                  className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 h-full"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-jmv-gold to-jmv-red rounded-full flex items-center justify-center mr-4">
                      <span className="text-white font-bold text-lg">
                        {testimonio.nombre.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-bold text-white">
                        {testimonio.nombre}
                      </h4>
                      <p className="text-jmv-gold text-sm">
                        {testimonio.cargo}
                      </p>
                    </div>
                  </div>

                  <blockquote className="text-white/80 mb-4 italic">
                    "{testimonio.testimonio}"
                  </blockquote>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-white/60">
                      {testimonio.ciudad} • {testimonio.años}
                    </span>
                    <span className="text-jmv-gold">
                      {testimonio.edad} años
                    </span>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-20 bg-gradient-to-br from-jmv-blue-dark via-blue-800 to-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up" delay={100}>
            <div className="bg-gradient-to-r from-jmv-red via-jmv-blue to-jmv-gold rounded-3xl p-12 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-black/40"></div>
              <div className="relative z-10">
                <Heart className="w-16 h-16 text-white mx-auto mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  ¡Es Hora de Actuar!
                </h2>
                <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
                  No esperes más. El mundo necesita tu corazón generoso, tu
                  energía transformadora y tu compromiso con los que más sufren.
                  ¡Únete hoy a la familia vicenciana!
                </p>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <button className="bg-white text-jmv-blue px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300">
                    Quiero Ser Parte de JMV Ecuador
                  </button>
                </motion.div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
