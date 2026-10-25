import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import HistoriaTimeline from "@/components/sections/HistoriaTimeline";
import SigueExplorando from "@/components/sections/institucional/SigueExplorando";
import { SITE, yearsSinceFoundation } from "@/lib/site";

// ISR: ver app/page.tsx.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Nuestra historia",
  description:
    "De las apariciones de la Medalla Milagrosa en la rue du Bac (París, 1830) a la fundación de JMV Ecuador en Quito en 1995: los hitos de nuestra historia.",
  alternates: { canonical: "/quienes-somos/historia" },
};

export default function HistoriaPage() {
  const anios = yearsSinceFoundation();
  return (
    <>
      <PageHero
        eyebrow="Nuestro legado"
        title="Historia de JMV Ecuador"
        motto={`${anios} años sembrando esperanza en el corazón del Ecuador.`}
        description={`Desde las apariciones de la Medalla Milagrosa a Santa Catalina Labouré en París (1830) hasta la fundación de JMV Ecuador en ${SITE.foundedYear} con Sor Noemí Miño, conoce los hitos que han marcado nuestro caminar.`}
        image={{ src: "/images/historia/jmv-fundacion.jpg", position: "center top" }}
        motif="monogram"
        breadcrumbs={[
          { label: "Quiénes somos", href: "/quienes-somos" },
          { label: "Historia" },
        ]}
        actions={[{ label: "Comenzar el recorrido", href: "#historia", icon: Clock }]}
      />
      <HistoriaTimeline />

      <section aria-labelledby="voces-titulo" className="bg-page pt-14 sm:pt-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-line bg-surface p-6 text-center shadow-card sm:p-8 dark:border-white/15 dark:bg-white/5">
            <h2 id="voces-titulo" className="text-2xl font-bold text-fg">
              La historia la siguen escribiendo los jóvenes
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-fg-muted">
              Lee los testimonios de quienes hoy viven JMV en sus comunidades.
            </p>
            <Link
              href="/quienes-somos#testimonios-titulo"
              className="mt-4 inline-flex min-h-11 items-center gap-2 font-semibold text-accent-gold underline underline-offset-4 hover:text-fg"
            >
              Ver testimonios
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      <SigueExplorando items={["pilares", "mundo", "estructura", "unete"]} />
    </>
  );
}
