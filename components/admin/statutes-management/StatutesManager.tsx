"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  BadgeCheck,
  Copy,
  ExternalLink,
  EyeOff,
  FileText,
  Lightbulb,
  Pencil,
  Plus,
  ScrollText,
  Trash2,
} from "lucide-react";
import {
  deleteStatuteVersionAPI,
  getStatuteVersionsAPI,
  makeCurrentStatuteVersionAPI,
  statutesErrorMessage,
  updateStatuteVersionAPI,
} from "@/actions/statutes";
import Button from "@/components/admin/ui/Button";
import ConfirmDialog from "@/components/admin/ui/ConfirmDialog";
import PageHeader from "@/components/admin/layout/PageHeader";
import { useToast } from "@/lib/hooks/useToast";
import { allArticles, countLabel, parseStatutes } from "@/lib/estatutos";
import { formatDate } from "@/lib/format";
import { STATUTES_PATH, statuteVersionHref } from "@/components/estatutos/content";
import type { StatuteVersion } from "@/types/statutes";

const linkButton =
  "inline-flex min-h-11 items-center justify-center gap-1.5 rounded-md px-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jmv-blue/40 sm:min-h-9";

export default function StatutesManager() {
  const toast = useToast();
  const [items, setItems] = useState<StatuteVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [toDelete, setToDelete] = useState<StatuteVersion | null>(null);
  const [toPromote, setToPromote] = useState<StatuteVersion | null>(null);
  const [busy, setBusy] = useState(false);

  const loadAll = async () => {
    try {
      setLoading(true);
      const data = await getStatuteVersionsAPI();
      setItems(data.items ?? []);
      setLoadError(false);
    } catch {
      setLoadError(true);
      toast.error("No se pudieron cargar las versiones de los estatutos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const current = items.find((i) => i.isCurrent) ?? null;
  const others = useMemo(
    () => items.filter((i) => !i.isCurrent).sort((a, b) => b.approvedAt.localeCompare(a.approvedAt)),
    [items]
  );

  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      setBusy(true);
      await deleteStatuteVersionAPI(toDelete.id);
      toast.success(`Se eliminó la versión ${toDelete.versionLabel}.`);
      setToDelete(null);
      await loadAll();
    } catch (error) {
      toast.error(statutesErrorMessage(error, "No se pudo eliminar la versión."));
    } finally {
      setBusy(false);
    }
  };

  const confirmPromote = async () => {
    if (!toPromote) return;
    try {
      setBusy(true);
      // La página pública solo lee versiones publicadas: una vigente oculta dejaría la página vacía
      if (!toPromote.published) await updateStatuteVersionAPI(toPromote.id, { published: true });
      await makeCurrentStatuteVersionAPI(toPromote.id);
      toast.success(`Los estatutos ${toPromote.versionLabel} ya son los vigentes.`);
      setToPromote(null);
      await loadAll();
    } catch (error) {
      toast.error(statutesErrorMessage(error, "No se pudo marcar como vigente."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Estatutos"
        description="Versiones de los Estatutos Nacionales que se muestran en /quienes-somos/estatutos."
        icon={<ScrollText className="h-[18px] w-[18px]" strokeWidth={2.1} />}
        breadcrumbs={[{ label: "Contenido" }, { label: "Estatutos" }]}
        actions={
          <Link href="/admin/estatutos/nueva" className={`${linkButton} bg-jmv-blue text-white shadow-sm hover:bg-jmv-blue-dark`}>
            <Plus className="h-4 w-4" strokeWidth={2.5} aria-hidden />
            Nueva versión
          </Link>
        }
      />

      <div className="flex flex-1 flex-col gap-6 overflow-auto px-4 py-5 sm:px-6">
        <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
          <Lightbulb className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
          <p>
            <strong>¿Preparando la reforma?</strong> Duplica la versión vigente, edita la copia sin publicarla y, cuando el
            Director General la apruebe, pulsa «Marcar como vigente». La versión anterior queda guardada para consulta.
          </p>
        </div>

        {loading ? (
          <div className="space-y-3" aria-hidden>
            <div className="h-40 animate-pulse rounded-2xl bg-slate-100" />
            <div className="h-20 animate-pulse rounded-xl bg-slate-100" />
          </div>
        ) : loadError ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-600">
            No se pudieron cargar las versiones.
            <Button variant="outline" onClick={() => void loadAll()}>
              Reintentar
            </Button>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-600">
            Todavía no hay estatutos cargados. Crea la primera versión y márcala como vigente.
            <Link href="/admin/estatutos/nueva" className={`${linkButton} bg-jmv-blue text-white hover:bg-jmv-blue-dark`}>
              <Plus className="h-4 w-4" aria-hidden />
              Nueva versión
            </Link>
          </div>
        ) : (
          <>
            <section aria-labelledby="estatutos-vigente">
              <h2 id="estatutos-vigente" className="mb-2 text-[15px] font-bold text-slate-900">
                Versión vigente
              </h2>
              {current ? (
                <VersionCard item={current} highlighted onPromote={() => setToPromote(current)} onDelete={() => setToDelete(current)} />
              ) : (
                <p className="rounded-xl border border-dashed border-red-300 bg-red-50 p-4 text-sm font-medium text-red-900">
                  Ninguna versión está marcada como vigente: la página pública muestra un aviso de «en preparación». Marca una
                  abajo.
                </p>
              )}
            </section>

            {others.length ? (
              <section aria-labelledby="estatutos-otras">
                <h2 id="estatutos-otras" className="mb-2 text-[15px] font-bold text-slate-900">
                  Borradores y versiones anteriores
                  <span className="ml-2 text-xs font-medium text-slate-500">{others.length}</span>
                </h2>
                <ul className="space-y-2">
                  {others.map((item) => (
                    <li key={item.id}>
                      <VersionCard item={item} onPromote={() => setToPromote(item)} onDelete={() => setToDelete(item)} />
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </>
        )}
      </div>

      <ConfirmDialog
        isOpen={Boolean(toPromote)}
        onClose={() => setToPromote(null)}
        onConfirm={() => void confirmPromote()}
        title="¿Marcar como vigente?"
        message={
          toPromote
            ? `Los estatutos ${toPromote.versionLabel} pasarán a ser los oficiales en el sitio${current ? ` y los ${current.versionLabel} quedarán como versión anterior` : ""}. Si la versión no está publicada, se publicará.`
            : ""
        }
        confirmText="Sí, marcar como vigente"
        isLoading={busy}
      />
      <ConfirmDialog
        isOpen={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        onConfirm={() => void confirmDelete()}
        title="¿Eliminar esta versión?"
        message={
          toDelete
            ? `La versión ${toDelete.versionLabel} («${toDelete.title}») se borrará para siempre. Si solo quieres esconderla, desmarca «Publicada» al editarla.`
            : ""
        }
        confirmText="Sí, eliminar"
        variant="danger"
        isLoading={busy}
      />
    </>
  );
}

function VersionCard({
  item,
  highlighted,
  onPromote,
  onDelete,
}: {
  item: StatuteVersion;
  highlighted?: boolean;
  onPromote: () => void;
  onDelete: () => void;
}) {
  const stats = useMemo(() => {
    const doc = parseStatutes(item.content ?? "");
    return { chapters: doc.chapters.length, articles: allArticles(doc).length };
  }, [item.content]);
  const publicHref = item.isCurrent ? STATUTES_PATH : statuteVersionHref(item.slug);

  return (
    <div
      className={`flex flex-col gap-4 rounded-2xl border bg-white p-4 sm:p-5 lg:flex-row lg:items-center ${
        highlighted ? "border-jmv-blue/40 shadow-md ring-1 ring-jmv-blue/10" : "border-slate-200"
      }`}
    >
      <div className="flex min-w-0 flex-1 items-start gap-4">
        <span
          className={`flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl ${
            highlighted ? "bg-jmv-blue text-white" : "bg-slate-100 text-slate-700"
          }`}
          aria-hidden
        >
          <FileText className="h-5 w-5" />
          <span className="mt-0.5 max-w-full truncate px-1 text-xs font-bold">{item.versionLabel}</span>
        </span>
        <div className="min-w-0">
          <h3 className="text-[15px] font-bold leading-tight text-slate-900">
            {item.title} <span className="font-semibold text-slate-500">· {item.versionLabel}</span>
          </h3>
          <p className="mt-1 text-xs text-slate-600">
            Aprobados el {formatDate(item.approvedAt)} · {item.approvedBy || "sin firmante"} · {countLabel(stats.articles, "artículo", "artículos")} en{" "}
            {countLabel(stats.chapters, "capítulo", "capítulos")}
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {item.isCurrent ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-900">
                <BadgeCheck className="h-3 w-3" aria-hidden />
                Vigente
              </span>
            ) : null}
            {!item.published ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-slate-200 px-2 py-0.5 text-[11px] font-semibold text-slate-800">
                <EyeOff className="h-3 w-3" aria-hidden />
                Borrador (no publicado)
              </span>
            ) : !item.isCurrent ? (
              <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-900">Anterior, publicada</span>
            ) : null}
            {!item.pdfUrl ? (
              <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-900">Sin PDF original</span>
            ) : null}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-1 border-t border-slate-100 pt-3 lg:border-0 lg:pt-0">
        <Link href={`/admin/estatutos/${item.id}`} className={`${linkButton} border border-slate-300 bg-white text-slate-700 hover:bg-slate-50`}>
          <Pencil className="h-4 w-4" aria-hidden />
          Editar
        </Link>
        <Link
          href={`/admin/estatutos/nueva?desde=${item.id}`}
          className={`${linkButton} text-slate-700 hover:bg-slate-100`}
          title="Crear un borrador a partir de esta versión"
        >
          <Copy className="h-4 w-4" aria-hidden />
          Duplicar
        </Link>
        {item.published ? (
          <a href={publicHref} target="_blank" rel="noopener noreferrer" className={`${linkButton} text-slate-700 hover:bg-slate-100`}>
            <ExternalLink className="h-4 w-4" aria-hidden />
            Ver
            <span className="sr-only"> en el sitio (se abre en una pestaña nueva)</span>
          </a>
        ) : null}
        {!item.isCurrent ? (
          <>
            <Button variant="secondary" className="min-h-11 sm:min-h-9" onClick={onPromote} icon={<BadgeCheck className="h-4 w-4" aria-hidden />}>
              Marcar como vigente
            </Button>
            <button
              type="button"
              onClick={onDelete}
              aria-label={`Eliminar la versión ${item.versionLabel}`}
              title="Eliminar"
              className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-red-600 transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jmv-blue/40 sm:h-9 sm:w-9"
            >
              <Trash2 className="h-4 w-4" aria-hidden />
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}
