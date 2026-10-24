"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Loader2, Lock, LogIn } from "lucide-react";
import ProfileClient from "./ProfileClient";
import { getAxiosClient } from "@/config/axios.config";
import { useAuth } from "@/lib/hooks/useAuth";
import { mapApiUser } from "@/lib/blog/posts";
import { fetchPostsPage } from "@/lib/blog/posts.client";
import { buttonVariants } from "@/components/ui/button-variants";
import type { Post, User } from "@/types/user";

// Máximo que acepta GET /posts; el backend aún no filtra por autor
const RECENT_LIMIT = 100;

function ProfileMessage({
  icon: Icon,
  title,
  children,
  action,
}: {
  icon: typeof Lock;
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="min-h-[70svh] bg-slate-100 px-4 pt-24 pb-12 sm:pt-28">
      <div
        className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm"
        data-surface="light"
      >
        <span className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-jmv-blue/10">
          <Icon className="h-8 w-8 text-jmv-blue" aria-hidden="true" />
        </span>
        <h1 className="mb-2 font-display text-2xl font-semibold text-gray-900">{title}</h1>
        <div className="text-base text-gray-700">{children}</div>
        <div className="mt-6 flex flex-col gap-2">
          {action}
          <Link href="/blog" className={buttonVariants({ variant: "ghost", className: "gap-2" })}>
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Volver a la comunidad
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePageClient() {
  const params = useParams();
  const id = String(params.id ?? "");
  const { user: authUser, loading: authLoading } = useAuth();
  const isOwn = id === "me" || (!!authUser?.id && id === authUser.id);

  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    if (!isOwn || authLoading || !authUser) return;
    let alive = true;
    (async () => {
      try {
        const { data } = await getAxiosClient().get("/auth/me");
        if (!alive) return;
        const me = mapApiUser(data?.user ?? authUser);
        setUser(me);
        try {
          const page = await fetchPostsPage({}, RECENT_LIMIT, 0);
          if (alive) setPosts(page.posts.filter((p) => p.author.id === me.id));
        } catch {
          if (alive) setPosts([]);
        }
        if (alive) setStatus("ready");
      } catch {
        if (alive) setStatus("error");
      }
    })();
    return () => {
      alive = false;
    };
  }, [isOwn, authLoading, authUser]);

  if (!isOwn && !authLoading) {
    return (
      <ProfileMessage icon={Lock} title="Este perfil no es público">
        Por ahora cada persona solo puede ver su propio perfil. Puedes leer lo
        que comparte la comunidad en el blog.
      </ProfileMessage>
    );
  }

  if (!authLoading && !authUser) {
    return (
      <ProfileMessage
        icon={LogIn}
        title="Inicia sesión para ver tu perfil"
        action={
          <Link
            href="/sign-in?redirect=/blog/profile/me"
            className={buttonVariants({ variant: "primary" })}
          >
            Iniciar sesión
          </Link>
        }
      >
        Tu perfil reúne tus datos y lo que compartes en la comunidad.
      </ProfileMessage>
    );
  }

  if (status === "error") {
    return (
      <ProfileMessage
        icon={Lock}
        title="No pudimos cargar tu perfil"
        action={
          <button
            type="button"
            onClick={() => window.location.reload()}
            className={buttonVariants({ variant: "primary" })}
          >
            Reintentar
          </button>
        }
      >
        Puede ser un problema de conexión. Revisa tu internet y vuelve a intentarlo.
      </ProfileMessage>
    );
  }

  if (status === "loading" || !user) {
    return (
      <div className="flex min-h-[70svh] items-center justify-center bg-slate-100 pt-24">
        <p role="status" className="flex items-center gap-3 text-base text-gray-700">
          <Loader2 className="h-6 w-6 text-jmv-blue motion-safe:animate-spin" aria-hidden="true" />
          Cargando tu perfil…
        </p>
      </div>
    );
  }

  return <ProfileClient user={user} userPosts={posts} postsLimit={RECENT_LIMIT} />;
}
