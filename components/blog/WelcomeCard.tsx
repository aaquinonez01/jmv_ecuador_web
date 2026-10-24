import Link from "next/link";
import { BookOpen, Camera, LogIn, UserPlus, Users } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";

export const SIGN_IN_FROM_BLOG = "/sign-in?redirect=/blog";

const BENEFITS = [
  {
    icon: Camera,
    title: "Comparte tus momentos",
    text: "Encuentros, misiones y servicio que viviste con tu comunidad.",
  },
  {
    icon: BookOpen,
    title: "Aporta recursos",
    text: "Formaciones y materiales que pueden servir a otras comunidades.",
  },
  {
    icon: Users,
    title: "Conecta con otras zonas",
    text: "Mira lo que viven jóvenes de JMV en todo el Ecuador.",
  },
];

// Tarjeta para visitantes sin sesión
export default function WelcomeCard() {
  return (
    <section
      aria-labelledby="welcome-card-title"
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
      data-surface="light"
    >
      <div className="bg-jmv-blue p-5 text-white">
        <h2 id="welcome-card-title" className="font-display text-xl font-semibold">
          Sé parte de la comunidad
        </h2>
        <p className="mt-1 text-sm text-white/90">
          Para publicar necesitas una cuenta de JMV Ecuador.
        </p>
      </div>

      <div className="space-y-5 p-5">
        <ul className="space-y-3">
          {BENEFITS.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-jmv-blue/10">
                <Icon className="h-5 w-5 text-jmv-blue" aria-hidden="true" />
              </span>
              <span>
                <strong className="block text-sm font-semibold text-gray-900">{title}</strong>
                <span className="text-sm text-gray-700">{text}</span>
              </span>
            </li>
          ))}
        </ul>

        <div className="space-y-2">
          <Link
            href={SIGN_IN_FROM_BLOG}
            className={buttonVariants({ variant: "primary", className: "w-full gap-2" })}
          >
            <LogIn className="h-5 w-5" aria-hidden="true" />
            Iniciar sesión
          </Link>
          <Link
            href="/unete"
            className={buttonVariants({ variant: "outline", className: "w-full gap-2" })}
          >
            <UserPlus className="h-5 w-5" aria-hidden="true" />
            Únete a JMV
          </Link>
        </div>
      </div>
    </section>
  );
}
