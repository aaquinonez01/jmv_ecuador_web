import { ImageResponse } from "next/og";
import { BrandBar, GOLD, MonthRing, NIGHT, SkyDust, loadOgFonts, loadOgLogo } from "@/lib/og/calendario";

export const alt = "Año Vicenciano · JMV Ecuador: las fechas de María, san Vicente y los santos vicencianos";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function CalendarOgImage() {
  const [fonts, logo] = await Promise.all([loadOgFonts(), loadOgLogo()]);
  const ring = 500;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: NIGHT,
          color: "white",
          fontFamily: "Poppins",
        }}
      >
        <SkyDust seed="ano-vicenciano" width={620} height={630} count={50} />
        <div
          style={{
            position: "absolute",
            left: 40,
            top: 25,
            width: 580,
            height: 580,
            backgroundImage: `radial-gradient(circle closest-side, ${GOLD}33 0%, ${GOLD}10 50%, transparent 100%)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 80,
            top: 65,
            width: ring,
            height: ring,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ position: "absolute", left: 0, top: 0, display: "flex" }}>
            <MonthRing size={ring} color={GOLD} />
          </div>
          <div
            style={{
              width: 230,
              height: 230,
              borderRadius: 115,
              background: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo} width={196} height={196} alt="" />
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: 640,
            right: 70,
            top: 0,
            bottom: 14,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: 5, color: GOLD }}>JMV ECUADOR</div>
          <div style={{ fontFamily: "Fraunces", fontWeight: 600, fontSize: 84, lineHeight: 1.02, marginTop: 14 }}>
            Año Vicenciano
          </div>
          <div style={{ fontSize: 28, lineHeight: 1.4, marginTop: 24, color: "rgba(255,255,255,0.88)" }}>
            12 estrellas, 12 meses: las fechas de María, san Vicente y los santos vicencianos.
          </div>
          <div style={{ fontSize: 22, marginTop: 30, color: "rgba(255,255,255,0.7)" }}>jmvecuador.org/calendario</div>
        </div>
        <BrandBar height={14} />
      </div>
    ),
    { ...size, fonts }
  );
}
