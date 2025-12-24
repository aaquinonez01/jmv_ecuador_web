"use server";

import { getAxiosClient } from "@/config/axios.config";

export interface PostFilters {
  scope?: string;
  activityType?: string;
  subtype?: string;
  typePost?: "moments" | "documents";
  search?: string;
  limit?: number;
  offset?: number;
}

export interface PostUser {
  id: string;
  fullName: string;
  email: string;
  profilePicture?: string | null;
  role: string;
}

export interface PostCategory {
  id: string;
  name: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  typePost: string;
  createdAt: string;
  updatedAt: string;
  images: string[];
  scope: PostCategory | null;
  activityType: PostCategory | null;
  subtype: PostCategory | null;
  user: PostUser;
}

export interface PostsResponse {
  page: number;
  limit: number;
  offset: number;
  total: number;
  posts: Post[];
}

/**
 * Obtiene todos los posts con filtros opcionales
 * @param filters - Filtros para scope, activityType, subtype, búsqueda y paginación
 * @returns Respuesta con posts paginados y filtrados
 */
export async function getAllPosts(
  filters: PostFilters = {}
): Promise<PostsResponse> {
  try {
    const api = getAxiosClient();

    // Construir query params
    const params = new URLSearchParams();

    if (filters.scope) params.append("scope", filters.scope);
    if (filters.activityType) params.append("activityType", filters.activityType);
    if (filters.subtype) params.append("subtype", filters.subtype);
    if (filters.typePost) params.append("typePost", filters.typePost);
    if (filters.search) params.append("search", filters.search);
    if (filters.limit) params.append("limit", filters.limit.toString());
    if (filters.offset) params.append("offset", filters.offset.toString());

    const { data } = await api.get<PostsResponse>(
      `/posts?${params.toString()}`
    );

    return data;
  } catch (error: any) {
    console.error("Error fetching posts:", error);
    throw new Error(
      error.response?.data?.message || "Error al obtener las publicaciones"
    );
  }
}
