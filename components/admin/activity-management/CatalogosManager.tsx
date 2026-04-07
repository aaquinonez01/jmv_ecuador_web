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
import { useToast } from "@/lib/hooks/useToast";
import type {
  ActivityCatalogItem,
  ActivityCatalogPayload,
} from "@/types/activity-management";
import { Layers3, Pencil, Plus, Shapes, Trash2 } from "lucide-react";

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
    .replace(/[\u0300-\u036f]/g, "")
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
  form,
  onFormChange,
  onCreate,
  onEdit,
  onToggle,
  onDelete,
  creating,
}: {
  title: string;
  description: string;
  icon: ReactNode;
  items: ActivityCatalogItem[];
  form: CatalogFormState;
  onFormChange: (changes: Partial<CatalogFormState>) => void;
  onCreate: () => Promise<void>;
  onEdit: (item: ActivityCatalogItem) => void;
  onToggle: (item: ActivityCatalogItem) => Promise<void>;
  onDelete: (item: ActivityCatalogItem) => Promise<void>;
  creating: boolean;
}) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-gray-200 px-6 py-5">
        <div className="rounded-xl bg-[#0066CC]/10 p-3 text-[#0066CC]">{icon}</div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>

      <div className="space-y-6 p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InputField
            label="Nombre"
            required
            value={form.name}
            onChange={(event) =>
              onFormChange({
                name: event.target.value,
                slug: form.slug ? form.slug : slugify(event.target.value),
              })
            }
            placeholder="Ej. Misión"
          />
          <InputField
            label="Slug"
            value={form.slug}
            onChange={(event) => onFormChange({ slug: event.target.value })}
            placeholder="mision"
          />
          <InputField
            label="Color"
            value={form.color}
            onChange={(event) => onFormChange({ color: event.target.value })}
            placeholder="#0F766E o from-blue-600 to-blue-800"
          />
          <InputField
            label="Ícono"
            value={form.icon}
            onChange={(event) => onFormChange({ icon: event.target.value })}
            placeholder="tent, heart, cross..."
          />
        </div>

        <TextareaField
          label="Descripción"
          value={form.description}
          onChange={(event) => onFormChange({ description: event.target.value })}
          placeholder="Descripción opcional"
          rows={3}
        />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <label className="inline-flex items-center gap-3 text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(event) => onFormChange({ active: event.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-jmv-blue focus:ring-jmv-blue"
            />
            Activo
          </label>
          <Button
            variant="primary"
            onClick={onCreate}
            isLoading={creating}
            icon={<Plus className="h-4 w-4" />}
          >
            Crear
          </Button>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  Nombre
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  Slug
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  Estado
                </th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                    No hay registros todavía.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{item.name}</div>
                      {item.description ? (
                        <div className="line-clamp-1 text-xs text-gray-500">
                          {item.description}
                        </div>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{item.slug}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          item.active
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {item.active ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onEdit(item)}
                          icon={<Pencil className="h-4 w-4" />}
                        >
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => onToggle(item)}
                        >
                          {item.active ? "Desactivar" : "Activar"}
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => onDelete(item)}
                          icon={<Trash2 className="h-4 w-4" />}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default function CatalogosManager() {
  const toast = useToast();
  const [pillars, setPillars] = useState<ActivityCatalogItem[]>([]);
  const [types, setTypes] = useState<ActivityCatalogItem[]>([]);
  const [pillarForm, setPillarForm] = useState<CatalogFormState>(emptyForm);
  const [typeForm, setTypeForm] = useState<CatalogFormState>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [creatingKind, setCreatingKind] = useState<CatalogKind | null>(null);
  const [editing, setEditing] = useState<{
    kind: CatalogKind;
    item: ActivityCatalogItem;
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

  const handleCreate = async (kind: CatalogKind) => {
    const form = kind === "pillar" ? pillarForm : typeForm;
    if (!form.name.trim()) {
      toast.error("El nombre es obligatorio.");
      return;
    }

    try {
      setCreatingKind(kind);
      if (kind === "pillar") {
        await createActivityPillarAPI(toPayload(form));
        setPillarForm(emptyForm());
      } else {
        await createActivityTypeAPI(toPayload(form));
        setTypeForm(emptyForm());
      }
      toast.success("Registro creado correctamente.");
      await loadAll();
    } catch {
      toast.error("No se pudo crear el registro.");
    } finally {
      setCreatingKind(null);
    }
  };

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

  const handleSaveEdit = async () => {
    if (!editing) return;
    if (!editing.form.name.trim()) {
      toast.error("El nombre es obligatorio.");
      return;
    }

    try {
      const payload = toPayload(editing.form);
      if (editing.kind === "pillar") {
        await updateActivityPillarAPI(editing.item.id, payload);
      } else {
        await updateActivityTypeAPI(editing.item.id, payload);
      }
      toast.success("Registro actualizado.");
      setEditing(null);
      await loadAll();
    } catch {
      toast.error("No se pudo guardar la edición.");
    }
  };

  const editingTitle = useMemo(() => {
    if (!editing) return "";
    return editing.kind === "pillar" ? "Editar pilar" : "Editar tipo";
  }, [editing]);

  if (loading) {
    return <div className="p-6 text-gray-600">Cargando catálogos...</div>;
  }

  return (
    <>
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Catálogos de actividades</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestiona los pilares y tipos que usarán las actividades históricas y
            las próximas actividades.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <CatalogSection
            title="Pilares"
            description="Clasifican las actividades por su pilar formativo."
            icon={<Layers3 className="h-5 w-5" />}
            items={pillars}
            form={pillarForm}
            onFormChange={(changes) =>
              setPillarForm((current) => ({ ...current, ...changes }))
            }
            onCreate={() => handleCreate("pillar")}
            onEdit={(item) =>
              setEditing({
                kind: "pillar",
                item,
                form: {
                  name: item.name,
                  slug: item.slug,
                  description: item.description || "",
                  color: item.color || "",
                  icon: item.icon || "",
                  active: item.active,
                },
              })
            }
            onToggle={(item) => handleToggle("pillar", item)}
            onDelete={(item) => handleDelete("pillar", item)}
            creating={creatingKind === "pillar"}
          />

          <CatalogSection
            title="Tipos de actividad"
            description="Misión, encuentro, retiro, visita, apostolado y otros."
            icon={<Shapes className="h-5 w-5" />}
            items={types}
            form={typeForm}
            onFormChange={(changes) =>
              setTypeForm((current) => ({ ...current, ...changes }))
            }
            onCreate={() => handleCreate("type")}
            onEdit={(item) =>
              setEditing({
                kind: "type",
                item,
                form: {
                  name: item.name,
                  slug: item.slug,
                  description: item.description || "",
                  color: item.color || "",
                  icon: item.icon || "",
                  active: item.active,
                },
              })
            }
            onToggle={(item) => handleToggle("type", item)}
            onDelete={(item) => handleDelete("type", item)}
            creating={creatingKind === "type"}
          />
        </div>
      </div>

      <Modal
        isOpen={!!editing}
        onClose={() => setEditing(null)}
        title={editingTitle}
        size="lg"
      >
        {editing ? (
          <div className="space-y-4 p-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <InputField
                label="Nombre"
                required
                value={editing.form.name}
                onChange={(event) =>
                  setEditing((current) =>
                    current
                      ? {
                          ...current,
                          form: {
                            ...current.form,
                            name: event.target.value,
                          },
                        }
                      : current
                  )
                }
              />
              <InputField
                label="Slug"
                value={editing.form.slug}
                onChange={(event) =>
                  setEditing((current) =>
                    current
                      ? {
                          ...current,
                          form: {
                            ...current.form,
                            slug: event.target.value,
                          },
                        }
                      : current
                  )
                }
              />
              <InputField
                label="Color"
                value={editing.form.color}
                onChange={(event) =>
                  setEditing((current) =>
                    current
                      ? {
                          ...current,
                          form: {
                            ...current.form,
                            color: event.target.value,
                          },
                        }
                      : current
                  )
                }
              />
              <InputField
                label="Ícono"
                value={editing.form.icon}
                onChange={(event) =>
                  setEditing((current) =>
                    current
                      ? {
                          ...current,
                          form: {
                            ...current.form,
                            icon: event.target.value,
                          },
                        }
                      : current
                  )
                }
              />
            </div>

            <TextareaField
              label="Descripción"
              value={editing.form.description}
              onChange={(event) =>
                setEditing((current) =>
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
              rows={4}
            />

            <label className="inline-flex items-center gap-3 text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                checked={editing.form.active}
                onChange={(event) =>
                  setEditing((current) =>
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
                className="h-4 w-4 rounded border-gray-300 text-jmv-blue focus:ring-jmv-blue"
              />
              Activo
            </label>

            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setEditing(null)}>
                Cancelar
              </Button>
              <Button variant="primary" onClick={handleSaveEdit}>
                Guardar cambios
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>
    </>
  );
}
