import { a11yProps, type BrandSvgProps } from "./svg-props";

// Monograma mariano del reverso de la Medalla: cruz sobre una barra y la M entrelazada.
export default function MarianMonogram({ title, strokeWidth = 6, ...props }: BrandSvgProps) {
  return (
    <svg
      viewBox="0 0 120 140"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...a11yProps(title)}
      {...props}
    >
      {title && <title>{title}</title>}
      {/* Cruz */}
      <path d="M60 6v62M44 22h32" />
      {/* Barra horizontal sobre la que se apoya la cruz */}
      <path d="M22 68h76" />
      {/* M: el trazo central sube hasta la barra */}
      <path d="M26 132V84l34 34 34-34v48" />
      <path d="M60 68v50" />
    </svg>
  );
}
