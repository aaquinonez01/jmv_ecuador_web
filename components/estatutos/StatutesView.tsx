import Link from "next/link";
import { ArrowRight, BadgeCheck, BookOpen, Download, TriangleAlert } from "lucide-react";
import HeroMedia, { type HeroMediaAction } from "@/components/media/HeroMedia";
import ReadMore from "@/components/media/ReadMore";
import type { SlotPhoto } from "@/lib/site-images";
import SigueExplorando from "@/components/sections/institucional/SigueExplorando";
import { allArticles, countLabel, parseStatutes } from "@/lib/estatutos";
import { formatDate } from "@/lib/format";
import type { StatuteVersion, StatuteVersionSummary } from "@/types/statutes";
import BackToTop from "./BackToTop";
import StatutesDownloads from "./StatutesDownloads";
import StatutesGlossary from "./StatutesGlossary";
import StatutesReader from "./StatutesReader";
import StatutesSummary from "./StatutesSummary";
import { MILESTONES, STATUTES_PATH, statuteVersionHref } from "./content";

// Vista completa de una versión de los estatutos (vigente o anterior).
export default function StatutesView({
  version,
  versions,
  heroImages,
}: {
  version: StatuteVersion;
  versions: StatuteVersionSummary[];
  /** Fotos del espacio "estatutos.hero" */
  heroImages: readonly SlotPhoto[];
}) {
  const doc = parseStatutes(version.content);
  const anchors = allArticles(doc).map((a) => a.id);
  const archived = !version.isCurrent;
  const basePath = archived ? statuteVersionHref(version.slug) : STATUTES_PATH;
  const approved = formatDate(version.approvedAt);

  const actions: HeroMediaAction[] = [{ label: "Leer los estatutos", href: "#texto", icon: BookOpen }];
  if (version.pdfUrl) {
    actions.push({ label: "Original en PDF", href: version.pdfUrl, icon: Download, external: true });
  }

  return (
    <>
      <HeroMedia
        images={heroImages}
        eyebrow={archived ? `Versión anterior · ${version.versionLabel}` : "Quiénes somos"}
        title="Estatutos Nacionales"
        lead="Las reglas que nos dimos para vivir juntos la fe, la formación y el servicio a los pobres."
        breadcrumbs={[
          { label: "Quiénes somos", href: "/quienes-somos" },
          archived ? { label: "Estatutos", href: STATUTES_PATH } : { label: "Estatutos" },
          ...(archived ? [{ label: version.versionLabel }] : []),
        ]}
        actions={actions}
      />

      {/* Lo que antes iba en la cabecera: resumen de la versión, aprobación e hitos.
          Como el resto de la página de lectura, es claro en ambos modos. */}
      <section aria-label="Sobre esta versión" className="border-b border-slate-200 bg-white py-8 sm:py-10">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start lg:gap-10 lg:px-8">
          <div className="flex flex-col gap-4">
            {version.summary ? (
              <ReadMore lines={3} buttonClassName="text-jmv-blue">
                <p className="text-lg leading-relaxed text-slate-700">{version.summary}</p>
              </ReadMore>
            ) : null}
            <div className="flex items-start gap-3 rounded-2xl border border-jmv-gold/50 bg-amber-50/60 p-4">
              <BadgeCheck className="mt-0.5 h-6 w-6 shrink-0 text-jmv-gold-ink" aria-hidden />
              <ReadMore lines={3} className="min-w-0 flex-1" buttonClassName="text-jmv-blue">
                <p className="text-sm leading-relaxed text-slate-700 sm:text-base">
                  <strong className="block font-semibold text-slate-900">Aprobados el {approved}</strong>
                  {version.approvedBy}
                </p>
              </ReadMore>
            </div>
          </div>
          <ul aria-label="Hitos de la Asociación" className="flex flex-wrap gap-2 lg:justify-end">
            {MILESTONES.map((m) => (
              <li key={m.year} className="rounded-full border border-slate-300 px-3 py-1.5 text-sm text-slate-700">
                {m.label} <strong className="font-semibold text-jmv-gold-ink">{m.year}</strong>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {archived ? (
        <div role="note" className="border-b border-amber-200 bg-amber-50">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
            <p className="flex items-start gap-2 font-semibold text-amber-950">
              <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
              Esta versión ya no está vigente. La conservamos para consulta.
            </p>
            <Link
              href={STATUTES_PATH}
              className="inline-flex min-h-11 items-center gap-1 font-semibold text-amber-950 underline underline-offset-4"
            >
              Ver los estatutos vigentes
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      ) : null}

      {!archived ? <StatutesSummary anchors={new Set(anchors)} /> : null}

      <section id="texto" aria-labelledby="estatutos-texto" className="scroll-mt-16 bg-white pb-20 pt-14 sm:scroll-mt-20 sm:pt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 max-w-3xl lg:ml-[19rem] xl:ml-[21rem]">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.14em] text-jmv-gold-ink">Texto completo</p>
            <h2 id="estatutos-texto" className="font-display text-3xl font-semibold text-slate-900 text-balance sm:text-4xl">
              {doc.title || version.title}
            </h2>
            <p className="mt-2 text-slate-600">
              Versión {version.versionLabel} · {countLabel(anchors.length, "artículo", "artículos")} en{" "}
              {countLabel(doc.chapters.length, "capítulo", "capítulos")}
            </p>
          </div>
          <StatutesReader doc={doc} basePath={basePath} shareTitle={`Estatutos de JMV Ecuador (${version.versionLabel})`} />
        </div>
      </section>

      <StatutesGlossary anchors={anchors} />
      <StatutesDownloads version={version} versions={versions} />
      <SigueExplorando items={["estructura", "historia", "unete"]} />
      <BackToTop targetId="page-hero-title" />
    </>
  );
}
