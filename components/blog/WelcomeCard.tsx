"use client";

import Link from "next/link";
import { UserPlus, LogIn, Heart, Users, BookOpen, Sparkles } from "lucide-react";

export default function WelcomeCard() {
  return (
    <div className="bg-gradient-to-br from-white via-white to-jmv-blue/5 rounded-2xl shadow-lg border border-jmv-blue/20 overflow-hidden">
      {/* Header con degradado */}
      <div className="bg-gradient-to-r from-jmv-blue to-jmv-blue-dark p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10" />
        <div className="relative z-10">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 mx-auto">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-center mb-2">
            ¡Únete a nuestra comunidad!
          </h3>
          <p className="text-sm text-white/90 text-center">
            Comparte momentos, aprende y crece con nosotros
          </p>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-6 space-y-6">
        {/* Beneficios */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-jmv-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5 text-jmv-gold" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm mb-1">
                Conecta con jóvenes
              </h4>
              <p className="text-xs text-gray-600">
                Conoce personas con tu misma fe y valores
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-jmv-blue/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-5 h-5 text-jmv-blue" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm mb-1">
                Formación continua
              </h4>
              <p className="text-xs text-gray-600">
                Accede a recursos y documentos formativos
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-jmv-red/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-jmv-red" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm mb-1">
                Experiencias únicas
              </h4>
              <p className="text-xs text-gray-600">
                Participa en retiros, encuentros y actividades
              </p>
            </div>
          </div>
        </div>

        {/* Separador */}
        <div className="border-t border-gray-200" />

        {/* Botones de acción */}
        <div className="space-y-3">
          <Link
            href="/unete"
            className="w-full bg-gradient-to-r from-jmv-blue to-jmv-blue-dark text-white px-4 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 group"
          >
            <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Únete a JMV</span>
          </Link>

          <Link
            href="/auth/signin"
            className="w-full bg-white text-jmv-blue px-4 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2 border-2 border-jmv-blue group"
          >
            <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            <span>Iniciar Sesión</span>
          </Link>
        </div>

        {/* Estadísticas de la comunidad */}
        <div className="bg-gradient-to-r from-jmv-gold/5 to-jmv-gold/10 rounded-xl p-4 border border-jmv-gold/20">
          <p className="text-xs text-gray-600 text-center mb-3 font-medium">
            Más de 300 jóvenes en Ecuador
          </p>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-lg font-bold text-jmv-blue">15+</div>
              <div className="text-xs text-gray-600">Comunidades</div>
            </div>
            <div className="border-x border-jmv-gold/30">
              <div className="text-lg font-bold text-jmv-blue">50+</div>
              <div className="text-xs text-gray-600">Actividades</div>
            </div>
            <div>
              <div className="text-lg font-bold text-jmv-blue">15</div>
              <div className="text-xs text-gray-600">Provincias</div>
            </div>
          </div>
        </div>

        {/* Llamado a la acción final */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            ¿Ya tienes cuenta?{" "}
            <Link
              href="/auth/signin"
              className="text-jmv-blue font-semibold hover:underline"
            >
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
