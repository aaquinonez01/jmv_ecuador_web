"use client";

import { useMemo, useState } from "react";
import Modal from "@/components/admin/ui/Modal";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import "yet-another-react-lightbox/styles.css";

interface AlbumImage {
  id: string;
  url: string;
  alt: string;
}

interface Album {
  id: string;
  title: string;
  description?: string;
  coverUrl: string;
  count: number;
  categorySlug?: string | null;
  categoryName?: string | null;
  images: AlbumImage[];
}

interface Category {
  slug: string;
  name: string;
}

export default function ActivitiesAlbumsClient({ albums, categories = [] }: { albums: Album[]; categories?: Category[] }) {
  const [openAlbum, setOpenAlbum] = useState<Album | null>(null);
  const [selectedCat, setSelectedCat] = useState<string>("todas");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const visibleAlbums = useMemo(() => {
    if (selectedCat === "todas") return albums;
    return albums.filter((a) => (a.categorySlug || null) === selectedCat);
  }, [albums, selectedCat]);

  return (
    <section className="py-12 sm:py-16 lg:py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-jmv-blue-dark to-blue-800" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white font-medium mb-6">
            Galería de Actividades
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
            Vivencias y servicio
          </h2>
        </div>

        <div className="mb-8 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedCat("todas")}
            className={`px-3 py-1.5 rounded-full text-sm ${selectedCat === "todas" ? "bg-white text-blue-900" : "bg-white/10 text-white hover:bg-white/20"}`}
          >
            Todas
          </button>
          {categories.map((c) => (
            <button
              key={c.slug}
              onClick={() => setSelectedCat(c.slug)}
              className={`px-3 py-1.5 rounded-full text-sm ${selectedCat === c.slug ? "bg-white text-blue-900" : "bg-white/10 text-white hover:bg_white/20"}`}
            >
              {c.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 auto-rows-[220px] sm:auto-rows-[240px]">
          {visibleAlbums.map((album) => (
            <button
              key={album.id}
              onClick={() => setOpenAlbum(album)}
              className="group relative rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:z-10 text-left"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url('${album.coverUrl}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/90 transition-all duration-300" />
              <div className="absolute inset-0 p-4 lg:p-6 flex flex-col justify-end text-white">
                <h3 className="text-base sm:text-lg lg:text-xl font-bold mb-1 sm:mb-2 group-hover:text-jmv-gold transition-colors duration-300 line-clamp-2">
                  {album.title}
                </h3>
                {album.description && (
                  <p className="text-xs sm:text-sm text-white/80 mb-2 sm:mb-3 line-clamp-2">
                    {album.description}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <p className="text-xs sm:text-sm text_white/70">Imágenes: {album.count}</p>
                  {album.categoryName && (
                    <span className="text-xs sm:text-sm text-white/80">{album.categoryName}</span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <Modal
        isOpen={!!openAlbum}
        onClose={() => setOpenAlbum(null)}
        title={openAlbum?.title || "Actividad"}
        size="xl"
      >
        <div className="p-4 sm:p-6">
          {openAlbum?.description && (
            <p className="text-sm text-gray-700 mb-4">{openAlbum.description}</p>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
            {openAlbum?.images.map((img, idx) => (
              <button
                key={img.id}
                onClick={() => {
                  setLightboxIndex(idx);
                  setLightboxOpen(true);
                }}
                className="relative w-full pt-[66%] rounded-lg overflow-hidden bg-gray-100 focus:outline-none focus:ring-2 focus:ring-jmv-gold"
                style={{ backgroundImage: `url('${img.url}')`, backgroundSize: "cover", backgroundPosition: "center" }}
                aria-label={img.alt}
                title={img.alt}
              />
            ))}
          </div>
        </div>
      </Modal>
      {lightboxOpen && openAlbum && (
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          index={lightboxIndex}
          slides={openAlbum.images.map((img) => ({ src: img.url, alt: img.alt }))}
          plugins={[Zoom, Fullscreen, Slideshow]}
          animation={{ fade: 300 }}
          zoom={{ maxZoomPixelRatio: 3, scrollToZoom: true }}
          slideshow={{ autoplay: false, delay: 3000 }}
          controller={{ closeOnBackdropClick: true }}
        />
      )}
    </section>
  );
}
