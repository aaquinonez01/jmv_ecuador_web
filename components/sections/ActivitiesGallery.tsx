"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Heart,
  Users,
  Hand,
  BookOpen,
  Cross,
  MapPin,
  ArrowRight,
  Eye,
  Plus,
} from "lucide-react";
import ScrollReveal from "../ui/ScrollReveal";

const activityTypes = [
  "Todas",
  "Apostolado",
  "Formación",
  "Encuentros",
  "Espiritualidad",
];

const activities = [
  {
    id: 1,
    title: "Encuentro Nacional JMV 2025",
    description: "Hermandad vicenciana unida en fe y servicio",
    location: "Chone, Manabi",
    type: "Encuentros",
    image: "/images/gallery/encuentro_nacional_2025.jpg",
    category: "large",
  },
  {
    id: 2,
    title: "Servicio en Comedores Comunitarios",
    description:
      "Apoyo alimentario a familias vulnerables en sectores marginales de Quito",
    location: "Quito Sur",
    type: "Apostolado",
    image: "/images/gallery/comedor-comunitario.jpg",
    featured: true,
    category: "medium",
  },

  {
    id: 3,
    title: "Adoración Eucarística",
    description: "Momentos de oración y encuentro con Jesús Sacramentado",
    location: "San Jose Poalo",
    type: "Espiritualidad",
    image: "/images/gallery/adoracion_santisimo.jpeg",
    category: "small",
  },
  {
    id: 4,
    title: "Asamblea Nacional 2024",
    description: "",
    location: "Quito, Pichincha",
    type: "Encuentros",
    image: "/images/gallery/asamblea_2024.jpg",
    category: "medium",
  },
  {
    id: 5,
    title: "Formación en Doctrina Social",
    description: "Taller sobre enseñanza social de la Iglesia",
    location: "Casa Provincial",
    type: "Formación",
    image: "/images/gallery/formacion.jpg",
    category: "small",
  },
  {
    id: 6,
    title: "Apoyo a Niñez Vulnerable",
    description:
      "Actividades recreativas y educativas para niños en situación de riesgo",
    location: "Guayaquil",
    type: "Apostolado",
    image: "/images/gallery/ninos-vulnerables.jpg",
    category: "large",
  },
  {
    id: 7,
    title: "Peregrinación Mariana",
    description: "Caminata de fe hacia el Santuario de la Virgen",
    location: "El Quinche",
    type: "Espiritualidad",
    image: "/images/gallery/peregrinacion.jpg",
    category: "medium",
  },
  {
    id: 8,
    title: "Construcción de Viviendas",
    description: "Trabajo colaborativo en construcción de hogares dignos",
    location: "Esmeraldas",
    type: "Servicio Social",
    image: "/images/gallery/construccion.jpg",
    category: "small",
  },
];

export default function ActivitiesGallery() {
  const [selectedType, setSelectedType] = useState("Todas");
  const [hoveredActivity, setHoveredActivity] = useState<number | null>(null);

  const filteredActivities = activities.filter(
    (activity) => selectedType === "Todas" || activity.type === selectedType
  );

  const getGridClasses = (category: string, index: number) => {
    switch (category) {
      case "large":
        return "sm:col-span-2 lg:col-span-2 xl:col-span-2 sm:row-span-2";
      case "medium":
        return "sm:col-span-2 lg:col-span-2 xl:col-span-2 sm:row-span-1";
      case "small":
        return "sm:col-span-1 lg:col-span-1 xl:col-span-1 sm:row-span-1";
      default:
        return "sm:col-span-1 lg:col-span-1 xl:col-span-1 sm:row-span-1";
    }
  };

  return (
    <section className="py-12 sm:py-16 lg:py-20 relative overflow-hidden">
      {/* Previous section background that fades out */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom right, var(--jmv-blue-dark), var(--jmv-blue), #1e40af)",
          maskImage:
            "linear-gradient(to bottom, black 0%, black 35%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, black 35%, transparent 100%)",
        }}
      />
      {/* Current section background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-jmv-blue-dark to-blue-800" />
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="hidden sm:block absolute top-20 left-4 sm:left-20 w-32 h-32 sm:w-64 sm:h-64 bg-white/3 rounded-full blur-3xl" />
        <div className="hidden md:block absolute bottom-20 right-4 sm:right-20 w-48 h-48 sm:w-96 sm:h-96 bg-white/2 rounded-full blur-3xl" />
        <div className="hidden lg:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-128 sm:h-128 bg-white/1 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <ScrollReveal direction="up" delay={100}>
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white font-medium mb-6">
              <Eye className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Galería de Actividades
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              Viviendo el{" "}
              <span className="text-jmv-gold">Carisma Vicenciano</span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/80 max-w-4xl mx-auto leading-relaxed">
              Una mirada a nuestro compromiso diario: sirviendo a los más
              necesitados, creciendo en la fe y construyendo comunidad en nombre
              de San Vicente de Paúl.
            </p>
          </div>
        </ScrollReveal>

        {/* Filter Buttons */}
        <ScrollReveal direction="up" delay={200}>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12 sm:mb-16">
            {activityTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-2 sm:px-6 sm:py-3 rounded-full text-sm sm:text-base font-medium transition-all duration-200 ${
                  selectedType === type
                    ? "bg-white text-jmv-blue shadow-lg scale-105"
                    : "bg-white/10 backdrop-blur-md border border-white/20 text-white/80 hover:bg-white/20 hover:text-white"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Masonry Gallery Grid */}
        <ScrollReveal direction="up" delay={300}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 auto-rows-[180px] sm:auto-rows-[200px]">
            {filteredActivities.map((activity, index) => (
              <div
                key={activity.id}
                className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:z-10 ${getGridClasses(
                  activity.category,
                  index
                )}`}
                onMouseEnter={() => setHoveredActivity(activity.id)}
                onMouseLeave={() => setHoveredActivity(null)}
              >
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-all duration-700 group-hover:scale-110"
                  style={{
                    backgroundImage: `url('${activity.image}')`,
                  }}
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/90 transition-all duration-300" />

                {/* Content */}
                <div className="absolute inset-0 p-3 sm:p-4 lg:p-6 flex flex-col justify-end text-white">
                  {/* Activity Type Badge */}
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                    <div className="px-2 py-1 sm:px-3 sm:py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium border border-white/30">
                      {activity.type}
                    </div>
                  </div>

                  {/* Title and Description */}
                  <div className="transform transition-all duration-300 group-hover:translate-y-0 translate-y-2">
                    <h3 className="text-sm sm:text-base lg:text-lg xl:text-xl font-bold mb-1 sm:mb-2 group-hover:text-jmv-gold transition-colors duration-300 line-clamp-2">
                      {activity.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-white/80 mb-2 sm:mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-clamp-2">
                      {activity.description}
                    </p>

                    <div className="flex items-center text-xs text-white/60 group-hover:text-white/80 transition-colors duration-300">
                      <MapPin className="w-3 h-3 mr-1" />
                      {activity.location}
                    </div>
                  </div>

                  {/* Hover Overlay with Plus Icon */}
                  <div
                    className={`absolute inset-0 flex items-center justify-center bg-jmv-blue/20 backdrop-blur-sm transition-all duration-300 ${
                      hoveredActivity === activity.id
                        ? "opacity-100"
                        : "opacity-0"
                    }`}
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/30">
                      <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* Call to Action */}
        <ScrollReveal direction="up" delay={500}>
          <div className="text-center mt-12 sm:mt-16">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/20 max-w-3xl mx-auto">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
                ¿Te inspira nuestro trabajo?
              </h3>
              <p className="text-sm sm:text-base text-white/70 mb-6 leading-relaxed">
                Únete a nosotros y vive el carisma vicenciano sirviendo a los
                más necesitados. Cada acción cuenta, cada corazón importa.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <Link href="/unete">
                  <button className="w-full sm:w-auto bg-white text-jmv-blue px-6 sm:px-8 py-3 rounded-xl text-sm sm:text-base font-semibold hover:bg-white/90 transition-all duration-200 transform hover:scale-105">
                    Únete a JMV
                    <Heart className="inline ml-2 w-4 h-4" />
                  </button>
                </Link>
                <Link href="/galeria">
                  <button className="w-full sm:w-auto text-white border-2 border-white/30 px-6 sm:px-8 py-3 rounded-xl text-sm sm:text-base font-semibold hover:bg-white hover:text-jmv-blue transition-all duration-200">
                    Ver Más Fotos
                    <ArrowRight className="inline ml-2 w-4 h-4" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
