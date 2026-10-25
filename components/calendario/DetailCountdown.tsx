"use client";

import { useEffect, useState } from "react";
import { PartyPopper, Hourglass } from "lucide-react";
import { daysUntil, nextOccurrence } from "@/lib/calendario";
import AnimatedNumber from "./AnimatedNumber";

// "Faltan N días" o "¡Es hoy!". Se recalcula tras montar (la página viene de ISR).
export default function DetailCountdown({ month, day, renderedAt }: { month: number; day: number; renderedAt: string }) {
  const [now, setNow] = useState(() => new Date(renderedAt));
  useEffect(() => setNow(new Date()), []);
  const days = daysUntil(nextOccurrence(month, day, now), now);

  if (days === 0) {
    return (
      <p className="inline-flex items-center gap-2 rounded-full bg-jmv-gold px-4 py-2 text-base font-semibold text-jmv-ink shadow-[0_0_30px_rgba(245,184,61,0.45)]">
        <PartyPopper className="h-5 w-5" aria-hidden />
        ¡Es hoy!
      </p>
    );
  }
  return (
    <p className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface px-4 py-2 text-base font-semibold text-fg shadow-card dark:bg-white/10 dark:backdrop-blur">
      <Hourglass className="h-5 w-5 text-accent-gold" aria-hidden />
      {days === 1 ? (
        "Es mañana"
      ) : (
        <span>
          Faltan <AnimatedNumber value={days} className="tabular-nums text-accent-gold" /> días
        </span>
      )}
    </p>
  );
}
