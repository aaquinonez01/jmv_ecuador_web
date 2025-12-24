"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, MoreHorizontal, Camera } from "lucide-react";
import ImageGallery from "./ImageGallery";
import PostModal from "./PostModal";
import { usePostCategories } from "@/lib/hooks/usePostCategories";
import type { Post } from "@/types/user";

interface BlogPostProps {
  post: Post;
  onLike?: (postId: number) => void;
  onComment?: (postId: number) => void;
  onShare?: (postId: number) => void;
}

export default function BlogPost({
  post,
  onLike,
  onComment,
  onShare,
}: BlogPostProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  // Cargar categorías desde backend para mostrar etiquetas dinámicas
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

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
    onLike?.(post.id);
  };

  const openGallery = (index: number) => {
    setGalleryIndex(index);
    setGalleryOpen(true);
  };

  const openModal = () => {
    setModalOpen(true);
  };

  return (
    <article
      className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 blog-content cursor-pointer"
      onClick={openModal}
      aria-labelledby={`post-title-${post.id}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openModal();
        }
      }}
    >
      {/* Header del Post */}
      <div className="p-3 xl:p-4 border-b border-gray-100">
        <div className="flex items-center justify-between gap-3 xl:gap-4 mb-2">
          <div className="flex items-center gap-3 xl:gap-4 flex-1 min-w-0">
            <Link
              href={`/blog/profile/${post.author.id}`}
              className="w-10 h-10 xl:w-12 xl:h-12 bg-jmv-blue/10 rounded-full flex items-center justify-center flex-shrink-0 hover:bg-jmv-blue/20 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-jmv-blue font-bold text-base xl:text-lg">
                {post.author.name.charAt(0)}
              </span>
            </Link>
            <Link
              href={`/blog/profile/${post.author.id}`}
              className="flex-1 min-w-0 hover:opacity-80 transition-opacity"
              onClick={(e) => e.stopPropagation()}
            >
              <h3
                id={`post-title-${post.id}`}
                className="font-semibold text-gray-900 text-sm xl:text-base truncate"
              >
                {post.author.name}
              </h3>
              <p className="text-xs xl:text-sm text-gray-500 truncate">
                {post.author.role}
              </p>
            </Link>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xs xl:text-sm text-gray-500">
              {post.timestamp}
            </span>
            <button
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Opciones de publicación"
              title="Opciones de publicación"
            >
              <MoreHorizontal
                className="w-4 h-4 text-gray-400"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>

        {/* Badges de categorías */}
        {(post.scope || post.activityType || post.subtype) && (
          <div className="flex items-center gap-2 flex-wrap">
            {/* Alcance Badge */}
            {post.scope && scopeName && (
              <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-jmv-blue to-jmv-blue-dark text-white shadow-sm">
                {scopeName}
              </span>
            )}

            {/* Tipo de Actividad Badge */}
            {post.activityType && activityTypeName && (
              <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-jmv-blue text-white shadow-sm">
                {activityTypeName}
              </span>
            )}

            {/* Subtipo Badge */}
            {post.subtype && post.activityType && subtypeName && (
              <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-jmv-gold/90 text-white shadow-sm">
                {subtypeName}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Contenido del Post */}
      <div className="p-3 xl:p-4">
        <p className="text-gray-800 mb-3 leading-relaxed text-sm xl:text-base blog-text">
          {post.content}
        </p>

        {/* Imágenes */}
        {post.images && post.images.length > 0 && (
          <div className="mb-3">
            <div
              className={`grid gap-2 sm:gap-3 ${
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
                    className={`relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden group cursor-pointer hover:scale-[1.02] transition-all duration-300 shadow-md hover:shadow-xl border border-gray-200/50 ${
                      post.images && post.images.length === 1
                        ? "h-48 sm:h-56 lg:h-64"
                        : post.images && post.images.length === 2
                        ? "h-36 sm:h-44 lg:h-48"
                        : "h-28 sm:h-36 lg:h-40"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      openGallery(index);
                    }}
                  >
                    <img
                      src={image}
                      alt={`Foto de ${post.author.name} ${index + 1}`}
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-jmv-blue/5 via-transparent to-jmv-gold/5 group-hover:from-jmv-blue/10 group-hover:to-jmv-gold/10 transition-all duration-300"></div>
                    {index === 5 && post.images && post.images.length > 6 && (
                      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-black/80 flex items-center justify-center backdrop-blur-sm">
                        <div className="text-white text-center">
                          <div className="text-sm sm:text-base font-bold drop-shadow-lg">
                            +{post.images.length - 6}
                          </div>
                          <div className="text-xs opacity-90">más fotos</div>
                        </div>
                      </div>
                    )}
                    {index === 3 &&
                      post.images &&
                      post.images.length > 4 &&
                      post.images.length <= 6 && (
                        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-black/80 flex items-center justify-center backdrop-blur-sm">
                          <div className="text-white text-center">
                            <div className="text-sm sm:text-base font-bold drop-shadow-lg">
                              +{post.images.length - 4}
                            </div>
                            <div className="text-xs opacity-90">más fotos</div>
                          </div>
                        </div>
                      )}
                    {index === 1 && post.images && post.images.length === 3 && (
                      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-black/80 flex items-center justify-center backdrop-blur-sm">
                        <div className="text-white text-center">
                          <div className="text-sm sm:text-base font-bold drop-shadow-lg">
                            +1
                          </div>
                          <div className="text-xs opacity-90">más foto</div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
            {post.images.length > 6 && (
              <button
                onClick={() => openGallery(0)}
                className="mt-2 text-jmv-blue hover:text-jmv-blue-dark text-sm font-medium flex items-center gap-1 transition-colors"
              >
                <Camera className="w-4 h-4" />
                Ver todas las {post.images.length} fotos
              </button>
            )}
          </div>
        )}

        {/* Acciones del Post */}
        <nav
          className="flex items-center justify-between pt-2 xl:pt-3 border-t border-gray-100"
          aria-label="Acciones de publicación"
        >
          <div className="flex items-center gap-4 xl:gap-6">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 xl:gap-2 transition-colors p-1 rounded ${
                isLiked ? "text-jmv-red" : "text-gray-500 hover:text-jmv-red"
              }`}
              aria-pressed={isLiked}
              aria-label="Me gusta"
              title="Me gusta"
            >
              <Heart
                className={`w-4 h-4 xl:w-5 xl:h-5 ${
                  isLiked ? "fill-current" : ""
                }`}
              />
              <span className="font-medium text-sm xl:text-base">
                {likeCount}
              </span>
            </button>
          </div>
        </nav>
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

      {/* Modal de Publicación */}
      <PostModal
        post={post}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onLike={onLike}
        onComment={onComment}
        onShare={onShare}
      />
    </article>
  );
}
