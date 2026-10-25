"use client";

import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Video de YouTube con carga diferida: primero solo la miniatura; el reproductor
 * (youtube-nocookie, sin cookies hasta reproducir) se carga al tocar.
 */
export default function VideoEmbed({
  videoId,
  title,
  onPlay,
  className,
}: {
  videoId: string;
  title: string;
  onPlay?: () => void;
  className?: string;
}) {
  const [playing, setPlaying] = useState(false);
  const frameRef = useRef<HTMLIFrameElement>(null);
  // Al cambiar el botón por el reproductor, el foco pasa al reproductor (no se pierde)
  useEffect(() => {
    if (playing) frameRef.current?.focus();
  }, [playing]);

  return (
    <div className={cn("relative aspect-video overflow-hidden rounded-3xl bg-black shadow-card-lg ring-1 ring-line dark:shadow-2xl dark:shadow-black/50", className)}>
      {playing ? (
        <iframe
          ref={frameRef}
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => {
            setPlaying(true);
            onPlay?.();
          }}
          className="group absolute inset-0 h-full w-full"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-100"
          />
          <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <span className="absolute left-1/2 top-1/2 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-jmv-gold text-jmv-ink shadow-2xl transition-transform motion-safe:group-hover:scale-110">
            <Play className="ml-1 h-9 w-9 fill-current" aria-hidden />
          </span>
          <span className="absolute inset-x-0 bottom-0 p-4 text-left text-sm font-semibold text-white sm:p-5 sm:text-base">
            <span className="sr-only">Reproducir el video: </span>
            {title}
          </span>
        </button>
      )}
    </div>
  );
}
