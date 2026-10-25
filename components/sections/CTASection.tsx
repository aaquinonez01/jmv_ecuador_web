import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, CalendarDays, HandHeart, Heart, Users } from "lucide-react";
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
      className="relative overflow-hidden bg-hero-plain py-12 sm:py-16 lg:py-20"
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center sm:mb-16">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-accent-gold">
            Tu llamado te espera
          </p>
          <h2
            id="cta-titulo"
            className="text-3xl font-bold leading-tight text-fg text-balance sm:text-4xl lg:text-5xl"
          >
            ¿Estás listo para transformar vidas?
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-fg-soft sm:text-xl">
            En JMV Ecuador creemos que cada joven puede ser agente de cambio. Únete a nuestra misión
            de servir a los más necesitados y vivir el carisma vicenciano con alegría y esperanza.
          </p>

          <div className="mt-10 flex flex-col flex-wrap items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Link href="/unete" className={buttonVariants({
                variant: "primary",
                size: "lg",
                // Claro: azul JMV; oscuro: el botón blanco de siempre
                className: "dark:bg-white dark:text-jmv-blue dark:shadow-lg dark:hover:bg-slate-100",
              })}>
              Únete ahora
              <ArrowRight className="ml-2 h-5 w-5" aria-hidden />
            </Link>
            <Link href="/contacto" className={buttonVariants({ variant: "outlineAuto", size: "lg" })}>
              Escríbenos
            </Link>
          </div>

          <p className="mt-6 text-base text-fg-soft">
            ¿Quieres apoyar la misión de otra forma?{" "}
            <Link
              href="/donar"
              className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-accent-gold underline underline-offset-4 hover:text-fg"
            >
              <HandHeart className="h-5 w-5" aria-hidden />
              Haz una donación
            </Link>
          </p>
        </div>

        <ul className="mb-16 grid gap-6 md:grid-cols-3">
          {ctaOptions.map(({ icon: Icon, title, description, link }) => (
            <li key={link}>
              <Link
                href={link}
                className="group flex h-full flex-col rounded-3xl border border-line bg-surface p-6 shadow-card transition-colors hover:border-jmv-blue/40 sm:p-8 dark:border-white/20 dark:bg-white/10 dark:hover:border-white/40 dark:hover:bg-white/15"
              >
                <span className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-jmv-gold text-jmv-ink">
                  <Icon className="h-7 w-7" aria-hidden />
                </span>
                <span className="text-2xl font-bold text-fg">{title}</span>
                <span className="mt-3 mb-6 leading-relaxed text-fg-soft">{description}</span>
                <span className="mt-auto inline-flex items-center font-semibold text-accent-gold">
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

        <figure className="rounded-3xl border border-line bg-surface p-8 text-center shadow-card dark:border-white/20 dark:bg-white/10 sm:p-12">
          <StarDivider className="mb-6" />
          <blockquote className="mx-auto max-w-4xl font-display text-2xl italic leading-snug text-fg md:text-3xl">
            “Si amas a Cristo, ayuda al pobre, porque en él encontrarás a Cristo”
          </blockquote>
          <figcaption className="mt-6 text-lg font-semibold text-fg-soft">
            — San Vicente de Paúl
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
