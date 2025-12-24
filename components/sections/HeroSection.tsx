"use client";

import Link from "next/link";
import { ChevronRight, Heart, Star } from "lucide-react";
import Button from "../ui/Button";
import ScrollReveal from "../ui/ScrollReveal";

interface Props {
  backgroundUrl?: string;
}

export default function HeroSection({ backgroundUrl = "/images/hero/hero.jpg" }: Props) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 sm:pt-24 lg:pt-16">
      {/* Background with Gradient Overlay */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-black z-10 opacity-60" />
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80"
          style={{ backgroundImage: `url('${backgroundUrl}')` }}
        />
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-20">
        <div className="hidden sm:block absolute top-20 left-10 w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 bg-white/10 rounded-full blur-xl animate-float" />
        <div
          className="hidden md:block absolute bottom-32 right-16 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-jmv-gold/20 rounded-full blur-2xl animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="hidden lg:block absolute top-1/2 left-1/4 w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-jmv-red/20 rounded-full blur-lg animate-float"
          style={{ animationDelay: "4s" }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white py-8 sm:py-12 lg:py-0">
        <ScrollReveal direction="fade" delay={200}>
          <div className="mt-4 sm:mt-6 lg:mt-8">
            <div className="inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-xs sm:text-sm font-medium mb-6 sm:mb-8">
              <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-jmv-gold" />
              <span className="hidden sm:inline">
                30 años formando jóvenes en Ecuador
              </span>
              <span className="sm:hidden">30 años en Ecuador</span>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={400}>
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 sm:mb-8 leading-tight">
            <span className="bg-gradient-to-r from-white via-jmv-gold to-white bg-clip-text text-transparent">
              Juventudes Marianas
            </span>
            <br />
            <span className="text-white text-xl sm:text-3xl md:text-4xl lg:text-5xl font-light">
              Vicencianas Ecuador
            </span>
          </h1>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={600}>
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light mb-6 sm:mb-8 text-white/90 font-dancing max-w-4xl mx-auto">
            "Formando jóvenes comprometidos con el servicio, la fe y la
            transformación social"
          </h2>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={800}>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/80 mb-8 sm:mb-10 lg:mb-12 max-w-4xl mx-auto leading-relaxed">
            Únete a una comunidad de jóvenes que viven el carisma vicenciano a
            través del servicio, la formación integral y el amor por los más
            necesitados, siguiendo el ejemplo de San Vicente de Paúl y Santa
            Catalina Labouré.
          </p>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={1000}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-12 sm:mb-16">
            <Link href="/quienes-somos">
              <Button
                size="lg"
                className="bg-white text-jmv-blue hover:bg-white/90 shadow-2xl"
              >
                Conoce Nuestra Historia
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>

            <Link href="/unete">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-jmv-blue"
              >
                Únete a JMV
                <Heart className="ml-2 h-5 w-5" />
              </Button>
            </Link>
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
  );
}
