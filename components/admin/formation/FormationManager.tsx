"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, GraduationCap, Pencil, Plus, Trash2, Users } from "lucide-react";
import {
  deleteFormationEncounterAPI,
  formationErrorMessage,
  getFormationEncountersAPI,
  updateFormationEncounterAPI,
} from "@/actions/formation";
import Button from "@/components/admin/ui/Button";
import ConfirmDialog from "@/components/admin/ui/ConfirmDialog";
import LoadingSpinner from "@/components/admin/ui/LoadingSpinner";
import PageHeader from "@/components/admin/layout/PageHeader";
import { useToast } from "@/lib/hooks/useToast";
import { FORMATION_PILLARS, FORMATION_STEPS, type FormationEncounter } from "@/types/formation";

const pillarName = (id?: string | null) => FORMATION_PILLARS.find((p) => p.id === id)?.name;

// Encuentros del camino formativo de la app, agrupados por paso
export default function FormationManager() {
  const toast = useToast();
  // useToast devuelve un objeto nuevo en cada render: se guarda en una ref para no recargar en bucle
  const toastRef = useRef(toast);
  toastRef.current = toast;
  const [items, setItems] = useState<FormationEncounter[]>([]);
  const [loading, setLoading] = useState(true);
  const [toDelete, setToDelete] = useState<FormationEncounter | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setItems(await getFormationEncountersAPI());
    } catch (e) {
      toastRef.current.error(formationErrorMessage(e, "No se pudieron cargar los encuentros."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const togglePublished = async (e: FormationEncounter) => {
    setBusy(e.id);
    try {
      // El PATCH recibe el encuentro completo
      const { id, createdAt, updatedAt, completions, ...payload } = e;
      void id; void createdAt; void updatedAt; void completions;
      await updateFormationEncounterAPI(e.id, { ...payload, published: !e.published });
      toast.success(e.published ? "Encuentro oculto de la app." : "Encuentro publicado en la app.");
      await load();
    } catch (err) {
      toast.error(formationErrorMessage(err, "No se pudo cambiar la publicación."));
    } finally {
      setBusy(null);
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    setBusy(toDelete.id);
    try {
      await deleteFormationEncounterAPI(toDelete.id);
      toast.success("Encuentro eliminado.");
      setToDelete(null);
      await load();
    } catch (err) {
      toast.error(formationErrorMessage(err, "No se pudo eliminar."));
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Formación (app)"
        description="Los encuentros que los jóvenes recorren en la app: Contemplar, Vivir, Servir y preguntas. La app acompaña la reunión del grupo; no la reemplaza."
        icon={<GraduationCap className="h-5 w-5" />}
        breadcrumbs={[{ label: "Formación" }]}
        actions={
          <Link href="/admin/formacion/nuevo">
            <Button icon={<Plus className="h-4 w-4" />}>Nuevo encuentro</Button>
          </Link>
        }
      />

      {loading ? (
        <div className="flex justify-center py-16"><LoadingSpinner /></div>
      ) : (
        FORMATION_STEPS.map((step) => {
          const list = items.filter((i) => i.step === step.id);
          return (
            <section key={step.id} className="rounded-xl border border-slate-200 bg-white">
              <header className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
                <h2 className="font-semibold text-slate-900">{step.name}</h2>
                <span className="text-sm text-slate-500">
                  {list.length === 1 ? "1 encuentro" : `${list.length} encuentros`}
                </span>
              </header>
              {list.length === 0 ? (
                <p className="px-5 py-4 text-sm text-slate-500">Aún no hay encuentros en este paso.</p>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {list.map((e) => (
                    <li key={e.id} className="flex flex-wrap items-center gap-3 px-5 py-3">
                      <span className="w-6 text-center text-sm font-semibold text-slate-400">{e.displayOrder}</span>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-slate-900">{e.title}</p>
                        <p className="text-xs text-slate-500">
                          {[pillarName(e.pillar), `${e.vivir.cards.length} tarjetas`, `${e.quiz.length} preguntas de quiz`, e.source]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1 text-xs text-slate-500" title="Jóvenes que lo marcaron como vivido">
                        <Users className="h-3.5 w-3.5" /> {e.completions ?? 0}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          e.published ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {e.published ? "Publicado" : "Borrador"}
                      </span>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          isLoading={busy === e.id}
                          onClick={() => togglePublished(e)}
                          aria-label={e.published ? `Ocultar ${e.title}` : `Publicar ${e.title}`}
                          icon={e.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        >
                          {e.published ? "Ocultar" : "Publicar"}
                        </Button>
                        <Link href={`/admin/formacion/${e.id}`}>
                          <Button size="sm" variant="outline" icon={<Pencil className="h-4 w-4" />}>Editar</Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setToDelete(e)}
                          aria-label={`Eliminar ${e.title}`}
                          icon={<Trash2 className="h-4 w-4 text-red-600" />}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })
      )}

      <ConfirmDialog
        isOpen={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        onConfirm={confirmDelete}
        title="Eliminar encuentro"
        message={`Se eliminará "${toDelete?.title ?? ""}" y el progreso de los jóvenes en este encuentro. No se puede deshacer.`}
        confirmText="Eliminar"
        variant="danger"
        isLoading={busy === toDelete?.id}
      />
    </div>
  );
}
