"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, Loader2, Plus, SearchX, Sparkles } from "lucide-react";
import BlogPost from "@/components/blog/BlogPost";
import BlogFilters from "@/components/blog/BlogFilters";
import BlogLayout from "@/components/blog/BlogLayout";
import CreatePostForm, { type CreatePostValues } from "@/components/blog/CreatePostForm";
import AuthRequiredModal from "@/components/blog/AuthRequiredModal";
import UserProfileCard from "@/components/blog/UserProfileCard";
import WelcomeCard from "@/components/blog/WelcomeCard";
import { usePostViewer } from "@/components/blog/usePostViewer";
import { buttonVariants } from "@/components/ui/button-variants";
import { usePostsData } from "@/lib/hooks/usePostsData";
import { usePostCategories } from "@/lib/hooks/usePostCategories";
import { useAuth } from "@/lib/hooks/useAuth";
import { createPost } from "@/actions/posts";
import { mapApiUser, type PostsPage } from "@/lib/blog/posts";
import type { BlogCategory } from "@/types/user";

interface BlogClientProps {
  initialPage: PostsPage | null;
  initialScopes: BlogCategory[];
  initialActivityTypes: BlogCategory[];
}

function FeedSkeleton() {
  return (
    <div className="space-y-4" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5 motion-safe:animate-pulse">
          <div className="mb-4 flex items-center gap-3">
            <div className="h-11 w-11 rounded-full bg-slate-200" />
            <div className="h-4 w-40 rounded bg-slate-200" />
          </div>
          <div className="mb-3 h-5 w-2/3 rounded bg-slate-200" />
          <div className="mb-2 h-4 w-full rounded bg-slate-200" />
          <div className="h-4 w-5/6 rounded bg-slate-200" />
        </div>
      ))}
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  children,
  action,
}: {
  icon: typeof SearchX;
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center" data-surface="light">
      <span className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-jmv-blue/10">
        <Icon className="h-8 w-8 text-jmv-blue" aria-hidden="true" />
      </span>
      <h2 className="mb-2 text-xl font-semibold text-gray-900">{title}</h2>
      <div className="mx-auto max-w-md text-base text-gray-700">{children}</div>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}

export default function BlogClient({
  initialPage,
  initialScopes,
  initialActivityTypes,
}: BlogClientProps) {
  const { user: authUser } = useAuth();
  const currentUser = useMemo(() => (authUser ? mapApiUser(authUser) : undefined), [authUser]);
  const isAuthenticated = !!currentUser;

  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showAuthRequired, setShowAuthRequired] = useState(false);
  const [notice, setNotice] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  // El aviso de "publicado" se retira solo
  useEffect(() => {
    if (!notice) return;
    const id = setTimeout(() => setNotice(""), 8000);
    return () => clearTimeout(id);
  }, [notice]);

  // Enlaces compartidos antes de que existiera /blog/[id] (/blog#publicacion-<id>)
  useEffect(() => {
    const match = /^#publicacion-([0-9a-f-]{36})$/i.exec(window.location.hash);
    if (match) window.location.replace(`/blog/${match[1]}`);
  }, []);

  const {
    posts,
    total,
    status,
    loadMoreFailed,
    hasMore,
    filters,
    hasFilters,
    setFilter,
    clearFilters,
    loadMore,
    refresh,
  } = usePostsData({ initialPage });

  const { scopes, activityTypes } = usePostCategories({
    scopes: initialScopes,
    activityTypes: initialActivityTypes,
  });
  const { showPost, showImage, viewer } = usePostViewer();

  // Búsqueda con espera de 400 ms
  const firstSearch = useRef(true);
  useEffect(() => {
    if (firstSearch.current) {
      firstSearch.current = false;
      return;
    }
    const id = setTimeout(() => setFilter("search", searchTerm.trim() || undefined), 400);
    return () => clearTimeout(id);
  }, [searchTerm, setFilter]);

  const handleClearFilters = () => {
    setSearchTerm("");
    clearFilters();
  };

  const handleCreatePostClick = () => {
    if (isAuthenticated) setShowCreatePost(true);
    else setShowAuthRequired(true);
  };

  const handleCreatePost = async (values: CreatePostValues) => {
    await createPost({
      title: values.title,
      content: values.content,
      scope: values.scope,
      activityType: values.activityType,
      subtype: values.subtype,
      typePost: values.typePost,
      files: values.attachments,
    });
    setNotice("¡Gracias por compartir! Tu publicación ya está en la comunidad.");
    refresh();
  };

  const isReplacing = status === "loading";
  const showSkeleton = isReplacing && posts.length === 0;

  const createButton = (
    <button
      type="button"
      onClick={handleCreatePostClick}
      className={buttonVariants({ variant: "gold", size: "md", className: "w-full gap-2 sm:w-auto" })}
    >
      <Plus className="h-5 w-5" aria-hidden="true" />
      Crear publicación
    </button>
  );

  return (
    <BlogLayout
      action={createButton}
      aside={
        currentUser ? (
          <UserProfileCard user={currentUser} onCreatePost={handleCreatePostClick} />
        ) : (
          <WelcomeCard />
        )
      }
    >
      <div className="space-y-4">
        <BlogFilters
          filters={filters}
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          onFilterChange={setFilter}
          onClear={handleClearFilters}
          hasFilters={hasFilters || !!searchTerm}
          scopes={scopes}
          activityTypes={activityTypes}
        />

        <div role="status" aria-live="polite" className="min-h-6 text-sm text-gray-700">
          {notice ? (
            <p className="rounded-xl border border-green-200 bg-green-50 p-3 font-medium text-green-800">
              {notice}
            </p>
          ) : isReplacing && posts.length > 0 ? (
            <p className="inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 motion-safe:animate-spin" aria-hidden="true" />
              Actualizando publicaciones…
            </p>
          ) : status !== "error" && !showSkeleton && posts.length > 0 ? (
            <p>
              Mostrando {posts.length} de {total} publicaciones
            </p>
          ) : null}
        </div>

        <h2 className="sr-only">Publicaciones</h2>

        {showSkeleton ? <FeedSkeleton /> : null}

        {status === "error" ? (
          <EmptyState
            icon={AlertTriangle}
            title="No pudimos cargar las publicaciones"
            action={
              <button type="button" onClick={refresh} className={buttonVariants({ variant: "primary" })}>
                Reintentar
              </button>
            }
          >
            Puede ser un problema de conexión. Revisa tu internet y vuelve a intentarlo.
          </EmptyState>
        ) : null}

        {status === "idle" && posts.length === 0 ? (
          hasFilters ? (
            <EmptyState
              icon={SearchX}
              title="No encontramos publicaciones con estos filtros"
              action={
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className={buttonVariants({ variant: "outline" })}
                >
                  Limpiar filtros
                </button>
              }
            >
              Prueba con otras palabras o quita algún filtro.
            </EmptyState>
          ) : (
            <EmptyState
              icon={Sparkles}
              title="Todavía no hay publicaciones"
              action={createButton}
            >
              Sé la primera persona en compartir un momento o un recurso con la comunidad.
            </EmptyState>
          )
        ) : null}

        {posts.length > 0 && status !== "error" ? (
          <ul
            className={`space-y-4 sm:space-y-6 ${isReplacing ? "opacity-60" : ""}`}
            aria-busy={isReplacing || undefined}
          >
            {posts.map((post) => (
              <li key={post.id}>
                <BlogPost post={post} onOpen={showPost} onOpenImage={showImage} />
              </li>
            ))}
          </ul>
        ) : null}

        {hasMore && posts.length > 0 && status !== "error" && !isReplacing ? (
          <div className="flex flex-col items-center gap-2 pt-2">
            {loadMoreFailed ? (
              <p role="alert" className="text-sm text-red-700">
                No pudimos cargar más publicaciones. Inténtalo de nuevo.
              </p>
            ) : null}
            <button
              type="button"
              onClick={loadMore}
              disabled={status === "loadingMore"}
              aria-busy={status === "loadingMore" || undefined}
              className={buttonVariants({ variant: "primary", className: "gap-2" })}
            >
              {status === "loadingMore" ? (
                <>
                  <Loader2 className="h-5 w-5 motion-safe:animate-spin" aria-hidden="true" />
                  Cargando…
                </>
              ) : (
                "Cargar más publicaciones"
              )}
            </button>
          </div>
        ) : null}
      </div>

      {viewer}

      {isAuthenticated ? (
        <CreatePostForm
          isOpen={showCreatePost}
          onClose={() => setShowCreatePost(false)}
          onSubmit={handleCreatePost}
          scopes={scopes}
          activityTypes={activityTypes}
        />
      ) : (
        <AuthRequiredModal isOpen={showAuthRequired} onClose={() => setShowAuthRequired(false)} />
      )}
    </BlogLayout>
  );
}
