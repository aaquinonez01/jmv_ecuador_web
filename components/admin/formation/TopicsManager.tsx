"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, Plus, Route, Trash2 } from "lucide-react";
import { deleteTopicAPI, formationErrorMessage, getTopicsAPI } from "@/actions/formation";
import Button from "@/components/admin/ui/Button";
import ConfirmDialog from "@/components/admin/ui/ConfirmDialog";
import LoadingSpinner from "@/components/admin/ui/LoadingSpinner";
import PageHeader from "@/components/admin/layout/PageHeader";
import { FORMATION_AXES, FORMATION_LEVELS, type FormationTopic } from "@/types/formation";
import { PublishedBadge, useToastRef } from "./shared";

// Itinerarios: los temas que el equipo de formación propone a los grupos
export default function TopicsManager() {
  const toast = useToastRef();
  const [items, setItems] = useState<FormationTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [toDelete, setToDelete] = useState<FormationTopic | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    try {
      setItems(await getTopicsAPI());
    } catch (e) {
      toast.current.error(formationErrorMessage(e, "No se pudieron cargar los itinerarios."));
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const confirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await deleteTopicAPI(toDelete.id);
      toast.current.success("Itinerario eliminado.");
      setToDelete(null);
      await load();
    } catch (e) {
      toast.current.error(formationErrorMessage(e, "No se pudo eliminar."));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Itinerarios"
        description="Temas para los grupos: eje, nivel, subtemas para conversar y referencias (citas bíblicas, libros, encíclicas, documentos). Se ven en la app, en Formación."
        icon={<Route className="h-5 w-5" />}
        breadcrumbs={[{ label: "Itinerarios" }]}
        actions={
          <Link href="/admin/itinerarios/nuevo">
            <Button icon={<Plus className="h-4 w-4" />}>Nuevo itinerario</Button>
          </Link>
        }
      />

      {loading ? (
        <div className="flex justify-center py-16"><LoadingSpinner /></div>
      ) : items.length === 0 ? (
        <p className="rounded-xl border border-slate-200 bg-white p-6 text-center text-slate-500">Aún no hay itinerarios. Crea el primero.</p>
      ) : (
        <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
          {items.map((t) => {
            const axis = FORMATION_AXES.find((a) => a.id === t.axis);
            return (
              <li key={t.id} className="flex flex-wrap items-center gap-3 px-5 py-4">
                <span className="h-10 w-1.5 rounded-full" style={{ backgroundColor: axis?.color }} aria-hidden />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-slate-900">{t.title}</p>
                  <p className="text-xs text-slate-500">
                    {axis?.name} · {t.levels.map((l) => FORMATION_LEVELS.find((x) => x.id === l)?.name).join(", ") || "Sin nivel"} · {t.subtopics.length} subtemas · {t.references.length} referencias
                  </p>
                </div>
                <PublishedBadge published={t.published} />
                <Link href={`/admin/itinerarios/${t.id}`}>
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
        title="Eliminar itinerario"
        message={`Se eliminará "${toDelete?.title ?? ""}". No se puede deshacer.`}
        confirmText="Eliminar"
        variant="danger"
        isLoading={deleting}
      />
    </div>
  );
}
