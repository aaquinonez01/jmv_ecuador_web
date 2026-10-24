"use client";

import { useEffect, useState } from "react";

type CountdownTargetType = "registration_close" | "event_start" | string;

type Props = {
  targetDate?: string | null;
  countdownTargetType?: CountdownTargetType | null;
};

function calculate(targetDate?: string | null) {
  if (!targetDate) return null;
  const target = new Date(targetDate).getTime();
  if (Number.isNaN(target)) return null;
  const diff = target - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isFinished: true };
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds, isFinished: false };
}

// Solo se muestra si hay fecha. Se calcula tras montar para no desajustar la
// hidratación (el HTML viene cacheado por ISR).
export default function CountdownClient({ targetDate, countdownTargetType }: Props) {
  const [countdown, setCountdown] = useState<ReturnType<typeof calculate>>(null);

  useEffect(() => {
    setCountdown(calculate(targetDate));
    if (!targetDate) return;
    const interval = window.setInterval(() => {
      setCountdown(calculate(targetDate));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [targetDate]);

  if (!targetDate || !countdown || countdown.isFinished) return null;

  const label =
    countdownTargetType === "registration_close" ? "Las inscripciones cierran en" : "Faltan";

  return (
    <div className="mt-5">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-200">{label}</p>
      {/* El valor cambia cada segundo: se anuncia una sola vez como texto, no en vivo */}
      <p className="sr-only">
        {countdown.days} días y {countdown.hours} horas
      </p>
      <div className="grid grid-cols-4 gap-2 sm:gap-3" aria-hidden="true">
        {[
          { label: "Días", value: countdown.days },
          { label: "Horas", value: countdown.hours },
          { label: "Min", value: countdown.minutes },
          { label: "Seg", value: countdown.seconds },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-white/15 bg-white/10 px-2 py-3 text-center sm:px-3 sm:py-4"
          >
            <div className="text-xl font-bold tabular-nums text-white sm:text-2xl">{item.value}</div>
            <div className="mt-1 text-[11px] uppercase tracking-[0.14em] text-slate-200 sm:text-xs">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
