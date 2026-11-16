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

function star(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 === 0 ? r : r * 0.42;
    const a = (Math.PI / 5) * i - Math.PI / 2;
    ctx.lineTo(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad);
  }
  ctx.closePath();
  ctx.fill();
}

export async function makeShareCard(p: {
  fiestaTitle: string;
  headline: string;
  piece: string;
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

  // Medalla: óvalo dorado con las 12 estrellas
  const cx = W / 2;
  const cy = 700;
  const halo = ctx.createRadialGradient(cx, cy, 60, cx, cy, 520);
  halo.addColorStop(0, "rgba(245,184,61,0.45)");
  halo.addColorStop(1, "rgba(245,184,61,0)");
  ctx.fillStyle = halo;
  ctx.fillRect(0, 150, W, 1100);
  ctx.save();
  ctx.translate(cx, cy);
  const body = ctx.createRadialGradient(0, -80, 20, 0, 0, 380);
  body.addColorStop(0, "#3a5f96");
  body.addColorStop(1, "#13284b");
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.ellipse(0, 0, 250, 330, 0, 0, Math.PI * 2);
  ctx.fill();
  const gold = ctx.createLinearGradient(-250, -330, 250, 330);
  gold.addColorStop(0, "#ffe7a3");
  gold.addColorStop(0.45, "#f5b83d");
  gold.addColorStop(1, "#c8860a");
  ctx.strokeStyle = gold;
  ctx.lineWidth = 14;
  ctx.stroke();
  ctx.fillStyle = gold;
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
    star(ctx, Math.cos(a) * 200, Math.sin(a) * 275, 20);
  }
  // M con la cruz
  ctx.strokeStyle = gold;
  ctx.lineWidth = 18;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(0, -190);
  ctx.lineTo(0, -40);
  ctx.moveTo(-40, -140);
  ctx.lineTo(40, -140);
  ctx.moveTo(-90, -40);
  ctx.lineTo(90, -40);
  ctx.moveTo(-80, 130);
  ctx.lineTo(-80, 20);
  ctx.lineTo(0, 100);
  ctx.lineTo(80, 20);
  ctx.lineTo(80, 130);
  ctx.moveTo(0, -40);
  ctx.lineTo(0, 100);
  ctx.stroke();
  ctx.restore();

  ctx.textAlign = "center";
  ctx.fillStyle = "#f5c867";
  ctx.font = "600 44px Poppins, system-ui, sans-serif";
  ctx.fillText(p.fiestaTitle.toUpperCase(), W / 2, 1180, W - 120);

  ctx.fillStyle = "#ffffff";
  ctx.font = "700 96px Georgia, serif";
  wrap(ctx, p.headline, W - 160).forEach((l, i) => ctx.fillText(l, W / 2, 1320 + i * 110));

  ctx.font = "500 50px Poppins, system-ui, sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.fillText(p.piece, W / 2, 1600, W - 120);

  ctx.font = "600 40px Poppins, system-ui, sans-serif";
  ctx.fillStyle = "#f5c867";
  ctx.fillText(p.footer, W / 2, 1760);
  ctx.font = "500 36px Poppins, system-ui, sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.fillText(p.url, W / 2, 1820);

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
