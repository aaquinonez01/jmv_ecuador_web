"use client";

import { getAxiosClient } from "@/config/axios.config";
import {
  mapPostsResponse,
  postsQuery,
  type ApiPostsResponse,
  type PostFilters,
  type PostsPage,
} from "./posts";

/** GET /posts desde el navegador (endpoint público) */
export async function fetchPostsPage(
  filters: PostFilters,
  limit: number,
  offset: number,
  signal?: AbortSignal
): Promise<PostsPage> {
  const { data } = await getAxiosClient().get<ApiPostsResponse>(
    `/posts?${postsQuery(filters, limit, offset)}`,
    { signal }
  );
  return mapPostsResponse(data);
}
