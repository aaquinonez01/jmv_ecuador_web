"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { fetchPostsPage } from "@/lib/blog/posts.client";
import {
  POSTS_PAGE_SIZE,
  type PostFilters,
  type PostsPage,
} from "@/lib/blog/posts";
import type { Post } from "@/types/user";

type FeedStatus = "idle" | "loading" | "loadingMore" | "error";

interface UsePostsDataOptions {
  /** Primera página renderizada en el servidor (sin filtros) */
  initialPage?: PostsPage | null;
  pageSize?: number;
}

const keyOf = (f: PostFilters) =>
  JSON.stringify([f.typePost, f.scope, f.activityType, f.subtype, f.search]);

/**
 * Feed del blog: filtros, primera página (o la del servidor) y "Cargar más"
 * que añade la página siguiente sin reemplazar lo que ya se ve.
 */
export function usePostsData({
  initialPage,
  pageSize = POSTS_PAGE_SIZE,
}: UsePostsDataOptions = {}) {
  const [filters, setFilters] = useState<PostFilters>({});
  const [posts, setPosts] = useState<Post[]>(initialPage?.posts ?? []);
  const [total, setTotal] = useState(initialPage?.total ?? 0);
  const [status, setStatus] = useState<FeedStatus>(
    initialPage ? "idle" : "loading"
  );
  const [loadMoreFailed, setLoadMoreFailed] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);

  const requestId = useRef(0);
  // Clave de filtros ya cargada: evita repetir la petición de la página del servidor
  const loadedKey = useRef<string | null>(initialPage ? keyOf({}) : null);
  const filtersKey = keyOf(filters);

  useEffect(() => {
    if (loadedKey.current === filtersKey) return;
    loadedKey.current = filtersKey;
    const id = ++requestId.current;
    setStatus("loading");
    setLoadMoreFailed(false);
    fetchPostsPage(filters, pageSize, 0)
      .then((page) => {
        if (id !== requestId.current) return;
        setPosts(page.posts);
        setTotal(page.total);
        setStatus("idle");
      })
      .catch(() => {
        if (id !== requestId.current) return;
        loadedKey.current = null;
        setStatus("error");
      });
    // filters cambia junto con filtersKey
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersKey, pageSize, reloadToken]);

  const loadMore = useCallback(async () => {
    if (status !== "idle" || posts.length >= total) return;
    const id = ++requestId.current;
    setStatus("loadingMore");
    setLoadMoreFailed(false);
    try {
      const page = await fetchPostsPage(filters, pageSize, posts.length);
      if (id !== requestId.current) return;
      setPosts((prev) => {
        const seen = new Set(prev.map((p) => p.id));
        return [...prev, ...page.posts.filter((p) => !seen.has(p.id))];
      });
      setTotal(page.total);
    } catch {
      if (id === requestId.current) setLoadMoreFailed(true);
    } finally {
      if (id === requestId.current) setStatus("idle");
    }
  }, [status, posts.length, total, filters, pageSize]);

  /** Vuelve a pedir la primera página con los filtros actuales */
  const refresh = useCallback(() => {
    loadedKey.current = null;
    setReloadToken((t) => t + 1);
  }, []);

  const setFilter = useCallback(
    <K extends keyof PostFilters>(key: K, value: PostFilters[K] | undefined) => {
      setFilters((prev) => {
        const next: PostFilters = { ...prev, [key]: value || undefined };
        // El subtipo depende del tipo de actividad
        if (key === "activityType") next.subtype = undefined;
        return next;
      });
    },
    []
  );

  const clearFilters = useCallback(() => setFilters({}), []);

  const hasFilters = useMemo(
    () => Object.values(filters).some(Boolean),
    [filters]
  );

  return {
    posts,
    total,
    status,
    loadMoreFailed,
    hasMore: posts.length < total,
    filters,
    hasFilters,
    setFilter,
    clearFilters,
    loadMore,
    refresh,
  };
}
