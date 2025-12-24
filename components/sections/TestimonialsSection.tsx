"use client";

import { useState, useEffect } from "react";
import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";
import ScrollReveal from "../ui/ScrollReveal";

const testimonials = [
  {
    id: 1,
    name: "Karla Rosero",
    role: "Coordinadora Nacional",
    location: "Esmeraldas, Esmeraldas",
    image: "/images/testimonials/karla-rosero.png",
    quote:
      "No somos solo una asociación más en el país. Somos el deseo de María hecho realidad en medio de una sociedad difícil. Una comunidad que ha crecido, madurado y se proyecta con valentía hacia nuevos desafíos.",
    rating: 5,
  },
  {
    id: 2,
    name: "Sor Noemí Niño Godoy",
    role: "Asesora JMV",
    location: "Latacunga, Cotopaxi",
    image: "/images/testimonials/carlos-eduardo.jpg",
    quote:
      "Ver jóvenes que un día llegaron con timidez y hoy son líderes entregados, ver comunidades que han crecido juntas en la fe y el servicio, ver el rostro de Cristo en cada acción solidaria... todo esto llena de orgullo santo y esperanza",
    rating: 5,
  },
  {
    id: 3,
    name: "Mario Lopez",
    role: "Ex-Coordinador Nacional",
    location: "Riobamba, Chimborazo",
    image: "/images/testimonials/mario-lopez.png",
    quote:
      "Fui llamado en la historia de JMV a ser servidor valiente en el corazón de la Iglesia, con la ternura de María y la entrega de Vicente de Paúl",
    rating: 5,
  },
  {
    id: 4,
    name: "Karlita Loor",
    role: "Voluntaria Internacional JMV",
    location: "Loja, Loja",
    image: "/images/testimonials/karlita-loor.png",
    quote:
      "JMV me ha enseñado que, sin importar si estás en Ecuador o al otro lado del mundo, seguimos siendo una sola familia. Ser JMV es encontrar en cada joven esa misma ilusión, ese mismo amor a Dios, incluso cuando no hablamos el mismo idioma.",
    rating: 5,
  },
  {
    id: 5,
    name: "Sofía Isabel Ramírez",
    role: "Miembro Activo",
    location: "Ambato, Tungurahua",
    image: "/images/testimonials/sofia-isabel.jpg",
    quote:
      "La formación integral que recibimos en JMV es única. No solo crecemos espiritualmente, sino que desarrollamos habilidades de liderazgo y compromiso social.",
    rating: 5,
  },
  {
    id: 6,
    name: "Andrés Felipe Castro",
    role: "Coordinador de Servicio Social",
    location: "Machala, El Oro",
    image: "/images/testimonials/andres-felipe.jpg",
    quote:
      "JMV me ha enseñado que el verdadero liderazgo se ejerce sirviendo. Aquí he encontrado el espacio perfecto para poner mis talentos al servicio de los más necesitados.",
    rating: 5,
  },
];

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < rating ? "text-white/90 fill-current" : "text-blue-400/60"
        }`}
      />
    ));
  };

  return (
    <section className="py-20 relative overflow-hidden">
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
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/3 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-white/3 rounded-full blur-2xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <ScrollReveal direction="up" delay={100}>
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-sm font-medium mb-6 border border-white/20">
              <Quote className="w-4 h-4 mr-2" />
              Testimonios
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={200}>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Voces que <span className="text-white/90">Transforman</span>
            </h2>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={300}>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Conoce las experiencias de jóvenes que han encontrado en JMV un
              espacio de crecimiento, servicio y fraternidad vicenciana.
            </p>
          </ScrollReveal>
        </div>

        {/* Main Testimonial */}
        <ScrollReveal direction="up" delay={400}>
          <div
            className="relative max-w-4xl mx-auto mb-12"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20">
              <div className="text-center mb-8">
                {/* Quote Icon */}
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-6">
                  <Quote className="w-8 h-8 text-white/80" />
                </div>

                {/* Stars */}
                <div className="flex justify-center space-x-1 mb-6">
                  {renderStars(testimonials[currentIndex].rating)}
                </div>

                {/* Quote */}
                <blockquote className="text-2xl md:text-3xl font-light text-white mb-8 leading-relaxed italic">
                  "{testimonials[currentIndex].quote}"
                </blockquote>

                {/* Author Info */}
                <div className="flex items-center justify-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-700 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {testimonials[currentIndex].name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div className="text-left">
                    <h4 className="text-xl font-semibold text-white">
                      {testimonials[currentIndex].name}
                    </h4>
                    <p className="text-blue-200">
                      {testimonials[currentIndex].role}
                    </p>
                    <p className="text-sm text-blue-300">
                      {testimonials[currentIndex].location}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevTestimonial}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-200"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextTestimonial}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-200"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </ScrollReveal>

        {/* Testimonial Dots */}
        <ScrollReveal direction="up" delay={600}>
          <div className="flex justify-center space-x-3 mb-12">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-white/90 scale-125"
                    : "bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        </ScrollReveal>

        {/* Thumbnail Grid */}
        <ScrollReveal direction="up" delay={700}>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <button
                key={testimonial.id}
                onClick={() => goToTestimonial(index)}
                className={`aspect-square rounded-2xl transition-all duration-300 ${
                  index === currentIndex
                    ? "ring-4 ring-white/80 scale-105"
                    : "opacity-60 hover:opacity-80"
                }`}
              >
                <div className="w-full h-full bg-gradient-to-br from-blue-700 to-blue-600 rounded-2xl flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-lg font-bold mb-1">
                      {testimonial.name.split(" ")[0]}
                    </div>
                    <div className="text-xs opacity-80">
                      {testimonial.location.split(",")[0]}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Bottom CTA */}
        <ScrollReveal direction="up" delay={800}>
          <div className="text-center mt-16">
            <h3 className="text-2xl font-bold text-white mb-4">
              ¿Quieres ser parte de estas historias de transformación?
            </h3>
            <p className="text-blue-200 mb-8 max-w-2xl mx-auto">
              Únete a nuestra familia vicenciana y descubre cómo tu vida puede
              ser una fuente de bendición para otros.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
