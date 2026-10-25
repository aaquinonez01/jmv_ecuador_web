import { ScrollText } from "lucide-react";
import type { ParsedStatutes } from "@/lib/estatutos";
import StatutesBody from "@/components/estatutos/StatutesBody";
import StatuteText from "@/components/estatutos/StatuteText";

// Vista previa con los mismos componentes que la página pública.
export default function StatutePreview({ doc }: { doc: ParsedStatutes }) {
  const empty = !doc.title && !doc.preamble.length && !doc.chapters.length;
  if (empty) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 p-10 text-center text-sm text-slate-500">
        <ScrollText className="h-8 w-8 text-slate-300" aria-hidden />
        Escribe o pega el texto a la izquierda y aquí verás cómo queda en el sitio.
      </div>
    );
  }
  return (
    <div className="mx-auto max-w-[70ch] px-5 py-6 sm:px-8">
      {doc.title ? (
        <p className="font-display text-3xl font-semibold leading-tight text-slate-900 text-balance">{doc.title}</p>
      ) : null}
      {doc.preamble.length ? (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
            <ScrollText className="h-4 w-4 text-jmv-gold-ink" aria-hidden />
            Carta de aprobación <span className="font-normal text-slate-500">(en el sitio aparece plegada)</span>
          </p>
          <div className="space-y-3 font-display text-[17px] leading-8 text-slate-800">
            {doc.preamble.map((p, i) => (
              <p key={i}>
                <StatuteText text={p} />
              </p>
            ))}
          </div>
        </div>
      ) : null}
      <StatutesBody doc={doc} className="mt-10" />
      {doc.closing ? (
        <p className="mt-14 border-t border-slate-200 pt-8 text-center font-display text-lg italic text-slate-700">
          <StatuteText text={doc.closing} />
        </p>
      ) : null}
    </div>
  );
}
