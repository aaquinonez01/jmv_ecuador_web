"use client";

import { useCallback, useState } from "react";
import { postHeading } from "@/lib/blog/posts";
import type { Post } from "@/types/user";
import PostModal from "./PostModal";
import ImageGallery from "./ImageGallery";

// Un único modal de publicación y una única galería para toda la lista,
// renderizados fuera de las tarjetas (en portal).
export function usePostViewer() {
  const [openPost, setOpenPost] = useState<Post | null>(null);
  const [postOpen, setPostOpen] = useState(false);
  const [gallery, setGallery] = useState<{ post: Post; index: number } | null>(null);
  const [galleryOpen, setGalleryOpen] = useState(false);

  const showPost = useCallback((post: Post) => {
    setOpenPost(post);
    setPostOpen(true);
  }, []);

  const showImage = useCallback((post: Post, index: number) => {
    setGallery({ post, index });
    setGalleryOpen(true);
  }, []);

  const viewer = (
    <>
      <PostModal
        post={openPost}
        isOpen={postOpen}
        onClose={() => setPostOpen(false)}
        onOpenImage={showImage}
      />
      {gallery ? (
        <ImageGallery
          images={gallery.post.images}
          startIndex={gallery.index}
          isOpen={galleryOpen}
          onClose={() => setGalleryOpen(false)}
          postTitle={postHeading(gallery.post)}
        />
      ) : null}
    </>
  );

  return { showPost, showImage, viewer };
}
