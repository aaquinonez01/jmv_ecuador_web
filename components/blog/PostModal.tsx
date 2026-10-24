"use client";

import Modal from "@/components/ui/Modal";
import { postHeading } from "@/lib/blog/posts";
import type { Post } from "@/types/user";
import { PostAuthorLine, PostBadges } from "./PostMeta";
import PostContent from "./PostContent";
import PostImagesGrid from "./PostImagesGrid";
import ShareButton from "./ShareButton";

interface PostModalProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenImage: (post: Post, index: number) => void;
}

// Publicación completa en un Dialog de Radix (portal, foco atrapado, Escape)
export default function PostModal({
  post,
  isOpen,
  onClose,
  onOpenImage,
}: PostModalProps) {
  if (!post) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={postHeading(post)}
      size="lg"
      footer={<ShareButton post={post} />}
    >
      <div className="space-y-5">
        <PostAuthorLine post={post} />
        <PostContent post={post} />
        <PostImagesGrid
          post={post}
          max={6}
          onOpen={(index) => onOpenImage(post, index)}
        />
        <PostBadges post={post} />
      </div>
    </Modal>
  );
}
