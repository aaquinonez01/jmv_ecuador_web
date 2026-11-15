"use client";

import { useEffect, useMemo, useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { errorMessage, getComunidades, login, register, type ComunidadOption } from "@/lib/fiestas/api";
import { cn } from "@/lib/utils";
import { FiestaButton, Sheet } from "./ui";

// Entrar o crear cuenta sin salir de la fiesta. Es la misma cuenta de la app.

type Tab = "registro" | "entrar";

const input =
  "w-full min-h-12 rounded-2xl border border-white/20 bg-white/10 px-4 text-base text-white placeholder:text-white/45 shadow-[inset_0_2px_4px_rgba(0,0,0,0.25)] outline-none transition focus:border-[#f5b83d] focus:ring-2 focus:ring-[#f5b83d]/40";

function passwordProblem(p: string) {
  if (p.length < 6) return "Usa al menos 6 caracteres.";
  if (!/[A-Z]/.test(p) || !/[a-z]/.test(p)) return "Incluye una mayúscula y una minúscula.";
  if (!/\d|\W/.test(p)) return "Incluye al menos un número.";
  return null;
}

function friendly(e: unknown, tab: Tab) {
  const msg = errorMessage(e);
  if (/ya existe/i.test(msg)) return "Ya hay una cuenta con ese correo. Toca «Ya tengo cuenta» para entrar.";
  const status = (e as { response?: { status?: number } })?.response?.status;
  if (tab === "entrar" && (status === 400 || status === 401))
    return "El correo o la contraseña no coinciden. Revísalos.";
  return msg;
}

export default function AuthDialog({
  open,
  onClose,
  onDone,
  initialTab = "registro",
}: {
  open: boolean;
  onClose: () => void;
  onDone: () => void;
  initialTab?: Tab;
}) {
  const [tab, setTab] = useState<Tab>(initialTab);
  const [comunidades, setComunidades] = useState<ComunidadOption[]>([]);
  const [form, setForm] = useState({ fullName: "", comunidadId: "", email: "", password: "" });
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) setTab(initialTab);
  }, [open, initialTab]);

  useEffect(() => {
    if (!open || comunidades.length) return;
    getComunidades()
      .then((list) => setComunidades(list.filter((c) => c.nombre)))
      .catch(() => setError("No pudimos cargar las comunidades. Revisa tu internet."));
  }, [open, comunidades.length]);

  // Comunidades agrupadas por zona, en orden alfabético
  const groups = useMemo(() => {
    const map = new Map<string, ComunidadOption[]>();
    for (const c of comunidades) {
      const z = c.zona?.nombre ?? "Otras";
      map.set(z, [...(map.get(z) ?? []), c]);
    }
    return [...map.entries()]
      .sort(([a], [b]) => a.localeCompare(b, "es"))
      .map(([zona, list]) => ({ zona, list: list.sort((a, b) => a.nombre.localeCompare(b.nombre, "es")) }));
  }, [comunidades]);

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (tab === "registro") {
      if (form.fullName.trim().split(/\s+/).length < 2) return setError("Escribe tu nombre y apellido.");
      if (!form.comunidadId) return setError("Elige tu comunidad.");
      if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) return setError("Revisa tu correo.");
      const p = passwordProblem(form.password);
      if (p) return setError(p);
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

  return (
    <Sheet open={open} onClose={onClose} title={tab === "registro" ? "Únete a la novena" : "Qué bueno verte"}>
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
                placeholder="Ej. Katty Pérez"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-white/80">Tu comunidad</span>
              <select
                className={cn(input, "appearance-none")}
                value={form.comunidadId}
                onChange={(e) => set("comunidadId", e.target.value)}
              >
                <option value="" className="text-black">
                  {comunidades.length ? "Elige tu comunidad" : "Cargando…"}
                </option>
                {groups.map((g) => (
                  <optgroup key={g.zona} label={g.zona} className="text-black">
                    {g.list.map((c) => (
                      <option key={c.id} value={c.id} className="text-black">
                        {c.nombre}
                        {c.ciudad ? ` · ${c.ciudad}` : ""}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </label>
          </>
        )}
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-white/80">Correo</span>
          <input
            className={input}
            type="email"
            inputMode="email"
            autoComplete="email"
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
            <span className="mt-1.5 block text-xs text-white/60">Mínimo 6 caracteres, con mayúscula, minúscula y un número.</span>
          )}
        </label>

        {error && (
          <p role="alert" className="rounded-2xl border border-[#ff8a8a]/40 bg-[#d3302f]/20 px-4 py-3 text-sm text-white">
            {error}
          </p>
        )}

        <FiestaButton type="submit" tone="gold" className="w-full text-base" disabled={busy}>
          {busy && <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />}
          {tab === "registro" ? "Crear mi cuenta y empezar" : "Entrar"}
        </FiestaButton>
        {tab === "registro" ? (
          <p className="text-center text-xs text-white/60">
            Es la misma cuenta de la app de JMV: tus puntos te esperan allí.
          </p>
        ) : (
          <p className="text-center text-sm">
            <a href="/forgot-password" className="font-semibold text-[#f5c867] underline-offset-4 hover:underline">
              Olvidé mi contraseña
            </a>
          </p>
        )}
      </form>
    </Sheet>
  );
}
