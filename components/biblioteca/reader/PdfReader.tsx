"use client";

import "./reader.css";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CloudOff, Download, FileWarning, Lock, LogIn, RotateCcw, SearchX, X } from "lucide-react";
import type { LibraryDocument } from "@/types/library";
import { getProgress, libraryHref, readerHref, saveProgress } from "@/lib/biblioteca";
import { cn } from "@/lib/utils";
import {
  clientApiBase,
  documentFileUrl,
  loadPdfJs,
  pdfSource,
  readAuthToken,
  withDownloadParam,
  type PdfJs,
  type PDFDocumentProxy,
} from "./pdfjs";
import PdfPage from "./PdfPage";
import ReaderEnd, { type NextReading } from "./ReaderEnd";
import { ReaderBottomBar, ReaderTopBar, THEMES, type ReaderMode, type ReaderTheme } from "./ReaderBars";
import { ReaderMessage, ReaderSkeleton, readerButton } from "./ReaderStates";
import ShortcutsDialog from "./ShortcutsDialog";

export type PdfReaderProps = {
  doc: LibraryDocument;
  /** Siguiente lectura si el documento está en una ruta de formación */
  next?: NextReading | null;
};

type Status =
  | { kind: "loading" }
  | { kind: "ready" }
  | { kind: "login"; expired: boolean }
  | { kind: "error"; reason: "noexiste" | "danado" | "clave" | "red" };

type Anchor = { page: number; fx: number; fy: number; cx: number; cy: number };

const ZOOM_STEPS = [0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3, 4];
const MIN_ZOOM = ZOOM_STEPS[0];
const MAX_ZOOM = ZOOM_STEPS[ZOOM_STEPS.length - 1];
/** Espacio de las barras (se superponen al documento) */
const PAD_TOP = 72;
const PAD_BOTTOM = 132;
/** Modo una página: la página entera cabe entre las dos barras */
const PAGE_PAD_BOTTOM = 112;
const GAP = 14;
/** Ancho máximo cómodo de lectura en pantallas grandes (zoom "Ajustar") */
const MAX_FIT_WIDTH = 880;
const PREFS_KEY = "jmv-lector-preferencias";

const clampZoom = (z: number) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z));

function readPrefs(): { theme: ReaderTheme; mode: ReaderMode } {
  try {
    const raw = JSON.parse(window.localStorage.getItem(PREFS_KEY) || "{}");
    return {
      theme: THEMES.some((t) => t.value === raw.theme) ? raw.theme : "claro",
      mode: raw.mode === "pagina" ? "pagina" : "continuo",
    };
  } catch {
    return { theme: "claro", mode: "continuo" };
  }
}

function classifyError(err: unknown): Status {
  const e = err as { name?: string; status?: number } | null;
  if (e?.status === 401 || e?.status === 403) return { kind: "login", expired: true };
  if (e?.name === "MissingPDFException" || e?.status === 404) return { kind: "error", reason: "noexiste" };
  if (e?.name === "InvalidPDFException") return { kind: "error", reason: "danado" };
  if (e?.name === "PasswordException") return { kind: "error", reason: "clave" };
  return { kind: "error", reason: "red" };
}

/** Primer índice i con tops[i] + heights[i] > y */
function pageAt(tops: number[], heights: number[], y: number) {
  let lo = 0;
  let hi = tops.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (tops[mid] + heights[mid] <= y) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

export default function PdfReader({ doc, next }: PdfReaderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLElement>(null);
  const [container, setContainer] = useState<HTMLElement | null>(null);

  const [{ theme, mode }, setPrefs] = useState(readPrefs);
  const [status, setStatus] = useState<Status>({ kind: "loading" });
  const [attempt, setAttempt] = useState(0);
  const [loadProgress, setLoadProgress] = useState<number | null>(null);
  const [lib, setLib] = useState<PdfJs | null>(null);
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [baseAspect, setBaseAspect] = useState(1.414);
  const [aspects, setAspects] = useState<Record<number, number>>({});
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [zoom, setZoom] = useState(1);
  const [current, setCurrent] = useState(1);
  const [range, setRange] = useState<[number, number]>([1, 2]);
  const [dir, setDir] = useState(0);
  const [showEnd, setShowEnd] = useState(false);
  const [finished, setFinished] = useState(false);
  const [bars, setBars] = useState(true);
  const [resumeFrom, setResumeFrom] = useState<number | null>(null);
  const [announce, setAnnounce] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [canFullscreen, setCanFullscreen] = useState(false);

  const fileUrl = useMemo(() => documentFileUrl(doc), [doc]);
  const membersOnly = doc.visibility === "miembros";
  const backHref = libraryHref(doc.slug);
  const signInHref = `/sign-in?redirect=${encodeURIComponent(readerHref(doc.slug))}`;

  const initialPage = useRef(1);
  const didInitialJump = useRef(false);
  const programmatic = useRef<number | null>(null);
  const pendingAnchor = useRef<Anchor | null>(null);
  const pendingShift = useRef(0);

  useEffect(() => setContainer(rootRef.current), []);

  useEffect(() => {
    try {
      window.localStorage.setItem(PREFS_KEY, JSON.stringify({ theme, mode }));
    } catch {}
  }, [theme, mode]);

  // Lector a pantalla completa: el header y el footer del sitio quedan fuera del foco y del scroll
  useEffect(() => {
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = "hidden";
    // Sin "atrás" del navegador al deslizar de página ni rebote del fondo
    const prevOverscroll = html.style.overscrollBehavior;
    html.style.overscrollBehavior = "none";
    const outside = Array.from(document.querySelectorAll<HTMLElement>("body > header, body > footer, body > a[href='#contenido']"));
    outside.forEach((el) => el.setAttribute("inert", ""));
    // El esqueleto que pintó el servidor ya no hace falta (ni debe anunciarse)
    document.getElementById("lector-esqueleto")?.setAttribute("hidden", "");
    setCanFullscreen(!!document.fullscreenEnabled && !!rootRef.current?.requestFullscreen);
    const onFs = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFs);
    return () => {
      html.style.overflow = prevOverflow;
      html.style.overscrollBehavior = prevOverscroll;
      outside.forEach((el) => el.removeAttribute("inert"));
      document.removeEventListener("fullscreenchange", onFs);
      if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
    };
  }, []);

  // ---------- Carga del documento ----------
  useEffect(() => {
    const token = membersOnly ? readAuthToken() : null;
    if (membersOnly && !token) {
      setStatus({ kind: "login", expired: false });
      return;
    }
    let destroyed = false;
    let task: ReturnType<PdfJs["getDocument"]> | null = null;
    setStatus({ kind: "loading" });
    setLoadProgress(null);

    (async () => {
      try {
        const pdfjs = await loadPdfJs();
        if (destroyed) return;
        task = pdfjs.getDocument(pdfSource(fileUrl, token));
        task.onProgress = ({ loaded, total }: { loaded: number; total: number }) => {
          if (total > 0) setLoadProgress(Math.min(1, loaded / total));
        };
        const loaded = await task.promise;
        const first = await loaded.getPage(1);
        if (destroyed) return;
        const vp = first.getViewport({ scale: 1 });
        const n = loaded.numPages;

        // ?p=N manda; si no, retomamos la última página guardada en este teléfono
        const p = Number(new URLSearchParams(window.location.search).get("p"));
        let start = 1;
        if (Number.isInteger(p) && p >= 1) start = Math.min(p, n);
        else {
          const saved = getProgress(doc.slug);
          if (saved && !saved.finished && saved.page > 1 && saved.page <= n) {
            start = saved.page;
            setResumeFrom(saved.page);
          }
        }
        initialPage.current = start;
        didInitialJump.current = false;
        setLib(pdfjs);
        setBaseAspect(vp.height / vp.width);
        setAspects({});
        setNumPages(n);
        setCurrent(start);
        setRange([Math.max(1, start - 1), Math.min(n, start + 1)]);
        setPdf(loaded);
        setStatus({ kind: "ready" });
      } catch (err) {
        if (destroyed) return;
        const st = classifyError(err);
        setStatus(st.kind === "login" ? { kind: "login", expired: !!token } : st);
      }
    })();

    return () => {
      destroyed = true;
      setPdf(null);
      task?.destroy();
    };
  }, [fileUrl, membersOnly, doc.slug, attempt]);

  // Una vista por sesión de lectura (no bloquea nada si falla)
  useEffect(() => {
    if (status.kind !== "ready") return;
    const key = `jmv-biblioteca-vista-${doc.id}`;
    try {
      if (window.sessionStorage.getItem(key)) return;
      window.sessionStorage.setItem(key, "1");
    } catch {}
    fetch(`${clientApiBase()}/library/documents/${encodeURIComponent(doc.id)}/view`, {
      method: "POST",
      keepalive: true,
    }).catch(() => {});
  }, [status.kind, doc.id]);

  // ---------- Medidas ----------
  const gutter = size.w < 640 ? 8 : 24;
  const aspectOf = useCallback((n: number) => aspects[n] ?? baseAspect, [aspects, baseAspect]);

  const fitWidth =
    mode === "continuo"
      ? Math.min(size.w - gutter * 2, MAX_FIT_WIDTH)
      : Math.min(size.w - gutter * 2, (size.h - PAD_TOP - PAGE_PAD_BOTTOM) / aspectOf(current));
  const pageW = Math.max(120, Math.round(fitWidth * zoom));

  const layout = useMemo(() => {
    const tops: number[] = [];
    const heights: number[] = [];
    let y = PAD_TOP;
    for (let n = 1; n <= numPages; n++) {
      const h = Math.round(pageW * (aspects[n] ?? baseAspect));
      tops.push(y);
      heights.push(h);
      y += h + GAP;
    }
    return { tops, heights, bottom: y + 32, contentW: Math.max(size.w, pageW + gutter * 2) };
  }, [numPages, pageW, aspects, baseAspect, size.w, gutter]);

  // useLayoutEffect y antes que los demás: el salto inicial ya necesita las medidas nuevas
  const layoutRef = useRef(layout);
  useLayoutEffect(() => {
    layoutRef.current = layout;
  }, [layout]);

  useLayoutEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize((prev) => {
        if (Math.abs(prev.w - width) < 1 && Math.abs(prev.h - height) < 1) return prev;
        if (prev.w > 0 && !pendingAnchor.current) pendingAnchor.current = measureAnchor(width / 2, height * 0.3);
        return { w: width, h: height };
      });
    });
    ro.observe(el);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status.kind]);

  /** Punto del documento que está bajo (cx, cy) del visor, para conservarlo al hacer zoom */
  function measureAnchor(cx: number, cy: number): Anchor | null {
    const scroller = scrollerRef.current;
    if (!scroller) return null;
    const s = scroller.getBoundingClientRect();
    const y = s.top + cy;
    let best: HTMLElement | null = null;
    let bestDist = Infinity;
    scroller.querySelectorAll<HTMLElement>("[data-page]").forEach((el) => {
      const r = el.getBoundingClientRect();
      const d = y < r.top ? r.top - y : y > r.bottom ? y - r.bottom : 0;
      if (d < bestDist) {
        bestDist = d;
        best = el;
      }
    });
    if (!best) return null;
    const el = best as HTMLElement;
    const r = el.getBoundingClientRect();
    return {
      page: Number(el.dataset.page),
      fx: (s.left + cx - r.left) / r.width,
      fy: Math.min(1, Math.max(0, (y - r.top) / r.height)),
      cx,
      cy,
    };
  }

  // Tras cambiar zoom o tamaño: devuelve el punto marcado a su sitio y quita la vista previa del pellizco
  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    const content = contentRef.current;
    if (content) content.style.transform = "";
    const a = pendingAnchor.current;
    pendingAnchor.current = null;
    if (!scroller || !a) return;
    const el = scroller.querySelector<HTMLElement>(`[data-page="${a.page}"]`);
    const s = scroller.getBoundingClientRect();
    if (el) {
      const r = el.getBoundingClientRect();
      scroller.scrollLeft += r.left + a.fx * r.width - (s.left + a.cx);
      scroller.scrollTop += r.top + a.fy * r.height - (s.top + a.cy);
    } else if (mode === "continuo" && layout.tops[a.page - 1] != null) {
      scroller.scrollTop = layout.tops[a.page - 1] + a.fy * layout.heights[a.page - 1] - a.cy;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageW]);

  // Si una página de arriba resultó de otro tamaño, compensa para que el texto no salte
  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    if (scroller && pendingShift.current) scroller.scrollTop += pendingShift.current;
    pendingShift.current = 0;
  }, [aspects]);

  const onAspect = useCallback(
    (n: number, a: number) => {
      const scroller = scrollerRef.current;
      const { tops, heights } = layoutRef.current;
      if (scroller && mode === "continuo" && tops[n - 1] != null && tops[n - 1] + heights[n - 1] < scroller.scrollTop) {
        pendingShift.current += Math.round(pageW * a) - heights[n - 1];
      }
      setAspects((prev) => (prev[n] === a ? prev : { ...prev, [n]: a }));
    },
    [mode, pageW],
  );

  // ---------- Navegación ----------
  const goTo = useCallback(
    (target: number, opts: { hideBars?: boolean } = {}) => {
      if (!numPages) return;
      const n = Math.min(numPages, Math.max(1, Math.round(target)));
      const scroller = scrollerRef.current;
      if (mode === "continuo") {
        programmatic.current = n;
        const top = layoutRef.current.tops[n - 1] ?? 0;
        if (scroller) scroller.scrollTop = n === 1 ? 0 : top - PAD_TOP + 8;
        setRange([Math.max(1, n - 1), Math.min(numPages, n + 1)]);
      } else {
        setShowEnd(false);
        setDir(n > current ? 1 : n < current ? -1 : 0);
        scroller?.scrollTo({ top: 0, left: 0 });
      }
      setCurrent(n);
      if (opts.hideBars) setBars(false);
    },
    [numPages, mode, current],
  );

  const showEndCard = useCallback(() => {
    if (mode === "continuo") {
      programmatic.current = numPages;
      endRef.current?.scrollIntoView({ block: "center" });
    } else {
      setDir(1);
      setShowEnd(true);
    }
  }, [mode, numPages]);

  const nextPage = useCallback(
    (hideBars = false) => {
      if (mode === "pagina" && showEnd) return;
      if (current >= numPages) showEndCard();
      else goTo(current + 1, { hideBars });
    },
    [mode, showEnd, current, numPages, showEndCard, goTo],
  );

  const prevPage = useCallback(
    (hideBars = false) => {
      if (mode === "pagina" && showEnd) {
        setDir(-1);
        setShowEnd(false);
        return;
      }
      goTo(current - 1, { hideBars });
    },
    [mode, showEnd, current, goTo],
  );

  // Salto inicial (página guardada o ?p=)
  useLayoutEffect(() => {
    if (status.kind !== "ready" || !size.w || didInitialJump.current) return;
    didInitialJump.current = true;
    goTo(initialPage.current);
  }, [status.kind, size.w, goTo]);

  // Al cambiar de modo, seguimos en la misma página
  const prevMode = useRef(mode);
  useLayoutEffect(() => {
    if (prevMode.current === mode) return;
    prevMode.current = mode;
    setShowEnd(false);
    setDir(0);
    const scroller = scrollerRef.current;
    if (mode === "continuo") {
      programmatic.current = current;
      if (scroller) scroller.scrollTop = current === 1 ? 0 : (layout.tops[current - 1] ?? 0) - PAD_TOP + 8;
      setRange([Math.max(1, current - 1), Math.min(numPages, current + 1)]);
    } else {
      scroller?.scrollTo({ top: 0, left: 0 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, layout]);

  // Desplazamiento continuo: página actual y páginas a dibujar (visibles ±1)
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || mode !== "continuo" || status.kind !== "ready") return;
    let raf = 0;
    let settle: ReturnType<typeof setTimeout> | undefined;
    let lastY = scroller.scrollTop;
    const userScroll = () => {
      programmatic.current = null;
    };
    const update = () => {
      raf = 0;
      const { tops, heights } = layoutRef.current;
      if (!tops.length) return;
      const top = scroller.scrollTop;
      const h = scroller.clientHeight;
      const first = pageAt(tops, heights, top);
      const last = pageAt(tops, heights, top + h);
      const probe = pageAt(tops, heights, top + Math.min(h * 0.4, PAD_TOP + 160));
      const atEnd = top + h >= scroller.scrollHeight - 4;
      const page = atEnd ? tops.length : (programmatic.current ?? probe + 1);
      setCurrent(page);
      clearTimeout(settle);
      settle = setTimeout(() => {
        setRange([Math.max(1, first), Math.min(tops.length, last + 2)]);
      }, 120);
      if (programmatic.current == null && Math.abs(top - lastY) > 48) {
        lastY = top;
        if (!rootRef.current?.querySelector("[data-reader-bar]:focus-within")) setBars(false);
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    scroller.addEventListener("scroll", onScroll, { passive: true });
    for (const ev of ["wheel", "touchstart", "pointerdown", "keydown"] as const) {
      scroller.addEventListener(ev, userScroll, { passive: true });
    }
    return () => {
      scroller.removeEventListener("scroll", onScroll);
      for (const ev of ["wheel", "touchstart", "pointerdown", "keydown"] as const) {
        scroller.removeEventListener(ev, userScroll);
      }
      cancelAnimationFrame(raf);
      clearTimeout(settle);
    };
  }, [mode, status.kind]);

  // Precarga las páginas vecinas en el modo una página
  useEffect(() => {
    if (mode !== "pagina" || !pdf) return;
    for (const n of [current + 1, current - 1]) {
      if (n >= 1 && n <= numPages) pdf.getPage(n).catch(() => {});
    }
  }, [mode, pdf, current, numPages]);

  // ---------- Final de la lectura ----------
  const finish = useCallback(() => {
    if (!numPages) return;
    saveProgress({ slug: doc.slug, page: numPages, pageCount: numPages, finished: true });
    setFinished(true);
    setBars(true);
  }, [doc.slug, numPages]);

  useEffect(() => {
    const end = endRef.current;
    const scroller = scrollerRef.current;
    if (mode !== "continuo" || !end || !scroller || status.kind !== "ready") return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) finish();
      },
      { root: scroller, threshold: 0.35 },
    );
    io.observe(end);
    return () => io.disconnect();
  }, [mode, status.kind, finish, numPages]);

  useEffect(() => {
    if (mode === "pagina" && showEnd) {
      finish();
      document.getElementById("lector-fin")?.focus({ preventScroll: true });
    }
  }, [mode, showEnd, finish]);

  // ---------- Progreso, URL y anuncio ----------
  useEffect(() => {
    if (status.kind !== "ready" || !numPages) return;
    const t = setTimeout(() => {
      saveProgress({ slug: doc.slug, page: current, pageCount: numPages });
      try {
        window.history.replaceState(window.history.state, "", readerHref(doc.slug, current));
      } catch {}
    }, 700);
    const a = setTimeout(() => setAnnounce(`Página ${current} de ${numPages}`), 500);
    return () => {
      clearTimeout(t);
      clearTimeout(a);
    };
  }, [current, numPages, status.kind, doc.slug]);

  useEffect(() => {
    if (resumeFrom == null) return;
    const t = setTimeout(() => setResumeFrom(null), 9000);
    return () => clearTimeout(t);
  }, [resumeFrom]);

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), 2800);
    return () => clearTimeout(t);
  }, [notice]);

  // ---------- Zoom ----------
  const zoomRef = useRef(zoom);
  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);

  const applyZoom = useCallback(
    (z: number, cx?: number, cy?: number) => {
      const target = clampZoom(z);
      if (Math.abs(target - zoomRef.current) < 0.001) {
        if (contentRef.current) contentRef.current.style.transform = "";
        return;
      }
      if (!pendingAnchor.current) pendingAnchor.current = measureAnchor(cx ?? size.w / 2, cy ?? size.h / 2);
      setZoom(target);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [size.w, size.h],
  );

  const stepZoom = useCallback(
    (d: 1 | -1) => {
      const z = zoomRef.current;
      const nextStep =
        d > 0 ? ZOOM_STEPS.find((s) => s > z + 0.01) ?? MAX_ZOOM : [...ZOOM_STEPS].reverse().find((s) => s < z - 0.01) ?? MIN_ZOOM;
      applyZoom(nextStep);
    },
    [applyZoom],
  );

  // ---------- Gestos: pellizco, doble toque, toque y deslizamiento ----------
  const gesture = useRef({ nextPage, prevPage, applyZoom, mode, showEnd });
  useEffect(() => {
    gesture.current = { nextPage, prevPage, applyZoom, mode, showEnd };
  });

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || status.kind !== "ready") return;
    let pinch: { d0: number; z0: number; r: number; anchor: Anchor | null } | null = null;
    let swipe: { x: number; y: number; t: number } | null = null;
    let swipeBlockedUntil = 0;
    let lastTap: { t: number; x: number; y: number } | null = null;
    let tapTimer: ReturnType<typeof setTimeout> | undefined;
    let wheel: { z0: number; r: number; anchor: Anchor | null; timer?: ReturnType<typeof setTimeout> } | null = null;

    const dist = (a: Touch, b: Touch) => Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
    const preview = (r: number, ox: number, oy: number) => {
      const content = contentRef.current;
      if (!content) return;
      content.style.transformOrigin = `${ox}px ${oy}px`;
      content.style.transform = `scale(${r})`;
    };
    const commit = (z0: number, r: number, anchor: Anchor | null) => {
      pendingAnchor.current = anchor;
      gesture.current.applyZoom(z0 * r);
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const [a, b] = [e.touches[0], e.touches[1]];
        const s = scroller.getBoundingClientRect();
        const cx = (a.clientX + b.clientX) / 2 - s.left;
        const cy = (a.clientY + b.clientY) / 2 - s.top;
        pinch = { d0: dist(a, b), z0: zoomRef.current, r: 1, anchor: measureAnchor(cx, cy) };
        const content = contentRef.current;
        if (content) content.style.transformOrigin = `${scroller.scrollLeft + cx}px ${scroller.scrollTop + cy}px`;
        swipe = null;
      } else if (e.touches.length === 1 && !pinch) {
        swipe = { x: e.touches[0].clientX, y: e.touches[0].clientY, t: Date.now() };
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (pinch && e.touches.length === 2) {
        e.preventDefault();
        const z = clampZoom((pinch.z0 * dist(e.touches[0], e.touches[1])) / pinch.d0);
        pinch.r = z / pinch.z0;
        const content = contentRef.current;
        if (content) content.style.transform = `scale(${pinch.r})`;
        return;
      }
      // Deslizar a los lados sin nada que recorrer: que no lo tome el navegador como "atrás"
      if (swipe && e.touches.length === 1 && e.cancelable) {
        const dx = e.touches[0].clientX - swipe.x;
        const dy = e.touches[0].clientY - swipe.y;
        if (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) {
          const maxLeft = scroller.scrollWidth - scroller.clientWidth;
          const canPan = dx > 0 ? scroller.scrollLeft > 1 : scroller.scrollLeft < maxLeft - 1;
          if (!canPan) e.preventDefault();
        }
      }
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (pinch) {
        if (e.touches.length < 2) {
          commit(pinch.z0, pinch.r, pinch.anchor);
          pinch = null;
          swipeBlockedUntil = Date.now() + 350;
        }
        return;
      }
      if (!swipe || e.changedTouches.length !== 1) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - swipe.x;
      const dy = t.clientY - swipe.y;
      const dt = Date.now() - swipe.t;
      swipe = null;
      const g = gesture.current;
      if (g.mode !== "pagina" || Date.now() < swipeBlockedUntil) return;
      if (dt > 700 || Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
      // Con zoom, primero se recorre la página; se pasa de página solo desde el borde
      const maxLeft = scroller.scrollWidth - scroller.clientWidth;
      if (dx < 0 && maxLeft > 2 && scroller.scrollLeft < maxLeft - 2) return;
      if (dx > 0 && maxLeft > 2 && scroller.scrollLeft > 2) return;
      if (dx < 0) g.nextPage(true);
      else g.prevPage(true);
    };

    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, input, [role=dialog], #lector-fin-wrap")) return;
      if (window.getSelection()?.toString()) return;
      const s = scroller.getBoundingClientRect();
      const x = e.clientX - s.left;
      const y = e.clientY - s.top;
      const now = Date.now();
      if (lastTap && now - lastTap.t < 300 && Math.hypot(x - lastTap.x, y - lastTap.y) < 40) {
        clearTimeout(tapTimer);
        lastTap = null;
        pendingAnchor.current = measureAnchor(x, y);
        gesture.current.applyZoom(zoomRef.current < 1.4 ? 2 : 1, x, y);
        return;
      }
      lastTap = { t: now, x, y };
      clearTimeout(tapTimer);
      tapTimer = setTimeout(() => {
        lastTap = null;
        setBars((v) => !v);
      }, 260);
    };

    // Ctrl + rueda (o pellizco en el touchpad)
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      const s = scroller.getBoundingClientRect();
      const cx = e.clientX - s.left;
      const cy = e.clientY - s.top;
      if (!wheel) {
        wheel = { z0: zoomRef.current, r: 1, anchor: measureAnchor(cx, cy) };
        preview(1, scroller.scrollLeft + cx, scroller.scrollTop + cy);
      }
      const z = clampZoom(wheel.z0 * wheel.r * Math.exp(-e.deltaY * 0.01));
      wheel.r = z / wheel.z0;
      const content = contentRef.current;
      if (content) content.style.transform = `scale(${wheel.r})`;
      clearTimeout(wheel.timer);
      wheel.timer = setTimeout(() => {
        if (!wheel) return;
        commit(wheel.z0, wheel.r, wheel.anchor);
        wheel = null;
      }, 180);
    };

    scroller.addEventListener("touchstart", onTouchStart, { passive: true });
    scroller.addEventListener("touchmove", onTouchMove, { passive: false });
    scroller.addEventListener("touchend", onTouchEnd);
    scroller.addEventListener("touchcancel", onTouchEnd);
    scroller.addEventListener("click", onClick);
    scroller.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      scroller.removeEventListener("touchstart", onTouchStart);
      scroller.removeEventListener("touchmove", onTouchMove);
      scroller.removeEventListener("touchend", onTouchEnd);
      scroller.removeEventListener("touchcancel", onTouchEnd);
      scroller.removeEventListener("click", onClick);
      scroller.removeEventListener("wheel", onWheel);
      clearTimeout(tapTimer);
      if (wheel) clearTimeout(wheel.timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status.kind]);

  // ---------- Acciones ----------
  const setTheme = useCallback((t: ReaderTheme) => setPrefs((p) => ({ ...p, theme: t })), []);
  const setMode = useCallback((m: ReaderMode) => {
    setZoom(1);
    setPrefs((p) => ({ ...p, mode: m }));
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
    else rootRef.current?.requestFullscreen?.({ navigationUI: "hide" }).catch(() => {});
  }, []);

  const share = useCallback(async () => {
    const url = new URL(libraryHref(doc.slug), window.location.origin).toString();
    const data = { title: doc.title, text: `Te comparto esta lectura de la Biblioteca JMV: ${doc.title}`, url };
    try {
      if (navigator.share) {
        await navigator.share(data);
        return;
      }
      await navigator.clipboard.writeText(url);
      setNotice("Enlace copiado. ¡Compártelo con tu comunidad!");
    } catch (err) {
      if ((err as Error)?.name === "AbortError") return;
      setNotice("No pudimos compartir el enlace.");
    }
  }, [doc.slug, doc.title]);

  const download = useCallback(async () => {
    const url = withDownloadParam(fileUrl);
    const token = membersOnly ? readAuthToken() : null;
    if (!membersOnly) {
      const a = document.createElement("a");
      a.href = url;
      a.download = `${doc.slug}.pdf`;
      a.rel = "noopener";
      document.body.append(a);
      a.click();
      a.remove();
      return;
    }
    if (!token) {
      setStatus({ kind: "login", expired: false });
      return;
    }
    setNotice("Preparando la descarga…");
    try {
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      if (res.status === 401 || res.status === 403) {
        setStatus({ kind: "login", expired: true });
        return;
      }
      if (!res.ok) throw new Error(String(res.status));
      const blobUrl = URL.createObjectURL(await res.blob());
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `${doc.slug}.pdf`;
      document.body.append(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(blobUrl), 10_000);
      setNotice(null);
    } catch {
      setNotice("No pudimos descargar el archivo. Inténtalo otra vez.");
    }
  }, [fileUrl, membersOnly, doc.slug]);

  const restart = useCallback(() => {
    setResumeFrom(null);
    setShowEnd(false);
    goTo(1);
    scrollerRef.current?.focus({ preventScroll: true });
  }, [goTo]);

  // ---------- Teclado ----------
  useEffect(() => {
    if (status.kind !== "ready") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
      const t = e.target as HTMLElement | null;
      if (t?.closest("input, textarea, select, [contenteditable=true], [role=dialog], [role=menu], [data-radix-popper-content-wrapper]")) return;
      const scroller = scrollerRef.current;
      const canPanX = !!scroller && scroller.scrollWidth > scroller.clientWidth + 2;
      let handled = true;
      switch (e.key) {
        case "ArrowRight":
          if (canPanX) handled = false;
          else nextPage();
          break;
        case "ArrowLeft":
          if (canPanX) handled = false;
          else prevPage();
          break;
        case "PageDown":
          if (mode === "pagina") nextPage();
          else handled = false;
          break;
        case "PageUp":
          if (mode === "pagina") prevPage();
          else handled = false;
          break;
        case "Home":
          goTo(1);
          break;
        case "End":
          goTo(numPages);
          break;
        case "+":
        case "=":
          stepZoom(1);
          break;
        case "-":
        case "_":
          stepZoom(-1);
          break;
        case "0":
          applyZoom(1);
          break;
        case "m":
        case "M":
          setMode(mode === "continuo" ? "pagina" : "continuo");
          break;
        case "t":
        case "T": {
          const i = THEMES.findIndex((x) => x.value === theme);
          setTheme(THEMES[(i + 1) % THEMES.length].value);
          break;
        }
        case "f":
        case "F":
          if (canFullscreen) toggleFullscreen();
          else handled = false;
          break;
        case "?":
          setShortcutsOpen(true);
          break;
        default:
          handled = false;
      }
      if (handled) e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [status.kind, mode, theme, numPages, canFullscreen, nextPage, prevPage, goTo, stepZoom, applyZoom, setMode, setTheme, toggleFullscreen]);

  // Foco en el documento para que flechas y espacio funcionen desde el inicio
  useEffect(() => {
    // focusVisible: false para no pintar el anillo al abrir; con el tabulador sí se ve
    if (status.kind === "ready") scrollerRef.current?.focus({ preventScroll: true, focusVisible: false } as FocusOptions);
  }, [status.kind]);

  // ---------- Render ----------
  const ready = status.kind === "ready" && !!pdf && !!lib && size.w > 0;
  const [from, to] = range;
  const windowFrom = Math.max(1, from - 3);
  const windowTo = Math.min(numPages, to + 3);

  const endCard = (
    <ReaderEnd
      ref={endRef}
      title={doc.title}
      celebrate={finished}
      next={next}
      onShare={share}
      onRestart={restart}
    />
  );

  let body: React.ReactNode = null;
  if (status.kind === "login") {
    body = (
      <ReaderMessage
        icon={<Lock className="size-8" aria-hidden="true" />}
        title={status.expired ? "Vuelve a iniciar sesión" : "Inicia sesión para leer"}
        actions={
          <>
            <Link href={signInHref} className={readerButton.primary}>
              <LogIn className="size-5" aria-hidden="true" />
              Iniciar sesión
            </Link>
            <Link href={backHref} className={readerButton.secondary}>
              Volver a la ficha
            </Link>
          </>
        }
      >
        {status.expired
          ? "Tu sesión terminó o no tiene permiso para este documento. Entra de nuevo y te traemos de vuelta aquí."
          : "Este documento es solo para miembros de JMV Ecuador. Entra con tu cuenta y te traemos de vuelta aquí para que sigas leyendo."}
      </ReaderMessage>
    );
  } else if (status.kind === "error") {
    const copy = {
      noexiste: {
        icon: <SearchX className="size-8" aria-hidden="true" />,
        title: "No encontramos el archivo",
        text: "Puede que lo estén actualizando. Inténtalo en un rato o avísanos si sigue sin aparecer.",
      },
      danado: {
        icon: <FileWarning className="size-8" aria-hidden="true" />,
        title: "No pudimos abrir este PDF",
        text: "El archivo parece estar dañado. Prueba a descargarlo y abrirlo en tu celular.",
      },
      clave: {
        icon: <Lock className="size-8" aria-hidden="true" />,
        title: "Este PDF tiene contraseña",
        text: "No podemos mostrarlo aquí. Descárgalo y ábrelo con la clave que te compartieron.",
      },
      red: {
        icon: <CloudOff className="size-8" aria-hidden="true" />,
        title: "Se cortó la conexión",
        text: "No pudimos traer el documento. Revisa tu internet e inténtalo otra vez.",
      },
    }[status.reason];
    body = (
      <ReaderMessage
        icon={copy.icon}
        title={copy.title}
        actions={
          <>
            <button type="button" onClick={() => setAttempt((a) => a + 1)} className={readerButton.primary}>
              <RotateCcw className="size-5" aria-hidden="true" />
              Reintentar
            </button>
            {status.reason !== "noexiste" && (
              <button type="button" onClick={download} className={readerButton.secondary}>
                <Download className="size-5" aria-hidden="true" />
                Descargar el PDF
              </button>
            )}
          </>
        }
      >
        {copy.text}
      </ReaderMessage>
    );
  } else if (ready && mode === "continuo") {
    body = (
      <div ref={contentRef} style={{ width: layout.contentW }}>
        <div className="relative" style={{ height: layout.bottom }}>
          {Array.from({ length: Math.max(0, windowTo - windowFrom + 1) }, (_, i) => {
            const n = windowFrom + i;
            return (
              <PdfPage
                key={n}
                lib={lib}
                pdf={pdf}
                pageNumber={n}
                numPages={numPages}
                width={pageW}
                aspect={aspectOf(n)}
                active={n >= from && n <= to}
                onAspect={onAspect}
                style={{ position: "absolute", top: layout.tops[n - 1], left: (layout.contentW - pageW) / 2 }}
              />
            );
          })}
        </div>
        {/* Inerte hasta llegar a las últimas páginas: el tabulador no salta al final del libro */}
        <div id="lector-fin-wrap" className="px-4" style={{ paddingBottom: PAD_BOTTOM + 24 }} inert={to < numPages}>
          {endCard}
        </div>
      </div>
    );
  } else if (ready) {
    body = (
      <div
        ref={contentRef}
        className="flex min-h-full"
        style={{ minWidth: "100%", width: "max-content", padding: `${PAD_TOP}px ${gutter}px ${PAGE_PAD_BOTTOM}px` }}
      >
        <div className="m-auto">
          {showEnd ? (
            <div id="lector-fin-wrap" className={cn("w-[min(36rem,calc(100vw-2rem))]", "jmv-reader-slide-next")}>
              {endCard}
            </div>
          ) : (
            <PdfPage
              key={current}
              lib={lib}
              pdf={pdf}
              pageNumber={current}
              numPages={numPages}
              width={pageW}
              aspect={aspectOf(current)}
              active
              onAspect={onAspect}
              className={dir > 0 ? "jmv-reader-slide-next" : dir < 0 ? "jmv-reader-slide-prev" : undefined}
            />
          )}
        </div>
      </div>
    );
  }

  const showChrome = status.kind === "ready";

  return (
    <div
      ref={rootRef}
      data-theme={theme}
      className="jmv-reader fixed inset-0 z-[70] overflow-hidden motion-safe:transition-colors motion-safe:duration-300"
    >
      {status.kind === "loading" && (
        <ReaderSkeleton title={doc.title} backHref={backHref} progress={loadProgress} themed />
      )}

      {/* Orden del tabulador: barra superior, documento, barra inferior */}
      {showChrome && (
        <div data-reader-bar>
          <ReaderTopBar
            visible={bars}
            title={doc.title}
            backHref={backHref}
            current={current}
            numPages={numPages}
            mode={mode}
            container={container}
            onGoTo={(n) => goTo(n)}
            onMode={setMode}
            onShortcuts={() => setShortcutsOpen(true)}
            onDownload={download}
            onShare={share}
            onReveal={() => setBars(true)}
          />
        </div>
      )}

      <div
        ref={scrollerRef}
        tabIndex={showChrome ? 0 : -1}
        role={showChrome ? "region" : undefined}
        aria-label={showChrome ? `Páginas de «${doc.title}»` : undefined}
        className="absolute inset-0 overflow-auto overscroll-none outline-none focus-visible:shadow-[inset_0_0_0_3px_var(--focus-ring)] focus-visible:outline-none"
        style={{ touchAction: "pan-x pan-y" }}
      >
        {body}
      </div>

      {showChrome && (
        <>
          <div data-reader-bar>
            <ReaderBottomBar
              visible={bars}
              current={current}
              numPages={numPages}
              zoom={zoom}
              minZoom={MIN_ZOOM}
              maxZoom={MAX_ZOOM}
              theme={theme}
              canFullscreen={canFullscreen}
              fullscreen={fullscreen}
              container={container}
              onGoTo={(n) => goTo(n)}
              onZoom={stepZoom}
              onZoomReset={() => applyZoom(1)}
              onTheme={setTheme}
              onFullscreen={toggleFullscreen}
              onDownload={download}
              onShare={share}
              onReveal={() => setBars(true)}
            />
          </div>
        </>
      )}

      {status.kind !== "ready" && status.kind !== "loading" && (
        <Link
          href={backHref}
          className="absolute left-2 top-[calc(0.5rem+env(safe-area-inset-top))] z-20 inline-flex min-h-11 items-center gap-2 rounded-full bg-(--r-bar) pl-3 pr-4 text-sm font-semibold shadow-md hover:bg-(--r-soft)"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Volver a la ficha
        </Link>
      )}

      {resumeFrom != null && showChrome && (
        <div
          role="status"
          className={cn(
            "absolute inset-x-3 z-30 mx-auto max-w-md rounded-2xl border border-(--r-line) bg-(--r-bar) pb-1.5 pl-4 pr-12 pt-3 text-sm shadow-xl backdrop-blur-md",
            "motion-safe:transition-[bottom] motion-safe:duration-300",
            bars ? "bottom-[calc(7.5rem+env(safe-area-inset-bottom))]" : "bottom-[calc(1rem+env(safe-area-inset-bottom))]",
          )}
        >
          <p>
            Retomamos donde lo dejaste · <strong className="whitespace-nowrap">página {resumeFrom}</strong>
          </p>
          <button
            type="button"
            onClick={restart}
            className="-ml-3 min-h-11 rounded-xl px-3 font-semibold text-(--r-accent) underline-offset-4 hover:bg-(--r-soft) hover:underline"
          >
            Empezar desde el inicio
          </button>
          <button
            type="button"
            onClick={() => setResumeFrom(null)}
            aria-label="Cerrar aviso"
            className="absolute right-1 top-1 inline-flex size-11 items-center justify-center rounded-full hover:bg-(--r-soft)"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
      )}

      <div aria-live="polite" className="pointer-events-none absolute inset-x-0 top-20 z-30 flex justify-center px-4">
        {notice && (
          <p className="rounded-full bg-jmv-ink px-4 py-2.5 text-sm font-medium text-white shadow-xl ring-1 ring-white/10">
            {notice}
          </p>
        )}
      </div>
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {announce}
      </p>

      <ShortcutsDialog open={shortcutsOpen} onOpenChange={setShortcutsOpen} container={container} />
    </div>
  );
}
