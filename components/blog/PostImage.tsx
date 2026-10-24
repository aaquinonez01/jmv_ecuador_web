import type { ImgHTMLAttributes } from "react";
import { getOptimizedUrl } from "@/lib/helpers/cloudinary";

const WIDTHS = [320, 480, 640, 960, 1280];

interface PostImageProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet"> {
  src: string;
  alt: string;
  /** Ancho máximo a pedir a Cloudinary */
  maxWidth?: number;
}

// Imagen de publicación servida por Cloudinary con srcset (sin pasar por el
// optimizador de Next, que gasta CPU del VPS). Diferida por defecto.
export default function PostImage({
  src,
  alt,
  maxWidth = 1280,
  sizes = "(min-width: 1024px) 640px, 100vw",
  loading = "lazy",
  ...props
}: PostImageProps) {
  const isCloudinary = src.includes("res.cloudinary.com");
  const widths = WIDTHS.filter((w) => w <= maxWidth);
  const srcSet = isCloudinary
    ? widths.map((w) => `${getOptimizedUrl(src, { w })} ${w}w`).join(", ")
    : undefined;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={isCloudinary ? getOptimizedUrl(src, { w: Math.min(800, maxWidth) }) : src}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      alt={alt}
      loading={loading}
      decoding="async"
      {...props}
    />
  );
}
