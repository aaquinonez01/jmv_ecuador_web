// Utilidades del blog que sirven en servidor y cliente: formato de la API,
// normalización y textos derivados.
import type { BlogCategory, Post, PostType, User } from "@/types/user";

export interface ApiPost {
  id: string;
  title: string | null;
  content: string;
  typePost: string | null;
  createdAt: string;
  images: string[] | null;
  scope: BlogCategory | null;
  activityType: BlogCategory | null;
  subtype: BlogCategory | null;
  user: {
    id: string;
    fullName: string;
    profilePicture?: string | null;
    role: string;
  } | null;
}

export interface ApiPostsResponse {
  page: number;
  limit: number;
  offset: number;
  total: number;
  posts: ApiPost[];
}

export interface PostFilters {
  scope?: string;
  activityType?: string;
  subtype?: string;
  typePost?: PostType;
  search?: string;
}

export interface PostsPage {
  posts: Post[];
  total: number;
}

export const POSTS_PAGE_SIZE = 10;

export function mapApiPost(p: ApiPost): Post {
  return {
    id: String(p.id),
    title: p.title?.trim() || "",
    content: p.content ?? "",
    typePost: p.typePost === "documents" ? "documents" : "moments",
    createdAt: p.createdAt,
    images: Array.isArray(p.images) ? p.images.filter(Boolean) : [],
    scope: p.scope ?? null,
    activityType: p.activityType ?? null,
    subtype: p.subtype ?? null,
    author: {
      id: p.user?.id ?? "",
      name: p.user?.fullName?.trim() || "Miembro de JMV",
      role: p.user?.role ?? "user",
      avatar: p.user?.profilePicture || undefined,
    },
  };
}

export function mapPostsResponse(data: ApiPostsResponse): PostsPage {
  return {
    posts: (data.posts ?? []).map(mapApiPost),
    total: data.total ?? 0,
  };
}

/** Query string para GET /posts */
export function postsQuery(filters: PostFilters, limit: number, offset: number) {
  const params = new URLSearchParams();
  if (filters.scope) params.set("scope", filters.scope);
  if (filters.activityType) params.set("activityType", filters.activityType);
  if (filters.subtype) params.set("subtype", filters.subtype);
  if (filters.typePost) params.set("typePost", filters.typePost);
  if (filters.search) params.set("search", filters.search);
  params.set("limit", String(limit));
  if (offset) params.set("offset", String(offset));
  return params.toString();
}

/** Nombre legible del rol (nunca "user" o "admin" crudos) */
export function roleLabel(role?: string | null) {
  switch (role) {
    case "admin":
      return "Equipo coordinador";
    case "user":
    default:
      return "Miembro de la comunidad";
  }
}

export const POST_TYPE_LABEL: Record<PostType, string> = {
  moments: "Momento",
  documents: "Documento",
};

/** Título visible: el del autor o, si falta, el inicio del texto */
export function postHeading(post: Post) {
  if (post.title) return post.title;
  const text = post.content.trim().replace(/\s+/g, " ");
  return text.length > 70 ? `${text.slice(0, 70).trimEnd()}…` : text || "Publicación";
}

export function initials(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join("") || "J"
  );
}

type ApiUser = {
  id?: string | null;
  email?: string;
  fullName?: string;
  displayName?: string | null;
  profilePicture?: string | null;
  role?: string;
  bio?: string | null;
  address?: string | null;
  nameComunity?: string | null;
  comunidad?: { nombre?: string } | null;
  createdAt?: string | null;
};

/** Usuario de /auth/me (o del store de sesión) al formato del blog */
export function mapApiUser(u: ApiUser): User {
  return {
    id: u.id ?? "me",
    name: u.displayName || u.fullName || u.email || "Tu perfil",
    email: u.email || undefined,
    role: u.role ?? "user",
    avatar: u.profilePicture || undefined,
    bio: u.bio || undefined,
    location: u.address || undefined,
    community: u.comunidad?.nombre || u.nameComunity || undefined,
    joinedAt: u.createdAt || undefined,
  };
}
