import { ImageResponse } from "next/og";
import { fetchCalendarDate } from "@/lib/api/calendar.server";
import { CATEGORY_META, anniversary } from "@/lib/calendario";
import {
  BrandBar,
  GOLD,
  MonthRing,
  NIGHT,
  SkyDust,
  categoryColor,
  clampText,
  featuredPhrase,
  fileSlug,
  loadOgFonts,
  loadOgLogo,
  monthName,
} from "@/lib/og/calendario";

// Imagen vertical 1080x1920 para historias de Instagram y estados de WhatsApp
const W = 1080;
const H = 1920;

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let item;
  try {
    item = await fetchCalendarDate(slug);
  } catch {
    return new Response("El calendario no está disponible en este momento.", {
      status: 503,
      headers: { "Retry-After": "60", "Cache-Control": "no-store" },
    });
  }
  if (!item) {
    return new Response("Fecha no encontrada", { status: 404, headers: { "Cache-Control": "no-store" } });
  }

  const [fonts, logo] = await Promise.all([loadOgFonts(), loadOgLogo()]);
  const color = categoryColor(item);
  const years = anniversary(item);
  const phrase = featuredPhrase(item, 210);
  const title = clampText(item.title, 90);
  const titleSize = title.length > 60 ? 64 : title.length > 36 ? 76 : 88;
  const ringSize = 820;
  const monthLabel = monthName(item.month).toUpperCase();
  // Los meses largos no deben tocar las estrellas del anillo
  const monthSpacing = monthLabel.length > 7 ? 9 : 16;

  const image = new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          background: NIGHT,
          color: "white",
          fontFamily: "Poppins",
        }}
      >
        <SkyDust seed={item.slug} width={W} height={1120} count={90} />
        {/* Resplandor del color de la categoría detrás del anillo */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 240,
            width: W,
            height: W,
            backgroundImage: `radial-gradient(circle closest-side, ${color}44 0%, ${color}18 50%, transparent 100%)`,
          }}
        />

        {/* Cabecera */}
        <div style={{ display: "flex", alignItems: "center", gap: 22, marginTop: 110 }}>
          <div
            style={{
              width: 84,
              height: 84,
              borderRadius: 42,
              background: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo} width={70} height={70} alt="" />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: 6, color: GOLD }}>AÑO VICENCIANO</div>
            <div style={{ fontSize: 26, color: "rgba(255,255,255,0.75)", letterSpacing: 2 }}>JMV Ecuador</div>
          </div>
        </div>

        {/* Anillo con el día y el mes */}
        <div
          style={{
            position: "relative",
            width: ringSize,
            height: ringSize,
            marginTop: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ position: "absolute", left: 0, top: 0, display: "flex" }}>
            <MonthRing size={ringSize} month={item.month} color={color} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div
              style={{
                fontFamily: "Fraunces",
                fontWeight: 600,
                fontSize: 330,
                lineHeight: 1,
                color: "white",
                letterSpacing: -8,
              }}
            >
              {String(item.day)}
            </div>
            <div
              style={{
                marginTop: 4,
                fontSize: monthLabel.length > 7 ? 48 : 54,
                fontWeight: 700,
                letterSpacing: monthSpacing,
                color,
                paddingLeft: monthSpacing,
              }}
            >
              {monthLabel}
            </div>
          </div>
        </div>

        {/* Título y frase */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            justifyContent: "center",
            flex: 1,
            padding: "0 90px 250px",
          }}
        >
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 26px",
                borderRadius: 999,
                border: `2px solid ${color}`,
                background: `${color}22`,
                fontSize: 26,
                color: "white",
              }}
            >
              <div style={{ width: 14, height: 14, borderRadius: 7, background: color }} />
              {CATEGORY_META[item.category].label}
            </div>
            {years ? (
              <div
                style={{
                  display: "flex",
                  padding: "10px 26px",
                  borderRadius: 999,
                  background: GOLD,
                  color: "#1a1206",
                  fontSize: 26,
                  fontWeight: 700,
                }}
              >
                {`Hace ${years} años`}
              </div>
            ) : null}
          </div>

          <div
            style={{
              fontFamily: "Fraunces",
              fontWeight: 600,
              fontSize: titleSize,
              lineHeight: 1.08,
              marginTop: 34,
              letterSpacing: -1,
            }}
          >
            {title}
          </div>

          <div style={{ width: 120, height: 4, borderRadius: 2, background: GOLD, marginTop: 38 }} />

          <div
            style={{
              fontFamily: phrase.isQuote ? "Fraunces" : "Poppins",
              fontStyle: phrase.isQuote ? "italic" : "normal",
              fontWeight: 500,
              fontSize: phrase.text.length > 150 ? 36 : 42,
              lineHeight: 1.38,
              marginTop: 36,
              color: "rgba(255,255,255,0.92)",
            }}
          >
            {phrase.isQuote ? `«${phrase.text}»` : phrase.text}
          </div>
          {phrase.author ? (
            <div style={{ fontSize: 28, marginTop: 20, color: GOLD }}>{`— ${phrase.author}`}</div>
          ) : null}
        </div>

        {/* Pie */}
        <div
          style={{
            position: "absolute",
            bottom: 90,
            left: 0,
            right: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div style={{ fontSize: 26, color: "rgba(255,255,255,0.7)" }}>Vive el año con nosotros en</div>
          <div style={{ fontSize: 40, fontWeight: 700, color: "white", letterSpacing: 1 }}>
            jmvecuador.org/calendario
          </div>
        </div>
        <BrandBar height={22} />
      </div>
    ),
    {
      width: W,
      height: H,
      fonts,
    }
  );

  const headers = new Headers(image.headers);
  headers.set("Content-Type", "image/png");
  headers.set(
    "Content-Disposition",
    `inline; filename="ano-vicenciano-${fileSlug(item.slug)}-historia.png"`
  );
  headers.set("Cache-Control", "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800");
  return new Response(image.body, { status: 200, headers });
}
