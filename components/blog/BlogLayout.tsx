"use client";

import { Plus, Search, Filter } from "lucide-react";
import TrendingPosts from "./TrendingPosts";
import BlogCategories from "./BlogCategories";
import RecentActivity from "./RecentActivity";
import UserProfileCard from "./UserProfileCard";
import WelcomeCard from "./WelcomeCard";
import { useBlogLayout } from "@/lib/hooks/useBlogLayout";
import type { User } from "@/types/user";

interface BlogLayoutProps {
  children: React.ReactNode;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onCreatePost: () => void;
  currentUser?: User;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  scopeOptions?: Array<{ id: string; name: string }>;
  activityTypeOptions?: Array<{ id: string; name: string }>;
  subtypeOptions?: Array<{ id: string; name: string }>;
  selectedScopeId?: string | undefined;
  selectedActivityTypeId?: string | undefined;
  selectedSubtypeId?: string | undefined;
  onScopeChange?: (id: string | undefined) => void;
  onActivityTypeChange?: (id: string | undefined) => void;
  onSubtypeChange?: (id: string | undefined) => void;
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

export default function BlogLayout({
  children,
  selectedCategory,
  onCategoryChange,
  onCreatePost,
  currentUser,
  searchValue,
  onSearchChange,
  trendingPosts,
  recentActivity,
  scopeOptions,
  activityTypeOptions,
  subtypeOptions,
  selectedScopeId,
  selectedActivityTypeId,
  selectedSubtypeId,
  onScopeChange,
  onActivityTypeChange,
  onSubtypeChange,
}: BlogLayoutProps) {
  const {
    searchQuery,
    setSearchQuery,
    showSidebar,
    setShowSidebar,
    mappedUser: mappedAuthUser,
  } = useBlogLayout();
  const effectiveSearchValue =
    typeof searchValue === "string" ? searchValue : searchQuery;
  const effectiveOnSearchChange =
    typeof onSearchChange === "function"
      ? onSearchChange
      : (v: string) => setSearchQuery(v);

  return (
    <div className="min-h-screen bg-[#A8C5E0] pt-20 sm:pt-24 overflow-x-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-jmv opacity-10" />

      <div className="max-w-7xl w-full mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 relative z-10">
        {/* Header principal */}
        <div className="mb-4 sm:mb-6 lg:mb-8 w-full">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-jmv-blue">
              Comunidad JMV
            </h1>

            {/* Botón crear post - visible en todas las pantallas */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={onCreatePost}
                className="flex-1 cursor-pointer sm:flex-initial bg-jmv-red  text-white px-3 sm:px-4 md:px-10 py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl font-medium hover:bg-jmv-red-dark transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm md:text-base whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0" />
                <span className="hidden sm:inline">
                  Crear Nueva Publicación
                </span>
                <span className="sm:hidden">Crear</span>
              </button>

              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="xl:hidden p-2 sm:p-2.5 hover:bg-white/50 rounded-lg transition-colors bg-white/30 flex-shrink-0"
                aria-label={showSidebar ? "Ocultar filtros" : "Mostrar filtros"}
                title={showSidebar ? "Ocultar filtros" : "Mostrar filtros"}
              >
                <Filter
                  className="w-4 h-4 sm:w-5 sm:h-5 text-jmv-blue"
                  aria-hidden="true"
                />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] xl:grid-cols-[300px_1fr_320px] gap-4 sm:gap-6 w-full">
          {/* Sidebar Izquierdo - Perfil del Usuario o Welcome Card */}
          <aside
            className="hidden lg:block lg:order-1"
            aria-label="Perfil del usuario"
          >
            <div className="sticky top-24 space-y-4">
              {currentUser || mappedAuthUser ? (
                <UserProfileCard user={(currentUser || mappedAuthUser)!} />
              ) : (
                <WelcomeCard />
              )}
            </div>
          </aside>

          {/* Contenido Principal */}
          <main className="w-full order-2 lg:order-2">
            {/* Categorías */}
            <div className="mb-4 sm:mb-6 lg:mb-8 overflow-x-auto -mx-3 sm:mx-0 px-3 sm:px-0">
              <BlogCategories
                selectedCategory={selectedCategory}
                onCategoryChange={onCategoryChange}
              />
            </div>

            {/* Contenido */}
            <div className="w-full">{children}</div>
          </main>

          {/* Sidebar Derecho */}
          <aside
            className={`w-full order-1 xl:order-3 ${
              showSidebar ? "block" : "hidden xl:block"
            }`}
            aria-label="Herramientas del blog"
          >
            <div className="xl:sticky xl:top-24 space-y-4">
              {/* Perfil del Usuario o Welcome Card - Solo móvil */}
              <div className="lg:hidden">
                {currentUser || mappedAuthUser ? (
                  <UserProfileCard user={(currentUser || mappedAuthUser)!} />
                ) : (
                  <WelcomeCard />
                )}
              </div>

              {/* Búsqueda */}
              <section
                className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-3 sm:p-4 md:p-6"
                aria-labelledby="blog-search-label"
              >
                <h3
                  id="blog-search-label"
                  className="text-sm sm:text-base md:text-lg font-semibold text-jmv-blue mb-2 sm:mb-3 md:mb-4"
                >
                  Buscar
                </h3>
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                    aria-hidden="true"
                  />
                  <label htmlFor="blog-search" className="sr-only">
                    Buscar publicaciones
                  </label>
                  <input
                    id="blog-search"
                    type="text"
                    value={effectiveSearchValue}
                    onChange={(e) => effectiveOnSearchChange(e.target.value)}
                    placeholder="Buscar..."
                    className="w-full text-jmv-blue pl-10 pr-3 py-2 sm:py-2.5 md:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-jmv-blue focus:border-transparent transition-all duration-200 text-xs sm:text-sm"
                    aria-label="Buscar publicaciones"
                  />
                </div>
              </section>

              {/* Filtros granulares */}
              <section className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-3 sm:p-4 md:p-6" aria-labelledby="blog-filters-label">
                <h3 id="blog-filters-label" className="text-sm sm:text-base md:text-lg font-semibold text-jmv-blue mb-2 sm:mb-3 md:mb-4">
                  Filtros
                </h3>
                <div className="space-y-3">
                  <div>
                    <label htmlFor="scope-select" className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                      Alcance
                    </label>
                    <select
                      id="scope-select"
                      className="w-full text-jmv-blue px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-jmv-blue focus:border-transparent transition-all duration-200 text-xs sm:text-sm"
                      value={selectedScopeId || ""}
                      onChange={(e) => onScopeChange?.(e.target.value || undefined)}
                      aria-label="Seleccionar alcance"
                    >
                      <option value="">Todos</option>
                      {(scopeOptions || []).map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="activity-select" className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                      Tipo de Actividad
                    </label>
                    <select
                      id="activity-select"
                      className="w-full text-jmv-blue px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-jmv-blue focus:border-transparent transition-all duration-200 text-xs sm:text-sm"
                      value={selectedActivityTypeId || ""}
                      onChange={(e) => onActivityTypeChange?.(e.target.value || undefined)}
                      aria-label="Seleccionar tipo de actividad"
                    >
                      <option value="">Todos</option>
                      {(activityTypeOptions || []).map((a) => (
                        <option key={a.id} value={a.id}>{a.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="subtype-select" className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                      Subtipo (Opcional)
                    </label>
                    <select
                      id="subtype-select"
                      className="w-full text-jmv-blue px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-jmv-blue focus:border-transparent transition-all duration-200 text-xs sm:text-sm"
                      value={selectedSubtypeId || ""}
                      onChange={(e) => onSubtypeChange?.(e.target.value || undefined)}
                      aria-label="Seleccionar subtipo"
                      disabled={!selectedActivityTypeId}
                    >
                      <option value="">Todos</option>
                      {(subtypeOptions || []).map((st) => (
                        <option key={st.id} value={st.id}>{st.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </section>

              {/* Actividad Reciente - Solo desktop */}
              <section className="hidden xl:block" aria-labelledby="recent-activity-label">
                <RecentActivity activities={recentActivity} />
              </section>

              {/* Posts Trending - Solo desktop */}
              <section
                className="hidden xl:block"
                aria-labelledby="trending-posts-label"
              >
                <TrendingPosts posts={trendingPosts} />
              </section>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
