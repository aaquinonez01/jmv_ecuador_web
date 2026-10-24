import { a11yProps, type BrandSvgProps } from "./svg-props";

// Los dos corazones de la Medalla: el de Jesús (coronado de espinas) y el de María
// (atravesado por una espada), cada uno con su llama. Trazo fino, sin relleno.
const HEART = "M0 10C0 2 6-4 13-4c5 0 9 3 11 7 2-4 6-7 11-7 7 0 13 6 13 14 0 14-16 24-24 32C16 34 0 24 0 10Z";
const FLAME = "M24 3c-4-5-2-10 0-14 2 4 4 9 0 14Z";

export default function TwoHearts({ title, strokeWidth = 2, ...props }: BrandSvgProps) {
  return (
    <svg
      viewBox="0 0 140 80"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...a11yProps(title)}
      {...props}
    >
      {title && <title>{title}</title>}
      {/* Corazón de Jesús: corona de espinas, llama y cruz */}
      <g transform="translate(14 30)">
        <path d={HEART} />
        <path d="M1 12c9 5 37 5 46 0M2 18c9 5 35 5 44 0" />
        <path d="M8 14.5l4 5M16 15.5l4 5M24 16l4 5M32 15.5l4 5M40 14.5l3 4" />
        <path d={FLAME} />
        <path d="M24 -14v-10M20 -20h8" />
      </g>
      {/* Corazón de María: espada y llama */}
      <g transform="translate(86 30)">
        <path d={HEART} />
        <path d="M-12 -8L20 20M-14 0l10-10M-12 -8l-5-5" />
        <path d={FLAME} />
      </g>
    </svg>
  );
}
