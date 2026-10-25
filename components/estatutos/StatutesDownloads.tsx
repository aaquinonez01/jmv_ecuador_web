import Link from "next/link";
import { ArrowRight, BadgeCheck, FileDown, History } from "lucide-react";
import { formatDate } from "@/lib/format";
import type { StatuteVersion, StatuteVersionSummary } from "@/types/statutes";
import { STATUTES_PATH, statuteVersionHref } from "./content";

// Original firmado (PDF) y lista de versiones.
export default function StatutesDownloads({
  version,
  versions,
}: {
  version: StatuteVersion;
  versions: StatuteVersionSummary[];
}) {
  // Siempre aparece la versión que se está leyendo, aunque la lista venga vacía
  const list = versions.some((v) => v.id === version.id) ? versions : [version, ...versions];
  const others = list.filter((v) => v.id !== version.id);

  return (
    <section aria-labelledby="estatutos-descargas" className="bg-slate-50 py-16 sm:py-20">
      <div className="mx-auto grid max-w-5xl gap-6 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
        <h2 id="estatutos-descargas" className="sr-only">
          Descargas y versiones
        </h2>
        <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-jmv-gold/15 text-jmv-gold-ink">
            <FileDown className="h-6 w-6" aria-hidden />
          </span>
          <h3 className="font-display text-2xl font-semibold text-slate-900">El documento original</h3>
          {version.pdfUrl ? (
            <>
              <p className="mt-2 flex-1 leading-relaxed text-slate-700">
                Es el texto escaneado con el sello y la firma del Director General. Lo que lees en esta página es su transcripción fiel.
              </p>
              <a
                href={version.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex min-h-12 w-fit items-center gap-2 rounded-xl bg-jmv-blue px-5 font-semibold text-white shadow-jmv hover:bg-[#173f70]"
              >
                <FileDown className="h-5 w-5" aria-hidden />
                Descargar el original firmado (PDF)
                <span className="sr-only"> (se abre en una pestaña nueva)</span>
              </a>
            </>
          ) : (
            <p className="mt-2 flex-1 leading-relaxed text-slate-700">
              Muy pronto podrás descargar aquí el original firmado. Si lo necesitas antes, escríbenos desde{" "}
              <Link href="/contacto" className="font-semibold text-jmv-blue underline underline-offset-4">
                contacto
              </Link>
              .
            </p>
          )}
        </div>

        <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-jmv-blue/10 text-jmv-blue">
            <History className="h-6 w-6" aria-hidden />
          </span>
          <h3 className="font-display text-2xl font-semibold text-slate-900">Versiones</h3>
          <ul className="mt-3 divide-y divide-slate-100">
            {list.map((v) => {
              const reading = v.id === version.id;
              const href = v.isCurrent ? STATUTES_PATH : statuteVersionHref(v.slug);
              const content = (
                <>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-slate-900">Estatutos {v.versionLabel}</span>
                    <span className="block text-sm text-slate-600">Aprobados el {formatDate(v.approvedAt)}</span>
                  </span>
                  {v.isCurrent ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-900">
                      <BadgeCheck className="h-3.5 w-3.5" aria-hidden />
                      Vigente
                    </span>
                  ) : (
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">Anterior</span>
                  )}
                </>
              );
              return (
                <li key={v.id}>
                  {reading ? (
                    <div className="flex min-h-14 items-center gap-3 py-2" aria-current="page">
                      {content}
                    </div>
                  ) : (
                    <Link href={href} className="group flex min-h-14 items-center gap-3 rounded-lg py-2 hover:bg-slate-50">
                      {content}
                      <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-jmv-blue" aria-hidden />
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
          {others.length === 0 ? (
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Cuando la Asamblea Nacional apruebe una reforma y el Director General la confirme, la versión anterior quedará guardada aquí para consulta.
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
