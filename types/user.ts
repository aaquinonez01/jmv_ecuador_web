// Tipos del blog "Comunidad JMV" (formato ya normalizado para la interfaz)

export interface BlogCategory {
  id: string;
  name: string;
}

export type PostType = "moments" | "documents";

export interface PostAuthor {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  typePost: PostType;
  /** Fecha ISO de creación */
  createdAt: string;
  images: string[];
  scope: BlogCategory | null;
  activityType: BlogCategory | null;
  subtype: BlogCategory | null;
  author: PostAuthor;
}

export interface User {
  id: string;
  name: string;
  email?: string;
  role: string;
  avatar?: string;
  bio?: string;
  location?: string;
  community?: string;
  /** Fecha ISO de registro; solo si el backend la envía */
  joinedAt?: string;
}
