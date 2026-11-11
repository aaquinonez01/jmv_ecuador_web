"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, Paperclip, Pencil, Plus, Presentation, Trash2 } from "lucide-react";
import { deleteTrainingAPI, formationErrorMessage, getTrainingsAPI } from "@/actions/formation";
import Button from "@/components/admin/ui/Button";
import ConfirmDialog from "@/components/admin/ui/ConfirmDialog";
import LoadingSpinner from "@/components/admin/ui/LoadingSpinner";
import PageHeader from "@/components/admin/layout/PageHeader";
import type { NationalTraining } from "@/types/formation";
import { PublishedBadge, useToastRef } from "./shared";

const fmt = (iso: string) =>
  new Intl.DateTimeFormat("es-EC", { dateStyle: "long", timeStyle: "short", timeZone: "America/Guayaquil" }).format(new Date(iso));

// Formaciones nacionales (virtuales, normalmente mensuales) con su material de apoyo
export default function TrainingsManager() {
  const toast = useToastRef();
  const [items, setItems] = useState<NationalTraining[]>([]);
  const [loading, setLoading] = useState(true);
  const [toDelete, setToDelete] = useState<NationalTraining | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    try {
      setItems(await getTrainingsAPI());
    } catch (e) {
      toast.current.error(formationErrorMessage(e, "No se pudieron cargar las formaciones."));
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const confirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await deleteTrainingAPI(toDelete.id);
      toast.current.success("Formación eliminada.");
      setToDelete(null);
      await load();
    } catch (e) {
      toast.current.error(formationErrorMessage(e, "No se pudo eliminar."));
    } finally {
      setDeleting(false);
    }
  };

  const now = Date.now();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Formaciones nacionales"
        description="Las formaciones que se ofrecen a nivel nacional: tema, ponente, fecha, enlace y material de apoyo (diapositivas, PDF, videos). Los jóvenes las ven en la app, en Formación."
        icon={<Presentation className="h-5 w-5" />}
        breadcrumbs={[{ label: "Formaciones nacionales" }]}
        actions={
          <Link href="/admin/formaciones/nueva">
            <Button icon={<Plus className="h-4 w-4" />}>Nueva formación</Button>
          </Link>
        }
      />

      {loading ? (
        <div className="flex justify-center py-16"><LoadingSpinner /></div>
      ) : items.length === 0 ? (
        <p className="rounded-xl border border-slate-200 bg-white p-6 text-center text-slate-500">Aún no hay formaciones. Registra la próxima o una que ya se dio, con su material.</p>
      ) : (
        <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
          {items.map((t) => {
            const proxima = new Date(t.startsAt).getTime() >= now;
            return (
              <li key={t.id} className="flex flex-wrap items-center gap-3 px-5 py-4">
                <span className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${proxima ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-600"}`}>
                  {proxima ? "Próxima" : "Realizada"}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-slate-900">{t.title}</p>
                  <p className="flex flex-wrap items-center gap-x-3 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />{fmt(t.startsAt)}</span>
                    {t.speaker && <span>{t.speaker}</span>}
                    <span className="inline-flex items-center gap-1"><Paperclip className="h-3.5 w-3.5" />{t.materials.length} materiales</span>
                  </p>
                </div>
                <PublishedBadge published={t.published} />
                <Link href={`/admin/formaciones/${t.id}`}>
                  <Button size="sm" variant="outline" icon={<Pencil className="h-4 w-4" />}>Editar</Button>
                </Link>
                <Button size="sm" variant="ghost" onClick={() => setToDelete(t)} aria-label={`Eliminar ${t.title}`} icon={<Trash2 className="h-4 w-4 text-red-600" />} />
              </li>
            );
          })}
        </ul>
      )}

      <ConfirmDialog
        isOpen={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        onConfirm={confirmDelete}
        title="Eliminar formación"
        message={`Se eliminará "${toDelete?.title ?? ""}" junto con los PDF subidos como material. No se puede deshacer.`}
        confirmText="Eliminar"
        variant="danger"
        isLoading={deleting}
      />
    </div>
  );
}
