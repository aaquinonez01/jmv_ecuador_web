import { ssrFetch } from "@/lib/helpers/apiBase";
import {
  mapPostsResponse,
  POSTS_PAGE_SIZE,
  postsQuery,
  type ApiPostsResponse,
  type PostsPage,
} from "@/lib/blog/posts";
import type { BlogCategory } from "@/types/user";

/** Primera página del blog para el render del servidor (ISR). null si el backend no responde. */
export async function fetchInitialPosts(): Promise<PostsPage | null> {
  try {
    const res = await ssrFetch(`/posts?${postsQuery({}, POSTS_PAGE_SIZE, 0)}`, {
      revalidate: 60,
      tags: ["posts"],
    });
    if (!res) return null;
    return mapPostsResponse((await res.json()) as ApiPostsResponse);
  } catch {
    // El cliente vuelve a intentarlo y muestra un error con "Reintentar"
    return null;
  }
}

async function fetchCategoryList(path: string, key: string): Promise<BlogCategory[]> {
  try {
    const res = await ssrFetch(path, { revalidate: 3600, tags: ["category_post"] });
    if (!res) return [];
    const data = await res.json();
    const list = (data?.[key] ?? data ?? []) as Array<{ id: string; name: string }>;
    return Array.isArray(list) ? list.map(({ id, name }) => ({ id, name })) : [];
  } catch {
    return [];
  }
}

/** Alcances y tipos de actividad para filtros y formulario */
export async function fetchPostCategories() {
  const [scopes, activityTypes] = await Promise.all([
    fetchCategoryList("/category-post/scopes", "scopes"),
    fetchCategoryList("/category-post/activity-types", "activityTypes"),
  ]);
  return { scopes, activityTypes };
}
