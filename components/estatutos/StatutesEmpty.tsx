import Link from "next/link";
import { Mail, ScrollText } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import { buttonVariants } from "@/components/ui/button-variants";
import { SITE, mailtoHref } from "@/lib/site";

// Sin versión vigente publicada (o el backend no respondió durante el build).
export default function StatutesEmpty() {
  return (
    <>
      <PageHero
        eyebrow="Quiénes somos"
        title="Estatutos Nacionales"
        description="Las reglas que nos dimos para vivir juntos la fe, la formación y el servicio a los pobres."
        motif="monogram"
        breadcrumbs={[{ label: "Quiénes somos", href: "/quienes-somos" }, { label: "Estatutos" }]}
      />
      <section className="bg-white py-20">
        <div className="mx-auto max-w-xl px-4 text-center sm:px-6">
          <span className="mx-auto mb-5 inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-jmv-gold/15 text-jmv-gold-ink">
            <ScrollText className="h-8 w-8" aria-hidden />
          </span>
          <h2 className="font-display text-3xl font-semibold text-slate-900">Estamos preparando la versión digital</h2>
          <p className="mt-3 text-lg leading-relaxed text-slate-600">
            Pronto podrás leer aquí nuestros estatutos completos. Mientras tanto, si necesitas una copia, escríbenos y te la
            enviamos.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a href={mailtoHref} className={buttonVariants({ variant: "primary" })}>
              <Mail className="mr-2 h-5 w-5" aria-hidden />
              {SITE.email}
            </a>
            <Link href="/quienes-somos" className={buttonVariants({ variant: "outline" })}>
              Volver a Quiénes somos
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
