import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { TwoHearts } from "@/components/brand";

const FEATURES = [
  {
    title: "Comparte tus momentos",
    text: "Encuentros, retiros y servicio que viviste con tu comunidad.",
  },
  {
    title: "Comparte lo que aprendes",
    text: "Formaciones y recursos que pueden servir a otras comunidades.",
  },
  {
    title: "Servicio vicenciano",
    text: "Al servicio de quienes más lo necesitan.",
  },
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Tarjeta blanca fija en ambos modos; en claro el fondo es el marfil del tema
  return (
    <div className="relative min-h-svh bg-page dark:bg-slate-100">
      <div className="relative flex min-h-svh items-start justify-center px-4 pt-24 pb-10 sm:px-6 sm:pt-28 md:px-8">
        <div className="w-full max-w-5xl">
          <Link
            href="/"
            className="mb-4 inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-semibold text-jmv-blue hover:underline"
            data-surface="light"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Volver al inicio
          </Link>

          <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-card-lg dark:border-white/60 dark:shadow-2xl">
            <div className="h-2 bg-gradient-to-r from-jmv-blue via-jmv-red to-jmv-gold" />

            <div className="grid md:grid-cols-2">
              {/* Formulario: primero en el DOM para que el foco y el lector lleguen antes */}
              <div className="p-6 sm:p-8 md:p-10" data-surface="light">
                {children}
              </div>

              <div className="relative overflow-hidden bg-jmv-blue p-8 text-white md:p-12">
                <TwoHearts className="pointer-events-none absolute -right-10 -bottom-10 h-56 w-56 text-white/10" />
                <div className="relative max-w-md">
                  <p className="mb-4 font-display text-3xl font-semibold md:text-4xl">
                    Juventudes Marianas Vicencianas
                  </p>
                  <p className="mb-8 text-lg text-white/90">
                    Comparte tus experiencias y momentos con la comunidad.
                  </p>

                  <ul className="hidden space-y-4 md:block">
                    {FEATURES.map((feature) => (
                      <li key={feature.title} className="flex items-start gap-3">
                        <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-jmv-gold">
                          <Check className="h-4 w-4 text-jmv-ink" strokeWidth={3} aria-hidden="true" />
                        </span>
                        <span>
                          <strong className="block font-semibold text-white">
                            {feature.title}
                          </strong>
                          <span className="text-sm text-white/85">{feature.text}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
