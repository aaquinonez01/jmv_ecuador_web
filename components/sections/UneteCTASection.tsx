import Link from "next/link";
import { ArrowRight, CheckCircle2, Heart, Mail, MapPin, MessageCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";
import SectionHeading from "@/components/ui/SectionHeading";
import { BENEFICIOS_JMV, PASOS_UNETE } from "@/lib/data/unete";
import { SITE, mailtoHref } from "@/lib/site";
import { whatsappLink } from "@/lib/whatsapp";

// Invitación a unirse al final de Quiénes somos. Pasos y beneficios salen de
// lib/data/unete.ts (los mismos que en /unete).
export default function UneteCTASection() {
  return (
    <section
      aria-labelledby="unete-cta-titulo"
      className="relative overflow-hidden bg-gradient-to-br from-jmv-ink via-[#163a68] to-jmv-blue py-16 sm:py-20"
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="unete-cta-titulo"
          eyebrow="Tu momento es ahora"
          title="Únete a nuestra familia"
          description="Forma parte de una comunidad de jóvenes que viven la fe y sirven a los más pobres. En JMV encontrarás propósito, amistad y la oportunidad de hacer la diferencia."
        />

        <h3 className="mb-8 text-center text-2xl font-bold text-white">¿Cómo unirte?</h3>
        <ol className="mb-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PASOS_UNETE.map((paso) => (
            <li key={paso.numero} className="text-center">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-jmv-gold text-2xl font-bold text-jmv-ink">
                {paso.numero}
              </span>
              <h4 className="mt-4 text-xl font-bold text-white">{paso.titulo}</h4>
              <p className="mt-2 text-slate-200">{paso.descripcion}</p>
            </li>
          ))}
        </ol>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/20 bg-white/10 p-6 sm:p-8">
            <h3 className="text-2xl font-bold text-white">
              Lo que <span className="text-jmv-gold-text">encontrarás</span>
            </h3>
            <ul className="mt-6 space-y-4">
              {BENEFICIOS_JMV.map((beneficio) => (
                <li key={beneficio} className="flex items-start gap-3 text-slate-100">
                  <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-jmv-gold-text" aria-hidden />
                  {beneficio}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-white/20 bg-white/10 p-6 sm:p-8">
            <h3 className="text-2xl font-bold text-white">
              <span className="text-jmv-gold-text">Contáctanos</span> hoy
            </h3>

            <ul className="mt-6 space-y-4">
              <li className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-4">
                <MapPin className="h-6 w-6 shrink-0 text-jmv-gold-text" aria-hidden />
                <div>
                  <p className="font-medium text-white">Sede nacional</p>
                  <p className="text-sm text-slate-200">Quito – La Recoleta</p>
                </div>
              </li>
              <li>
                <a
                  href={mailtoHref}
                  className="flex min-h-11 items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10"
                >
                  <Mail className="h-6 w-6 shrink-0 text-jmv-gold-text" aria-hidden />
                  <span>
                    <span className="block font-medium text-white">Correo nacional</span>
                    <span className="block break-all text-sm text-slate-200">{SITE.email}</span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={whatsappLink("Hola, vi la web de JMV y quiero unirme a una comunidad.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-11 items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10"
                >
                  <MessageCircle className="h-6 w-6 shrink-0 text-jmv-gold-text" aria-hidden />
                  <span>
                    <span className="block font-medium text-white">WhatsApp</span>
                    <span className="block text-sm text-slate-200">{SITE.phone}</span>
                  </span>
                  <span className="sr-only"> (se abre en una pestaña nueva)</span>
                </a>
              </li>
            </ul>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href="/unete" className={buttonVariants({ variant: "gold", size: "lg" })}>
                Quiero unirme
                <Heart className="ml-2 h-5 w-5" aria-hidden />
              </Link>
              <Link
                href="/actividades#proximas"
                className={buttonVariants({ variant: "outlineLight", size: "lg" })}
              >
                Ver próximas actividades
                <ArrowRight className="ml-2 h-5 w-5" aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
