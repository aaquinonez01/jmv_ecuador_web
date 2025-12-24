export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  profilePicture?: string;
  bio?: string;
  location?: string;
  zone?: string;
  joinedDate: string;
  stats: {
    posts: number;
    followers: number;
    following: number;
  };
  social?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
}

export interface Post {
  id: number;
  author: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
  };
  content: string;
  images?: string[];
  scope?: string; // local, zonal, nacional
  activityType?: string; // formacion, comunidad-juvenil, apostolado, etc.
  subtype?: string; // convivencia, retiro, etc.
  // Legacy fields (mantener compatibilidad temporal)
  category?: string;
  subcategory?: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked?: boolean;
}
