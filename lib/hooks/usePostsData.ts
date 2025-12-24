"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getAllPosts,
  type Post,
  type PostFilters,
  type PostsResponse,
} from "@/actions/posts";

interface UsePostsDataOptions {
  initialFilters?: PostFilters;
  autoFetch?: boolean;
}

/**
 * Custom hook para manejar la obtención y filtrado de posts desde el backend
 * Soporta filtros dinámicos por scope, activityType, subtype, typePost y búsqueda
 */
export function usePostsData(options: UsePostsDataOptions = {}) {
  const { initialFilters = {}, autoFetch = true } = options;

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    offset: 0,
    total: 0,
  });

  // Filtros activos
  const [filters, setFilters] = useState<PostFilters>(initialFilters);

  /**
   * Función para obtener posts con los filtros actuales
   */
  const fetchPosts = useCallback(async (customFilters?: PostFilters) => {
    setLoading(true);
    setError(null);

    try {
      const appliedFilters = customFilters || filters;
      const response: PostsResponse = await getAllPosts(appliedFilters);

      setPosts(response.posts);
      setPagination({
        page: response.page,
        limit: response.limit,
        offset: response.offset,
        total: response.total,
      });
    } catch (err: any) {
      setError(err.message || "Error al cargar las publicaciones");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  /**
   * Actualizar filtro de scope
   */
  const setScope = useCallback((scope?: string) => {
    setFilters((prev) => ({ ...prev, scope, offset: 0 }));
  }, []);

  /**
   * Actualizar filtro de activityType
   */
  const setActivityType = useCallback((activityType?: string) => {
    setFilters((prev) => ({ ...prev, activityType, offset: 0 }));
  }, []);

  /**
   * Actualizar filtro de subtype
   */
  const setSubtype = useCallback((subtype?: string) => {
    setFilters((prev) => ({ ...prev, subtype, offset: 0 }));
  }, []);

  /**
   * Actualizar filtro de typePost (moments/documents)
   */
  const setTypePost = useCallback((typePost?: "moments" | "documents") => {
    setFilters((prev) => ({ ...prev, typePost, offset: 0 }));
  }, []);

  /**
   * Actualizar búsqueda
   */
  const setSearch = useCallback((search?: string) => {
    setFilters((prev) => ({ ...prev, search, offset: 0 }));
  }, []);

  /**
   * Actualizar todos los filtros de una vez
   */
  const updateFilters = useCallback((newFilters: Partial<PostFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, offset: 0 }));
  }, []);

  /**
   * Limpiar todos los filtros
   */
  const clearFilters = useCallback(() => {
    setFilters({ limit: 10, offset: 0 });
  }, []);

  /**
   * Cambiar página (paginación)
   */
  const changePage = useCallback((page: number) => {
    setFilters((prev) => ({
      ...prev,
      offset: (page - 1) * (prev.limit || 10),
    }));
  }, []);

  /**
   * Recargar posts manualmente
   */
  const refresh = useCallback(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Auto-fetch cuando los filtros cambian
  useEffect(() => {
    if (autoFetch) {
      fetchPosts();
    }
  }, [filters, autoFetch, fetchPosts]);

  return {
    // Data
    posts,
    loading,
    error,
    pagination,
    filters,

    // Actions
    setScope,
    setActivityType,
    setSubtype,
    setTypePost,
    setSearch,
    updateFilters,
    clearFilters,
    changePage,
    refresh,
    fetchPosts,
  };
}
