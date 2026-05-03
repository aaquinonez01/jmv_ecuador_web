import type { Post } from "@/types/user";

const posts: Post[] = [];

export function getAllPosts(): Post[] {
  return posts;
}

export function getPostsByUserId(userId: string): Post[] {
  return posts.filter((post) => post.author.id === userId);
}
