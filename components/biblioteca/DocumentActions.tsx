"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Check, CheckCircle2, Download, ExternalLink, Loader2, Play, Send, Share2 } from "lucide-react";
import type { LibraryDocument } from "@/types/library";
import { markFinished, progressPercent, readerHref } from "@/lib/biblioteca";
import { whatsappShareLink } from "@/lib/whatsapp";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import MembersGate from "./MembersGate";
import VideoEmbed from "./VideoEmbed";
import { countView, downloadHref, downloadWithToken, fetchMemberLink } from "./api";
import { documentFileHref, hostLabel, pageLabel, youtubeId } from "./shared";
import { useDocProgress } from "./useLibraryProgress";
import { useLibrarySession, type SessionState } from "./useLibrarySession";

export type ActionDoc = Pick<
  LibraryDocument,
  "id" | "slug" | "title" | "kind" | "visibility" | "externalUrl" | "fileUrl" | "pageCount"
>;

const secondary =
  "inline-flex min-h-11 items-center gap-2 rounded-full border border-line-strong bg-surface px-4 py-2 text-sm font-semibold text-fg shadow-card transition-colors hover:bg-surface-2 disabled:opacity-60 dark:hover:bg-white/15";

type LinkState = { url: string | null; error: "auth" | "red" | null; loading: boolean };

/** Enlace o video: el público viene en el documento; el de miembros se pide con el token */
function useExternalLink(doc: ActionDoc, session: SessionState): LinkState {
  const needsToken = doc.kind !== "pdf" && doc.visibility === "miembros";
  const token = session.status === "in" ? session.token : null;
  const [state, setState] = useState<{ key: string; url: string | null; error: LinkState["error"] } | null>(null);
  const key = `${doc.id}:${token}`;

  useEffect(() => {
    if (!needsToken || !token) return;
    let alive = true;
    fetchMemberLink(doc.id, token).then(
      (url) => alive && setState({ key, url, error: null }),
      (e) => alive && setState({ key, url: null, error: e instanceof Error && e.message === "auth" ? "auth" : "red" }),
    );
    return () => {
      alive = false;
    };
  }, [needsToken, token, doc.id, key]);

  if (!needsToken) return { url: doc.externalUrl ?? null, error: null, loading: false };
  if (!token) return { url: null, error: null, loading: session.status === "loading" };
  const current = state?.key === key ? state : null;
  return { url: current?.url ?? null, error: current?.error ?? null, loading: !current };
}

const primary = buttonVariants({ variant: "gold", size: "lg", className: "w-full gap-2.5 rounded-full sm:w-auto" });

/**
 * Acciones de la ficha: leer (o continuar), abrir el enlace o ver el video,
 * marcar como terminado, descargar y compartir. Si es solo para miembros y no
 * hay sesión, muestra el aviso para iniciar sesión.
 */
export default function DocumentActions({
  doc,
  shareUrl,
  shareText,
}: {
  doc: ActionDoc;
  shareUrl: string;
  shareText: string;
}) {
  const session = useLibrarySession();
  const progress = useDocProgress(doc.slug);
  const [canShare, setCanShare] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => setCanShare(typeof navigator.share === "function"), []);

  const locked = doc.visibility === "miembros";
  const gated = locked && session.status === "out";
  const finished = !!progress?.finished;
  const resume = progress && !finished && progress.page > 1 ? progress.page : null;
  const link = useExternalLink(doc, session);
  const fileHref = doc.kind === "pdf" ? documentFileHref(doc) : null;
  const video = doc.kind === "video" ? youtubeId(link.url) : null;
  const host = hostLabel(link.url);

  const share = async () => {
    try {
      await navigator.share({ title: doc.title, text: shareText, url: shareUrl });
    } catch {
      // El usuario canceló o el navegador no lo permite
    }
  };

  const download = async () => {
    if (!fileHref || session.status !== "in") return;
    setDownloading(true);
    setMessage("Preparando la descarga…");
    try {
      await downloadWithToken(fileHref, session.token, `${doc.slug}.pdf`);
      setMessage("Listo: el PDF se descargó en tu teléfono.");
    } catch (e) {
      setMessage(
        e instanceof Error && e.message === "auth"
          ? "Tu sesión venció. Vuelve a iniciar sesión para descargarlo."
          : "No pudimos descargar el PDF. Revisa tu conexión e inténtalo otra vez.",
      );
    } finally {
      setDownloading(false);
    }
  };

  const toggleFinished = () => {
    markFinished(doc.slug, !finished);
    setMessage(finished ? "Lo quitamos de tus terminados." : "¡Bien! Lo marcamos como terminado en este teléfono.");
  };

  if (gated || link.error === "auth") return <MembersGate slug={doc.slug} />;

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        {doc.kind === "pdf" &&
          (session.status === "loading" && locked ? (
            <span className={cn(primary, "pointer-events-none opacity-70")} aria-hidden="true">
              <Loader2 className="h-5 w-5 animate-spin" />
              Cargando…
            </span>
          ) : (
            <Link href={readerHref(doc.slug, resume ?? undefined)} className={primary}>
              {resume ? <Play className="h-5 w-5 fill-current" aria-hidden /> : <BookOpen className="h-5 w-5" aria-hidden />}
              {resume ? `Continuar en la página ${resume}` : finished ? "Leer de nuevo" : "Leer ahora"}
            </Link>
          ))}

        {doc.kind !== "pdf" && link.loading && (
          <span className={cn(primary, "pointer-events-none opacity-70")} aria-hidden="true">
            <Loader2 className="h-5 w-5 animate-spin" />
            Cargando…
          </span>
        )}

        {doc.kind === "enlace" && link.url && (
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => countView(doc.id)}
            className={primary}
          >
            <ExternalLink className="h-5 w-5" aria-hidden />
            Abrir recurso
            <span className="sr-only"> (se abre en una pestaña nueva)</span>
          </a>
        )}

        {doc.kind === "video" &&
          link.url &&
          (video ? (
            <a href="#video" className={primary}>
              <Play className="h-5 w-5 fill-current" aria-hidden />
              Ver el video
            </a>
          ) : (
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => countView(doc.id)}
              className={primary}
            >
              <Play className="h-5 w-5 fill-current" aria-hidden />
              Ver el video
              <span className="sr-only"> (se abre en una pestaña nueva)</span>
            </a>
          ))}

        {doc.kind !== "pdf" && (
          <button type="button" onClick={toggleFinished} aria-pressed={finished} className={cn(secondary, "min-h-12 px-5", finished && "border-emerald-600/50 bg-emerald-500/10 dark:border-emerald-400/60 dark:bg-emerald-500/15")}>
            {finished ? <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" aria-hidden /> : <Check className="h-5 w-5 text-accent-gold" aria-hidden />}
            {finished ? "Terminado" : "Marcar como terminado"}
          </button>
        )}
      </div>

      {doc.kind === "pdf" && progress && !finished && progress.page > 1 && (
        <p className="mt-3 text-sm text-fg-muted">
          Vas en la {pageLabel(progress.page, progress.pageCount || doc.pageCount).toLowerCase()} ({progressPercent(progress)} %)
        </p>
      )}
      {doc.kind === "pdf" && finished && (
        <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700 dark:text-emerald-300">
          <CheckCircle2 className="h-4 w-4" aria-hidden />
          Ya lo terminaste en este teléfono
        </p>
      )}
      {link.error === "red" && (
        <p className="mt-3 text-sm text-fg-muted">
          No pudimos abrir el recurso. Revisa tu conexión y vuelve a cargar la página.
        </p>
      )}
      {(doc.kind === "enlace" || (doc.kind === "video" && !video)) && host && (
        <p className="mt-3 text-sm text-fg-muted">Se abre en {host}</p>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        {fileHref &&
          (locked ? (
            session.status === "in" && (
              <button type="button" onClick={download} disabled={downloading} className={secondary}>
                {downloading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-accent-gold" aria-hidden />
                ) : (
                  <Download className="h-4 w-4 text-accent-gold" aria-hidden />
                )}
                Descargar PDF
              </button>
            )
          ) : (
            <a href={downloadHref(fileHref)} download={`${doc.slug}.pdf`} className={secondary}>
              <Download className="h-4 w-4 text-accent-gold" aria-hidden />
              Descargar PDF
            </a>
          ))}
        <a href={whatsappShareLink(shareText, shareUrl)} target="_blank" rel="noopener noreferrer" className={secondary}>
          <Send className="h-4 w-4 text-accent-gold" aria-hidden />
          WhatsApp
          <span className="sr-only"> (compartir, se abre en una pestaña nueva)</span>
        </a>
        {canShare && (
          <button type="button" onClick={share} className={secondary}>
            <Share2 className="h-4 w-4 text-accent-gold" aria-hidden />
            Compartir…
          </button>
        )}
      </div>
      <p role="status" className="mt-3 min-h-5 text-sm text-fg-muted">
        {message}
      </p>
    </div>
  );
}

/** Reproductor de la ficha (solo YouTube); respeta el aviso de solo miembros */
export function DocumentVideo({ doc }: { doc: ActionDoc }) {
  const session = useLibrarySession();
  const link = useExternalLink(doc, session);
  const id = youtubeId(link.url);
  if (!id) return null;
  return (
    <section id="video" aria-label="Video" className="scroll-mt-28">
      <VideoEmbed videoId={id} title={doc.title} onPlay={() => countView(doc.id)} />
    </section>
  );
}
