import type { SVGProps } from "react";

export interface BrandSvgProps extends Omit<SVGProps<SVGSVGElement>, "title"> {
  /** Si se indica, el SVG se anuncia como imagen con este nombre; si no, es decorativo */
  title?: string;
}

/** Atributos de accesibilidad: decorativo (aria-hidden) salvo que tenga título */
export function a11yProps(title?: string) {
  return title
    ? ({ role: "img", "aria-label": title } as const)
    : ({ "aria-hidden": true, focusable: false } as const);
}

/** Puntos de una estrella de cinco puntas centrada en (cx, cy) */
export function starPoints(cx: number, cy: number, outer: number, inner = outer * 0.42) {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (Math.PI / 5) * i - Math.PI / 2;
    pts.push(`${(cx + Math.cos(a) * r).toFixed(2)},${(cy + Math.sin(a) * r).toFixed(2)}`);
  }
  return pts.join(" ");
}
