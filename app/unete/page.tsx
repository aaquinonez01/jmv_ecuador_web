import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, HandHeart, Heart, MapPin, MessageCircle, Smile, Sparkles, Users } from "lucide-react";
import HeroMedia from "@/components/media/HeroMedia";
import PhotoCard from "@/components/media/PhotoCard";
import ReadMore from "@/components/media/ReadMore";
import SectionHeading from "@/components/ui/SectionHeading";
import { buttonVariants } from "@/components/ui/button-variants";
import { StarDivider } from "@/components/brand";
import ComunidadFinder from "@/components/sections/unete/ComunidadFinder";
import UneteForm from "@/components/sections/unete/UneteForm";
import { fetchComunidades } from "@/lib/api/comunidades.server";
import { fetchSlots } from "@/lib/api/site-images.server";
import { BENEFICIOS_JMV, PASOS_UNETE } from "@/lib/data/unete";
import { SITE, mailtoHref } from "@/lib/site";
import { whatsappLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Únete",
  description:
    "Encuentra la comunidad JMV más cercana a ti, escríbele por WhatsApp y vive tu primer encuentro. Jóvenes de 15 a 30 años que viven la fe y el servicio en todo Ecuador.",
  keywords:
    "unirse JMV, comunidades vicencianas, jóvenes católicos Ecuador, grupo juvenil, Juventudes Marianas Vicencianas",
  alternates: { canonical: "/unete" },
};

// ISR: ver app/page.tsx.
export const revalidate = 3600;

const WHATSAPP_UNETE = whatsappLink("Hola, vi la web de JMV y quiero unirme a una comunidad.");

// Textos breves (caben en dos líneas sobre la foto). Las tres tarjetas llevan las
// fotos del espacio "unete.primer-encuentro"; la nota práctica va aparte.
const primerEncuentro = [
  {
    icon: Smile,
    title: "Te reciben con los brazos abiertos",
    text: "Sin experiencia ni conocer a nadie: basta con tus ganas.",
  },
  {
    icon: Users,
    title: "Compartes con jóvenes como tú",
    text: "Oración, formación y amistad, al ritmo de cada comunidad.",
  },
  {
    icon: HandHeart,
    title: "Descubres el servicio",
    text: "Sirves junto a los más pobres, acompañado y sin presiones.",
  },
];

function FinderSkeleton() {
  return (
    <div aria-hidden="true">
      <div className="h-24 animate-pulse rounded-2xl bg-fg/10 motion-reduce:animate-none" />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-56 animate-pulse rounded-2xl bg-fg/10 motion-reduce:animate-none" />
        ))}
      </div>
    </div>
  );
}

async function ComunidadFinderServer() {
  const comunidades = await fetchComunidades();
  return <ComunidadFinder initial={comunidades} />;
}

export default async function UnetePage() {
  const photos = await fetchSlots(["unete.hero", "unete.primer-encuentro"] as const);
  const encuentroFotos = photos["unete.primer-encuentro"];

  return (
    <>
      <HeroMedia
        images={photos["unete.hero"]}
        eyebrow="Únete a JMV"
        title="Hay un lugar para ti en JMV"
        lead="Jóvenes que viven la fe, la amistad y el servicio"
        breadcrumbs={[{ label: "Únete" }]}
        carouselLabel="Fotos de jóvenes de JMV"
        actions={[
          { label: "Encuentra tu grupo", href: "#encuentra", icon: MapPin },
          { label: "Escríbenos por WhatsApp", href: WHATSAPP_UNETE, icon: MessageCircle, external: true },
        ]}
      />

      {/* 1. Buscador de comunidades */}
      <section
        id="encuentra"
        aria-labelledby="encuentra-titulo"
        className="scroll-mt-24 bg-page py-14 sm:py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            id="encuentra-titulo"
            eyebrow="Paso 1"
            title="Encuentra tu comunidad"
            description="Si tienes entre 15 y 30 años, elige tu ciudad o usa tu ubicación y escríbele por WhatsApp."
            className="mb-8 sm:mb-10"
          />
          <Suspense fallback={<FinderSkeleton />}>
            <ComunidadFinderServer />
          </Suspense>
        </div>
      </section>

      {/* 2. Tu primer encuentro: fotos con textos cortos */}
      <section aria-labelledby="primer-encuentro-titulo" className="bg-page-deep py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            id="primer-encuentro-titulo"
            eyebrow="Tu primer encuentro"
            title="Qué esperar la primera vez"
            description="Dar el primer paso cuesta menos cuando sabes lo que viene."
            className="mb-8 sm:mb-10"
          />
          {/* Móvil: franja deslizable; desde md, tres columnas */}
          <ul
            aria-label="Cómo es el primer encuentro"
            className="scrollbar-hide -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto overscroll-x-contain px-4 pb-1 sm:-mx-6 sm:scroll-px-6 sm:px-6 md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0"
          >
            {primerEncuentro.map((item, i) => {
              const image = encuentroFotos[i % Math.max(encuentroFotos.length, 1)];
              return (
                <li key={item.title} className="w-[84%] shrink-0 snap-start sm:w-[45%] md:w-auto">
                  {image ? (
                    <PhotoCard
                      variant="overlay"
                      image={image}
                      icon={item.icon}
                      title={item.title}
                      text={item.text}
                      sizes="(min-width: 768px) 33vw, 84vw"
                      className="h-full"
                    />
                  ) : (
                    <div className="surface-card h-full rounded-2xl p-5">
                      <item.icon className="h-8 w-8 text-accent-gold" aria-hidden />
                      <h3 className="mt-3 text-lg font-bold text-fg">{item.title}</h3>
                      <p className="mt-1 text-sm text-fg-muted">{item.text}</p>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="surface-card mt-6 flex items-start gap-4 rounded-2xl p-5">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-jmv-gold text-jmv-ink">
              <MessageCircle className="h-6 w-6" aria-hidden />
            </span>
            <div>
              <h3 className="font-semibold text-fg">Día, hora y lugar los confirma tu comunidad</h3>
              <p className="mt-1 text-sm text-fg-muted">
                Cuando escribas, te dirán cuándo y dónde se reúnen. Puedes ir con un amigo o amiga.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Pasos: tarjetas con icono grande y una línea */}
      <section aria-labelledby="pasos-titulo" className="bg-section py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading id="pasos-titulo" eyebrow="Cómo unirte" title="Cuatro pasos sencillos" className="mb-8 sm:mb-10" />
          <ol className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
            {PASOS_UNETE.map((paso) => {
              const Icon = paso.icon;
              return (
                <li key={paso.numero} className="surface-card relative rounded-2xl p-4 text-fg sm:p-6">
                  <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-jmv-blue text-white sm:h-16 sm:w-16">
                    <Icon className="h-7 w-7 sm:h-8 sm:w-8" aria-hidden />
                    <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-jmv-gold text-sm font-bold text-jmv-ink ring-2 ring-[var(--page)]">
                      <span className="sr-only">Paso </span>
                      {paso.numero}
                    </span>
                  </span>
                  <h3 className="mt-4 text-base font-semibold leading-tight sm:text-xl">{paso.titulo}</h3>
                  <p className="mt-1.5 text-sm leading-snug text-fg-muted sm:text-base">{paso.descripcion}</p>
                </li>
              );
            })}
          </ol>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl bg-jmv-blue p-6 text-white sm:p-8" data-tone="dark">
              <h3 className="flex items-center gap-2 text-xl font-semibold">
                <Heart className="h-6 w-6 shrink-0 text-jmv-gold-text" aria-hidden />
                Si eres mamá, papá o representante
              </h3>
              <ReadMore lines={3} className="mt-3" buttonClassName="text-jmv-gold-text">
                <p className="text-slate-100">
                  JMV es una asociación católica de la Familia Vicenciana. Las comunidades cuentan con
                  asesores que acompañan a los jóvenes. Puedes escribirnos para conocer a la comunidad
                  antes y resolver todas tus dudas.
                </p>
              </ReadMore>
              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href={whatsappLink("Hola, soy madre/padre de familia y quiero información sobre JMV para mi hijo o hija.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonVariants({ variant: "gold", size: "md" })}
                >
                  Hablar con el equipo
                  <span className="sr-only"> por WhatsApp (se abre en una pestaña nueva)</span>
                </a>
                <Link href="/quienes-somos" className={buttonVariants({ variant: "outlineLight", size: "md" })}>
                  Conoce quiénes somos
                </Link>
              </div>
            </div>

            <div className="surface-card rounded-2xl p-6 sm:p-8">
              <h3 className="flex items-center gap-2 text-xl font-semibold text-fg">
                <Sparkles className="h-6 w-6 text-accent-gold" aria-hidden />
                Lo que encontrarás en JMV
              </h3>
              <ul className="mt-4 space-y-3">
                {BENEFICIOS_JMV.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-fg-muted">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent-gold" aria-hidden />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Formulario */}
      <section
        id="quiero-unirme"
        aria-labelledby="formulario-unete-titulo"
        className="scroll-mt-24 bg-page py-14 sm:py-20"
      >
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_1.3fr] lg:gap-10 lg:px-8">
          <div className="text-fg">
            <SectionHeading
              id="formulario-unete-titulo"
              align="left"
              eyebrow="¿Prefieres que te escribamos?"
              title="Déjanos tus datos"
              description="Alguien del equipo nacional te contactará por WhatsApp."
              className="mb-6 sm:mb-8"
            />
            <p className="text-fg-soft">También puedes escribirnos directamente:</p>
            <ul className="mt-1 flex flex-wrap gap-x-6 gap-y-1">
              <li>
                <a
                  href={WHATSAPP_UNETE}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 font-semibold text-accent-gold underline underline-offset-4 hover:text-fg"
                >
                  <MessageCircle className="h-5 w-5" aria-hidden />
                  WhatsApp {SITE.phone}
                  <span className="sr-only"> (se abre en una pestaña nueva)</span>
                </a>
              </li>
              <li>
                <a
                  href={mailtoHref}
                  className="inline-flex min-h-11 items-center gap-2 break-all font-semibold text-accent-gold underline underline-offset-4 hover:text-fg"
                >
                  {SITE.email}
                </a>
              </li>
            </ul>
          </div>
          <UneteForm />
        </div>
      </section>

      {/* 5. CTA final */}
      <section aria-labelledby="cta-unete-titulo" className="bg-[linear-gradient(135deg,var(--section-blue)_0%,var(--page-deep)_100%)] py-14 sm:py-20 dark:bg-[linear-gradient(135deg,rgba(15,23,42,0.94)_0%,rgba(29,78,138,0.88)_55%,rgba(122,31,30,0.82)_100%)]">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-surface px-6 py-10 text-fg shadow-card-lg ring-1 ring-line sm:px-12 sm:py-12 dark:bg-jmv-ink/80 dark:shadow-none dark:ring-0">
            <StarDivider className="mx-auto mb-6 text-accent-gold" />
            <h2 id="cta-unete-titulo" className="text-3xl font-bold sm:text-4xl">
              Es hora de dar el paso
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-fg-muted dark:text-slate-100">
              El mundo necesita tu corazón generoso y tu compromiso con quienes más sufren. Tu
              comunidad te está esperando.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
              <Link href="#encuentra" className={buttonVariants({ variant: "gold", size: "lg" })}>
                <MapPin className="mr-2 h-5 w-5" aria-hidden />
                Encuentra tu grupo
              </Link>
              <a
                href={WHATSAPP_UNETE}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ variant: "outlineAuto", size: "lg" })}
              >
                <MessageCircle className="mr-2 h-5 w-5" aria-hidden />
                Escríbenos por WhatsApp
                <span className="sr-only"> (se abre en una pestaña nueva)</span>
              </a>
            </div>
            <p className="mt-6 text-fg-soft">
              <Link
                href="/donar"
                className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-accent-gold underline underline-offset-4 hover:text-fg"
              >
                <HandHeart className="h-5 w-5" aria-hidden />
                También puedes apoyar con una donación
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
