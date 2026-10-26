"use client";

import Image, { type ImageLoaderProps, type ImageProps } from "next/image";

// Las fotos de Cloudinary se piden ya redimensionadas a Cloudinary (f_auto, q_auto,
// ancho exacto) en vez de pasar por el optimizador de Next: menos CPU en el VPS.
// Las fotos locales (/images/...) sí usan el optimizador de Next.
// Es un componente cliente porque `loader` es una función y no puede cruzar
// del servidor al cliente.
function cloudinaryLoader({ src, width }: ImageLoaderProps) {
  const [base, rest] = src.split("/upload/");
  if (!rest) return src;
  return `${base}/upload/f_auto,q_auto,c_limit,w_${width}/${rest}`;
}

export function isCloudinary(src: string) {
  return src.startsWith("https://res.cloudinary.com/") && src.includes("/upload/");
}

export default function SiteImage(props: ImageProps) {
  const src = typeof props.src === "string" ? props.src : "";
  if (src && isCloudinary(src)) {
    return <Image {...props} loader={cloudinaryLoader} alt={props.alt} />;
  }
  return <Image {...props} alt={props.alt} />;
}
