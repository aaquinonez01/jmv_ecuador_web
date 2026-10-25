"use client";

import { Popover } from "radix-ui";
import { BookA, Info, X } from "lucide-react";
import { articleAnchor } from "@/lib/estatutos";
import SectionHeading from "@/components/ui/SectionHeading";
import { GLOSSARY } from "./content";

// Glosario: cada término abre una definición breve (teclado, toque y lector de pantalla).
export default function StatutesGlossary({ anchors }: { anchors: string[] }) {
  const available = new Set(anchors);
  return (
    <section aria-labelledby="estatutos-glosario" className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="estatutos-glosario"
          tone="light"
          eyebrow="Glosario"
          title="Palabras que vas a encontrar"
          description="Toca un término para ver qué significa, según los propios estatutos."
        />
        <ul className="flex flex-wrap justify-center gap-3">
          {GLOSSARY.map((item) => {
            const refs = item.refs.filter((r) => available.has(articleAnchor(r.article)));
            return (
              <li key={item.term}>
                <Popover.Root>
                  <Popover.Trigger className="inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-jmv-blue/20 bg-white px-4 py-2 font-semibold text-jmv-blue transition-colors hover:border-jmv-blue hover:bg-jmv-blue/5 data-[state=open]:border-jmv-blue data-[state=open]:bg-jmv-blue data-[state=open]:text-white">
                    <BookA className="h-4 w-4" aria-hidden />
                    {item.term}
                  </Popover.Trigger>
                  <Popover.Portal>
                    <Popover.Content
                      sideOffset={8}
                      collisionPadding={16}
                      className="z-50 w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-2xl outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 motion-reduce:animate-none"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="font-display text-xl font-semibold text-slate-900">{item.term}</p>
                        <Popover.Close
                          className="-m-2 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100"
                          aria-label="Cerrar definición"
                        >
                          <X className="h-5 w-5" aria-hidden />
                        </Popover.Close>
                      </div>
                      <p className="mt-2 leading-relaxed text-slate-700">{item.definition}</p>
                      {refs.length ? (
                        <p className="mt-3 flex flex-wrap items-center gap-x-3 text-sm">
                          <Info className="h-4 w-4 text-slate-400" aria-hidden />
                          {refs.map((ref) => (
                            <Popover.Close asChild key={ref.article}>
                              <a
                                href={`#${articleAnchor(ref.article)}`}
                                className="inline-flex min-h-11 items-center font-semibold text-jmv-blue underline-offset-4 hover:underline"
                              >
                                {ref.label}
                              </a>
                            </Popover.Close>
                          ))}
                        </p>
                      ) : null}
                      <Popover.Arrow className="fill-white" />
                    </Popover.Content>
                  </Popover.Portal>
                </Popover.Root>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
