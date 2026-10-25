import type { ReactNode } from "react";
import { matchRanges, parseInline } from "@/lib/estatutos";

// Texto de un numeral o párrafo: *cursivas* como <em> y coincidencias de la
// búsqueda como <mark>. Construye nodos React: nunca inserta HTML.
export default function StatuteText({ text, query }: { text: string; query?: string }) {
  return (
    <>
      {parseInline(text).map((segment, i) => {
        const content = highlight(segment.text, query);
        return segment.em ? <em key={i}>{content}</em> : <span key={i}>{content}</span>;
      })}
    </>
  );
}

export function highlight(text: string, query?: string): ReactNode {
  const ranges = query ? matchRanges(text, query) : [];
  if (!ranges.length) return text;
  const out: ReactNode[] = [];
  let last = 0;
  ranges.forEach(([start, end], i) => {
    if (start > last) out.push(text.slice(last, start));
    out.push(
      <mark
        key={i}
        data-hit=""
        className="rounded-sm bg-jmv-gold/30 px-0.5 text-inherit data-[current=true]:bg-jmv-gold data-[current=true]:text-jmv-ink data-[current=true]:outline-2 data-[current=true]:outline-jmv-ink"
      >
        {text.slice(start, end)}
      </mark>
    );
    last = end;
  });
  if (last < text.length) out.push(text.slice(last));
  return out;
}
