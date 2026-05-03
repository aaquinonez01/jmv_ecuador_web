"use client";

import { type ReactNode, useEffect, useMemo, useState } from "react";
import {
  createActivityPillarAPI,
  deleteActivityPillarAPI,
  getActivityPillarsAPI,
  updateActivityPillarAPI,
} from "@/actions/activity-pillars";
import {
  createActivityTypeAPI,
  deleteActivityTypeAPI,
  getActivityTypesAPI,
  updateActivityTypeAPI,
} from "@/actions/activity-types";
import Button from "@/components/admin/ui/Button";
import InputField from "@/components/admin/ui/InputField";
import Modal from "@/components/admin/ui/Modal";
import TextareaField from "@/components/admin/ui/TextareaField";
import PageHeader from "@/components/admin/layout/PageHeader";
import { useToast } from "@/lib/hooks/useToast";
import type {
  ActivityCatalogItem,
  ActivityCatalogPayload,
} from "@/types/activity-management";
import {
  Layers3,
  Pencil,
  Plus,
  Power,
  PowerOff,
  Shapes,
  Trash2,
} from "lucide-react";

type CatalogKind = "pillar" | "type";

interface CatalogFormState {
  name: string;
  slug: string;
  description: string;
  color: string;
  icon: string;
  active: boolean;
}

const emptyForm = (): CatalogFormState => ({
  name: "",
  slug: "",
  description: "",
  color: "",
  icon: "",
  active: true,
});

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function toPayload(form: CatalogFormState): ActivityCatalogPayload {
  return {
    name: form.name.trim(),
    slug: form.slug.trim() || slugify(form.name),
    description: form.description.trim() || undefined,
    color: form.color.trim() || undefined,
    icon: form.icon.trim() || undefined,
    active: form.active,
  };
}

function CatalogSection({
  title,
  description,
  icon,
  items,
  onCreate,
  onEdit,
  onToggle,
  onDelete,
}: {
  title: string;
  description: string;
  icon: ReactNode;
  items: ActivityCatalogItem[];
  onCreate: () => void;
  onEdit: (item: ActivityCatalogItem) => void;
  onToggle: (item: ActivityCatalogItem) => Promise<void>;
  onDelete: (item: ActivityCatalogItem) => Promise<void>;
}) {
  const activeCount = items.filter((i) => i.active).length;

  return (
    <section className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white">
      <header className="flex shrink-0 items-center gap-3 border-b border-slate-200 bg-slate-50/60 px-4 py-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-jmv-blue/10 text-jmv-blue ring-1 ring-jmv-blue/15">
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="truncate text-[14px] font-bold leading-tight text-slate-900">
              {title}
            </h2>
            <span className="rounded-md bg-white px-1.5 py-0.5 text-[10.5px] font-bold text-slate-600 ring-1 ring-slate-200">
              {items.length}
            </span>
          </div>
          <p className="mt-0.5 truncate text-[11.5px] leading-tight text-slate-500">
            {description}
          </p>
        </div>
        <Button
          size="sm"
          variant="primary"
          onClick={onCreate}
          icon={<Plus className="h-3.5 w-3.5" strokeWidth={2.5} />}
        >
          Nuevo
        </Button>
      </header>

      {items.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 px-4 py-10 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            {icon}
          </div>
          <p className="text-[12.5px] font-medium text-slate-600">
            No hay registros todavía
          </p>
          <button
            onClick={onCreate}
            className="text-[11.5px] font-semibold text-jmv-blue hover:underline"
          >
            Crear el primero
          </button>
        </div>
      ) : (
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-auto">
          <table className="min-w-full divide-y divide-slate-200 text-xs">
            <thead className="sticky top-0 bg-slate-50">
              <tr className="text-[10px] uppercase tracking-wider text-slate-500">
                <th className="px-3 py-2 text-left font-bold">Nombre</th>
                <th className="px-3 py-2 text-left font-bold">Slug</th>
                <th className="px-3 py-2 text-left font-bold">Estado</th>
                <th className="px-3 py-2 text-right font-bold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {items.map((item) => (
                <tr
                  key={item.id}
                  className="transition-colors hover:bg-slate-50/50"
                >
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      {item.color ? (
                        <span
                          className="h-2.5 w-2.5 shrink-0 rounded-full ring-1 ring-black/10"
                          style={{ backgroundColor: item.color }}
                        />
                      ) : null}
                      <div className="min-w-0">
                        <div className="truncate text-[12px] font-bold text-slate-900">
                          {item.name}
                        </div>
                        {item.description ? (
                          <div className="line-clamp-1 text-[10.5px] text-slate-500">
                            {item.description}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2 font-mono text-[11px] text-slate-600">
                    {item.slug}
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                        item.active
                          ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                          : "bg-slate-100 text-slate-500 ring-1 ring-slate-200"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          item.active ? "bg-emerald-500" : "bg-slate-400"
                        }`}
                      />
                      {item.active ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex justify-end gap-0.5">
                      <button
                        onClick={() => onEdit(item)}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-jmv-blue/10 hover:text-jmv-blue"
                        title="Editar"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => void onToggle(item)}
                        className={`inline-flex h-7 w-7 items-center justify-center rounded-md transition-colors ${
                          item.active
                            ? "text-amber-600 hover:bg-amber-50"
                            : "text-emerald-600 hover:bg-emerald-50"
                        }`}
                        title={item.active ? "Desactivar" : "Activar"}
                      >
                        {item.active ? (
                          <PowerOff className="h-3.5 w-3.5" />
                        ) : (
                          <Power className="h-3.5 w-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => void onDelete(item)}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-md text-red-600 transition-colors hover:bg-red-50"
                        title="Eliminar"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
          <footer className="shrink-0 border-t border-slate-100 bg-slate-50/40 px-3 py-1.5 text-[10.5px] text-slate-500">
            <strong className="font-bold text-slate-700">{activeCount}</strong>{" "}
            activo{activeCount === 1 ? "" : "s"} de {items.length}
          </footer>
        </div>
      )}
    </section>
  );
}

export default function CatalogosManager() {
  const toast = useToast();
  const [pillars, setPillars] = useState<ActivityCatalogItem[]>([]);
  const [types, setTypes] = useState<ActivityCatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editorState, setEditorState] = useState<{
    kind: CatalogKind;
    item: ActivityCatalogItem | null;
    form: CatalogFormState;
  } | null>(null);

  const loadAll = async () => {
    try {
      setLoading(true);
      const [pillarsData, typesData] = await Promise.all([
        getActivityPillarsAPI(),
        getActivityTypesAPI(),
      ]);
      setPillars(pillarsData);
      setTypes(typesData);
    } catch {
      toast.error("No se pudieron cargar los catálogos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const openCreate = (kind: CatalogKind) => {
    setEditorState({ kind, item: null, form: emptyForm() });
  };

  const openEdit = (kind: CatalogKind, item: ActivityCatalogItem) => {
    setEditorState({
      kind,
      item,
      form: {
        name: item.name,
        slug: item.slug,
        description: item.description || "",
        color: item.color || "",
        icon: item.icon || "",
        active: item.active,
      },
    });
  };

  const closeEditor = () => setEditorState(null);

  const handleToggle = async (kind: CatalogKind, item: ActivityCatalogItem) => {
    try {
      if (kind === "pillar") {
        await updateActivityPillarAPI(item.id, { active: !item.active });
      } else {
        await updateActivityTypeAPI(item.id, { active: !item.active });
      }
      toast.success("Estado actualizado.");
      await loadAll();
    } catch {
      toast.error("No se pudo actualizar el estado.");
    }
  };

  const handleDelete = async (kind: CatalogKind, item: ActivityCatalogItem) => {
    const ok = window.confirm(
      `Se eliminará "${item.name}". Esta acción no se puede deshacer.`
    );
    if (!ok) return;

    try {
      if (kind === "pillar") {
        await deleteActivityPillarAPI(item.id);
      } else {
        await deleteActivityTypeAPI(item.id);
      }
      toast.success("Registro eliminado.");
      await loadAll();
    } catch {
      toast.error("No se pudo eliminar el registro.");
    }
  };

  const handleSubmit = async () => {
    if (!editorState) return;
    if (!editorState.form.name.trim()) {
      toast.error("El nombre es obligatorio.");
      return;
    }

    try {
      setSubmitting(true);
      const payload = toPayload(editorState.form);
      if (editorState.item) {
        if (editorState.kind === "pillar") {
          await updateActivityPillarAPI(editorState.item.id, payload);
        } else {
          await updateActivityTypeAPI(editorState.item.id, payload);
        }
        toast.success("Registro actualizado.");
      } else {
        if (editorState.kind === "pillar") {
          await createActivityPillarAPI(payload);
        } else {
          await createActivityTypeAPI(payload);
        }
        toast.success("Registro creado correctamente.");
      }
      closeEditor();
      await loadAll();
    } catch {
      toast.error("No se pudo guardar el registro.");
    } finally {
      setSubmitting(false);
    }
  };

  const editorTitle = useMemo(() => {
    if (!editorState) return "";
    const isPillar = editorState.kind === "pillar";
    if (editorState.item) return isPillar ? "Editar pilar" : "Editar tipo";
    return isPillar ? "Nuevo pilar" : "Nuevo tipo de actividad";
  }, [editorState]);

  if (loading) {
    return (
      <div className="px-6 py-10 text-sm text-slate-500">
        Cargando catálogos...
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Catálogos de actividades"
        description="Pilares y tipos que usarán las actividades."
        icon={<Layers3 className="h-[18px] w-[18px]" strokeWidth={2.1} />}
        breadcrumbs={[{ label: "Contenido" }, { label: "Catálogos" }]}
      />

      <div className="flex-1 overflow-auto px-6 py-5">
        <div className="grid h-full grid-cols-1 gap-4 xl:grid-cols-2">
          <CatalogSection
            title="Pilares"
            description="Clasifican las actividades por su pilar formativo."
            icon={<Layers3 className="h-[18px] w-[18px]" strokeWidth={2} />}
            items={pillars}
            onCreate={() => openCreate("pillar")}
            onEdit={(item) => openEdit("pillar", item)}
            onToggle={(item) => handleToggle("pillar", item)}
            onDelete={(item) => handleDelete("pillar", item)}
          />

          <CatalogSection
            title="Tipos de actividad"
            description="Misión, encuentro, retiro, visita, apostolado y otros."
            icon={<Shapes className="h-[18px] w-[18px]" strokeWidth={2} />}
            items={types}
            onCreate={() => openCreate("type")}
            onEdit={(item) => openEdit("type", item)}
            onToggle={(item) => handleToggle("type", item)}
            onDelete={(item) => handleDelete("type", item)}
          />
        </div>
      </div>

      <Modal
        isOpen={!!editorState}
        onClose={closeEditor}
        title={editorTitle}
        size="lg"
        footer={
          <>
            <Button size="sm" variant="outline" onClick={closeEditor}>
              Cancelar
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={handleSubmit}
              isLoading={submitting}
              icon={
                editorState?.item ? undefined : (
                  <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
                )
              }
            >
              {editorState?.item ? "Guardar cambios" : "Crear"}
            </Button>
          </>
        }
      >
        {editorState ? (
          <div className="space-y-3.5 px-5 py-4">
            <div className="grid grid-cols-2 gap-3">
              <InputField
                label="Nombre"
                required
                value={editorState.form.name}
                onChange={(event) =>
                  setEditorState((current) =>
                    current
                      ? {
                          ...current,
                          form: {
                            ...current.form,
                            name: event.target.value,
                            slug: current.form.slug
                              ? current.form.slug
                              : slugify(event.target.value),
                          },
                        }
                      : current
                  )
                }
                placeholder="Ej. Misión"
              />
              <InputField
                label="Slug"
                value={editorState.form.slug}
                onChange={(event) =>
                  setEditorState((current) =>
                    current
                      ? {
                          ...current,
                          form: { ...current.form, slug: event.target.value },
                        }
                      : current
                  )
                }
                placeholder="mision"
              />
              <InputField
                label="Color"
                value={editorState.form.color}
                onChange={(event) =>
                  setEditorState((current) =>
                    current
                      ? {
                          ...current,
                          form: { ...current.form, color: event.target.value },
                        }
                      : current
                  )
                }
                placeholder="#0F766E"
              />
              <InputField
                label="Ícono"
                value={editorState.form.icon}
                onChange={(event) =>
                  setEditorState((current) =>
                    current
                      ? {
                          ...current,
                          form: { ...current.form, icon: event.target.value },
                        }
                      : current
                  )
                }
                placeholder="tent, heart, cross..."
              />
            </div>

            <TextareaField
              label="Descripción"
              value={editorState.form.description}
              onChange={(event) =>
                setEditorState((current) =>
                  current
                    ? {
                        ...current,
                        form: {
                          ...current.form,
                          description: event.target.value,
                        },
                      }
                    : current
                )
              }
              rows={3}
              placeholder="Descripción opcional"
            />

            <label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50">
              <input
                type="checkbox"
                checked={editorState.form.active}
                onChange={(event) =>
                  setEditorState((current) =>
                    current
                      ? {
                          ...current,
                          form: {
                            ...current.form,
                            active: event.target.checked,
                          },
                        }
                      : current
                  )
                }
                className="h-4 w-4 rounded border-slate-300 text-jmv-blue focus:ring-2 focus:ring-jmv-blue/30"
              />
              Activo
            </label>
          </div>
        ) : null}
      </Modal>
    </>
  );
}
