"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { ArrowLeft, Camera, Info, LayoutList } from "lucide-react";
import UserProfileHeader from "@/components/blog/UserProfileHeader";
import UserAbout from "@/components/blog/UserAbout";
import BlogPost from "@/components/blog/BlogPost";
import PostImage from "@/components/blog/PostImage";
import { usePostViewer } from "@/components/blog/usePostViewer";
import { postHeading } from "@/lib/blog/posts";
import { cn } from "@/lib/utils";
import type { Post, User } from "@/types/user";

interface ProfileClientProps {
  user: User;
  userPosts: Post[];
  /** Cuántas publicaciones recientes del blog se revisaron */
  postsLimit: number;
}

type TabId = "posts" | "photos" | "about";

export default function ProfileClient({ user, userPosts, postsLimit }: ProfileClientProps) {
  const baseId = useId();
  const [selected, setSelected] = useState<TabId>("posts");
  const tabRefs = useRef<Record<TabId, HTMLButtonElement | null>>({
    posts: null,
    photos: null,
    about: null,
  });
  const { showPost, showImage, viewer } = usePostViewer();

  const photos = userPosts.flatMap((post) =>
    post.images.map((src, index) => ({ post, src, index }))
  );

  const tabs: { id: TabId; label: string; count?: number; icon: typeof Camera }[] = [
    { id: "posts", label: "Publicaciones", count: userPosts.length, icon: LayoutList },
    { id: "photos", label: "Fotos", count: photos.length, icon: Camera },
    { id: "about", label: "Acerca de", icon: Info },
  ];
  const tabId = (id: TabId) => `${baseId}-tab-${id}`;
  const panelId = (id: TabId) => `${baseId}-panel-${id}`;

  // Patrón de pestañas WAI-ARIA: flechas, Inicio y Fin con activación automática
  const onTabKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const order = tabs.map((t) => t.id);
    const current = order.indexOf(selected);
    let next: number | null = null;
    if (e.key === "ArrowRight") next = (current + 1) % order.length;
    else if (e.key === "ArrowLeft") next = (current - 1 + order.length) % order.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = order.length - 1;
    if (next === null) return;
    e.preventDefault();
    const id = order[next];
    setSelected(id);
    tabRefs.current[id]?.focus();
  };

  return (
    <div className="min-h-screen bg-slate-100 pt-24 pb-12 sm:pt-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/blog"
          className="mb-4 inline-flex min-h-11 items-center gap-2 font-semibold text-jmv-blue hover:underline"
          data-surface="light"
        >
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          Volver a la comunidad
        </Link>

        <UserProfileHeader user={user} />

        <div className="mt-4 overflow-hidden rounded-2xl bg-white shadow-sm" data-surface="light">
          <div
            role="tablist"
            aria-label="Secciones de tu perfil"
            className="scrollbar-hide flex overflow-x-auto border-b border-slate-200"
          >
            {tabs.map(({ id, label, count, icon: Icon }) => {
              const active = selected === id;
              return (
                <button
                  key={id}
                  ref={(el) => {
                    tabRefs.current[id] = el;
                  }}
                  id={tabId(id)}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-controls={panelId(id)}
                  tabIndex={active ? 0 : -1}
                  onClick={() => setSelected(id)}
                  onKeyDown={onTabKeyDown}
                  className={cn(
                    "inline-flex min-h-12 flex-1 items-center justify-center gap-2 border-b-[3px] px-4 font-semibold whitespace-nowrap",
                    active
                      ? "border-jmv-blue text-jmv-blue"
                      : "border-transparent text-gray-700 hover:text-gray-900"
                  )}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {label}
                  {count !== undefined ? <span className="text-sm font-normal">({count})</span> : null}
                </button>
              );
            })}
          </div>

          <div className="p-4 sm:p-6">
            <div
              id={panelId("posts")}
              role="tabpanel"
              aria-labelledby={tabId("posts")}
              hidden={selected !== "posts"}
              tabIndex={0}
            >
              <p className="mb-4 text-sm text-gray-600">
                Tus publicaciones entre las {postsLimit} más recientes de la comunidad.
              </p>
              {userPosts.length ? (
                <ul className="space-y-4">
                  {userPosts.map((post) => (
                    <li key={post.id}>
                      <BlogPost post={post} onOpen={showPost} onOpenImage={showImage} />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="py-10 text-center text-gray-700">
                  Aún no tienes publicaciones recientes.{" "}
                  <Link href="/blog" className="font-semibold text-jmv-blue underline underline-offset-4">
                    Comparte algo con la comunidad
                  </Link>
                  .
                </p>
              )}
            </div>

            <div
              id={panelId("photos")}
              role="tabpanel"
              aria-labelledby={tabId("photos")}
              hidden={selected !== "photos"}
              tabIndex={0}
            >
              {photos.length ? (
                <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:grid-cols-4">
                  {photos.map(({ post, src, index }) => (
                    <li key={`${post.id}-${index}`}>
                      <button
                        type="button"
                        onClick={() => showImage(post, index)}
                        className="group relative block aspect-square w-full overflow-hidden rounded-xl bg-slate-200"
                      >
                        <PostImage
                          src={src}
                          alt=""
                          sizes="(min-width: 768px) 200px, 50vw"
                          maxWidth={640}
                          className="absolute inset-0 h-full w-full object-cover motion-safe:transition-transform motion-safe:group-hover:scale-105"
                        />
                        <span className="sr-only">
                          Ver foto {index + 1} de «{postHeading(post)}»
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="py-10 text-center text-gray-700">Aún no has compartido fotos.</p>
              )}
            </div>

            <div
              id={panelId("about")}
              role="tabpanel"
              aria-labelledby={tabId("about")}
              hidden={selected !== "about"}
              tabIndex={0}
            >
              <UserAbout user={user} />
            </div>
          </div>
        </div>
      </div>

      {viewer}
    </div>
  );
}
