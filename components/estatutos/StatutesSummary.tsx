import Link from "next/link";
import { ArrowRight, Compass, Heart, Network, ShieldCheck, Target, type LucideIcon } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { articleAnchor } from "@/lib/estatutos";
import { SUMMARY_CARDS, type SummaryCard } from "./content";

const ICONS: Record<SummaryCard["icon"], LucideIcon> = {
  heart: Heart,
  target: Target,
  compass: Compass,
  network: Network,
  shield: ShieldCheck,
};

// "Nuestros estatutos en 2 minutos": resumen juvenil con enlaces a cada artículo.
export default function StatutesSummary({ anchors }: { anchors: Set<string> }) {
  return (
    <section aria-labelledby="estatutos-resumen" className="bg-slate-50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="estatutos-resumen"
          tone="light"
          eyebrow="Para leer rápido"
          title="Nuestros estatutos en 2 minutos"
          description="Lo esencial, en palabras sencillas. Cada tarjeta te lleva al artículo original."
        />
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SUMMARY_CARDS.map((card) => {
            const Icon = ICONS[card.icon];
            const refs = card.refs.filter((r) => anchors.has(articleAnchor(r.article)));
            return (
              <li key={card.key} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-jmv-blue/10 text-jmv-blue">
                  <Icon className="h-6 w-6" aria-hidden />
                </span>
                <h3 className="font-display text-2xl font-semibold text-slate-900">{card.title}</h3>
                <p className="mt-2 flex-1 leading-relaxed text-slate-700">{card.text}</p>
                {refs.length || card.extra ? (
                  <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1">
                    {refs.map((ref) => (
                      <a
                        key={ref.article}
                        href={`#${articleAnchor(ref.article)}`}
                        className="inline-flex min-h-11 items-center gap-1 rounded text-sm font-semibold text-jmv-blue underline-offset-4 hover:underline"
                      >
                        Leer {ref.label.toLowerCase()}
                      </a>
                    ))}
                    {card.extra ? (
                      <Link
                        href={card.extra.href}
                        className="inline-flex min-h-11 items-center gap-1 rounded text-sm font-semibold text-jmv-gold-ink underline-offset-4 hover:underline"
                      >
                        {card.extra.label}
                        <ArrowRight className="h-4 w-4" aria-hidden />
                      </Link>
                    ) : null}
                  </div>
                ) : null}
              </li>
            );
          })}
          <li className="flex flex-col justify-center rounded-2xl bg-jmv-ink p-6 text-white">
            <p className="font-display text-2xl font-semibold leading-snug">¿Quieres el detalle?</p>
            <p className="mt-2 text-slate-300">Abajo está el texto completo: búscalo por palabras, salta por capítulos y comparte cualquier artículo.</p>
            <a
              href="#texto"
              className="mt-5 inline-flex min-h-11 w-fit items-center gap-2 rounded-xl bg-jmv-gold px-5 font-semibold text-jmv-ink hover:bg-jmv-gold-text"
            >
              Ir al texto completo
              <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}
