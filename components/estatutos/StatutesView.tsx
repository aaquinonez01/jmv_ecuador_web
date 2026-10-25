import Link from "next/link";
import { ArrowRight, BadgeCheck, BookOpen, Download, TriangleAlert } from "lucide-react";
import PageHero, { type PageHeroAction } from "@/components/ui/PageHero";
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
}: {
  version: StatuteVersion;
  versions: StatuteVersionSummary[];
}) {
  const doc = parseStatutes(version.content);
  const anchors = allArticles(doc).map((a) => a.id);
  const archived = !version.isCurrent;
  const basePath = archived ? statuteVersionHref(version.slug) : STATUTES_PATH;
  const approved = formatDate(version.approvedAt);

  const actions: PageHeroAction[] = [{ label: "Leer los estatutos", href: "#texto", icon: BookOpen }];
  if (version.pdfUrl) {
    actions.push({ label: "Original en PDF", href: version.pdfUrl, icon: Download, external: true });
  }

  return (
    <>
      <PageHero
        eyebrow={archived ? `Versión anterior · ${version.versionLabel}` : "Quiénes somos"}
        title="Estatutos Nacionales"
        description={
          version.summary ||
          "Las reglas que nos dimos para vivir juntos la fe, la formación y el servicio a los pobres. Léelas, búscalas por palabras y comparte el artículo que necesites."
        }
        motif="monogram"
        breadcrumbs={[
          { label: "Quiénes somos", href: "/quienes-somos" },
          archived ? { label: "Estatutos", href: STATUTES_PATH } : { label: "Estatutos" },
          ...(archived ? [{ label: version.versionLabel }] : []),
        ]}
        actions={actions}
      >
        <div className="mt-8 flex max-w-xl items-start gap-3 rounded-2xl border border-accent-gold/40 bg-surface p-4 shadow-card dark:bg-white/5 dark:backdrop-blur-sm">
          <BadgeCheck className="mt-0.5 h-6 w-6 shrink-0 text-accent-gold" aria-hidden />
          <p className="text-sm leading-relaxed text-fg-muted dark:text-slate-200 sm:text-base">
            <strong className="block font-semibold text-fg">
              Aprobados el {approved}
            </strong>
            {version.approvedBy}
          </p>
        </div>
        <ul aria-label="Hitos de la Asociación" className="mt-5 flex flex-wrap gap-2">
          {MILESTONES.map((m) => (
            <li key={m.year} className="rounded-full border border-line-strong bg-surface/60 px-3 py-1.5 text-sm text-fg-muted dark:bg-transparent dark:text-slate-200">
              {m.label} <strong className="font-semibold text-accent-gold">{m.year}</strong>
            </li>
          ))}
        </ul>
      </PageHero>

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
