import type { ReactNode } from "react";

// Muestra el texto de la novena tal como se pegó, pero legible en el celular:
// los títulos de sección, las etiquetas ("Lectura principal:") y la frase para
// guardar se destacan; el contenido no se cambia.

const LABELS = [
  "Símbolo de la medalla",
  "Signo de la jornada",
  "Canto de entrada",
  "Lectura principal",
  "Textos para acompañar",
  "Guía",
  "Todos",
  "Lector",
];

function linkify(text: string): ReactNode[] {
  return text.split(/(https?:\/\/\S+)/g).map((part, i) =>
    /^https?:\/\//.test(part) ? (
      <a key={i} href={part} target="_blank" rel="noreferrer" className="break-all font-semibold text-[#f5c867] underline underline-offset-4">
        {part.includes("youtu") ? "Escuchar en YouTube ↗" : part}
      </a>
    ) : (
      part
    ),
  );
}

export default function RichText({ text }: { text: string }) {
  const blocks = text.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  return (
    <div className="space-y-4">
      {blocks.map((b, i) => {
        const numbered = /^(0[1-9])\s+(.+)$/.exec(b);
        if (numbered && b.length < 90 && !b.includes("\n")) {
          return (
            <h3 key={i} className="flex items-start gap-3 pt-3 font-display text-xl font-semibold leading-snug text-white">
              <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[#f5b83d] text-sm font-bold text-[#3b2600] shadow-[0_3px_0_#9a6504]">
                {numbered[1]}
              </span>
              {numbered[2]}
            </h3>
          );
        }
        if (b.length < 60 && !/[.:;,?!»]$/.test(b) && !b.includes("\n")) {
          return (
            <h3 key={i} className="pt-3 text-sm font-bold uppercase tracking-[0.18em] text-[#f5c867]">
              {b}
            </h3>
          );
        }
        if (b.startsWith("Frase para guardar en el corazón:")) {
          return (
            <blockquote
              key={i}
              className="rounded-2xl border-l-4 border-[#f5b83d] bg-[#f5b83d]/10 px-4 py-3 font-display text-lg italic leading-relaxed text-white"
            >
              <span className="mb-1 block font-sans text-xs font-bold uppercase not-italic tracking-[0.16em] text-[#f5c867]">
                Frase para guardar en el corazón
              </span>
              {b.replace("Frase para guardar en el corazón:", "").trim()}
            </blockquote>
          );
        }
        const label = LABELS.find((l) => b.startsWith(`${l}:`));
        if (label) {
          return (
            <p key={i} className="leading-relaxed text-white/90">
              <strong className="font-semibold text-[#ffe7a3]">{label}:</strong>
              {linkify(b.slice(label.length + 1))}
            </p>
          );
        }
        if (/^\d\.\s/.test(b)) {
          return (
            <p key={i} className="flex gap-3 rounded-2xl bg-white/[0.05] px-4 py-3 leading-relaxed text-white/90">
              <span className="font-bold text-[#f5c867]">{b.slice(0, 2)}</span>
              <span>{b.slice(3)}</span>
            </p>
          );
        }
        return (
          <p key={i} className="whitespace-pre-line leading-relaxed text-white/90">
            {linkify(b)}
          </p>
        );
      })}
    </div>
  );
}
