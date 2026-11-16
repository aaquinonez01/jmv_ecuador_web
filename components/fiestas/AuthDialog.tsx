"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Check, ChevronRight, Eye, EyeOff, Loader2, MapPin, Search, Users } from "lucide-react";
import { errorMessage, getComunidades, login, register, type ComunidadOption } from "@/lib/fiestas/api";
import { cn } from "@/lib/utils";
import { FiestaButton, Sheet } from "./ui";

// Entrar o crear cuenta sin salir de la fiesta. Es la misma cuenta de la app.

type Tab = "registro" | "entrar";

const input =
  "w-full min-h-12 rounded-2xl border border-white/20 bg-white/10 px-4 text-base text-white placeholder:text-white/45 shadow-[inset_0_2px_4px_rgba(0,0,0,0.25)] outline-none transition focus:border-[#f5b83d] focus:ring-2 focus:ring-[#f5b83d]/40";

const RULES = [
  { label: "6 caracteres o más", ok: (p: string) => p.length >= 6 },
  { label: "Mayúscula y minúscula", ok: (p: string) => /[A-Z]/.test(p) && /[a-z]/.test(p) },
  { label: "Un número", ok: (p: string) => /\d|\W/.test(p) },
];

/** Sin tildes ni mayúsculas, para buscar "riobamba" o "corazon" */
const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

const initials = (s: string) =>
  s
    .split(/\s+/)
    .filter((w) => w.length > 2)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("") || s.slice(0, 2).toUpperCase();

const HUES = ["#f5b83d", "#5b8dd6", "#e2504f", "#4fd18f", "#b98cf2", "#f28c5b"];
const hueOf = (id: string) => HUES[[...id].reduce((a, c) => a + c.charCodeAt(0), 0) % HUES.length];

function friendly(e: unknown, tab: Tab) {
  const msg = errorMessage(e);
  if (/ya existe/i.test(msg)) return "Ya hay una cuenta con ese correo. Toca «Ya tengo cuenta» para entrar.";
  const status = (e as { response?: { status?: number } })?.response?.status;
  if (tab === "entrar" && (status === 400 || status === 401)) return "El correo o la contraseña no coinciden. Revísalos.";
  return msg;
}

// ── Selector de comunidad: búsqueda, zonas y lista agrupada ──

function ComunidadPicker({
  comunidades,
  loading,
  value,
  onPick,
}: {
  comunidades: ComunidadOption[];
  loading: boolean;
  value: string;
  onPick: (c: ComunidadOption) => void;
}) {
  const [q, setQ] = useState("");
  const [zona, setZona] = useState<string>("");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setTimeout(() => searchRef.current?.focus(), 250);
    return () => clearTimeout(t);
  }, []);

  const zonas = useMemo(
    () => [...new Set(comunidades.map((c) => c.zona?.nombre ?? "Otras"))].sort((a, b) => a.localeCompare(b, "es", { numeric: true })),
    [comunidades],
  );

  const groups = useMemo(() => {
    const term = norm(q.trim());
    const list = comunidades.filter(
      (c) =>
        (!zona || (c.zona?.nombre ?? "Otras") === zona) &&
        (!term || norm(`${c.nombre} ${c.ciudad ?? ""} ${c.zona?.nombre ?? ""}`).includes(term)),
    );
    const map = new Map<string, ComunidadOption[]>();
    for (const c of list) {
      const z = c.zona?.nombre ?? "Otras";
      map.set(z, [...(map.get(z) ?? []), c]);
    }
    return [...map.entries()]
      .sort(([a], [b]) => a.localeCompare(b, "es", { numeric: true }))
      .map(([z, l]) => ({ zona: z, list: l.sort((a, b) => a.nombre.localeCompare(b.nombre, "es")) }));
  }, [comunidades, q, zona]);

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/50" aria-hidden="true" />
        <input
          ref={searchRef}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Busca por nombre o ciudad"
          className={cn(input, "pl-12")}
          aria-label="Buscar comunidad"
        />
      </div>

      {zonas.length > 1 && (
        <div className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-1 [scrollbar-width:none]">
          {["", ...zonas].map((z) => (
            <button
              key={z || "todas"}
              type="button"
              onClick={() => setZona(z)}
              className={cn(
                "min-h-9 shrink-0 rounded-full px-3.5 text-sm font-semibold transition active:translate-y-0.5",
                zona === z
                  ? "bg-[#f5b83d] text-[#3b2600] shadow-[0_3px_0_#9a6504]"
                  : "border border-white/20 bg-white/10 text-white/85 shadow-[0_3px_0_rgba(0,0,0,0.25)] hover:bg-white/15",
              )}
            >
              {z || "Todas"}
            </button>
          ))}
        </div>
      )}

      <div className="-mx-2 max-h-[52vh] overflow-y-auto px-2 pb-2 sm:max-h-[420px]">
        {loading ? (
          <div className="space-y-2">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded-2xl bg-white/10" />
            ))}
          </div>
        ) : groups.length === 0 ? (
          <div className="py-10 text-center">
            <Users className="mx-auto mb-2 h-9 w-9 text-white/40" aria-hidden="true" />
            <p className="font-semibold">No encontramos «{q}»</p>
            <p className="text-sm text-white/60">Prueba con el nombre de tu ciudad.</p>
          </div>
        ) : (
          groups.map((g) => (
            <section key={g.zona} className="mb-3">
              <h3 className="sticky top-0 z-10 -mx-2 mb-1.5 bg-[#132b4f]/95 px-2 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#f5c867] backdrop-blur">
                {g.zona}
              </h3>
              <ul className="space-y-2">
                {g.list.map((c) => {
                  const on = c.id === value;
                  return (
                    <li key={c.id}>
                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onPick(c)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-2xl border px-3 py-2.5 text-left transition",
                          on
                            ? "border-[#f5b83d] bg-[#f5b83d]/15 shadow-[0_3px_0_rgba(154,101,4,0.6)]"
                            : "border-white/10 bg-white/[0.06] shadow-[0_3px_0_rgba(0,0,0,0.25)] hover:border-white/25 hover:bg-white/10",
                        )}
                      >
                        <span
                          className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-sm font-bold text-[#0b1a33] shadow-[inset_0_-3px_0_rgba(0,0,0,0.15)]"
                          style={{ background: hueOf(c.id) }}
                          aria-hidden="true"
                        >
                          {initials(c.nombre)}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-semibold text-white">{c.nombre}</span>
                          {c.ciudad && (
                            <span className="flex items-center gap-1 text-xs text-white/60">
                              <MapPin className="h-3 w-3" aria-hidden="true" />
                              {c.ciudad}
                            </span>
                          )}
                        </span>
                        <span
                          className={cn(
                            "grid h-7 w-7 shrink-0 place-items-center rounded-full border-2",
                            on ? "border-[#f5b83d] bg-[#f5b83d] text-[#3b2600]" : "border-white/25 text-transparent",
                          )}
                        >
                          <Check className="h-4 w-4" strokeWidth={3} />
                        </span>
                      </motion.button>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))
        )}
      </div>
    </div>
  );
}

export default function AuthDialog({
  open,
  onClose,
  onDone,
  initialTab = "registro",
  joinTitle,
}: {
  open: boolean;
  onClose: () => void;
  onDone: () => void;
  initialTab?: Tab;
  /** Título del registro (por defecto, el de la novena) */
  joinTitle?: string;
}) {
  const [tab, setTab] = useState<Tab>(initialTab);
  const [picking, setPicking] = useState(false);
  const [comunidades, setComunidades] = useState<ComunidadOption[]>([]);
  const [loadingCom, setLoadingCom] = useState(true);
  const [form, setForm] = useState({ fullName: "", comunidadId: "", email: "", password: "" });
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setTab(initialTab);
      setPicking(false);
    }
  }, [open, initialTab]);

  // Normalmente ya vienen en caché (la página las pide al cargar)
  useEffect(() => {
    if (!open || comunidades.length) return;
    setLoadingCom(true);
    getComunidades()
      .then(setComunidades)
      .catch(() => setError("No pudimos cargar las comunidades. Revisa tu internet."))
      .finally(() => setLoadingCom(false));
  }, [open, comunidades.length]);

  const chosen = comunidades.find((c) => c.id === form.comunidadId);
  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (tab === "registro") {
      if (form.fullName.trim().split(/\s+/).length < 2) return setError("Escribe tu nombre y apellido.");
      if (!form.comunidadId) return setError("Elige tu comunidad.");
      if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) return setError("Revisa tu correo.");
      if (!RULES.every((r) => r.ok(form.password))) return setError("Tu contraseña aún no cumple los requisitos.");
    } else if (!form.email.trim() || !form.password) {
      return setError("Escribe tu correo y tu contraseña.");
    }
    setBusy(true);
    try {
      if (tab === "registro") await register(form);
      else await login(form.email, form.password);
      onDone();
    } catch (err) {
      setError(friendly(err, tab));
    } finally {
      setBusy(false);
    }
  };

  const title = picking ? "Tu comunidad" : tab === "registro" ? (joinTitle ?? "Únete a la novena") : "Qué bueno verte";

  return (
    <Sheet open={open} onClose={picking ? () => setPicking(false) : onClose} title={title}>
      <AnimatePresence mode="wait" initial={false}>
        {picking ? (
          <motion.div
            key="picker"
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 40, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button
              type="button"
              onClick={() => setPicking(false)}
              className="mb-3 inline-flex min-h-10 items-center gap-1.5 text-sm font-semibold text-white/75 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Volver al registro
            </button>
            <ComunidadPicker
              comunidades={comunidades}
              loading={loadingCom && !comunidades.length}
              value={form.comunidadId}
              onPick={(c) => {
                set("comunidadId", c.id);
                setError("");
                setPicking(false);
              }}
            />
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -40, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="mb-5 grid grid-cols-2 gap-1 rounded-2xl bg-black/25 p-1">
              {(["registro", "entrar"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setTab(t);
                    setError("");
                  }}
                  className={cn(
                    "min-h-11 rounded-xl text-sm font-semibold transition",
                    tab === t ? "bg-white text-[#0f2547] shadow-[0_3px_0_rgba(0,0,0,0.25)]" : "text-white/70 hover:text-white",
                  )}
                >
                  {t === "registro" ? "Crear cuenta" : "Ya tengo cuenta"}
                </button>
              ))}
            </div>

            <form onSubmit={submit} className="space-y-4" noValidate>
              {tab === "registro" && (
                <>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium text-white/80">Nombre y apellido</span>
                    <input
                      className={input}
                      value={form.fullName}
                      onChange={(e) => set("fullName", e.target.value)}
                      autoComplete="name"
                      autoCapitalize="words"
                      placeholder="Ej. Katty Pérez"
                    />
                  </label>
                  <div>
                    <span className="mb-1.5 block text-sm font-medium text-white/80">Tu comunidad</span>
                    <button
                      type="button"
                      onClick={() => setPicking(true)}
                      className={cn(
                        "flex min-h-14 w-full items-center gap-3 rounded-2xl border px-3 text-left transition active:translate-y-0.5",
                        chosen
                          ? "border-[#f5b83d]/70 bg-[#f5b83d]/10 shadow-[0_3px_0_rgba(154,101,4,0.5)]"
                          : "border-dashed border-white/30 bg-white/[0.06] hover:border-[#f5b83d] hover:bg-white/10",
                      )}
                    >
                      {chosen ? (
                        <span
                          className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-sm font-bold text-[#0b1a33]"
                          style={{ background: hueOf(chosen.id) }}
                          aria-hidden="true"
                        >
                          {initials(chosen.nombre)}
                        </span>
                      ) : (
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10 text-[#f5c867]">
                          <Users className="h-5 w-5" aria-hidden="true" />
                        </span>
                      )}
                      <span className="min-w-0 flex-1">
                        <span className={cn("block truncate font-semibold", chosen ? "text-white" : "text-white/70")}>
                          {chosen ? chosen.nombre : "Elige tu comunidad"}
                        </span>
                        <span className="block truncate text-xs text-white/55">
                          {chosen
                            ? [chosen.ciudad, chosen.zona?.nombre].filter(Boolean).join(" · ")
                            : comunidades.length === 1 ? "1 comunidad de JMV Ecuador" : `${comunidades.length || "Todas las"} comunidades de JMV Ecuador`}
                        </span>
                      </span>
                      <ChevronRight className="h-5 w-5 shrink-0 text-white/50" aria-hidden="true" />
                    </button>
                  </div>
                </>
              )}
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-white/80">Correo</span>
                <input
                  className={input}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  autoCapitalize="none"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder="tu@correo.com"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-white/80">Contraseña</span>
                <div className="relative">
                  <input
                    className={cn(input, "pr-12")}
                    type={show ? "text" : "password"}
                    autoComplete={tab === "registro" ? "new-password" : "current-password"}
                    value={form.password}
                    onChange={(e) => set("password", e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShow((s) => !s)}
                    aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
                    className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-white/70 hover:text-white"
                  >
                    {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {tab === "registro" && (
                  <span className="mt-2 flex flex-wrap gap-1.5">
                    {RULES.map((r) => {
                      const ok = r.ok(form.password);
                      return (
                        <span
                          key={r.label}
                          className={cn(
                            "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition",
                            ok ? "bg-[#2fa36b]/25 text-[#7be3ad]" : "bg-white/10 text-white/55",
                          )}
                        >
                          <Check className={cn("h-3 w-3", ok ? "opacity-100" : "opacity-40")} strokeWidth={3} aria-hidden="true" />
                          {r.label}
                        </span>
                      );
                    })}
                  </span>
                )}
              </label>

              {error && (
                <p role="alert" className="rounded-2xl border border-[#ff8a8a]/40 bg-[#d3302f]/20 px-4 py-3 text-sm text-white">
                  {error}
                </p>
              )}

              <FiestaButton type="submit" tone="gold" className="w-full text-base" disabled={busy}>
                {busy && <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />}
                {busy ? (tab === "registro" ? "Creando tu cuenta…" : "Entrando…") : tab === "registro" ? "Crear mi cuenta y empezar" : "Entrar"}
              </FiestaButton>
              {tab === "registro" ? (
                <p className="text-center text-xs text-white/60">Es la misma cuenta de la app de JMV: tus puntos te esperan allí.</p>
              ) : (
                <p className="text-center text-sm">
                  <a href="/forgot-password" className="font-semibold text-[#f5c867] underline-offset-4 hover:underline">
                    Olvidé mi contraseña
                  </a>
                </p>
              )}
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </Sheet>
  );
}
