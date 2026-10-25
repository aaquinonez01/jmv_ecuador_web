import { BookMarked, ChevronDown } from "lucide-react";

const EXAMPLES: { code: string; meaning: string }[] = [
  { code: "# Estatutos Nacionales de JMV Ecuador", meaning: "Título del documento (una sola vez, al inicio)." },
  { code: "> En virtud de los Rescriptos Pontificios…\n>\n> Como Director General…", meaning: "Carta de aprobación o preámbulo. Cada línea empieza con «> »; un «>» solo separa párrafos." },
  { code: "## Capítulo I · Identidad", meaning: "Capítulo: número romano y título en mayúscula tipo oración." },
  { code: "### Artículo 1 · Constitución", meaning: "Artículo: un encabezado por artículo, con su número." },
  { code: "1.1 Texto del numeral en una sola línea.", meaning: "Numeral. No partas el texto en varias líneas." },
  { code: "4.3.2 *Búsqueda de la voluntad de Dios (Obediencia):* texto…", meaning: "Sub-numeral. Lo que va entre *asteriscos* sale en cursiva." },
  { code: "Texto suelto del artículo.", meaning: "Párrafo normal, sin numeral." },
  { code: "- Viñeta\n  - Subviñeta (dos espacios)", meaning: "Listas con guion; dos espacios delante para una subviñeta." },
  { code: "Estatutos aprobados el 15 de agosto de 2010 — …", meaning: "Línea de cierre: el último párrafo, después del último artículo." },
];

// Chuleta del formato del texto, plegable.
export default function FormatGuide() {
  return (
    <details className="group rounded-xl border border-slate-200 bg-slate-50 open:bg-white">
      <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100 [&::-webkit-details-marker]:hidden">
        <BookMarked className="h-4 w-4 text-jmv-blue" aria-hidden />
        Guía rápida del formato
        <span className="font-normal text-slate-500">· cómo escribir capítulos, artículos y numerales</span>
        <ChevronDown className="ml-auto h-4 w-4 text-slate-500 transition-transform group-open:rotate-180 motion-reduce:transition-none" aria-hidden />
      </summary>
      <div className="border-t border-slate-200 p-3">
        <dl className="grid gap-2 lg:grid-cols-2">
          {EXAMPLES.map((ex) => (
            <div key={ex.code} className="rounded-lg border border-slate-200 bg-white p-2.5">
              <dt>
                <pre className="overflow-x-auto whitespace-pre-wrap rounded bg-slate-900 px-2.5 py-1.5 font-mono text-[12px] leading-5 text-slate-100">
                  {ex.code}
                </pre>
              </dt>
              <dd className="mt-1.5 text-xs leading-relaxed text-slate-600">{ex.meaning}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 text-xs leading-relaxed text-slate-600">
          Copia el texto <strong>tal como está en el original</strong>, con su numeración y redacción, aunque tenga erratas. No
          incluyas el membrete ni el pie de página que se repiten en cada hoja, ni sellos o firmas.
        </p>
      </div>
    </details>
  );
}
