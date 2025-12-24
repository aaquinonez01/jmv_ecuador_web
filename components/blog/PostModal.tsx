"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  X,
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Camera,
} from "lucide-react";
import ImageGallery from "./ImageGallery";
import { usePostCategories } from "@/lib/hooks/usePostCategories";
import type { Post } from "@/types/user";

interface PostModalProps {
  post: Post;
  isOpen: boolean;
  onClose: () => void;
  onLike?: (postId: number) => void;
  onComment?: (postId: number) => void;
  onShare?: (postId: number) => void;
}

export default function PostModal({
  post,
  isOpen,
  onClose,
  onLike,
  onComment,
  onShare,
}: PostModalProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);
  const prevFocusedEl = useRef<HTMLElement | null>(null);

  // Cargar categorías desde backend para mostrar etiquetas dinámicas
  // IMPORTANTE: Pasamos el activityTypeId del post para que cargue los subtypes correspondientes
  const { scopes, activityTypes, subtypes } = usePostCategories({
    scopeId: post.scope,
    activityTypeId: post.activityType,
    subtypeId: post.subtype,
  });

  const scopeName = scopes.find((s: any) => s.id === post.scope)?.name;
  const activityTypeName = activityTypes.find(
    (a: any) => a.id === post.activityType
  )?.name;
  const subtypeName = subtypes.find((st: any) => st.id === post.subtype)?.name;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      prevFocusedEl.current = document.activeElement as HTMLElement;
      setTimeout(() => {
        const closeBtn = modalRef.current?.querySelector<HTMLElement>(
          'button[aria-label="Cerrar publicación"]'
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

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
    onLike?.(post.id);
  };

  const openGallery = (index: number) => {
    setGalleryIndex(index);
    setGalleryOpen(true);
  };

  const handleClose = () => {
    onClose();
    if (prevFocusedEl.current) {
      prevFocusedEl.current.focus();
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      handleClose();
      return;
    }
    if (e.key === "Tab") {
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
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-modal-in"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby={`post-title-${post.id}`}
          tabIndex={-1}
          ref={modalRef}
          onKeyDown={onKeyDown}
        >
          {/* Header del Modal */}
          <div className="sticky top-0 bg-white border-b border-gray-100 p-6 z-10">
            <div className="flex items-center justify-between">
              <Link
                href={`/blog/profile/${post.author.id}`}
                className="flex items-center gap-4 hover:opacity-80 transition-opacity"
              >
                <div className="w-12 h-12 bg-jmv-blue/10 rounded-full flex items-center justify-center hover:bg-jmv-blue/20 transition-colors">
                  <span className="text-jmv-blue font-bold text-lg">
                    {post.author.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {post.author.name}
                  </h3>
                  <p className="text-sm text-gray-500">{post.author.role}</p>
                </div>
              </Link>

              <div className="flex items-center gap-3 flex-wrap">
                {/* Alcance (Scope) */}
                {post.scope && scopeName && (
                  <span
                    className={`px-3 py-1 text-sm font-semibold rounded-full bg-jmv-blue text-white shadow-sm`}
                  >
                    <span className="hidden sm:inline">{scopeName}</span>
                    <span className="sm:hidden">{scopeName}</span>
                  </span>
                )}

                {/* Tipo de Actividad */}
                {post.activityType && activityTypeName && (
                  <span className="px-3 py-1 text-sm font-semibold rounded-full bg-jmv-blue text-white shadow-sm">
                    <span className="hidden sm:inline">{activityTypeName}</span>
                    <span className="sm:hidden">{activityTypeName}</span>
                  </span>
                )}

                {/* Subtipo */}
                {post.subtype && post.activityType && subtypeName && (
                  <span className="px-3 py-1 text-sm font-medium rounded-full bg-jmv-gold/90 text-white shadow-sm">
                    {subtypeName}
                  </span>
                )}

                <span className="text-sm text-gray-500">{post.timestamp}</span>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Cerrar publicación"
                  title="Cerrar publicación"
                >
                  <X className="w-5 h-5 text-gray-400" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          {/* Contenido del Modal */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            {/* Contenido del Post */}
            <div className="mb-6">
              <p className="text-gray-800 text-lg leading-relaxed">
                {post.content}
              </p>
            </div>

            {/* Imágenes */}
            {post.images && post.images.length > 0 && (
              <div className="mb-6">
                <div
                  className={`grid gap-3 ${
                    post.images.length === 1
                      ? "grid-cols-1"
                      : post.images.length === 2
                      ? "grid-cols-2"
                      : post.images.length <= 4
                      ? "grid-cols-2"
                      : "grid-cols-2 sm:grid-cols-3"
                  }`}
                >
                  {post.images
                    .slice(0, post.images.length > 6 ? 6 : post.images.length)
                    .map((image, index) => (
                      <div
                        key={index}
                        className="relative h-32 sm:h-40 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden group cursor-pointer hover:scale-105 transition-all duration-300 shadow-md hover:shadow-xl border border-gray-200/50"
                        onClick={() => openGallery(index)}
                        style={{
                          transform: `rotate(${
                            index % 2 === 0 ? "1deg" : "-1deg"
                          })`,
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-jmv-blue/20 via-jmv-blue/10 to-jmv-gold/20 flex items-center justify-center group-hover:from-jmv-blue/30 group-hover:via-jmv-blue/20 group-hover:to-jmv-gold/30 transition-all duration-300">
                          <Camera className="w-6 h-6 text-jmv-blue drop-shadow-sm" />
                        </div>
                        {index === 5 &&
                          post.images &&
                          post.images.length > 6 && (
                            <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-black/80 flex items-center justify-center backdrop-blur-sm">
                              <div className="text-white text-center">
                                <div className="text-lg font-bold drop-shadow-lg">
                                  +{post.images.length - 6}
                                </div>
                                <div className="text-sm opacity-90">
                                  más fotos
                                </div>
                              </div>
                            </div>
                          )}
                        {index === 3 &&
                          post.images &&
                          post.images.length > 4 &&
                          post.images.length <= 6 && (
                            <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-black/80 flex items-center justify-center backdrop-blur-sm">
                              <div className="text-white text-center">
                                <div className="text-lg font-bold drop-shadow-lg">
                                  +{post.images.length - 4}
                                </div>
                                <div className="text-sm opacity-90">
                                  más fotos
                                </div>
                              </div>
                            </div>
                          )}
                        {index === 1 &&
                          post.images &&
                          post.images.length === 3 && (
                            <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-black/80 flex items-center justify-center backdrop-blur-sm">
                              <div className="text-white text-center">
                                <div className="text-lg font-bold drop-shadow-lg">
                                  +1
                                </div>
                                <div className="text-sm opacity-90">
                                  más foto
                                </div>
                              </div>
                            </div>
                          )}
                      </div>
                    ))}
                </div>
                {post.images.length > 6 && (
                  <button
                    onClick={() => openGallery(0)}
                    className="mt-3 text-jmv-blue hover:text-jmv-blue-dark text-base font-medium flex items-center gap-2 transition-colors"
                  >
                    <Camera className="w-5 h-5" />
                    Ver todas las {post.images.length} fotos
                  </button>
                )}
              </div>
            )}

            {/* Acciones del Post */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center gap-6">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 transition-colors p-1 rounded ${
                  isLiked
                    ? "text-jmv-red"
                    : "text-gray-500 hover:text-jmv-red"
                }`}
                aria-pressed={isLiked}
                aria-label="Me gusta"
                title="Me gusta"
              >
                  <Heart
                    className={`w-6 h-6 ${isLiked ? "fill-current" : ""}`}
                    aria-hidden="true"
                  />
                  <span className="font-medium text-lg">{likeCount}</span>
                </button>
                <button
                  onClick={() => onComment?.(post.id)}
                  className="flex items-center gap-2 text-gray-500 hover:text-jmv-blue transition-colors"
                  aria-label="Comentar publicación"
                >
                  <MessageCircle className="w-6 h-6" aria-hidden="true" />
                  <span className="font-medium text-lg">{post.comments}</span>
                </button>
                <button
                  onClick={() => onShare?.(post.id)}
                  className="flex items-center gap-2 text-gray-500 hover:text-jmv-gold transition-colors"
                  aria-label="Compartir publicación"
                >
                  <Share2 className="w-6 h-6" aria-hidden="true" />
                  <span className="font-medium text-lg">{post.shares}</span>
                </button>
              </div>

              <button
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Más opciones"
                title="Más opciones"
              >
                <MoreHorizontal
                  className="w-5 h-5 text-gray-400"
                  aria-hidden="true"
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Visor de Galería */}
      {post.images && post.images.length > 0 && (
        <ImageGallery
          images={post.images}
          currentIndex={galleryIndex}
          isOpen={galleryOpen}
          onClose={() => setGalleryOpen(false)}
          postInfo={{
            author: post.author.name,
            content: post.content,
            likes: likeCount,
            comments: post.comments,
            shares: post.shares,
          }}
        />
      )}
    </>
  );
}
