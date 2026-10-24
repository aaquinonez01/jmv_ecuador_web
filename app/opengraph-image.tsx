import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

export const alt = `${SITE.fullName}: ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const logo = await readFile(join(process.cwd(), "public/logo-jmv.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  // 12 estrellas en anillo (motivo de la Medalla Milagrosa)
  const stars = Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
    return { x: 230 + Math.cos(angle) * 190, y: 315 + Math.sin(angle) * 190 };
  });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "linear-gradient(135deg, #0f172a 0%, #1D4E8A 60%, #16365f 100%)",
          color: "white",
          fontFamily: "serif",
        }}
      >
        {stars.map((s, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: s.x - 9,
              top: s.y - 9,
              width: 18,
              height: 18,
              borderRadius: 9,
              background: "#F5B83D",
            }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            left: 90,
            top: 175,
            width: 280,
            height: 280,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 140,
            background: "white",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} width={240} height={240} alt="" />
        </div>
        <div
          style={{
            position: "absolute",
            left: 480,
            top: 0,
            bottom: 0,
            right: 70,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div style={{ fontSize: 28, color: "#F5B83D", letterSpacing: 4 }}>
            JMV ECUADOR
          </div>
          <div style={{ fontSize: 62, fontWeight: 700, lineHeight: 1.1, marginTop: 16 }}>
            Juventudes Marianas Vicencianas
          </div>
          <div style={{ fontSize: 30, marginTop: 28, color: "#e2e8f0", lineHeight: 1.35 }}>
            {SITE.tagline}
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 14,
            display: "flex",
          }}
        >
          <div style={{ flex: 1, background: "#1D4E8A" }} />
          <div style={{ flex: 1, background: "#D98F06" }} />
          <div style={{ flex: 1, background: "#D3302F" }} />
        </div>
      </div>
    ),
    size,
  );
}
