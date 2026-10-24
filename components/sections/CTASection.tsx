import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, CalendarDays, Heart, Users } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";
import { StarDivider } from "@/components/brand";
import { SITE, yearsSinceFoundation } from "@/lib/site";

const getCtaOptions = (): { icon: LucideIcon; title: string; description: string; link: string }[] => [
  {
    icon: Users,
    title: "Únete a JMV",
    description: "Encuentra la comunidad más cercana y vive tu primer encuentro",
    link: "/unete",
  },
  {
    icon: Heart,
    title: "Conoce nuestra historia",
    description: `${yearsSinceFoundation()} años de JMV en Ecuador, desde ${SITE.foundedYear}`,
    link: "/quienes-somos/historia",
  },
  {
    icon: CalendarDays,
    title: "Próximas actividades",
    description: "Encuentros, retiros y misiones en los que puedes participar",
    link: "/actividades#proximas",
  },
];

export default function CTASection() {
  const ctaOptions = getCtaOptions();
  return (
    <section
      aria-labelledby="cta-titulo"
      className="relative overflow-hidden bg-gradient-to-br from-jmv-ink via-[#163a68] to-jmv-blue py-12 sm:py-16 lg:py-20"
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center sm:mb-16">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-jmv-gold-text">
            Tu llamado te espera
          </p>
          <h2
            id="cta-titulo"
            className="text-3xl font-bold leading-tight text-white text-balance sm:text-4xl lg:text-5xl"
          >
            ¿Estás listo para transformar vidas?
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-slate-200 sm:text-xl">
            En JMV Ecuador creemos que cada joven puede ser agente de cambio. Únete a nuestra misión
            de servir a los más necesitados y vivir el carisma vicenciano con alegría y esperanza.
          </p>

          <div className="mt-10 flex flex-col flex-wrap items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Link href="/unete" className={buttonVariants({ variant: "light", size: "lg" })}>
              Únete ahora
              <ArrowRight className="ml-2 h-5 w-5" aria-hidden />
            </Link>
            <Link href="/contacto" className={buttonVariants({ variant: "outlineLight", size: "lg" })}>
              Escríbenos
            </Link>
          </div>
        </div>

        <ul className="mb-16 grid gap-6 md:grid-cols-3">
          {ctaOptions.map(({ icon: Icon, title, description, link }) => (
            <li key={link}>
              <Link
                href={link}
                className="group flex h-full flex-col rounded-3xl border border-white/20 bg-white/10 p-6 transition-colors hover:border-white/40 hover:bg-white/15 sm:p-8"
              >
                <span className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-jmv-gold text-jmv-ink">
                  <Icon className="h-7 w-7" aria-hidden />
                </span>
                <span className="text-2xl font-bold text-white">{title}</span>
                <span className="mt-3 mb-6 leading-relaxed text-slate-200">{description}</span>
                <span className="mt-auto inline-flex items-center font-semibold text-jmv-gold-text">
                  Explorar
                  <ArrowRight
                    className="ml-2 h-5 w-5 transition-transform motion-safe:group-hover:translate-x-1"
                    aria-hidden
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <figure className="rounded-3xl border border-white/20 bg-white/10 p-8 text-center sm:p-12">
          <StarDivider className="mb-6" />
          <blockquote className="mx-auto max-w-4xl font-display text-2xl italic leading-snug text-white md:text-3xl">
            “Si amas a Cristo, ayuda al pobre, porque en él encontrarás a Cristo”
          </blockquote>
          <figcaption className="mt-6 text-lg font-semibold text-slate-200">
            — San Vicente de Paúl
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
