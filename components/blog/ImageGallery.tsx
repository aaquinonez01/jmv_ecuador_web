"use client";

import { useState, useEffect, useRef } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Download,
  Share2,
  Heart,
  MessageCircle,
} from "lucide-react";

interface ImageGalleryProps {
  images: string[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  postInfo?: {
    author: string;
    content: string;
    likes: number;
    comments: number;
    shares: number;
  };
}

export default function ImageGallery({
  images,
  currentIndex,
  isOpen,
  onClose,
  postInfo,
}: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(currentIndex);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const prevFocusedEl = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setActiveIndex(currentIndex);
  }, [currentIndex]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      prevFocusedEl.current = document.activeElement as HTMLElement;
      setTimeout(() => {
        const closeBtn = modalRef.current?.querySelector<HTMLElement>(
          'button[aria-label="Cerrar galería"]'
        );
        closeBtn?.focus();
      }, 0);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const nextImage = () => {
    setActiveIndex((prev) => (prev + 1) % images.length);
    setZoom(1);
    setRotation(0);
  };

  const prevImage = () => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
    setZoom(1);
    setRotation(0);
  };

  const handleZoom = (direction: "in" | "out") => {
    if (direction === "in") {
      setZoom((prev) => Math.min(prev + 0.5, 3));
    } else {
      setZoom((prev) => Math.max(prev - 0.5, 0.5));
    }
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = images[activeIndex];
    link.download = `jmv-gallery-${activeIndex + 1}.jpg`;
    link.click();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Galería JMV",
        text: postInfo?.content || "Mira esta galería de JMV Ecuador",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleClose = () => {
    onClose();
    if (prevFocusedEl.current) {
      prevFocusedEl.current.focus();
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case "Escape":
        e.stopPropagation();
        handleClose();
        break;
      case "ArrowLeft":
        prevImage();
        break;
      case "ArrowRight":
        nextImage();
        break;
      case "+":
      case "=":
        handleZoom("in");
        break;
      case "-":
        handleZoom("out");
        break;
      case "r":
      case "R":
        handleRotate();
        break;
      case "Tab": {
        const container = modalRef.current;
        if (!container) return;
        const focusable = container.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        } else if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
        break;
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Galería de imágenes"
      tabIndex={-1}
      ref={modalRef}
      onKeyDown={onKeyDown}
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Cerrar galería"
              title="Cerrar galería"
            >
              <X className="w-6 h-6 text-white" aria-hidden="true" />
            </button>
            <div className="text-white">
              <span className="text-lg font-semibold">
                {activeIndex + 1} de {images.length}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleZoom("out")}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Alejar"
              title="Alejar"
            >
              <ZoomOut className="w-5 h-5 text-white" aria-hidden="true" />
            </button>
            <button
              onClick={() => handleZoom("in")}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Acercar"
              title="Acercar"
            >
              <ZoomIn className="w-5 h-5 text-white" aria-hidden="true" />
            </button>
            <button
              onClick={handleRotate}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Rotar"
              title="Rotar"
            >
              <RotateCw className="w-5 h-5 text-white" aria-hidden="true" />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Descargar imagen"
              title="Descargar imagen"
            >
              <Download className="w-5 h-5 text-white" aria-hidden="true" />
            </button>
            <button
              onClick={handleShare}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Compartir"
              title="Compartir"
            >
              <Share2 className="w-5 h-5 text-white" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* Imagen Principal */}
      <div className="flex items-center justify-center h-full pt-16 pb-20">
        <div className="relative max-w-full max-h-full">
          <img
            src={images[activeIndex]}
            alt={`Galería ${activeIndex + 1}`}
            className="max-w-full max-h-full object-contain transition-transform duration-300"
            style={{
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
            }}
            draggable={false}
          />
        </div>
      </div>

      {/* Navegación */}
      <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
        <button
          onClick={prevImage}
          className="p-3 hover:bg-white/20 rounded-full transition-colors"
          aria-label="Imagen anterior"
          title="Imagen anterior"
        >
          <ChevronLeft className="w-8 h-8 text-white" aria-hidden="true" />
        </button>
      </div>

      <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
        <button
          onClick={nextImage}
          className="p-3 hover:bg-white/20 rounded-full transition-colors"
          aria-label="Imagen siguiente"
          title="Imagen siguiente"
        >
          <ChevronRight className="w-8 h-8 text-white" aria-hidden="true" />
        </button>
      </div>

      {/* Miniaturas */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                index === activeIndex
                  ? "border-jmv-gold"
                  : "border-transparent hover:border-white/50"
              }`}
              aria-label={`Ir a imagen ${index + 1}`}
              title={`Ir a imagen ${index + 1}`}
            >
              <img
                src={image}
                alt={`Miniatura ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Información del Post */}
      {postInfo && (
        <div className="absolute bottom-20 left-4 right-4 bg-black/60 backdrop-blur-sm rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-jmv-blue/20 rounded-full flex items-center justify-center">
              <span className="text-jmv-blue font-bold text-sm">
                {postInfo.author.charAt(0)}
              </span>
            </div>
            <span className="text-white font-medium">{postInfo.author}</span>
          </div>
          <p className="text-white/80 text-sm mb-3 line-clamp-2">
            {postInfo.content}
          </p>
          <div className="flex items-center gap-4 text-white/60 text-sm">
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              <span>{postInfo.likes}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              <span>{postInfo.comments}</span>
            </div>
            <div className="flex items-center gap-1">
              <Share2 className="w-4 h-4" />
              <span>{postInfo.shares}</span>
            </div>
          </div>
        </div>
      )}

      {/* Controles de Zoom */}
      <div className="absolute top-20 right-4 bg-black/60 backdrop-blur-sm rounded-lg p-2">
        <div className="text-white text-xs text-center mb-1">
          {Math.round(zoom * 100)}%
        </div>
        <div className="w-20 h-1 bg-white/30 rounded-full">
          <div
            className="h-full bg-jmv-gold rounded-full transition-all"
            style={{ width: `${((zoom - 0.5) / 2.5) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
