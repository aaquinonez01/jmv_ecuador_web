import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";
import { starPoints } from "./svg-props";

function Star({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" className={cn("shrink-0 fill-current", className)}>
      <polygon points={starPoints(20, 21, 18)} />
    </svg>
  );
}

const SIZES = {
  // Portada: tres palabras en una sola línea, también en un celular angosto
  hero: { text: "text-[clamp(1.3rem,6vw,3.25rem)] gap-[0.45em]", star: "h-[0.55em] w-[0.55em]" },
  footer: { text: "text-lg gap-2", star: "h-3 w-3" },
};

/**
 * Lema de JMV Ecuador. Las palabras entran una tras otra solo con CSS: el texto ya
 * está en el HTML y es visible sin JavaScript. El color lo hereda de `className`.
 */
export default function Motto({ size = "hero", className }: { size?: keyof typeof SIZES; className?: string }) {
  const s = SIZES[size];
  return (
    <p className={cn("font-display font-semibold leading-tight", className)}>
      <span className="sr-only">{SITE.motto}</span>
      <span aria-hidden="true" className={cn("flex flex-nowrap items-center", s.text)}>
        {SITE.mottoWords.map((word, i) => (
          <span key={word} className="contents">
            {i > 0 && <Star className={s.star} />}
            <span
              className="whitespace-nowrap motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-2 motion-safe:duration-700 motion-safe:fill-mode-both"
              style={{ animationDelay: `${150 + i * 220}ms` }}
            >
              {word}
            </span>
          </span>
        ))}
      </span>
    </p>
  );
}
