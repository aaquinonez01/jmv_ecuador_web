"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, FileUp, Link2, Plus, Save } from "lucide-react";
import {
  createTrainingAPI,
  formationErrorMessage,
  getTrainingAPI,
  materialFileUrl,
  updateTrainingAPI,
  uploadMaterialAPI,
} from "@/actions/formation";
import Button from "@/components/admin/ui/Button";
import InputField from "@/components/admin/ui/InputField";
import LoadingSpinner from "@/components/admin/ui/LoadingSpinner";
import SelectField from "@/components/admin/ui/SelectField";
import TextareaField from "@/components/admin/ui/TextareaField";
import PageHeader, { PageBody } from "@/components/admin/layout/PageHeader";
import { MATERIAL_TYPES, type NationalTrainingPayload, type TrainingMaterial } from "@/types/formation";
import { RowTools, Section, move, useToastRef } from "./shared";

const MAX_MB = 50;

// "2026-11-20T19:30" en hora de Ecuador (UTC-5, sin horario de verano) <-> ISO
const toLocalInput = (iso: string) => new Date(new Date(iso).getTime() - 5 * 3600_000).toISOString().slice(0, 16);
const fromLocalInput = (v: string) => new Date(`${v}:00-05:00`).toISOString();

const empty = (): NationalTrainingPayload => ({
  title: "",
  speaker: "",
  startsAt: "",
  description: "",
  meetingUrl: "",
  recordingUrl: "",
  materials: [],
  published: false,
});

export default function TrainingEditor({ id }: { id?: string }) {
  const router = useRouter();
  const toast = useToastRef();
  const [form, setForm] = useState<NationalTrainingPayload>(empty);
  const [fecha, setFecha] = useState("");
  const [loading, setLoading] = useState(Boolean(id));
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<number | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const uploadIndex = useRef<number>(-1);

  useEffect(() => {
    if (!id) return;
    getTrainingAPI(id)
      .then((t) => {
        setForm({ ...t, speaker: t.speaker ?? "", description: t.description ?? "", meetingUrl: t.meetingUrl ?? "", recordingUrl: t.recordingUrl ?? "" });
        setFecha(toLocalInput(t.startsAt));
      })
      .catch((e) => toast.current.error(formationErrorMessage(e, "No se pudo cargar la formación.")))
      .finally(() => setLoading(false));
  }, [id, toast]);

  const set = <K extends keyof NationalTrainingPayload>(k: K, v: NationalTrainingPayload[K]) => setForm((f) => ({ ...f, [k]: v }));
  const mats = form.materials;
  const setMats = (m: TrainingMaterial[]) => set("materials", m);

  const pickFile = (i: number) => {
    uploadIndex.current = i;
    fileInput.current?.click();
  };

  const onFile = async (file?: File) => {
    const i = uploadIndex.current;
    if (!file || i < 0) return;
    if (file.size > MAX_MB * 1024 * 1024) return toast.current.error(`El PDF pesa más de ${MAX_MB} MB. Súbelo a Drive y pega el enlace.`);
    if (!/\.pdf$/i.test(file.name)) return toast.current.error("Solo se pueden subir PDF. Exporta las diapositivas a PDF o pega un enlace.");
    setUploading(i);
    try {
      const { fileName } = await uploadMaterialAPI(file);
      setMats(mats.map((m, k) => (k === i ? { ...m, fileName, url: undefined, title: m.title || file.name.replace(/\.pdf$/i, "") } : m)));
      toast.current.success("PDF subido. Recuerda guardar.");
    } catch (e) {
      toast.current.error(formationErrorMessage(e, "No se pudo subir el PDF."));
    } finally {
      setUploading(null);
      if (fileInput.current) fileInput.current.value = "";
    }
  };

  const save = async () => {
    if (!form.title.trim()) return toast.current.error("Escribe el tema de la formación.");
    if (!fecha) return toast.current.error("Indica la fecha y hora.");
    const bad = mats.findIndex((m) => !m.title.trim() || (!m.fileName && !m.url?.trim()));
    if (bad >= 0) return toast.current.error(`Material ${bad + 1}: ponle un nombre y sube un PDF o pega un enlace.`);
    const payload: NationalTrainingPayload = {
      ...form,
      startsAt: fromLocalInput(fecha),
      speaker: form.speaker?.trim() || undefined,
      description: form.description?.trim() || undefined,
      meetingUrl: form.meetingUrl?.trim() || undefined,
      recordingUrl: form.recordingUrl?.trim() || undefined,
      materials: mats.map((m) => ({ title: m.title.trim(), type: m.type, fileName: m.fileName, url: m.fileName ? undefined : m.url?.trim() })),
    };
    setSaving(true);
    try {
      if (id) {
        await updateTrainingAPI(id, payload);
        toast.current.success("Formación guardada.");
      } else {
        const created = await createTrainingAPI(payload);
        toast.current.success("Formación creada.");
        router.replace(`/admin/formaciones/${created.id}`);
      }
    } catch (e) {
      toast.current.error(formationErrorMessage(e, "No se pudo guardar."));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center py-16"><LoadingSpinner /></div>;

  return (
    <>
      <PageHeader
        title={id ? "Editar formación" : "Nueva formación nacional"}
        description="El tema, quién la da, cuándo, el enlace y todo el material de apoyo para que los jóvenes lo tengan en la app."
        breadcrumbs={[{ label: "Formaciones nacionales", href: "/admin/formaciones" }, { label: id ? "Editar" : "Nueva" }]}
      />
      <PageBody className="pb-28">

      <Section title="Datos de la formación">
        <InputField label="Tema" required value={form.title} onChange={(e) => set("title", e.target.value)} />
        <div className="grid gap-4 sm:grid-cols-2">
          <InputField label="Ponente(s)" value={form.speaker ?? ""} onChange={(e) => set("speaker", e.target.value)} placeholder="Ej.: P. Juan Pérez, CM" />
          <InputField label="Fecha y hora (Ecuador)" type="datetime-local" required value={fecha} onChange={(e) => setFecha(e.target.value)} />
        </div>
        <TextareaField label="Descripción" rows={4} value={form.description ?? ""} onChange={(e) => set("description", e.target.value)} hint="De qué trata y qué se trabajó." />
        <div className="grid gap-4 sm:grid-cols-2">
          <InputField label="Enlace para unirse" value={form.meetingUrl ?? ""} onChange={(e) => set("meetingUrl", e.target.value)} placeholder="https://meet.google.com/…" hint="Se muestra solo antes de la fecha." />
          <InputField label="Grabación" value={form.recordingUrl ?? ""} onChange={(e) => set("recordingUrl", e.target.value)} placeholder="https://youtube.com/…" hint="Cuando ya se realizó." />
        </div>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-800">
          <input type="checkbox" className="h-4 w-4" checked={Boolean(form.published)} onChange={(e) => set("published", e.target.checked)} />
          Publicada en la app
        </label>
      </Section>

      <Section title="Material de apoyo" hint={`Diapositivas, PDF, videos o enlaces que usó el ponente. Puedes subir PDF de hasta ${MAX_MB} MB; las presentaciones expórtalas a PDF o pega su enlace.`}>
        <input ref={fileInput} type="file" accept="application/pdf,.pdf" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
        {mats.length === 0 && <p className="text-sm text-slate-500">Aún no hay material.</p>}
        <ol className="space-y-4">
          {mats.map((m, i) => (
            <li key={i} className="space-y-3 rounded-lg border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-500">Material {i + 1}</span>
                <RowTools i={i} total={mats.length} label={`material ${i + 1}`} onMove={(d) => setMats(move(mats, i, d))} onRemove={() => setMats(mats.filter((_, k) => k !== i))} />
              </div>
              <div className="grid gap-3 sm:grid-cols-[1fr_220px]">
                <InputField label="Nombre" value={m.title} onChange={(e) => setMats(mats.map((x, k) => (k === i ? { ...x, title: e.target.value } : x)))} placeholder="Ej.: Diapositivas de la charla" />
                <SelectField label="Tipo" value={m.type} onChange={(e) => setMats(mats.map((x, k) => (k === i ? { ...x, type: e.target.value as TrainingMaterial["type"] } : x)))} options={MATERIAL_TYPES.map((t) => ({ id: t.id, name: t.name }))} />
              </div>
              {m.fileName ? (
                <div className="flex flex-wrap items-center gap-3 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
                  <FileUp className="h-4 w-4" /> PDF subido
                  <a href={materialFileUrl(m.fileName)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-medium underline">
                    Ver <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                  <Button type="button" size="xs" variant="ghost" onClick={() => setMats(mats.map((x, k) => (k === i ? { ...x, fileName: undefined } : x)))}>Quitar PDF</Button>
                </div>
              ) : (
                <div className="grid items-end gap-3 sm:grid-cols-[1fr_auto]">
                  <InputField label="Enlace" value={m.url ?? ""} placeholder="https://drive.google.com/… o https://youtube.com/…" onChange={(e) => setMats(mats.map((x, k) => (k === i ? { ...x, url: e.target.value } : x)))} />
                  <Button type="button" variant="outline" isLoading={uploading === i} icon={<FileUp className="h-4 w-4" />} onClick={() => pickFile(i)}>
                    o subir PDF
                  </Button>
                </div>
              )}
            </li>
          ))}
        </ol>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" icon={<FileUp className="h-4 w-4" />} onClick={() => { setMats([...mats, { title: "", type: "diapositivas" }]); setTimeout(() => pickFile(mats.length), 0); }}>
            Subir PDF
          </Button>
          <Button type="button" variant="outline" size="sm" icon={<Link2 className="h-4 w-4" />} onClick={() => setMats([...mats, { title: "", type: "enlace", url: "" }])}>
            Agregar enlace
          </Button>
          <Button type="button" variant="ghost" size="sm" icon={<Plus className="h-4 w-4" />} onClick={() => setMats([...mats, { title: "", type: "video", url: "" }])}>
            Agregar video
          </Button>
        </div>
      </Section>

      <div className="sticky bottom-0 z-10 -mx-4 flex justify-end gap-3 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur">
        <Button type="button" variant="outline" onClick={() => router.push("/admin/formaciones")}>Volver</Button>
        <Button type="button" onClick={save} isLoading={saving} icon={<Save className="h-4 w-4" />}>Guardar</Button>
      </div>
      </PageBody>
    </>
  );
}
