"use client";

import Lightbox, { type Slide } from "yet-another-react-lightbox";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import { getOptimizedUrl } from "@/lib/helpers/cloudinary";

// Separado para cargarlo con next/dynamic solo cuando se abre un álbum.
export default function ActivityLightbox({
  open,
  close,
  index,
  slides,
}: {
  open: boolean;
  close: () => void;
  index: number;
  slides: Slide[];
}) {
  return (
    <Lightbox
      open={open}
      close={close}
      index={index}
      slides={slides.map((s) =>
        "src" in s ? { ...s, src: getOptimizedUrl(s.src, { w: 1920 }) } : s
      )}
      plugins={[Zoom, Fullscreen, Slideshow]}
      animation={{ fade: 300 }}
      zoom={{ maxZoomPixelRatio: 3, scrollToZoom: true }}
      slideshow={{ autoplay: false, delay: 3000 }}
      controller={{ closeOnBackdropClick: true }}
    />
  );
}
