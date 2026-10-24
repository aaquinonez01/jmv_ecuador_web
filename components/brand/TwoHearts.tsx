import { a11yProps, type BrandSvgProps } from "./svg-props";

// Los dos corazones de la Medalla: el de Jesús (coronado de espinas) y el de María
// (atravesado por una espada), cada uno con su llama. Trazo fino, sin relleno.
const HEART = "M0 10C0 2 6-4 13-4c5 0 9 3 11 7 2-4 6-7 11-7 7 0 13 6 13 14 0 14-16 24-24 32C16 34 0 24 0 10Z";

export default function TwoHearts({ title, strokeWidth = 2.5, ...props }: BrandSvgProps) {
  return (
    <svg
      viewBox="0 0 132 84"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...a11yProps(title)}
      {...props}
    >
      {title && <title>{title}</title>}
      {/* Corazón de Jesús */}
      <g transform="translate(10 30)">
        <path d={HEART} />
        {/* Corona de espinas */}
        <path d="M4 12c8 5 32 5 40 0" />
        <path d="M10 13.5l-2 4M18 15l1 4M28 15l-1 4M37 13.5l2 4" />
        {/* Llama y cruz */}
        <path d="M24 3c-4-5-2-10 0-14 2 4 4 9 0 14Z" />
        <path d="M24 -14v-10M20 -20h8" />
      </g>
      {/* Corazón de María */}
      <g transform="translate(74 30)">
        <path d={HEART} />
        {/* Espada */}
        <path d="M-4 30L50 2M44 0l8 6" />
        {/* Llama */}
        <path d="M24 3c-4-5-2-10 0-14 2 4 4 9 0 14Z" />
      </g>
    </svg>
  );
}
