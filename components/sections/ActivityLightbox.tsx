"use client";

import Lightbox, { type Slide } from "yet-another-react-lightbox";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import { useReducedMotion } from "framer-motion";
import { getOptimizedUrl } from "@/lib/helpers/cloudinary";

const LABELS = {
  Previous: "Foto anterior",
  Next: "Foto siguiente",
  Close: "Cerrar pantalla completa",
  Slide: "Foto",
  Carousel: "Carrusel",
  Lightbox: "Visor de fotos",
  "Photo gallery": "Galería de fotos",
  "{index} of {total}": "{index} de {total}",
  "Zoom in": "Acercar",
  "Zoom out": "Alejar",
  "Enter Fullscreen": "Pantalla completa",
  "Exit Fullscreen": "Salir de pantalla completa",
  Play: "Reproducir presentación",
  Pause: "Pausar presentación",
};

// Separado para cargarlo con next/dynamic solo cuando se abre un álbum. Se monta
// dentro del diálogo del álbum (portalRoot) para que el foco y Escape funcionen.
export default function ActivityLightbox({
  open,
  close,
  index,
  slides,
  portalRoot,
}: {
  open: boolean;
  close: () => void;
  index: number;
  slides: Slide[];
  portalRoot?: HTMLElement | null;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <Lightbox
      open={open}
      close={close}
      index={index}
      slides={slides.map((s) =>
        "src" in s ? { ...s, src: getOptimizedUrl(s.src, { w: 1920 }) } : s
      )}
      plugins={[Zoom, Fullscreen, Slideshow]}
      labels={LABELS}
      portal={{ root: portalRoot }}
      animation={reduceMotion ? { fade: 0, swipe: 0, zoom: 0 } : { fade: 300 }}
      zoom={{ maxZoomPixelRatio: 3, scrollToZoom: true }}
      slideshow={{ autoplay: false, delay: 3000 }}
      controller={{ closeOnBackdropClick: true }}
    />
  );
}
