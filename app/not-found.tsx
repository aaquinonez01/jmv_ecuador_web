import Link from "next/link";
import { CalendarDays, Home, Mail } from "lucide-react";
import StarsRing from "@/components/brand/StarsRing";
import { buttonVariants } from "@/components/ui/Button";

const links = [
  { href: "/", label: "Inicio", description: "Vuelve a la portada", icon: Home },
  { href: "/actividades", label: "Actividades", description: "Lo que hacemos en todo Ecuador", icon: CalendarDays },
  { href: "/contacto", label: "Contacto", description: "Escríbenos, te respondemos", icon: Mail },
];

export default function NotFound() {
  return (
    <section className="relative flex min-h-[70svh] flex-col items-center justify-center overflow-hidden px-4 pb-16 pt-28 text-center">
      <StarsRing className="pointer-events-none absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 text-jmv-gold-text/15" />
      <div className="relative max-w-2xl">
        <p className="font-display text-lg italic text-jmv-gold-text">Error 404</p>
        <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
          No encontramos esta página
        </h1>
        <p className="mt-4 text-slate-300">
          Puede que el enlace haya cambiado o que la página ya no exista. Estos
          caminos te pueden ayudar:
        </p>
        <ul className="mt-8 grid gap-3 text-left sm:grid-cols-3">
          {links.map(({ href, label, description, icon: Icon }) => (
            <li key={href}>
              <Link
                href={href}
                className="flex h-full items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 hover:border-jmv-gold-text/50 hover:bg-white/10"
              >
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-jmv-gold-text" aria-hidden />
                <span>
                  <span className="block font-semibold text-white">{label}</span>
                  <span className="block text-sm text-slate-300">{description}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/unete" className={buttonVariants({ variant: "gold", className: "mt-8" })}>
          Encuentra tu grupo
        </Link>
      </div>
    </section>
  );
}
