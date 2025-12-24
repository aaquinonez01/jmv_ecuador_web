"use client";

import { useState } from "react";
import {
  Hand,
  Heart,
  Users,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Play,
  Plus,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import ScrollReveal from "../ui/ScrollReveal";
import Image from "next/image";

interface Item {
  id: string;
  titulo: string;
  descripcion: string;
  imagen: string;
  ubicacion?: string;
  beneficiarios?: number;
}

export default function ApostoladoPilarView({ items }: { items: Item[] }) {
  const [currentImage, setCurrentImage] = useState(0);
  const nextImage = () => setCurrentImage((prev) => (prev + 1) % items.length);
  const prevImage = () =>
    setCurrentImage((prev) => (prev - 1 + items.length) % items.length);

  return (
    <section
      id="apostolado"
      className="py-12 sm:py-16 lg:py-20 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-jmv-blue-dark to-blue-800" />
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <ScrollReveal direction="up" delay={50}>
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white font-medium mb-6">
              <Hand className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Primer Pilar
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              <span className="text-jmv-gold">Apostolado</span> Social
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/80 max-w-4xl mx-auto leading-relaxed">
              Compromiso activo con los más necesitados siguiendo el ejemplo de
              San Vicente de Paúl.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 mb-12 sm:mb-16">
          <ScrollReveal direction="left" delay={100}>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 lg:p-6 border border-white/20">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 text-center">
                Galería de Actividades
              </h3>

              <div className="relative mb-4 sm:mb-6">
                <div className="relative w-full overflow-hidden rounded-xl border border-white/20">
                  <div className="aspect-video relative">
                    {items.length > 0 ? (
                      <Image
                        src={
                          items[currentImage]?.imagen ||
                          "/images/placeholder.jpg"
                        }
                        alt={items[currentImage]?.titulo || "Actividad"}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        priority
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/5">
                        <Play className="w-16 h-16 text-jmv-gold" />
                      </div>
                    )}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/40 backdrop-blur-sm p-3 sm:p-4">
                    <h4 className="text-sm sm:text-base lg:text-lg font-bold text-white">
                      {items.length > 0
                        ? items[currentImage]?.titulo
                        : "Apostolado Social"}
                    </h4>
                    <p className="text-white/80 text-xs sm:text-sm line-clamp-2">
                      {items.length > 0
                        ? items[currentImage]?.descripcion
                        : "Próximamente más imágenes de nuestras actividades de servicio."}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center text-jmv-gold text-xs sm:text-sm">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="truncate">
                          {items.length > 0
                            ? items[currentImage]?.ubicacion || "—"
                            : "—"}
                        </span>
                      </div>
                      <div className="flex items-center text-jmv-gold text-xs sm:text-sm">
                        <Users className="w-4 h-4 mr-1" />
                        {typeof items[currentImage]?.beneficiarios === "number"
                          ? `${items[currentImage]?.beneficiarios} personas`
                          : "—"}
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={items.length > 0 ? prevImage : undefined}
                  disabled={items.length === 0}
                  className={`absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 rounded-full p-2 sm:p-3 text-white transition-colors ${
                    items.length === 0
                      ? "bg-black/30 opacity-50 cursor-not-allowed"
                      : "bg-black/50 backdrop-blur-sm hover:bg-black/70"
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={items.length > 0 ? nextImage : undefined}
                  disabled={items.length === 0}
                  className={`absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 rounded-full p-2 sm:p-3 text-white transition-colors ${
                    items.length === 0
                      ? "bg-black/30 opacity-50 cursor-not-allowed"
                      : "bg-black/50 backdrop-blur-sm hover:bg-black/70"
                  }`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/20">
                {items.length > 0
                  ? items.map((actividad, index) => (
                      <button
                        key={actividad.id}
                        onClick={() => setCurrentImage(index)}
                        className={`flex-shrink-0 w-16 h-12 sm:w-20 sm:h-16 rounded-lg border-2 transition-all duration-300 ${
                          currentImage === index
                            ? "border-jmv-gold bg-jmv-gold/20"
                            : "border-white/20 bg-white/5 hover:border-white/40"
                        }`}
                      >
                        <div className="relative w-full h-full rounded-md overflow-hidden">
                          <Image
                            src={actividad.imagen}
                            alt={actividad.titulo}
                            fill
                            className="object-cover"
                            sizes="100px"
                          />
                        </div>
                      </button>
                    ))
                  : Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={`placeholder-${i}`}
                        className="flex-shrink-0 w-16 h-12 sm:w-20 sm:h-16 rounded-lg border-2 border-white/20 bg-white/5 flex items-center justify-center"
                      >
                        <Plus className="w-5 h-5 text-jmv-gold" />
                      </div>
                    ))}
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={150}>
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="flex items-center mb-4">
                  <Heart className="w-6 h-6 text-jmv-gold mr-3" />
                  <h3 className="text-xl font-bold text-white">
                    ¿Qué es el Apostolado?
                  </h3>
                </div>
                <p className="text-white/80 leading-relaxed">
                  El apostolado es el corazón de nuestra misión vicenciana. A
                  través del servicio directo a los más pobres y excluidos,
                  nuestros jóvenes descubren el rostro de Cristo en cada hermano
                  necesitado y experimentan la transformación que produce el
                  amor concreto.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-jmv-gold/10 rounded-xl p-4 border border-jmv-gold/20 text-center">
                  <div className="text-2xl font-bold text-jmv-gold mb-1">
                    690
                  </div>
                  <div className="text-white/70 text-sm">
                    Beneficiarios Directos
                  </div>
                </div>
                <div className="bg-jmv-gold/10 rounded-xl p-4 border border-jmv-gold/20 text-center">
                  <div className="text-2xl font-bold text-jmv-gold mb-1">6</div>
                  <div className="text-white/70 text-sm">
                    Tipos de Actividades
                  </div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <h4 className="text-lg font-bold text-white mb-4">
                  Valores que Desarrollamos
                </h4>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Heart className="w-5 h-5 text-jmv-gold mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-white/80 text-sm">
                      Amor efectivo y afectivo hacia los pobres
                    </span>
                  </div>
                  <div className="flex items-start">
                    <Hand className="w-5 h-5 text-jmv-gold mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-white/80 text-sm">
                      Compromiso social y transformador
                    </span>
                  </div>
                  <div className="flex items-start">
                    <AlertTriangle className="w-5 h-5 text-jmv-gold mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-white/80 text-sm">
                      Sensibilidad ante la injusticia
                    </span>
                  </div>
                  <div className="flex items-start">
                    <Sparkles className="w-5 h-5 text-jmv-gold mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-white/80 text-sm">
                      Creatividad en el servicio
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
