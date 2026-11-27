"use client";

// Tarjeta vertical (1080×1920) para estados de WhatsApp e historias de Instagram.

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = w;
    } else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

const HEART = "M0 10C0 2 6-4 13-4c5 0 9 3 11 7 2-4 6-7 11-7 7 0 13 6 13 14 0 14-16 24-24 32C16 34 0 24 0 10Z";
const FLAME = "M24 3c-4-5-2-10 0-14 2 4 4 9 0 14Z";
const INSCRIPTION = "OH MARÍA, SIN PECADO CONCEBIDA, RUEGA POR NOSOTROS QUE RECURRIMOS A TI";

/**
 * Dibuja la medalla con las mismas formas que el componente Medal (lienzo 200×260):
 * en oro las piezas ganadas y en contorno punteado las que faltan.
 */
function drawMedal(ctx: CanvasRenderingContext2D, cx: number, cy: number, k: number, earned: Set<string>, face: "front" | "back") {
  const complete = earned.has("medalla");
  const has = (id: string) => complete || earned.has(id);
  ctx.save();
  ctx.translate(cx - 100 * k, cy - 130 * k);
  ctx.scale(k, k);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  const gold = ctx.createLinearGradient(8, 8, 192, 252);
  gold.addColorStop(0, "#ffe7a3");
  gold.addColorStop(0.45, "#f5b83d");
  gold.addColorStop(1, "#c8860a");
  const OFF = "rgba(255,255,255,0.2)";

  const body = ctx.createRadialGradient(100, 100, 6, 100, 130, 150);
  body.addColorStop(0, complete ? "#3a5f96" : "#1c3a66");
  body.addColorStop(1, complete ? "#13284b" : "#0d1d38");
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.ellipse(100, 130, 92, 122, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = complete ? gold : "rgba(245,184,61,0.5)";
  ctx.lineWidth = complete ? 5 : 3;
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(100, 130, 84, 114, 0, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(245,184,61,0.22)";
  ctx.lineWidth = 1;
  ctx.stroke();

  /** Traza (y rellena si toca) una pieza con el estilo de ganada o pendiente */
  const piece = (id: string, parts: { d: string; w: number; fill?: boolean }[], transform?: [number, number, number]) => {
    const on = has(id);
    ctx.save();
    if (transform) {
      ctx.translate(transform[0], transform[1]);
      ctx.scale(transform[2], transform[2]);
    }
    ctx.strokeStyle = on ? gold : OFF;
    ctx.setLineDash(on ? [] : [3, 4]);
    if (on) {
      ctx.shadowColor = "rgba(245,184,61,0.55)";
      ctx.shadowBlur = 5 * k;
    }
    for (const part of parts) {
      const path = new Path2D(part.d);
      if (on && part.fill) {
        ctx.fillStyle = "rgba(245,184,61,0.16)";
        ctx.fill(path);
      }
      ctx.lineWidth = part.w;
      ctx.stroke(path);
    }
    ctx.restore();
  };

  if (face === "front") {
    const rays = [0, 1, 2, 3, 4, 5].flatMap((i) => [
      `M${74 - i * 0.6} ${132 + i * 2}L${40 + i * 6} ${196 + i * 2}`,
      `M${126 + i * 0.6} ${132 + i * 2}L${160 - i * 6} ${196 + i * 2}`,
    ]);
    piece("rayos", rays.map((d) => ({ d, w: 1.6 })));
    piece("globo", [
      { d: "M62 214 A38 18 0 0 1 138 214 Z", w: 2, fill: true },
      { d: "M74 205 Q100 198 126 205 M100 196 V214 M84 199 Q80 207 82 214 M116 199 Q120 207 118 214", w: 1.2 },
    ]);
    piece("serpiente", [
      { d: "M58 206 C66 196 74 212 84 204 S100 196 110 204 S128 210 136 200", w: 2.2 },
      { d: "M136 200 C139 196 145 196 146 200 C145 204 139 204 136 200 Z", w: 1.6 },
    ]);
    piece("maria", [
      { d: "M109 74 A9 9 0 1 1 91 74 A9 9 0 1 1 109 74 Z", w: 2.2, fill: true },
      { d: "M100 63 C86 65 82 80 85 94 L70 194 C86 202 114 202 130 194 L115 94 C118 80 114 65 100 63 Z", w: 2.2, fill: true },
      { d: "M88 102 C82 112 78 122 74 132 M112 102 C118 112 122 122 126 132", w: 2.2 },
      { d: "M92 150 C96 160 104 160 108 150", w: 1.2 },
    ]);
    // Jaculatoria sobre el arco de la medalla (elipse 72×104 centrada en 100,130)
    const on = has("inscripcion");
    ctx.fillStyle = on ? "#f5c867" : "rgba(255,255,255,0.2)";
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    ctx.font = "600 7.6px Poppins, system-ui, sans-serif";
    const t0 = Math.atan2((186 - 130) / 104, (39 - 100) / 72);
    const t1 = Math.atan2((186 - 130) / 104, (161 - 100) / 72) + Math.PI * 2;
    const N = 600;
    const pts: { x: number; y: number; len: number }[] = [];
    for (let i = 0; i <= N; i++) {
      const t = t0 + ((t1 - t0) * i) / N;
      const x = 100 + 72 * Math.cos(t);
      const y = 130 + 104 * Math.sin(t);
      const prev = pts[i - 1];
      pts.push({ x, y, len: prev ? prev.len + Math.hypot(x - prev.x, y - prev.y) : 0 });
    }
    const total = pts[N].len;
    const chars = [...INSCRIPTION];
    const widths = chars.map((ch) => ctx.measureText(ch).width + 0.3);
    let pos = (total - widths.reduce((a, b) => a + b, 0)) / 2;
    let j = 0;
    chars.forEach((ch, i) => {
      const mid = pos + widths[i] / 2;
      while (j < N - 1 && pts[j + 1].len < mid) j++;
      const a = pts[j];
      const b = pts[j + 1];
      ctx.save();
      ctx.translate(a.x, a.y);
      ctx.rotate(Math.atan2(b.y - a.y, b.x - a.x));
      ctx.fillText(ch, 0, 0);
      ctx.restore();
      pos += widths[i];
    });
    ctx.font = "700 11px Poppins, system-ui, sans-serif";
    ctx.fillText("1830", 100, 238);
  } else {
    const stars = Array.from({ length: 12 }, (_, i) => {
      const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
      const sx = 100 + Math.cos(a) * 74;
      const sy = 130 + Math.sin(a) * 104;
      const p = Array.from({ length: 10 }, (_, n) => {
        const r = n % 2 === 0 ? 7 : 7 * 0.42;
        const ang = (Math.PI / 5) * n - Math.PI / 2;
        return `${(sx + Math.cos(ang) * r).toFixed(2)} ${(sy + Math.sin(ang) * r).toFixed(2)}`;
      });
      return { d: `M${p.join(" L")} Z`, w: 1.2, fill: true };
    });
    piece("estrellas", stars);
    piece("cruz", [{ d: "M100 50 V108 M86 66 H114 M68 108 H132", w: 5 }]);
    piece("m", [{ d: "M72 164 V122 L100 150 L128 122 V164 M100 108 V150", w: 5 }]);
    piece(
      "corazones",
      [
        { d: HEART, w: 2.4, fill: true },
        { d: "M1 12c9 5 37 5 46 0M2 18c9 5 35 5 44 0", w: 2.4 },
        { d: FLAME, w: 2.4, fill: true },
        { d: "M24 -14v-10M20 -20h8", w: 2.4 },
      ],
      [51, 186, 0.82],
    );
    piece(
      "corazones",
      [
        { d: HEART, w: 2.4, fill: true },
        { d: "M-12 -8L20 20M-14 0l10-10M-12 -8l-5-5", w: 2.4 },
        { d: FLAME, w: 2.4, fill: true },
      ],
      [110, 186, 0.82],
    );
  }
  ctx.restore();
}

/** Pide a Cloudinary la foto completa a un tamaño razonable, sin recortarla (otras direcciones se dejan igual) */
function fitUrl(url: string) {
  return url.includes("res.cloudinary.com") && url.includes("/upload/")
    ? url.replace("/upload/", "/upload/c_limit,w_1100,h_1400,f_jpg,q_auto/")
    : url;
}

/** Carga una imagen para dibujarla en el lienzo (null si no se puede) */
function loadImage(url: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

export async function makeShareCard(p: {
  fiestaTitle: string;
  headline: string;
  piece: string;
  /** Piezas ya ganadas (ids de PIECES) */
  earned: string[];
  /** Cara de la medalla que se dibuja */
  face: "front" | "back";
  /** Ej.: "1 de 10 piezas de mi Medalla" */
  progress?: string;
  /** Frase bajo el titular (hasta dos líneas): lo vivido en la fiesta */
  message?: string;
  /** Foto de quien comparte (su recuerdo con la medalla): va en grande, con la Medalla al lado */
  photo?: string | null;
  /** Símbolo por capas: imagen base y capas ya ganadas (en lugar de la Medalla) */
  layers?: { base: string | null; images: string[] };
  footer: string;
  url: string;
}): Promise<Blob> {
  const W = 1080;
  const H = 1920;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d")!;
  await document.fonts?.ready;

  const bg = ctx.createRadialGradient(W / 2, 300, 50, W / 2, 700, 1500);
  bg.addColorStop(0, "#1d4e8a");
  bg.addColorStop(0.45, "#0f2547");
  bg.addColorStop(1, "#070d1d");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  const rand = seeded(27);
  for (let i = 0; i < 180; i++) {
    ctx.globalAlpha = 0.25 + rand() * 0.6;
    ctx.fillStyle = i % 4 === 0 ? "#f5c867" : "#ffffff";
    ctx.beginPath();
    ctx.arc(rand() * W, rand() * H, 1 + rand() * 2.6, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // La medalla tal como va: en oro las piezas ganadas, en contorno tenue las que faltan
  const cx = W / 2;
  const cy = 680;
  const complete = p.layers ? !p.progress : p.earned.includes("medalla");
  const halo = ctx.createRadialGradient(cx, cy, 60, cx, cy, 540);
  halo.addColorStop(0, complete ? "rgba(245,184,61,0.45)" : "rgba(91,141,214,0.35)");
  halo.addColorStop(1, "rgba(245,184,61,0)");
  ctx.fillStyle = halo;
  ctx.fillRect(0, 110, W, 1140);
  if (p.layers) {
    // Todas las capas miden lo mismo que la base: se dibujan en el mismo recuadro
    const imgs = await Promise.all([p.layers.base, ...p.layers.images].map((u) => (u ? loadImage(u) : null)));
    const ref = imgs.find(Boolean);
    if (ref) {
      const k = Math.min(820 / ref.naturalWidth, 820 / ref.naturalHeight);
      const w = ref.naturalWidth * k;
      const h = ref.naturalHeight * k;
      for (const img of imgs) if (img) ctx.drawImage(img, cx - w / 2, cy - h / 2, w, h);
    }
  } else {
    // Con foto: en un marco dorado de esquinas redondeadas, con la Medalla más pequeña a un lado.
    // Las fotos muy alargadas se recortan un poco (sobre todo por abajo) para que el marco no quede
    // tan angosto, pero conservando el rostro y el pecho, que es donde va la medalla puesta.
    const photo = p.photo ? await loadImage(fitUrl(p.photo)) : null;
    if (photo) {
      const MAX_RATIO = 1.45; // alto / ancho máximo del marco
      const srcW = photo.naturalWidth;
      const srcH = Math.min(photo.naturalHeight, srcW * MAX_RATIO);
      // de lo que sobra, se quita el 40 % arriba y el 60 % abajo
      const srcY = (photo.naturalHeight - srcH) * 0.4;
      const k = Math.min(720 / srcW, 880 / srcH);
      const w = srcW * k;
      const h = srcH * k;
      const x = cx - w / 2;
      const y = 150 + (880 - h) / 2;
      const round = (pad: number, radius: number) => {
        ctx.beginPath();
        ctx.roundRect(x - pad, y - pad, w + pad * 2, h + pad * 2, radius);
      };
      ctx.save();
      ctx.shadowColor = "rgba(245,184,61,0.7)";
      ctx.shadowBlur = 70;
      round(10, 58);
      ctx.fillStyle = "#f5b83d";
      ctx.fill();
      ctx.restore();
      ctx.save();
      round(0, 48);
      ctx.clip();
      ctx.drawImage(photo, 0, srcY, srcW, srcH, x, y, w, h);
      ctx.restore();
      // La Medalla, en la esquina inferior derecha del marco
      drawMedal(ctx, Math.min(x + w + 40, W - 135), y + h - 110, 1.25, new Set(p.earned), p.face);
    } else {
      drawMedal(ctx, cx, cy, 3.3, new Set(p.earned), p.face);
    }
  }

  ctx.textAlign = "center";
  ctx.fillStyle = "#f5c867";
  ctx.font = "600 44px Poppins, system-ui, sans-serif";
  ctx.fillText(p.fiestaTitle.toUpperCase(), W / 2, 1180, W - 120);

  ctx.fillStyle = "#ffffff";
  ctx.font = "700 96px Georgia, serif";
  wrap(ctx, p.headline, W - 160).forEach((l, i) => ctx.fillText(l, W / 2, 1320 + i * 110));

  // Con mensaje, el titular ocupa hasta dos líneas y lo demás baja un poco para hacerle sitio
  const lines = wrap(ctx, p.headline, W - 160).length;
  const shift = p.message ? 70 : 0;
  if (p.message) {
    ctx.font = "italic 500 40px Georgia, serif";
    ctx.fillStyle = "#ffe7a3";
    const top = 1320 + (lines - 1) * 110 + 86;
    wrap(ctx, p.message, W - 200).slice(0, 2).forEach((l, i) => ctx.fillText(l, W / 2, top + i * 54));
  }

  ctx.font = "500 50px Poppins, system-ui, sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.fillText(p.piece, W / 2, 1580 + shift, W - 120);
  if (p.progress) {
    ctx.font = "500 38px Poppins, system-ui, sans-serif";
    ctx.fillStyle = "#f5c867";
    ctx.fillText(p.progress, W / 2, 1650 + shift * 0.9, W - 120);
  }

  ctx.font = "600 40px Poppins, system-ui, sans-serif";
  ctx.fillStyle = "#f5c867";
  ctx.fillText(p.footer, W / 2, 1760 + shift * 0.6);
  ctx.font = "500 36px Poppins, system-ui, sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.fillText(p.url, W / 2, 1820 + shift * 0.5);

  return new Promise((resolve, reject) => c.toBlob((b) => (b ? resolve(b) : reject(new Error("canvas"))), "image/png"));
}

/** Comparte solo la imagen (sin texto ni enlace) con el menú del teléfono; si no se puede, la descarga */
export async function shareCard(blob: Blob, filename = "jmv-medalla.png") {
  const file = new File([blob], filename, { type: "image/png" });
  const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
  if (nav.canShare?.({ files: [file] })) {
    try {
      await nav.share({ files: [file] });
      return "shared";
    } catch (e) {
      if ((e as Error).name === "AbortError") return "cancelled";
    }
  }
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  return "downloaded";
}
