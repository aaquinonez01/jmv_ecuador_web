"use client";

import { TrendingUp, Heart, MessageCircle, Share2 } from "lucide-react";

interface TrendingPost {
  id: number;
  title: string;
  author: string;
  category: string;
  likes: number;
  comments: number;
  shares: number;
  engagement: number;
}

interface TrendingPostsProps {
  posts: TrendingPost[];
}

export default function TrendingPosts({ posts }: TrendingPostsProps) {
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "momentos":
        return "bg-jmv-gold/20 text-jmv-gold";
      case "formación":
        return "bg-jmv-blue/20 text-jmv-blue";
      case "documentos":
        return "bg-jmv-red/20 text-jmv-red";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 xl:p-6 blog-content">
      <div className="flex items-center gap-3 mb-4 xl:mb-6">
        <div className="w-10 h-10 bg-jmv-gold/20 rounded-xl flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-jmv-gold" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-jmv-blue">Tendencias</h3>
          <p className="text-sm text-gray-600">Publicaciones más populares</p>
        </div>
      </div>

      <ul className="space-y-2" role="list" aria-label="Lista de publicaciones en tendencia">
        {posts.map((post, index) => (
          <li
            key={post.id}
            className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors trending-item"
            role="listitem"
          >
            {/* Número de ranking */}
            <div className="flex-shrink-0">
              <div className="w-6 h-6 bg-jmv-blue text-white rounded flex items-center justify-center font-bold text-xs">
                {index + 1}
              </div>
            </div>

            {/* Contenido principal */}
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 text-xs truncate">
                {post.title}
              </h4>
              <p className="text-xs text-gray-600 truncate">
                por {post.author}
              </p>
            </div>

            {/* Categoría compacta */}
            <div className="flex-shrink-0">
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(
                  post.category
                )}`}
              >
                {post.category.charAt(0)}
              </span>
            </div>

            {/* Métricas compactas */}
            <div className="flex items-center gap-1 text-xs text-gray-500 flex-shrink-0">
              <div className="flex items-center gap-0.5">
                <Heart className="w-3 h-3" />
                <span>{post.likes}</span>
              </div>
              <div className="flex items-center gap-0.5">
                <MessageCircle className="w-3 h-3" />
                <span>{post.comments}</span>
              </div>
              <div className="flex items-center gap-0.5">
                <Share2 className="w-3 h-3" />
                <span>{post.shares}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {posts.length === 0 && (
        <div className="text-center py-8">
          <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No hay tendencias disponibles</p>
        </div>
      )}
    </div>
  );
}
