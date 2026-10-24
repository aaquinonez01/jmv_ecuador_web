import { ImageResponse } from "next/og";
import { fetchCalendarDate } from "@/lib/api/calendar.server";
import { CATEGORY_META, anniversary, dayLabel } from "@/lib/calendario";
import {
  BrandBar,
  GOLD,
  MonthRing,
  NIGHT,
  SkyDust,
  categoryColor,
  clampText,
  featuredPhrase,
  loadOgFonts,
  loadOgLogo,
  monthName,
} from "@/lib/og/calendario";
import type { CalendarDateItem } from "@/types/calendar";

export const alt = "Año Vicenciano · JMV Ecuador";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function CalendarDateOgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let item: CalendarDateItem | null = null;
  try {
    item = await fetchCalendarDate(slug);
  } catch {
    item = null;
  }

  const [fonts, logo] = await Promise.all([loadOgFonts(), loadOgLogo()]);
  const color = item ? categoryColor(item) : GOLD;
  const years = item ? anniversary(item) : null;
  const phrase = item ? featuredPhrase(item, 130) : null;
  const title = item ? clampText(item.title, 80) : "Año Vicenciano";
  const titleSize = title.length > 50 ? 50 : title.length > 28 ? 60 : 70;
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
        <SkyDust seed={slug} width={620} height={630} count={45} />
        <div
          style={{
            position: "absolute",
            left: 40,
            top: 25,
            width: 580,
            height: 580,
            backgroundImage: `radial-gradient(circle closest-side, ${color}40 0%, ${color}14 50%, transparent 100%)`,
          }}
        />

        {/* Anillo con el día */}
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
            <MonthRing size={ring} month={item?.month} color={color} />
          </div>
          {item ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ fontFamily: "Fraunces", fontWeight: 600, fontSize: 190, lineHeight: 1, letterSpacing: -5 }}>
                {String(item.day)}
              </div>
              <div
                style={{
                  fontSize: 30,
                  fontWeight: 700,
                  letterSpacing: 8,
                  paddingLeft: 8,
                  color,
                }}
              >
                {monthName(item.month).toUpperCase()}
              </div>
            </div>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo} width={200} height={200} alt="" style={{ borderRadius: 100, background: "white" }} />
          )}
        </div>

        {/* Texto */}
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
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 26,
                background: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logo} width={44} height={44} alt="" />
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: 4, color: GOLD }}>AÑO VICENCIANO</div>
          </div>

          {item ? (
            <div style={{ display: "flex", gap: 10, marginTop: 26 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 16px",
                  borderRadius: 999,
                  border: `2px solid ${color}`,
                  background: `${color}22`,
                  fontSize: 18,
                }}
              >
                <div style={{ width: 10, height: 10, borderRadius: 5, background: color }} />
                {CATEGORY_META[item.category].label}
              </div>
              {years ? (
                <div
                  style={{
                    display: "flex",
                    padding: "6px 16px",
                    borderRadius: 999,
                    background: GOLD,
                    color: "#1a1206",
                    fontSize: 18,
                    fontWeight: 700,
                  }}
                >
                  {`Hace ${years} años`}
                </div>
              ) : null}
            </div>
          ) : null}

          <div
            style={{
              fontFamily: "Fraunces",
              fontWeight: 600,
              fontSize: titleSize,
              lineHeight: 1.06,
              marginTop: 18,
              letterSpacing: -0.5,
            }}
          >
            {title}
          </div>

          {phrase ? (
            <div
              style={{
                fontFamily: phrase.isQuote ? "Fraunces" : "Poppins",
                fontStyle: phrase.isQuote ? "italic" : "normal",
                fontWeight: 500,
                fontSize: 24,
                lineHeight: 1.4,
                marginTop: 20,
                color: "rgba(255,255,255,0.88)",
              }}
            >
              {phrase.isQuote ? `«${phrase.text}»` : phrase.text}
            </div>
          ) : null}

          <div style={{ fontSize: 20, marginTop: 26, color: "rgba(255,255,255,0.7)" }}>
            {item ? `${dayLabel(item.month, item.day)} · jmvecuador.org/calendario` : "jmvecuador.org/calendario"}
          </div>
        </div>
        <BrandBar height={14} />
      </div>
    ),
    { ...size, fonts }
  );
}
