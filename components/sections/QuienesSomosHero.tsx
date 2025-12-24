"use client";

import Link from "next/link";
import { ChevronRight, Heart, Star, Users, Calendar } from "lucide-react";
import Button from "../ui/Button";
import ScrollReveal from "../ui/ScrollReveal";

interface Props {
  backgroundUrl?: string;
}

export default function QuienesSomosHero({ backgroundUrl = "/images/quienes-somos/jmv-community.jpg" }: Props) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24">
      {/* Background with Gradient Overlay */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-jmv z-10" />
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
          style={{ backgroundImage: `url('${backgroundUrl}')` }}
        />
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
              Conoce Nuestra Historia
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={100}>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-white via-jmv-gold to-white bg-clip-text text-transparent">
              Quiénes Somos
            </span>
            <br />
            <span className="text-white text-2xl md:text-3xl lg:text-4xl font-light">
              Juventudes Marianas Vicencianas Ecuador
            </span>
          </h1>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={150}>
          <h2 className="text-xl md:text-2xl lg:text-3xl font-light mb-8 text-white/90 font-dancing max-w-5xl mx-auto">
            "Una familia de jóvenes que vive el carisma vicenciano a través del
            servicio, la fe y el compromiso con los más necesitados"
          </h2>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={200}>
          <p className="text-lg md:text-xl text-white/80 mb-12 max-w-4xl mx-auto leading-relaxed">
            Desde 1995, hemos formado generaciones de jóvenes comprometidos con
            la transformación social, siguiendo el ejemplo de San Vicente de
            Paúl y bajo la protección maternal de María Santísima.
          </p>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={250}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
            <Link href="#historia">
              <Button
                size="lg"
                className="bg-white text-jmv-blue hover:bg-white/90 shadow-2xl"
              >
                Nuestra Historia
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>

            <Link href="#organizacion">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-jmv-blue"
              >
                Organización
                <Users className="ml-2 h-5 w-5" />
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
