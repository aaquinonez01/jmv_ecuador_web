import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#A8C5E0] relative overflow-hidden">
      {/* Background Animated Gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-jmv-blue/10 via-jmv-gold/10 to-jmv-red/10 animate-gradient -z-10" />

      {/* Animated Background Shapes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-32 left-10 w-72 h-72 bg-jmv-blue/5 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-jmv-gold/5 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-jmv-red/5 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "4s" }}
        />
      </div>

      {/* Main Content */}
      <div className="relative min-h-screen flex items-start justify-center p-4 sm:p-6 md:p-8 pt-28 sm:pt-30 md:pt-30 pb-8">
        <div className="w-full max-w-6xl animate-fade-in">
          {/* Main Card with Two Columns */}
          <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
            {/* Decorative Top Border */}
            <div className="h-2 bg-gradient-to-r from-jmv-blue via-jmv-red to-jmv-gold" />

            {/* Content Grid */}
            <div className="grid md:grid-cols-2">
              {/* Left Side - Image/Illustration */}
              <div className="relative bg-gradient-to-br from-jmv-blue to-jmv-blue-dark p-8 md:p-12 flex flex-col justify-center items-center text-white order-2 md:order-1 min-h-[200px] md:min-h-[600px]">
                {/* Decorative Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-10 left-10 w-20 h-20 border-4 border-white rounded-full"></div>
                  <div className="absolute bottom-20 right-10 w-32 h-32 border-4 border-white rounded-lg rotate-45"></div>
                  <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white rounded-full"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 text-center md:text-left w-full max-w-md">
                  <div className="mb-6 md:mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-6 animate-float">
                      <svg
                        className="w-12 h-12 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                    </div>
                  </div>

                  <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
                    Juventudes Marianas Vicencianas
                  </h2>
                  <p className="text-lg md:text-xl text-white/90 mb-6">
                    Comparte tus experiencias y momentos con nosotros.
                  </p>

                  {/* Features List */}
                  <div className="space-y-4 mt-8 hidden md:block">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-jmv-gold flex items-center justify-center flex-shrink-0 mt-1">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">
                          Comparte tus experiencias y momentos
                        </h3>
                        <p className="text-sm text-white/80">
                          Estamos para escuchar tus historias.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-jmv-gold flex items-center justify-center flex-shrink-0 mt-1">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">
                          Comparte tus formaciones y conocimientos.
                        </h3>
                        <p className="text-sm text-white/80">
                          Estamos para escuchar tus historias.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-jmv-gold flex items-center justify-center flex-shrink-0 mt-1">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">
                          Servicio vicenciano
                        </h3>
                        <p className="text-sm text-white/80">
                          Al servicio de los más necesitados
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Form */}
              <div className="p-6 sm:p-8 md:p-10 order-1 md:order-2">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
