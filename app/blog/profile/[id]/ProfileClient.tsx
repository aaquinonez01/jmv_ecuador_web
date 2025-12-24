"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Grid3x3, List, Camera, FileText } from "lucide-react";
import UserProfileHeader from "@/components/blog/UserProfileHeader";
import UserAbout from "@/components/blog/UserAbout";
import BlogPost from "@/components/blog/BlogPost";
import type { User, Post } from "@/types/user";
import { useAuth } from "@/lib/hooks/useAuth";

interface ProfileClientProps {
  user: User;
  userPosts: Post[];
}

export default function ProfileClient({ user, userPosts }: ProfileClientProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [selectedTab, setSelectedTab] = useState<
    "posts" | "gallery" | "documents" | "about"
  >("posts");
  const { user: authUser } = useAuth();
  const isOwnProfile = authUser ? user.id === (authUser as any).id : false;

  const handleLike = (postId: number) => {
    console.log("Like post:", postId);
  };

  const handleComment = (postId: number) => {
    console.log("Comment post:", postId);
  };

  const handleShare = (postId: number) => {
    console.log("Share post:", postId);
  };

  // Extraer todas las imágenes de las publicaciones
  const allImages = userPosts.flatMap(
    (post) =>
      post.images?.map((image, idx) => ({
        image,
        postId: post.id,
        index: idx,
        content: post.content,
        timestamp: post.timestamp,
      })) || []
  );

  // Filtrar solo publicaciones de tipo Documentos
  const documentPosts = userPosts.filter(
    (post) => post.category?.toLowerCase() === "documentos"
  );

  // Contar imágenes y documentos
  const totalImages = allImages.length;
  const totalDocuments = documentPosts.length;

  return (
    <div className="min-h-screen bg-[#A8C5E0] pt-20 sm:pt-24">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Back Button */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-jmv-blue hover:text-jmv-blue-dark font-semibold mb-4 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Volver al blog
        </Link>

        {/* Profile Header */}
        <UserProfileHeader user={user} isOwnProfile={isOwnProfile} />

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-lg mt-4 overflow-hidden">
          <div className="border-b border-gray-200 overflow-x-auto">
            <div className="flex min-w-max" role="tablist" aria-label="Navegación de perfil">
              <button
                onClick={() => setSelectedTab("posts")}
                className={`flex-1 px-4 sm:px-6 py-4 font-semibold transition-colors border-b-2 whitespace-nowrap ${
                  selectedTab === "posts"
                    ? "border-jmv-blue text-jmv-blue"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
                role="tab"
                aria-selected={selectedTab === "posts"}
                aria-controls="panel-posts"
              >
                Publicaciones
                <span className="ml-2 text-sm">({user.stats.posts})</span>
              </button>
              <button
                onClick={() => setSelectedTab("gallery")}
                className={`flex-1 px-4 sm:px-6 py-4 font-semibold transition-colors border-b-2 whitespace-nowrap flex items-center justify-center gap-2 ${
                  selectedTab === "gallery"
                    ? "border-jmv-blue text-jmv-blue"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
                role="tab"
                aria-selected={selectedTab === "gallery"}
                aria-controls="panel-gallery"
              >
                <Camera className="w-4 h-4" />
                <span className="hidden sm:inline">Galería</span>
                <span className="sm:hidden">Fotos</span>
                <span className="ml-2 text-sm">({totalImages})</span>
              </button>
              <button
                onClick={() => setSelectedTab("documents")}
                className={`flex-1 px-4 sm:px-6 py-4 font-semibold transition-colors border-b-2 whitespace-nowrap flex items-center justify-center gap-2 ${
                  selectedTab === "documents"
                    ? "border-jmv-blue text-jmv-blue"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
                role="tab"
                aria-selected={selectedTab === "documents"}
                aria-controls="panel-documents"
              >
                <FileText className="w-4 h-4" />
                Documentos
                <span className="ml-2 text-sm">({totalDocuments})</span>
              </button>
              <button
                onClick={() => setSelectedTab("about")}
                className={`flex-1 px-4 sm:px-6 py-4 font-semibold transition-colors border-b-2 whitespace-nowrap ${
                  selectedTab === "about"
                    ? "border-jmv-blue text-jmv-blue"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
                role="tab"
                aria-selected={selectedTab === "about"}
                aria-controls="panel-about"
              >
                Acerca de
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-4 sm:p-6">
            {selectedTab === "posts" && (
              <div id="panel-posts" role="tabpanel" aria-labelledby="tab-posts">
                {/* View Toggle */}
                <div className="flex justify-end mb-4">
                  <div className="bg-gray-100 rounded-lg p-1 flex gap-1">
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded transition-all ${
                        viewMode === "list"
                          ? "bg-white shadow text-jmv-blue"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      <List className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded transition-all ${
                        viewMode === "grid"
                          ? "bg-white shadow text-jmv-blue"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      <Grid3x3 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Posts */}
                {viewMode === "list" ? (
                  <div className="space-y-4">
                    {userPosts.map((post) => (
                      <BlogPost
                        key={`${post.author.id}-${post.timestamp}`}
                        post={post}
                        onLike={handleLike}
                        onComment={handleComment}
                        onShare={handleShare}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
                    {userPosts.flatMap((post) =>
                      post.images?.slice(0, 1).map((image, idx) => (
                        <div
                          key={`${post.id}-${idx}`}
                          className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform"
                        >
                          <div className="w-full h-full bg-gradient-to-br from-jmv-blue/20 to-jmv-gold/20 flex items-center justify-center">
                            <span className="text-gray-400 text-sm">
                              Imagen
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {userPosts.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-600">
                      {isOwnProfile
                        ? "Aún no has publicado nada"
                        : "Este usuario no tiene publicaciones"}
                    </p>
                  </div>
                )}
              </div>
            )}

            {selectedTab === "gallery" && (
              <div id="panel-gallery" role="tabpanel" aria-labelledby="tab-gallery">
                {allImages.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
                    {allImages.map((item, idx) => (
                      <div
                        key={`${item.postId}-${item.index}`}
                        className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-all duration-300 shadow-md hover:shadow-xl group relative"
                      >
                        <div className="w-full h-full bg-gradient-to-br from-jmv-blue/20 via-jmv-blue/10 to-jmv-gold/20 flex items-center justify-center">
                          <Camera className="w-8 h-8 text-jmv-blue" />
                        </div>
                        {/* Overlay on hover */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                          <p className="text-white text-xs line-clamp-2">
                            {item.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Camera className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-600">
                      {isOwnProfile
                        ? "Aún no has compartido fotos"
                        : "Este usuario no tiene fotos"}
                    </p>
                  </div>
                )}
              </div>
            )}

            {selectedTab === "documents" && (
              <div id="panel-documents" role="tabpanel" aria-labelledby="tab-documents">
                {documentPosts.length > 0 ? (
                  <div className="space-y-4">
                    {documentPosts.map((post) => (
                      <BlogPost
                        key={`${post.author.id}-${post.timestamp}`}
                        post={post}
                        onLike={handleLike}
                        onComment={handleComment}
                        onShare={handleShare}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-600">
                      {isOwnProfile
                        ? "Aún no has compartido documentos"
                        : "Este usuario no tiene documentos"}
                    </p>
                  </div>
                )}
              </div>
            )}

            {selectedTab === "about" && (
              <div id="panel-about" role="tabpanel" aria-labelledby="tab-about">
                <UserAbout user={user} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
