"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Music, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { createSongAPI, deleteSongAPI, formationErrorMessage, getSongsAPI, updateSongAPI } from "@/actions/formation";
import Button from "@/components/admin/ui/Button";
import ConfirmDialog from "@/components/admin/ui/ConfirmDialog";
import InputField from "@/components/admin/ui/InputField";
import LoadingSpinner from "@/components/admin/ui/LoadingSpinner";
import Modal from "@/components/admin/ui/Modal";
import SelectField from "@/components/admin/ui/SelectField";
import TextareaField from "@/components/admin/ui/TextareaField";
import PageHeader, { PageBody } from "@/components/admin/layout/PageHeader";
import { SONG_CATEGORIES, type Song, type SongPayload } from "@/types/formation";
import { PublishedBadge, useToastRef } from "./shared";

const empty = (): SongPayload => ({ title: "", author: "", category: "Entrada", lyrics: "", songKey: "", videoUrl: "", displayOrder: 0, published: true });

// Cancionero de la pestaña "Orar y cantar" de la app
export default function SongsManager() {
  const toast = useToastRef();
  const [items, setItems] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<{ id?: string; form: SongPayload } | null>(null);
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState<Song | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    try {
      setItems(await getSongsAPI());
    } catch (e) {
      toast.current.error(formationErrorMessage(e, "No se pudieron cargar los cantos."));
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? items.filter((s) => `${s.title} ${s.author ?? ""}`.toLowerCase().includes(q)) : items;
  }, [items, query]);

  const save = async () => {
    if (!editing) return;
    const f = editing.form;
    if (!f.title.trim() || !f.lyrics.trim()) return toast.current.error("El título y la letra son obligatorios.");
    setSaving(true);
    try {
      const payload: SongPayload = {
        ...f,
        displayOrder: Number(f.displayOrder) || 0,
        author: f.author?.trim() || undefined,
        songKey: f.songKey?.trim() || undefined,
        videoUrl: f.videoUrl?.trim() || undefined,
      };
      if (editing.id) await updateSongAPI(editing.id, payload);
      else await createSongAPI(payload);
      toast.current.success("Canto guardado.");
      setEditing(null);
      await load();
    } catch (e) {
      toast.current.error(formationErrorMessage(e, "No se pudo guardar."));
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await deleteSongAPI(toDelete.id);
      toast.current.success("Canto eliminado.");
      setToDelete(null);
      await load();
    } catch (e) {
      toast.current.error(formationErrorMessage(e, "No se pudo eliminar."));
    } finally {
      setDeleting(false);
    }
  };

  const setF = <K extends keyof SongPayload>(k: K, v: SongPayload[K]) =>
    setEditing((e) => (e ? { ...e, form: { ...e.form, [k]: v } } : e));

  return (
    <>
      <PageHeader
        title="Cantos"
        description="El cancionero de la pestaña Orar y cantar de la app. Los jóvenes lo pueden abrir sin internet."
        icon={<Music className="h-5 w-5" />}
        breadcrumbs={[{ label: "Cantos" }]}
        actions={<Button icon={<Plus className="h-4 w-4" />} onClick={() => setEditing({ form: empty() })}>Nuevo canto</Button>}
      />
      <PageBody>
        <label className="relative block max-w-md">
          <span className="sr-only">Buscar canto</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por título o autor"
            className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </label>

        {loading ? (
          <div className="flex justify-center py-16"><LoadingSpinner /></div>
        ) : items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center">
            <Music className="mx-auto h-8 w-8 text-slate-400" aria-hidden="true" />
            <p className="mt-3 font-semibold text-slate-900">Todavía no hay cantos</p>
            <p className="mt-1 text-sm text-slate-500">Agrega el primero con el botón Nuevo canto.</p>
          </div>
        ) : (
          SONG_CATEGORIES.map((c) => {
            const list = shown.filter((s) => s.category === c);
            if (list.length === 0) return null;
            return (
              <section key={c} className="rounded-xl border border-slate-200 bg-white">
                <header className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
                  <h2 className="font-semibold text-slate-900">{c}</h2>
                  <span className="text-sm text-slate-500">{list.length}</span>
                </header>
                <ul className="divide-y divide-slate-100">
                  {list.map((s) => (
                    <li key={s.id} className="flex flex-wrap items-center gap-3 px-4 py-3 sm:px-5">
                      <div className="min-w-0 flex-1 max-sm:basis-full">
                        <p className="font-medium text-slate-900">{s.title}</p>
                        <p className="truncate text-xs text-slate-500">
                          {[s.author, s.songKey ? `Tono ${s.songKey}` : null].filter(Boolean).join(" · ") || "Sin autor"}
                        </p>
                      </div>
                      <PublishedBadge published={s.published} />
                      <Button
                        size="sm"
                        variant="outline"
                        icon={<Pencil className="h-4 w-4" />}
                        onClick={() => setEditing({ id: s.id, form: { title: s.title, author: s.author ?? "", category: s.category, lyrics: s.lyrics, songKey: s.songKey ?? "", videoUrl: s.videoUrl ?? "", displayOrder: s.displayOrder, published: s.published } })}
                      >
                        Editar
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setToDelete(s)} aria-label={`Eliminar ${s.title}`} icon={<Trash2 className="h-4 w-4 text-red-600" />} />
                    </li>
                  ))}
                </ul>
              </section>
            );
          })
        )}
        {!loading && items.length > 0 && shown.length === 0 && (
          <p className="text-sm text-slate-500">Ningún canto coincide con la búsqueda.</p>
        )}

        <Modal isOpen={Boolean(editing)} onClose={() => setEditing(null)} title={editing?.id ? "Editar canto" : "Nuevo canto"} size="lg">
          {editing && (
            <div className="space-y-4 px-5 pb-5">
              <InputField label="Título" required value={editing.form.title} onChange={(e) => setF("title", e.target.value)} />
              <div className="grid gap-4 sm:grid-cols-2">
                <InputField label="Autor" value={editing.form.author ?? ""} onChange={(e) => setF("author", e.target.value)} placeholder="Quién lo compuso" />
                <SelectField label="Momento" value={editing.form.category} onChange={(e) => setF("category", e.target.value as SongPayload["category"])} options={SONG_CATEGORIES.map((c) => ({ id: c, name: c }))} />
              </div>
              <TextareaField
                label="Letra"
                rows={14}
                required
                value={editing.form.lyrics}
                onChange={(e) => setF("lyrics", e.target.value)}
                hint="Deja una línea en blanco entre estrofas. Los acordes van entre corchetes, justo antes de la sílaba donde suenan: [Do]Santo, [Sol]santo. Sin corchetes, el canto sale solo con la letra."
              />
              <div className="grid gap-4 sm:grid-cols-[140px_1fr]">
                <InputField label="Tono" value={editing.form.songKey ?? ""} onChange={(e) => setF("songKey", e.target.value)} placeholder="Ej.: Do" />
                <InputField label="Enlace para escucharlo" type="url" value={editing.form.videoUrl ?? ""} onChange={(e) => setF("videoUrl", e.target.value)} placeholder="https://…" />
              </div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-800">
                <input type="checkbox" className="h-4 w-4" checked={Boolean(editing.form.published)} onChange={(e) => setF("published", e.target.checked)} />
                Publicado en la app
              </label>
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" onClick={() => setEditing(null)}>Cancelar</Button>
                <Button onClick={save} isLoading={saving}>Guardar</Button>
              </div>
            </div>
          )}
        </Modal>

        <ConfirmDialog
          isOpen={Boolean(toDelete)}
          onClose={() => setToDelete(null)}
          onConfirm={confirmDelete}
          title="Eliminar canto"
          message={`Se eliminará "${toDelete?.title ?? ""}". No se puede deshacer.`}
          confirmText="Eliminar"
          variant="danger"
          isLoading={deleting}
        />
      </PageBody>
    </>
  );
}
