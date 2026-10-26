"use client";

import Lightbox, { type Slide } from "yet-another-react-lightbox";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import { useMemo } from "react";
import { useReducedMotion } from "framer-motion";
import { getOptimizedUrl, viewerUrl } from "@/lib/helpers/cloudinary";

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

// Mismo padding que el carrusel por defecto, para que la miniatura quede justo detrás de la foto
const PADDING = 16;

type ViewerSlide = Slide & { thumb?: string };

// Separado para cargarlo con next/dynamic (se precarga en segundo plano al abrir
// la sección). Desde el álbum se monta dentro del diálogo (portalRoot) para que
// el foco y Escape funcionen.
export default function ActivityLightbox({
  open,
  close,
  index,
  slides,
  portalRoot,
  thumbWidth = 320,
}: {
  open: boolean;
  close: () => void;
  index: number;
  slides: Slide[];
  portalRoot?: HTMLElement | null;
  /** Ancho de la miniatura ya descargada que se muestra mientras carga la foto grande */
  thumbWidth?: number;
}) {
  const reduceMotion = useReducedMotion();
  const viewerSlides = useMemo<ViewerSlide[]>(
    () =>
      slides.map((s) =>
        "src" in s && s.src
          ? { ...s, src: viewerUrl(s.src), thumb: getOptimizedUrl(s.src, { w: thumbWidth }) }
          : s,
      ),
    [slides, thumbWidth],
  );

  return (
    <Lightbox
      open={open}
      close={close}
      index={index}
      slides={viewerSlides}
      plugins={[Zoom, Fullscreen, Slideshow]}
      labels={LABELS}
      portal={{ root: portalRoot }}
      animation={reduceMotion ? { fade: 0, swipe: 0, zoom: 0 } : { fade: 300 }}
      zoom={{ maxZoomPixelRatio: 3, scrollToZoom: true }}
      slideshow={{ autoplay: false, delay: 3000 }}
      controller={{ closeOnBackdropClick: true }}
      carousel={{ padding: PADDING, preload: 2 }}
      render={{
        // La miniatura (ya en caché) se ve al instante; la foto grande la cubre al llegar
        slideContainer: ({ slide, children }) => {
          const thumb = (slide as ViewerSlide).thumb;
          return (
            <div style={{ position: "relative", width: "100%", height: "100%" }}>
              {thumb ? (
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    inset: PADDING,
                    backgroundImage: `url("${thumb}")`,
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    filter: "blur(3px)",
                  }}
                />
              ) : null}
              {children}
            </div>
          );
        },
      }}
    />
  );
}
