"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CalendarClock, Check, ChevronDown, ImagePlus, Loader2, Trash2, UploadCloud } from "lucide-react";
import { errorMessage, getMyCommunity, removeMyPhoto, setMode, uploadPhotos } from "@/lib/fiestas/api";
import { MODES, type FiestaDaySummary, type MyCommunity, type PhotoStatus } from "@/lib/fiestas/types";
import { cn } from "@/lib/utils";
import { FiestaButton, Glass } from "./ui";

const STATUS: Record<PhotoStatus, { label: string; cls: string }> = {
  pending: { label: "En revisión", cls: "bg-white/85 text-[#0f2547]" },
  approved: { label: "En el mural", cls: "bg-[#2fa36b] text-white" },
  rejected: { label: "Quitada del mural", cls: "bg-[#d3302f] text-white" },
};

const shortDate = (iso: string) =>
  new Date(iso.slice(0, 10) + "T12:00:00").toLocaleDateString("es-EC", { day: "numeric", month: "short" }).replace(".", "");
const longDate = (iso: string) =>
  new Date(iso.slice(0, 10) + "T12:00:00").toLocaleDateString("es-EC", { day: "numeric", month: "long" });

/** Selector del día con el estilo de la fiesta (reemplaza al <select> nativo) */
function DayPicker({
  days,
  value,
  onChange,
  lastDay,
}: {
  days: FiestaDaySummary[];
  value: number;
  onChange: (n: number) => void;
  lastDay: number;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = days.find((d) => d.dayNumber === value) ?? days[0];

  useEffect(() => {
    if (!open) return;
    const out = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", out);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", out);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  const badge = (d: FiestaDaySummary, on: boolean) => (
    <span
      aria-hidden="true"
      className={cn(
        "grid h-10 w-10 shrink-0 place-items-center rounded-xl text-base font-bold",
        on ? "bg-[#f5b83d] text-[#3b2600] shadow-[0_3px_0_#9a6504]" : "bg-white/15 text-white",
      )}
    >
      {d.dayNumber === lastDay ? "★" : d.dayNumber}
    </span>
  );

  return (
    <div ref={ref}>
      <p id="fiesta-dia-label" className="mb-1.5 text-sm text-white/75">
        ¿De qué día?
      </p>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby="fiesta-dia-label"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex min-h-14 w-full items-center gap-3 rounded-2xl border bg-white/10 px-3 py-2 text-left shadow-[0_4px_0_rgba(0,0,0,0.3)] transition hover:bg-white/15 active:translate-y-0.5",
          open ? "border-[#f5b83d]" : "border-white/20",
        )}
      >
        {badge(current, true)}
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-bold text-white">
            {current.label}
            {current.title ? ` · ${current.title}` : ""}
          </span>
          <span className="block text-xs text-white/60">{shortDate(current.date)}</span>
        </span>
        <ChevronDown className={cn("h-5 w-5 shrink-0 text-[#f5c867] transition-transform", open && "rotate-180")} aria-hidden="true" />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-labelledby="fiesta-dia-label"
          className="mt-2 max-h-80 space-y-1 overflow-y-auto rounded-2xl border border-white/20 bg-black/30 p-1.5"
        >
          {days.map((d) => {
            const on = d.dayNumber === current.dayNumber;
            return (
              <li key={d.dayNumber} role="option" aria-selected={on}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(d.dayNumber);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex min-h-14 w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left transition",
                    on ? "bg-[#f5b83d]/20" : "hover:bg-white/10",
                  )}
                >
                  {badge(d, on)}
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold leading-snug text-white">
                      {d.label}
                      {d.title ? ` · ${d.title}` : ""}
                    </span>
                    <span className="block text-xs text-white/60">{shortDate(d.date)}</span>
                  </span>
                  {on && <Check className="h-5 w-5 shrink-0 text-[#f5c867]" aria-hidden="true" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

// Mi comunidad en la fiesta. El responsable elige cómo la viven y sube las fotos.
export default function CommunityPanel({
  slug,
  days,
  onChanged,
}: {
  slug: string;
  days: FiestaDaySummary[];
  onChanged?: () => void;
}) {
  const [data, setData] = useState<MyCommunity | null>(null);
  const [day, setDay] = useState<number>(() => days.filter((d) => d.state !== "locked").at(-1)?.dayNumber ?? 1);
  const [files, setFiles] = useState<File[]>([]);
  const [caption, setCaption] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const load = useCallback(() => getMyCommunity(slug).then(setData).catch(() => setData({ comunidad: null })), [slug]);
  useEffect(() => {
    load();
  }, [load]);

  if (!data) return <div className="h-40 animate-pulse rounded-3xl bg-white/10" />;
  if (!data.comunidad)
    return (
      <Glass className="p-6 text-white/80">
        Tu cuenta no tiene comunidad. Escríbenos y te la asignamos para que sumes puntos con ella.
      </Glass>
    );

  const opened = data.earlyPhotos ? days : days.filter((d) => d.state !== "locked");
  const lastDay = days.at(-1)?.dayNumber ?? 0;
  const max = Math.max(1, ...(data.perDay ?? []).map((d) => d.participants));

  const chooseMode = async (m: (typeof MODES)[number]["id"]) => {
    try {
      await setMode(slug, m);
      setData((d) => (d ? { ...d, mode: m } : d));
    } catch (e) {
      setMsg({ ok: false, text: errorMessage(e) });
    }
  };

  const upload = async () => {
    if (!files.length) return;
    setBusy(true);
    setMsg(null);
    try {
      const r = await uploadPhotos(slug, day, files, caption);
      setFiles([]);
      setCaption("");
      setMsg({
        ok: true,
        text: `¡Listo! ${r.uploaded} ${r.uploaded === 1 ? "foto subida" : "fotos subidas"}. Ya están en el mural.${r.failed ? ` (${r.failed} no se pudieron subir)` : ""}`,
      });
      await load();
      onChanged?.();
    } catch (e) {
      setMsg({ ok: false, text: errorMessage(e, "No se pudieron subir las fotos.") });
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    try {
      await removeMyPhoto(id);
      await load();
    } catch (e) {
      setMsg({ ok: false, text: errorMessage(e) });
    }
  };

  return (
    <Glass className="space-y-6 p-5 sm:p-6">
      <h3 className="font-display text-2xl font-semibold text-white">{data.comunidad.nombre}</h3>

      <div>
        <p className="mb-2 text-sm font-semibold text-white/85">
          {data.isLead ? "¿Cómo la viven en persona?" : "Así la viven en persona"}
        </p>
        <div className="grid grid-cols-3 gap-2">
          {MODES.map((m) => {
            const on = data.mode === m.id;
            return (
              <button
                key={m.id}
                type="button"
                disabled={!data.isLead}
                onClick={() => chooseMode(m.id)}
                aria-pressed={on}
                className={cn(
                  "rounded-2xl border px-2 py-3 text-center transition",
                  on
                    ? "border-[#f5b83d] bg-[#f5b83d] text-[#3b2600] shadow-[0_4px_0_#9a6504]"
                    : "border-white/20 bg-white/[0.08] text-white",
                  data.isLead && !on && "shadow-[0_4px_0_rgba(0,0,0,0.3)] hover:bg-white/15 active:translate-y-1",
                  !data.isLead && !on && "opacity-60",
                )}
              >
                <span className="block text-sm font-bold">{m.label}</span>
                <span className={cn("block text-[11px]", on ? "text-[#3b2600]/80" : "text-white/60")}>{m.hint}</span>
              </button>
            );
          })}
        </div>
        {!data.mode && !data.isLead && (
          <p className="mt-2 text-xs text-white/55">El responsable de tu comunidad aún no lo eligió.</p>
        )}
      </div>

      {(data.perDay?.length ?? 0) > 0 && (
        <div>
          <p className="mb-2 text-sm font-semibold text-white/85">Quiénes de tu comunidad participaron</p>
          <div className="flex h-24 items-end gap-1.5">
            {data.perDay!.map((d) => (
              <div key={d.dayNumber} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-[10px] font-semibold text-white/70">{d.participants || ""}</span>
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-[#c8860a] to-[#ffd36e] transition-all"
                  style={{ height: `${Math.max(4, (d.participants / max) * 64)}px`, opacity: d.participants ? 1 : 0.25 }}
                />
                <span className="text-[10px] text-white/55">{d.dayNumber === lastDay ? "★" : d.dayNumber}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.isLead ? (
        <div className="space-y-4 rounded-3xl border border-white/15 bg-black/20 p-4">
          <div className="flex items-center gap-2">
            <UploadCloud className="h-5 w-5 text-[#f5c867]" aria-hidden="true" />
            <p className="font-semibold text-white">Sube las fotos de tu comunidad</p>
          </div>
          {opened.length === 0 && days[0] && (
            <p className="flex items-center gap-3 rounded-2xl border border-[#f5b83d]/40 bg-[#f5b83d]/10 px-4 py-3 text-sm text-white/85">
              <CalendarClock className="h-5 w-5 shrink-0 text-[#f5c867]" aria-hidden="true" />
              Podrán subir fotos desde el {longDate(days[0].date)}, cuando empiece el primer día.
            </p>
          )}
          {opened.length > 0 && (
            <>
          {opened.length > 0 && <DayPicker days={opened} value={day} onChange={setDay} lastDay={lastDay} />}
          <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-white/25 bg-white/[0.04] p-4 text-center transition hover:border-[#f5b83d] hover:bg-white/[0.07]">
            <ImagePlus className="h-8 w-8 text-[#f5c867]" aria-hidden="true" />
            <span className="text-sm font-semibold text-white">
              {files.length ? `${files.length} ${files.length === 1 ? "foto elegida" : "fotos elegidas"}` : "Elige hasta 10 fotos"}
            </span>
            <span className="text-xs text-white/55">JPG, PNG o WEBP · hasta 10 MB cada una</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="sr-only"
              onChange={(e) => setFiles(Array.from(e.target.files ?? []).slice(0, data.maxPhotosPerDay ?? 10))}
            />
          </label>
          {files.length > 0 && (
            <div className="flex gap-2 overflow-x-auto">
              {files.map((f) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={f.name + f.size} src={URL.createObjectURL(f)} alt="" className="h-16 w-16 shrink-0 rounded-xl object-cover" />
              ))}
            </div>
          )}
          <input
            value={caption}
            onChange={(e) => setCaption(e.target.value.slice(0, 200))}
            placeholder="Una frase sobre el momento (opcional)"
            className="min-h-12 w-full rounded-2xl border border-white/20 bg-white/10 px-4 text-white placeholder:text-white/45"
          />
          <FiestaButton tone="gold" className="w-full" disabled={!files.length || busy} onClick={upload}>
            {busy ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> : <UploadCloud className="h-5 w-5" aria-hidden="true" />}
            {busy ? "Subiendo…" : "Subir fotos"}
          </FiestaButton>
            </>
          )}
          {msg && (
            <p
              role="status"
              className={cn(
                "rounded-2xl px-4 py-3 text-sm",
                msg.ok ? "bg-[#2fa36b]/25 text-white" : "bg-[#d3302f]/25 text-white",
              )}
            >
              {msg.text}
            </p>
          )}

          {(data.photos?.length ?? 0) > 0 && (
            <div>
              <p className="mb-2 text-sm font-semibold text-white/85">Fotos de tu comunidad</p>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {data.photos!.map((p) => (
                  <div key={p.id} className="relative overflow-hidden rounded-2xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.url.replace("/upload/", "/upload/w_300,q_auto,f_auto/")} alt={p.caption ?? ""} className="aspect-square w-full object-cover" />
                    <span className={cn("absolute left-1.5 top-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold", STATUS[p.status].cls)}>
                      {STATUS[p.status].label}
                    </span>
                    <span className="absolute bottom-1.5 left-1.5 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-white">
                      Día {p.dayNumber}
                    </span>
                    {(
                      <button
                        type="button"
                        onClick={() => remove(p.id)}
                        aria-label="Quitar foto"
                        className="absolute right-1.5 top-1.5 grid h-8 w-8 place-items-center rounded-full bg-black/60 text-white hover:bg-[#d3302f]"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <p className="rounded-2xl bg-black/20 px-4 py-3 text-sm text-white/70">
          Las fotos de tu comunidad las sube su responsable. ¿Eres coordinador? Pide al equipo nacional que te marque como
          responsable.
        </p>
      )}
    </Glass>
  );
}
