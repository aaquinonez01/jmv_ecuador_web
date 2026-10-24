// Piezas compartidas de las imágenes del Año Vicenciano (historias y Open Graph).
// Solo se usan con next/og (Satori): cada div con varios hijos necesita display flex.

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { starPoints } from "@/components/brand/svg-props";
import { CATEGORY_META, MONTHS } from "@/lib/calendario";
import type { CalendarDateItem } from "@/types/calendar";

export const GOLD = "#F5B83D";
export const NIGHT = "linear-gradient(180deg, #040A18 0%, #0A1B38 38%, #12305A 72%, #163A68 100%)";

type OgFont = {
  name: string;
  data: Buffer;
  weight: 500 | 600 | 700;
  style: "normal" | "italic";
};

const fontsDir = join(process.cwd(), "public/fonts/og");

let fontsPromise: Promise<OgFont[]> | null = null;

/** Fraunces (títulos) y Poppins (texto), como en el sitio */
export function loadOgFonts() {
  fontsPromise ??= Promise.all([
    readFile(join(fontsDir, "Fraunces-SemiBold.ttf")),
    readFile(join(fontsDir, "Fraunces-MediumItalic.ttf")),
    readFile(join(fontsDir, "Poppins-Medium.ttf")),
    readFile(join(fontsDir, "Poppins-Bold.ttf")),
  ]).then(([fraunces, frauncesItalic, poppins, poppinsBold]) => [
    { name: "Fraunces", data: fraunces, weight: 600, style: "normal" },
    { name: "Fraunces", data: frauncesItalic, weight: 500, style: "italic" },
    { name: "Poppins", data: poppins, weight: 500, style: "normal" },
    { name: "Poppins", data: poppinsBold, weight: 700, style: "normal" },
  ]);
  // Si falla la lectura, el siguiente intento vuelve a probar
  fontsPromise.catch(() => {
    fontsPromise = null;
  });
  return fontsPromise;
}

let logoPromise: Promise<string> | null = null;

export function loadOgLogo() {
  logoPromise ??= readFile(join(process.cwd(), "public/logo-jmv.png")).then(
    (buf) => `data:image/png;base64,${buf.toString("base64")}`
  );
  return logoPromise;
}

export function categoryColor(item: Pick<CalendarDateItem, "category">) {
  return CATEGORY_META[item.category]?.color ?? GOLD;
}

/** Recorta en la última palabra completa y añade "…" */
export function clampText(text: string, max: number) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > max * 0.6 ? lastSpace : max).replace(/[\s,.;:]+$/, "")}…`;
}

/** Frase para la imagen: la cita si existe; si no, el resumen */
export function featuredPhrase(item: CalendarDateItem, max: number) {
  if (item.quote?.trim()) {
    return { text: clampText(item.quote, max), author: item.quoteAuthor?.trim() || null, isQuote: true };
  }
  return { text: clampText(item.summary, max), author: null, isQuote: false };
}

// Generador determinista (mismo slug = mismo cielo) para las estrellas de fondo
function seeded(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

/** Cielo nocturno: puntitos de luz repartidos al azar (deterministas) */
export function SkyDust({
  seed,
  width,
  height,
  count,
}: {
  seed: string;
  width: number;
  height: number;
  count: number;
}) {
  const rand = seeded(seed);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width, height, display: "flex" }}>
      {Array.from({ length: count }, (_, i) => {
        const size = rand() < 0.85 ? 2 + rand() * 2 : 4 + rand() * 3;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: rand() * width,
              top: rand() * height,
              width: size,
              height: size,
              borderRadius: size,
              background: "white",
              opacity: 0.25 + rand() * 0.6,
            }}
          />
        );
      })}
    </div>
  );
}

/**
 * Anillo de 12 estrellas = 12 meses (enero arriba, en sentido horario).
 * La estrella del mes de la fecha se ilumina con el color de su categoría.
 */
export function MonthRing({
  size,
  month,
  color,
}: {
  size: number;
  month?: number;
  color: string;
}) {
  const c = size / 2;
  const radius = size * 0.43;
  const stars = Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
    return { i, x: c + Math.cos(a) * radius, y: c + Math.sin(a) * radius };
  });
  const active = month ? stars[month - 1] : null;
  const small = size * 0.034;
  const big = size * 0.062;

  return (
    <div style={{ position: "relative", width: size, height: size, display: "flex" }}>
      {/* Halo del mes */}
      {active ? (
        <div
          style={{
            position: "absolute",
            left: active.x - big * 3.2,
            top: active.y - big * 3.2,
            width: big * 6.4,
            height: big * 6.4,
            borderRadius: big * 3.2,
            backgroundImage: `radial-gradient(circle, ${color}AA 0%, ${color}33 35%, transparent 70%)`,
          }}
        />
      ) : null}
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ position: "absolute", left: 0, top: 0 }}>
        <circle cx={c} cy={c} r={radius} fill="none" stroke={GOLD} strokeOpacity={0.22} strokeWidth={size * 0.003} />
        <circle cx={c} cy={c} r={radius * 0.8} fill="none" stroke="white" strokeOpacity={0.08} strokeWidth={size * 0.002} />
        {stars.map((s) => (
          <polygon
            key={s.i}
            points={starPoints(s.x, s.y, s.i === (month ?? 0) - 1 ? big : small)}
            fill={s.i === (month ?? 0) - 1 ? color : GOLD}
            fillOpacity={s.i === (month ?? 0) - 1 ? 1 : 0.85}
          />
        ))}
      </svg>
    </div>
  );
}

/** Franja tricolor de marca (azul, dorado, rojo) */
export function BrandBar({ height }: { height: number }) {
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height, display: "flex" }}>
      <div style={{ flex: 1, background: "#1D4E8A" }} />
      <div style={{ flex: 1, background: "#D98F06" }} />
      <div style={{ flex: 1, background: "#D3302F" }} />
    </div>
  );
}

export function monthName(month: number) {
  return MONTHS[month - 1] ?? "";
}

/** Nombre de archivo sin tildes ni símbolos */
export function fileSlug(text: string) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}
