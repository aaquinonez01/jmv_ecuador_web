import { a11yProps, starPoints, type BrandSvgProps } from "./svg-props";

// Doce estrellas en anillo, como en el reverso de la Medalla Milagrosa.
// Hereda el color de currentColor (p. ej. text-jmv-gold-text/30).
const STARS = Array.from({ length: 12 }, (_, i) => {
  const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
  return starPoints(100 + Math.cos(a) * 84, 100 + Math.sin(a) * 84, 9);
});

export default function StarsRing({
  title,
  withCircle = false,
  ...props
}: BrandSvgProps & { withCircle?: boolean }) {
  return (
    <svg viewBox="0 0 200 200" fill="currentColor" {...a11yProps(title)} {...props}>
      {title && <title>{title}</title>}
      {withCircle && (
        <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" strokeWidth="0.75" opacity="0.6" />
      )}
      {STARS.map((points, i) => (
        <polygon key={i} points={points} />
      ))}
    </svg>
  );
}
