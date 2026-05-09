"use client";

import { useEffect, useState } from "react";

type CountdownTargetType = "registration_close" | "event_start" | string;

type Props = {
  targetDate?: string | null;
  countdownTargetType?: CountdownTargetType | null;
};

function calculate(targetDate?: string | null) {
  if (!targetDate) return null;
  const diff = new Date(targetDate).getTime() - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isFinished: true };
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds, isFinished: false };
}

export default function CountdownClient({ targetDate, countdownTargetType }: Props) {
  const [countdown, setCountdown] = useState(() => calculate(targetDate));

  useEffect(() => {
    setCountdown(calculate(targetDate));
    if (!targetDate) return;
    const interval = window.setInterval(() => {
      setCountdown(calculate(targetDate));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [targetDate]);

  if (!targetDate || !countdown) {
    return (
      <div className="rounded-2xl border border-white/15 bg-white/10 p-4 text-white/75">
        Define una fecha del evento o de cierre para activar el contador.
      </div>
    );
  }

  if (countdown.isFinished) {
    return (
      <div className="rounded-2xl border border-amber-300/20 bg-amber-500/10 p-4 text-amber-100">
        {countdownTargetType === "registration_close"
          ? "La fecha máxima de inscripción ya venció."
          : "La fecha del evento ya llegó o pasó."}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
      {[
        { label: "Días", value: countdown.days },
        { label: "Horas", value: countdown.hours },
        { label: "Min", value: countdown.minutes },
        { label: "Seg", value: countdown.seconds },
      ].map((item) => (
        <div
          key={item.label}
          className="rounded-2xl border border-white/15 bg-white/10 px-2 py-3 text-center backdrop-blur-sm sm:px-3 sm:py-4"
        >
          <div className="text-xl font-bold text-white sm:text-2xl">
            {item.value}
          </div>
          <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/65 sm:text-xs sm:tracking-[0.25em]">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
}
