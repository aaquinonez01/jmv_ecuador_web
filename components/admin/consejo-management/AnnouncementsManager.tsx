"use client";

import { useEffect, useState } from "react";
import {
  Megaphone,
  Pencil,
  Plus,
  Trash2,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  createAnnouncementAPI,
  deleteAnnouncementAPI,
  getAnnouncementsAPI,
  updateAnnouncementAPI,
} from "@/actions/home-announcements";
import Button from "@/components/admin/ui/Button";
import InputField from "@/components/admin/ui/InputField";
import SelectField from "@/components/admin/ui/SelectField";
import Modal from "@/components/admin/ui/Modal";
import TextareaField from "@/components/admin/ui/TextareaField";
import PageHeader from "@/components/admin/layout/PageHeader";
import { useToast } from "@/lib/hooks/useToast";
import type { HomeAnnouncement, TipoAnnouncement } from "@/types/consejo";

const TIPO_OPTIONS = [
  { id: "general", name: "General" },
  { id: "nuevo_consejo", name: "Nuevo Consejo Nacional" },
  { id: "nuevo_asesor", name: "Nuevo Asesor / Asesora" },
  { id: "nueva_vocalia", name: "Nueva Vocalía" },
];

interface FormState {
  titulo: string;
  subtitulo: string;
  mensaje: string;
  tipo: TipoAnnouncement;
  ctaLabel: string;
  ctaUrl: string;
  fechaPublicacion: string;
  fechaExpiracion: string;
  displayOrder: string;
  featuredInHome: boolean;
  active: boolean;
  image: File | null;
}

const emptyForm = (): FormState => ({
  titulo: "",
  subtitulo: "",
  mensaje: "",
  tipo: "general",
  ctaLabel: "",
  ctaUrl: "",
  fechaPublicacion: "",
  fechaExpiracion: "",
  displayOrder: "",
  featuredInHome: true,
  active: true,
  image: null,
});

function toLocalDateTime(value?: string | null): string {
  if (!value) return "";
  try {
    const d = new Date(value);
    const offset = d.getTimezoneOffset();
    const local = new Date(d.getTime() - offset * 60_000);
    return local.toISOString().slice(0, 16);
  } catch {
    return "";
  }
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleString("es-EC", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return value;
  }
}

export default function AnnouncementsManager() {
  const toast = useToast();
  const [items, setItems] = useState<HomeAnnouncement[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<HomeAnnouncement | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  const loadAll = async () => {
    try {
      setLoading(true);
      const data = await getAnnouncementsAPI();
      setItems(data);
    } catch {
      toast.error("No se pudieron cargar los anuncios.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setIsModalOpen(true);
  };

  const openEdit = (a: HomeAnnouncement) => {
    setEditing(a);
    setForm({
      titulo: a.titulo,
      subtitulo: a.subtitulo || "",
      mensaje: a.mensaje,
      tipo: a.tipo,
      ctaLabel: a.ctaLabel || "",
      ctaUrl: a.ctaUrl || "",
      fechaPublicacion: toLocalDateTime(a.fechaPublicacion),
      fechaExpiracion: toLocalDateTime(a.fechaExpiracion),
      displayOrder: String(a.displayOrder ?? ""),
      featuredInHome: a.featuredInHome,
      active: a.active,
      image: null,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditing(null);
    setForm(emptyForm());
  };

  const submit = async () => {
    if (!form.titulo.trim() || !form.mensaje.trim()) {
      toast.error("Título y mensaje son obligatorios.");
      return;
    }
    try {
      setSubmitting(true);
      const payload = {
        titulo: form.titulo.trim(),
        subtitulo: form.subtitulo.trim() || null,
        mensaje: form.mensaje.trim(),
        tipo: form.tipo,
        ctaLabel: form.ctaLabel.trim() || null,
        ctaUrl: form.ctaUrl.trim() || null,
        fechaPublicacion: form.fechaPublicacion || null,
        fechaExpiracion: form.fechaExpiracion || null,
        displayOrder: form.displayOrder || null,
        featuredInHome: form.featuredInHome,
        active: form.active,
        image: form.image,
      };
      if (editing) {
        await updateAnnouncementAPI(editing.id, payload);
        toast.success("Anuncio actualizado.");
      } else {
        await createAnnouncementAPI(payload);
        toast.success("Anuncio creado.");
      }
      closeModal();
      await loadAll();
    } catch {
      toast.error("No se pudo guardar el anuncio.");
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async (a: HomeAnnouncement) => {
    if (!window.confirm(`Eliminar el anuncio "${a.titulo}"?`)) return;
    try {
      await deleteAnnouncementAPI(a.id);
      toast.success("Anuncio eliminado.");
      await loadAll();
    } catch {
      toast.error("No se pudo eliminar el anuncio.");
    }
  };

  if (loading) {
    return (
      <div className="px-5 py-10 text-sm text-slate-500">
        Cargando anuncios...
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Anuncios destacados del Home"
        description='Banner "Felizmente anunciamos…" que aparece en el inicio.'
        icon={<Megaphone className="h-[18px] w-[18px]" strokeWidth={2.1} />}
        breadcrumbs={[{ label: "Contenido" }, { label: "Anuncios" }]}
        actions={
          <Button
            variant="primary"
            size="md"
            icon={<Plus className="h-3.5 w-3.5" strokeWidth={2.5} />}
            onClick={openCreate}
          >
            Nuevo anuncio
          </Button>
        }
      />

      <div className="flex-1 overflow-auto px-6 py-6">
        {items.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
            <Megaphone className="mx-auto mb-3 h-10 w-10 text-jmv-blue" />
            <p className="mb-3 text-sm text-slate-600">
              No hay anuncios todavía.
            </p>
            <Button variant="primary" size="md" onClick={openCreate}>
              Crear primer anuncio
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((a) => (
              <article
                key={a.id}
                className="rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-slate-300"
              >
                <div className="flex flex-wrap items-start gap-4">
                  {a.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={a.imageUrl}
                      alt={a.titulo}
                      className="h-20 w-32 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-20 w-32 items-center justify-center rounded-lg bg-gradient-to-br from-jmv-gold/30 to-jmv-blue/30">
                      <Megaphone className="h-8 w-8 text-jmv-blue" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">
                        {a.titulo}
                      </h3>
                      {a.active && a.featuredInHome ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-700">
                          <CheckCircle2 className="h-2.5 w-2.5" />
                          Visible
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-500">
                          <EyeOff className="h-2.5 w-2.5" />
                          Oculto
                        </span>
                      )}
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-600">
                        {a.tipo}
                      </span>
                    </div>
                    {a.subtitulo && (
                      <p className="text-xs font-semibold text-jmv-blue">
                        {a.subtitulo}
                      </p>
                    )}
                    <p className="mt-1 line-clamp-2 text-xs text-slate-600">
                      {a.mensaje}
                    </p>
                    <p className="mt-2 text-[11px] text-slate-400">
                      Desde {formatDate(a.fechaPublicacion)}
                      {a.fechaExpiracion
                        ? ` · hasta ${formatDate(a.fechaExpiracion)}`
                        : " · sin expiración"}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <button
                      onClick={() => openEdit(a)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-jmv-blue/10 hover:text-jmv-blue"
                      title="Editar"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => remove(a)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-red-600 hover:bg-red-50"
                      title="Eliminar"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editing ? "Editar anuncio" : "Nuevo anuncio destacado"}
        description="Aparecerá como banner destacado en la página de inicio."
        size="lg"
        footer={
          <>
            <Button size="sm" variant="outline" onClick={closeModal}>
              Cancelar
            </Button>
            <Button
              size="sm"
              variant="primary"
              isLoading={submitting}
              onClick={submit}
            >
              {editing ? "Guardar cambios" : "Publicar"}
            </Button>
          </>
        }
      >
        <div className="space-y-3 px-5 py-4">
          <InputField
            label="Título"
            required
            value={form.titulo}
            onChange={(e) =>
              setForm((c) => ({ ...c, titulo: e.target.value }))
            }
            placeholder="Ej. ¡Felizmente anunciamos al nuevo Consejo Nacional!"
          />
          <InputField
            label="Subtítulo"
            value={form.subtitulo}
            onChange={(e) =>
              setForm((c) => ({ ...c, subtitulo: e.target.value }))
            }
            placeholder="Ej. Período 2026-2029"
          />
          <TextareaField
            label="Mensaje"
            required
            value={form.mensaje}
            onChange={(e) =>
              setForm((c) => ({ ...c, mensaje: e.target.value }))
            }
            rows={4}
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <SelectField
              label="Tipo de anuncio"
              value={form.tipo}
              onChange={(e) =>
                setForm((c) => ({
                  ...c,
                  tipo: e.target.value as TipoAnnouncement,
                }))
              }
              options={TIPO_OPTIONS}
            />
            <InputField
              label="Orden de visualización"
              type="number"
              value={form.displayOrder}
              onChange={(e) =>
                setForm((c) => ({ ...c, displayOrder: e.target.value }))
              }
              hint="Menor = primero"
            />
            <InputField
              label="Etiqueta del botón (CTA)"
              value={form.ctaLabel}
              onChange={(e) =>
                setForm((c) => ({ ...c, ctaLabel: e.target.value }))
              }
              placeholder="Ej. Conoce al nuevo Consejo"
            />
            <InputField
              label="URL del botón"
              value={form.ctaUrl}
              onChange={(e) =>
                setForm((c) => ({ ...c, ctaUrl: e.target.value }))
              }
              placeholder="Ej. /estructura"
            />
            <InputField
              label="Publicar desde"
              type="datetime-local"
              value={form.fechaPublicacion}
              onChange={(e) =>
                setForm((c) => ({ ...c, fechaPublicacion: e.target.value }))
              }
              hint="Vacío = ahora"
            />
            <InputField
              label="Expira el"
              type="datetime-local"
              value={form.fechaExpiracion}
              onChange={(e) =>
                setForm((c) => ({ ...c, fechaExpiracion: e.target.value }))
              }
              hint="Vacío = sin expiración"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Imagen destacada
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setForm((c) => ({
                  ...c,
                  image: e.target.files?.[0] || null,
                }))
              }
              className="block w-full text-xs text-slate-600 file:mr-3 file:h-9 file:rounded-md file:border-0 file:bg-jmv-blue file:px-3 file:text-xs file:font-semibold file:text-white hover:file:bg-jmv-blue-dark"
            />
            <p className="mt-1 text-[11px] text-slate-500">
              {form.image
                ? form.image.name
                : editing?.imageUrl
                  ? "Se mantiene la imagen actual"
                  : "Sin imagen cargada"}
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) =>
                  setForm((c) => ({ ...c, active: e.target.checked }))
                }
                className="h-4 w-4 rounded border-slate-300 text-jmv-blue focus:ring-2 focus:ring-jmv-blue/30"
              />
              <Eye className="h-3.5 w-3.5" />
              Activo
            </label>
            <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={form.featuredInHome}
                onChange={(e) =>
                  setForm((c) => ({
                    ...c,
                    featuredInHome: e.target.checked,
                  }))
                }
                className="h-4 w-4 rounded border-slate-300 text-jmv-blue focus:ring-2 focus:ring-jmv-blue/30"
              />
              Mostrar en el Home
            </label>
          </div>
        </div>
      </Modal>
    </>
  );
}
