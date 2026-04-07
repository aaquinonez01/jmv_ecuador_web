"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import ScrollReveal from "../ui/ScrollReveal";
import type { TestimonialItem } from "@/types/activity-management";

function renderStars(rating: number) {
  return Array.from({ length: 5 }, (_, index) => (
    <Star
      key={index}
      className={`h-5 w-5 ${
        index < rating ? "fill-current text-white/90" : "text-blue-400/60"
      }`}
    />
  ));
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function TestimonialsSectionClient({
  testimonials,
}: {
  testimonials: TestimonialItem[];
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    setCurrentIndex(0);
  }, [testimonials.length]);

  useEffect(() => {
    if (!isAutoPlaying || testimonials.length <= 1) return;

    const interval = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  if (!testimonials.length) {
    return null;
  }

  const activeItem = testimonials[currentIndex];

  return (
    <section className="relative overflow-hidden py-20">
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
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-jmv-blue-dark to-blue-800" />

      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 h-96 w-96 rounded-full bg-white/3 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute top-1/2 left-1/4 h-64 w-64 rounded-full bg-white/3 blur-2xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <ScrollReveal direction="up" delay={100}>
            <div className="mb-6 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md">
              <Quote className="mr-2 h-4 w-4" />
              Testimonios
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={200}>
            <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
              Voces que <span className="text-white/90">Transforman</span>
            </h2>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={300}>
            <p className="mx-auto max-w-3xl text-xl text-blue-100">
              Conoce las experiencias de jóvenes que han encontrado en JMV un
              espacio de crecimiento, servicio y fraternidad vicenciana.
            </p>
          </ScrollReveal>
        </div>

        <ScrollReveal direction="up" delay={400}>
          <div
            className="relative mx-auto mb-12 max-w-4xl"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            <div className="rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-md md:p-12">
              <div className="text-center">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
                  <Quote className="h-8 w-8 text-white/80" />
                </div>

                <div className="mb-6 flex justify-center space-x-1">
                  {renderStars(activeItem.rating || 5)}
                </div>

                <blockquote className="mb-8 text-2xl leading-relaxed font-light text-white italic md:text-3xl">
                  "{activeItem.quote}"
                </blockquote>

                <div className="flex items-center justify-center space-x-4">
                  <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-700 to-blue-600 text-lg font-bold text-white">
                    {activeItem.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={activeItem.imageUrl}
                        alt={activeItem.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      initials(activeItem.name)
                    )}
                  </div>
                  <div className="text-left">
                    <h4 className="text-xl font-semibold text-white">
                      {activeItem.name}
                    </h4>
                    <p className="text-blue-200">{activeItem.role}</p>
                    <p className="text-sm text-blue-300">
                      {activeItem.location || "JMV Ecuador"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {testimonials.length > 1 ? (
              <>
                <button
                  onClick={() =>
                    setCurrentIndex(
                      (prev) => (prev - 1 + testimonials.length) % testimonials.length
                    )
                  }
                  className="absolute top-1/2 left-4 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={() =>
                    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
                  }
                  className="absolute top-1/2 right-4 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            ) : null}
          </div>
        </ScrollReveal>

        {testimonials.length > 1 ? (
          <>
            <ScrollReveal direction="up" delay={600}>
              <div className="mb-12 flex justify-center space-x-3">
                {testimonials.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-3 w-3 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? "scale-125 bg-white/90"
                        : "bg-white/30 hover:bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={700}>
              <div className="mx-auto grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
                {testimonials.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => setCurrentIndex(index)}
                    className={`aspect-square rounded-2xl transition-all duration-300 ${
                      index === currentIndex
                        ? "scale-105 ring-4 ring-white/80"
                        : "opacity-60 hover:opacity-80"
                    }`}
                  >
                    <div className="flex h-full w-full items-center justify-center rounded-2xl bg-gradient-to-br from-blue-700 to-blue-600 p-3 text-white">
                      <div className="text-center">
                        <div className="mb-1 text-sm font-bold">
                          {item.name.split(" ")[0]}
                        </div>
                        <div className="text-xs opacity-80">
                          {(item.location || "JMV Ecuador").split(",")[0]}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollReveal>
          </>
        ) : null}

        <ScrollReveal direction="up" delay={800}>
          <div className="mt-16 text-center">
            <h3 className="mb-4 text-2xl font-bold text-white">
              ¿Quieres ser parte de estas historias de transformación?
            </h3>
            <p className="mx-auto max-w-2xl text-blue-200">
              Únete a nuestra familia vicenciana y descubre cómo tu vida puede
              ser una fuente de bendición para otros.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
