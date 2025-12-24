"use client";

import { useState, useMemo, useEffect } from "react";
import BlogPost from "@/components/blog/BlogPost";
import CreatePostForm from "@/components/blog/CreatePostForm";
import AuthRequiredModal from "@/components/blog/AuthRequiredModal";
import BlogLayout from "@/components/blog/BlogLayout";
import { usePostsData } from "@/lib/hooks/usePostsData";
import { useAuth } from "@/lib/hooks/useAuth";
import { createPost } from "@/actions/posts";
import { usePostCategories } from "@/lib/hooks/usePostCategories";
import LoadingSpinner from "@/components/admin/ui/LoadingSpinner";
import type { CreatePostData } from "@/lib/helpers/form-data.helper";
import type { User, Post as FrontendPost } from "@/types/user";
import type { Post as BackendPost } from "@/actions/posts";

interface BlogClientProps {
  currentUser?: User;
  trendingPosts: Array<{
    id: number;
    title: string;
    author: string;
    category: string;
    likes: number;
    comments: number;
    shares: number;
    engagement: number;
  }>;
  recentActivity: Array<{
    id: number;
    type: "like" | "comment" | "share" | "post";
    user: string;
    action: string;
    postTitle?: string;
    timestamp: string;
    category?: string;
  }>;
}

/**
 * Convierte un post del backend al formato del frontend
 */
function mapBackendPostToFrontend(backendPost: BackendPost): FrontendPost {
  return {
    id: Number.isFinite(Number(backendPost.id))
      ? Number(backendPost.id)
      : Date.parse(backendPost.createdAt) || 0,
    author: {
      id: backendPost.user.id,
      name: backendPost.user.fullName,
      role: backendPost.user.role,
      avatar: backendPost.user.profilePicture || undefined,
    },
    content: backendPost.content,
    images: backendPost.images,
    scope: backendPost.scope?.id || "",
    activityType: backendPost.activityType?.id || "",
    subtype: backendPost.subtype?.id || undefined,
    timestamp: new Date(backendPost.createdAt).toISOString(),
    likes: 0, // TODO: Implementar sistema de likes
    comments: 0, // TODO: Implementar sistema de comentarios
    shares: 0, // TODO: Implementar sistema de shares
    isLiked: false,
  };
}

export default function BlogClient({
  currentUser,
  trendingPosts,
  recentActivity,
}: BlogClientProps) {
  const { user: authUser } = useAuth();
  const [selectedScope, setSelectedScope] = useState<string | undefined>(
    undefined
  );
  const [selectedActivityType, setSelectedActivityType] = useState<
    string | undefined
  >(undefined);
  const [selectedSubtype, setSelectedSubtype] = useState<string | undefined>(
    undefined
  );
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showAuthRequired, setShowAuthRequired] = useState(false);

  // Determinar si hay un usuario autenticado (desde props o desde el hook de auth)
  const isAuthenticated = !!(currentUser || authUser);

  // Hook para obtener posts con filtros dinámicos
  const {
    posts: backendPosts,
    loading,
    error,
    pagination,
    filters,
    setScope,
    setActivityType,
    setSubtype,
    setTypePost,
    setSearch,
    updateFilters,
    refresh,
  } = usePostsData({
    initialFilters: { limit: 20 },
    autoFetch: true,
  });

  // Opciones de filtros desde backend
  const { scopes, activityTypes, subtypes } = usePostCategories();

  // Mapear posts del backend al formato del frontend
  const mappedPosts = useMemo(() => {
    return backendPosts.map(mapBackendPostToFrontend);
  }, [backendPosts]);

  console.log("mappedPosts", mappedPosts);
  // Manejar cambio de categoría (scope, activity, subtype)
  const handleCategoryChange = (category: string) => {
    // Resetear filtros cuando se selecciona "all"
    if (category === "all") {
      setSelectedScope(undefined);
      setSelectedActivityType(undefined);
      setSelectedSubtype(undefined);
      setScope(undefined);
      setActivityType(undefined);
      setSubtype(undefined);
      return;
    }

    // TODO: Implementar lógica para determinar si es scope, activity o subtype
    // Por ahora, asumimos que es el scope
    if (category === "momentos") {
      setTypePost("moments");
    } else if (category === "documentos") {
      setTypePost("documents");
    } else {
      setSelectedScope(category);
      setScope(category);
    }
  };

  const handleCreatePost = async (formData: {
    title?: string;
    content: string;
    scope: string;
    activityType: string;
    subtype?: string;
    typePost: "moments" | "documents";
    attachments: File[];
  }): Promise<void> => {
    try {
      // Convertir formData a CreatePostData (renombrar attachments a files)
      const postData: CreatePostData = {
        title: formData.title,
        content: formData.content,
        scope: formData.scope,
        activityType: formData.activityType,
        subtype: formData.subtype,
        typePost: formData.typePost,
        files: formData.attachments, // Conversión: attachments -> files
      };

      // Llamar al action para crear el post
      await createPost(postData);

      // Recargar posts después de crear exitosamente
      refresh();

      // Cerrar el modal (esto se hace en CreatePostForm si es exitoso)
      // setShowCreatePost(false); - No necesario, el form lo cierra
    } catch (error: any) {
      // El error se maneja en CreatePostForm
      // Solo re-lanzamos para que el form lo capture
      throw error;
    }
  };

  const handleLike = (postId: number) => {
    console.log("Like en post:", postId);
    // TODO: Implementar like en el backend
  };

  const handleComment = (postId: number) => {
    console.log("Comentario en post:", postId);
    // TODO: Implementar comentarios en el backend
  };

  const handleShare = (postId: number) => {
    console.log("Compartir post:", postId);
    // TODO: Implementar compartir en el backend
  };

  // Búsqueda con debounce
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    const id = setTimeout(() => {
      setSearch(searchTerm || undefined);
    }, 400);
    return () => clearTimeout(id);
  }, [searchTerm, setSearch]);

  // Manejar clic en crear publicación
  const handleCreatePostClick = () => {
    if (!isAuthenticated) {
      setShowAuthRequired(true);
    } else {
      setShowCreatePost(true);
    }
  };

  return (
    <BlogLayout
      selectedCategory="all"
      onCategoryChange={handleCategoryChange}
      onCreatePost={handleCreatePostClick}
      currentUser={currentUser}
      trendingPosts={trendingPosts}
      recentActivity={recentActivity}
      searchValue={searchTerm}
      onSearchChange={setSearchTerm}
      scopeOptions={scopes}
      activityTypeOptions={activityTypes}
      subtypeOptions={subtypes}
      selectedScopeId={selectedScope}
      selectedActivityTypeId={selectedActivityType}
      selectedSubtypeId={selectedSubtype}
      onScopeChange={(id) => {
        setSelectedScope(id);
        setScope(id);
      }}
      onActivityTypeChange={(id) => {
        setSelectedActivityType(id);
        setActivityType(id);
      }}
      onSubtypeChange={(id) => {
        setSelectedSubtype(id);
        setSubtype(id);
      }}
    >
      {/* Conteo de resultados */}
      {!loading && !error && (
        <p className="text-xs sm:text-sm text-gray-600 mb-2">
          Mostrando {mappedPosts.length} de {pagination.total} publicaciones
        </p>
      )}
      {/* Loading State */}
      {loading && (
        <div className="py-8 sm:py-12">
          <div className="flex justify-center mb-6">
            <LoadingSpinner text="Cargando publicaciones..." />
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 animate-pulse"
              >
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
                <div className="h-3 bg-gray-200 rounded w-2/3 mb-2" />
                <div className="h-28 bg-gray-200 rounded mb-4" />
                <div className="flex gap-4">
                  <div className="h-4 w-16 bg-gray-200 rounded" />
                  <div className="h-4 w-16 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="text-center py-8 sm:py-12">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <span className="text-red-500 text-2xl">⚠️</span>
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 px-4">
            Error al cargar publicaciones
          </h3>
          <p className="text-sm sm:text-base text-gray-600 px-4 mb-4">
            {error}
          </p>
          <button
            onClick={refresh}
            className="bg-jmv-blue text-white px-6 py-2 rounded-lg hover:bg-jmv-blue-dark transition-colors"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Feed de Publicaciones */}
      {!loading && !error && (
        <>
          <div className="space-y-4 sm:space-y-6 w-full">
            {mappedPosts.map((post: FrontendPost) => (
              <BlogPost
                key={`${post.author.id}-${post.timestamp}`}
                post={post}
                onLike={handleLike}
                onComment={handleComment}
                onShare={handleShare}
              />
            ))}
          </div>

          {/* Cargar más */}
          {mappedPosts.length < pagination.total && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() =>
                  updateFilters({ limit: (filters.limit || 10) + 10 })
                }
                disabled={loading}
                className="bg-jmv-blue text-white px-6 py-2 rounded-lg hover:bg-jmv-blue-dark transition-colors disabled:opacity-50"
              >
                Cargar más
              </button>
            </div>
          )}

          {/* Mensaje si no hay posts */}
          {mappedPosts.length === 0 && (
            <div className="text-center py-8 sm:py-12">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-jmv-blue/10 rounded-full flex items-center justify_center mx-auto mb-3 sm:mb-4">
                <span className="text-jmv-blue text-2xl">📝</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 px-4">
                Todavía no hay publicaciones aquí
              </h3>
              <p className="text-sm sm:text-base text-gray-600 px-4">
                ¿Quieres compartir la tuya? Haz clic en “Crear”.
              </p>
            </div>
          )}
        </>
      )}

      {/* Modal para crear post - solo si hay usuario autenticado */}
      {isAuthenticated && (
        <CreatePostForm
          isOpen={showCreatePost}
          onClose={() => setShowCreatePost(false)}
          onSubmit={handleCreatePost}
        />
      )}

      {/* Modal de autenticación requerida - solo si no hay usuario */}
      {!isAuthenticated && (
        <AuthRequiredModal
          isOpen={showAuthRequired}
          onClose={() => setShowAuthRequired(false)}
        />
      )}
    </BlogLayout>
  );
}
