import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, CalendarDays, HandHeart, Heart, Users } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";
import { StarDivider } from "@/components/brand";
import SiteImage from "@/components/media/SiteImage";
import ReadMore from "@/components/media/ReadMore";
import { fetchSlotImages } from "@/lib/api/site-images.server";
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

// Invitación final del inicio: una foto de grupo (espacio "home.unete") con el
// título encima, un texto breve plegable y accesos directos compactos.
export default async function CTASection() {
  const [photo] = await fetchSlotImages("home.unete");
  const ctaOptions = getCtaOptions();

  return (
    <section aria-labelledby="cta-titulo" className="relative overflow-hidden bg-hero-plain py-12 sm:py-16 lg:py-20">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
          {/* Foto con el título encima: isla oscura en ambos modos */}
          <div
            data-tone="dark"
            className="relative isolate flex aspect-[4/5] max-h-[34rem] w-full flex-col justify-end overflow-hidden rounded-3xl bg-jmv-ink p-6 shadow-card-lg sm:aspect-[3/2] sm:p-8 lg:aspect-[4/5] lg:max-h-none"
          >
            {photo && (
              <SiteImage
                src={photo.src}
                alt={photo.alt}
                fill
                loading="lazy"
                sizes="(min-width: 1024px) 560px, 100vw"
                className="-z-20 object-cover"
                style={{ objectPosition: photo.position ?? "center" }}
              />
            )}
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 bg-gradient-to-t from-hero-veil via-hero-veil/60 via-35% to-hero-veil/0 to-70%"
            />
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.14em] text-jmv-gold-text">
              Tu llamado te espera
            </p>
            <h2
              id="cta-titulo"
              className="text-3xl font-bold leading-tight text-white text-balance [text-shadow:0_2px_12px_rgb(15_23_42/0.5)] sm:text-4xl"
            >
              ¿Estás listo para transformar vidas?
            </h2>
          </div>

          <div>
            <ReadMore lines={3}>
              <p className="text-lg leading-relaxed text-fg-soft sm:text-xl">
                En JMV Ecuador creemos que cada joven puede ser agente de cambio. Únete a nuestra misión de servir a
                los más necesitados y vivir el carisma vicenciano con alegría y esperanza.
              </p>
            </ReadMore>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/unete"
                className={buttonVariants({
                  variant: "primary",
                  size: "lg",
                  // Claro: azul JMV; oscuro: el botón blanco de siempre
                  className: "dark:bg-white dark:text-jmv-blue dark:shadow-lg dark:hover:bg-slate-100",
                })}
              >
                Únete ahora
                <ArrowRight className="ml-2 h-5 w-5" aria-hidden />
              </Link>
              <Link href="/contacto" className={buttonVariants({ variant: "outlineAuto", size: "lg" })}>
                Escríbenos
              </Link>
            </div>

            <ul className="mt-8 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
              {ctaOptions.map(({ icon: Icon, title, description, link }) => (
                <li key={link}>
                  <Link
                    href={link}
                    className="group flex min-h-16 items-center gap-4 px-4 py-3 transition-colors hover:bg-surface-2 sm:px-5"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-jmv-gold text-jmv-ink">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-bold text-fg">{title}</span>
                      <span className="block line-clamp-2 text-sm leading-snug text-fg-muted">{description}</span>
                    </span>
                    <ArrowRight
                      className="h-5 w-5 shrink-0 text-accent-gold transition-transform motion-safe:group-hover:translate-x-1"
                      aria-hidden
                    />
                  </Link>
                </li>
              ))}
            </ul>

            <p className="mt-5 text-base text-fg-soft">
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
        </div>

        <figure className="mx-auto mt-14 max-w-4xl text-center">
          <StarDivider className="mb-5" />
          <blockquote className="font-display text-xl italic leading-snug text-fg sm:text-2xl md:text-3xl">
            “Si amas a Cristo, ayuda al pobre, porque en él encontrarás a Cristo”
          </blockquote>
          <figcaption className="mt-4 font-semibold text-fg-soft">— San Vicente de Paúl</figcaption>
        </figure>
      </div>
    </section>
  );
}
