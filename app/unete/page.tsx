import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, HandHeart, Heart, MapPin, MessageCircle, Smile, Sparkles, Users } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import { buttonVariants } from "@/components/ui/button-variants";
import { StarDivider } from "@/components/brand";
import ComunidadFinder from "@/components/sections/unete/ComunidadFinder";
import UneteForm from "@/components/sections/unete/UneteForm";
import { fetchComunidades } from "@/lib/api/comunidades.server";
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

const primerEncuentro = [
  {
    icon: Smile,
    title: "Te reciben con los brazos abiertos",
    text: "No necesitas experiencia, ni conocer a nadie, ni pertenecer ya a un grupo de la parroquia. Basta con tus ganas de conocer.",
  },
  {
    icon: Users,
    title: "Compartes con jóvenes como tú",
    text: "Los encuentros combinan oración, formación y momentos de amistad. Cada comunidad tiene su propio ritmo.",
  },
  {
    icon: HandHeart,
    title: "Descubres el servicio",
    text: "Con el tiempo te invitarán a servir junto a los más pobres, siempre acompañado y sin presiones.",
  },
  {
    icon: MessageCircle,
    title: "Día, hora y lugar los confirma tu comunidad",
    text: "Cuando escribas, la comunidad te dirá cuándo y dónde se reúne. Puedes ir con un amigo o amiga.",
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

export default function UnetePage() {
  return (
    <>
      <PageHero
        eyebrow="Únete a JMV"
        title="Hay un lugar para ti en JMV"
        motto="Jóvenes que viven la fe, la amistad y el servicio"
        description={`Si tienes entre 15 y 30 años, en ${SITE.name} encuentras una comunidad para crecer en la fe y servir a los más pobres. Busca el grupo más cercano y escríbele: te acompañamos desde el primer encuentro.`}
        breadcrumbs={[{ label: "Únete" }]}
        image={{ src: "/images/gallery/encuentro_nacional_2025.jpg", position: "center 35%" }}
        motif="hearts"
        actions={[
          { label: "Encuentra tu grupo", href: "#encuentra", icon: MapPin },
          { label: "Escríbenos por WhatsApp", href: WHATSAPP_UNETE, icon: MessageCircle, external: true },
        ]}
      />

      {/* 1. Buscador de comunidades */}
      <section
        id="encuentra"
        aria-labelledby="encuentra-titulo"
        className="scroll-mt-24 bg-page py-16 sm:py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            id="encuentra-titulo"
            eyebrow="Paso 1"
            title="Encuentra tu comunidad"
            description="Elige tu ciudad o usa tu ubicación y escríbele directamente por WhatsApp. Si no hay un grupo cerca, escríbenos igual: te ayudamos a encontrar uno."
          />
          <Suspense fallback={<FinderSkeleton />}>
            <ComunidadFinderServer />
          </Suspense>
        </div>
      </section>

      {/* 2. Pasos */}
      <section aria-labelledby="pasos-titulo" className="bg-section py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading id="pasos-titulo" eyebrow="Cómo unirte" title="Cuatro pasos sencillos" />
          <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PASOS_UNETE.map((paso) => {
              const Icon = paso.icon;
              return (
                <li key={paso.numero} className="rounded-2xl border border-line bg-surface shadow-card dark:border-white/15 dark:bg-white/[0.07] p-6 text-fg">
                  <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-jmv-gold text-xl font-bold text-jmv-ink">
                      {paso.numero}
                    </span>
                    <Icon className="h-6 w-6 text-accent-gold" aria-hidden />
                  </div>
                  <h3 className="mt-4 text-xl font-semibold">{paso.titulo}</h3>
                  <p className="mt-2 text-fg-muted">{paso.descripcion}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* 3. Primer encuentro */}
      <section aria-labelledby="primer-encuentro-titulo" className="bg-slate-50 py-16 sm:py-20" data-surface="light">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            id="primer-encuentro-titulo"
            tone="light"
            eyebrow="Tu primer encuentro"
            title="Qué esperar la primera vez"
            description="Dar el primer paso cuesta menos cuando sabes lo que viene."
          />
          <div className="grid gap-6 md:grid-cols-2">
            {primerEncuentro.map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex gap-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-jmv-blue/10 text-jmv-blue">
                  <Icon className="h-6 w-6" aria-hidden />
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
                  <p className="mt-1 text-slate-700">{text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl bg-jmv-blue p-6 text-white sm:p-8">
              <h3 className="flex items-center gap-2 text-xl font-semibold">
                <Heart className="h-6 w-6 text-jmv-gold-text" aria-hidden />
                Si eres mamá, papá o representante
              </h3>
              <p className="mt-3 text-slate-100">
                JMV es una asociación católica de la Familia Vicenciana. Las comunidades cuentan con
                asesores que acompañan a los jóvenes. Puedes escribirnos para conocer a la comunidad
                antes y resolver todas tus dudas.
              </p>
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

            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
              <h3 className="flex items-center gap-2 text-xl font-semibold text-slate-900">
                <Sparkles className="h-6 w-6 text-jmv-gold-ink" aria-hidden />
                Lo que encontrarás en JMV
              </h3>
              <ul className="mt-4 space-y-3">
                {BENEFICIOS_JMV.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-slate-700">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-jmv-gold-ink" aria-hidden />
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
        className="scroll-mt-24 bg-page py-16 sm:py-20"
      >
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1.3fr] lg:px-8">
          <div className="text-fg">
            <SectionHeading
              id="formulario-unete-titulo"
              align="left"
              eyebrow="¿Prefieres que te escribamos?"
              title="Déjanos tus datos"
              description="Si no sabes a qué comunidad escribir, completa el formulario y alguien del equipo nacional te contactará por WhatsApp."
            />
            <p className="text-fg-muted">También puedes escribirnos directamente:</p>
            <ul className="mt-3 space-y-2">
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
      <section aria-labelledby="cta-unete-titulo" className="bg-[linear-gradient(135deg,var(--section-blue)_0%,var(--page-deep)_100%)] py-16 sm:py-20 dark:bg-[linear-gradient(135deg,rgba(15,23,42,0.94)_0%,rgba(29,78,138,0.88)_55%,rgba(122,31,30,0.82)_100%)]">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-surface px-6 py-12 text-fg shadow-card-lg ring-1 ring-line sm:px-12 dark:bg-jmv-ink/80 dark:shadow-none dark:ring-0">
            <StarDivider className="mx-auto mb-6 text-accent-gold" />
            <h2 id="cta-unete-titulo" className="text-3xl font-bold sm:text-4xl">
              Es hora de dar el paso
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-fg-muted">
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
            <p className="mt-6 text-fg-muted">
              ¿Quieres acompañar la misión de otra forma?{" "}
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
