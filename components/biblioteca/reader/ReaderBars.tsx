"use client";

import { forwardRef, useId, useState } from "react";
import Link from "next/link";
import { DropdownMenu, Popover } from "radix-ui";
import {
  ArrowLeft,
  BookOpenText,
  Check,
  Download,
  FileText,
  Keyboard,
  Maximize,
  Minimize,
  Minus,
  MoreVertical,
  Palette,
  Plus,
  Rows3,
  Share2,
  Square,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StarsRing } from "@/components/brand";

export type ReaderTheme = "claro" | "sepia" | "noche";
export type ReaderMode = "continuo" | "pagina";

export const THEMES: { value: ReaderTheme; label: string; swatch: string }[] = [
  { value: "claro", label: "Claro", swatch: "#ffffff" },
  { value: "sepia", label: "Sepia", swatch: "#f3e6c8" },
  { value: "noche", label: "Nocturno", swatch: "#1a1a1a" },
];

type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { label: string };

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, className, children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      className={cn(
        "inline-flex size-11 shrink-0 items-center justify-center rounded-full text-(--r-fg) hover:bg-(--r-soft) active:bg-(--r-line) disabled:pointer-events-none disabled:opacity-40",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
});

const panel =
  "z-[90] rounded-2xl border border-(--r-line) bg-(--r-bar) p-2 text-(--r-fg) shadow-2xl backdrop-blur-md data-[state=open]:motion-safe:animate-in data-[state=open]:motion-safe:fade-in-0 data-[state=open]:motion-safe:zoom-in-95";

const menuItem =
  "flex min-h-11 cursor-pointer select-none items-center gap-3 rounded-xl px-3 text-sm outline-none data-[highlighted]:bg-(--r-soft)";

type TopBarProps = {
  visible: boolean;
  title: string;
  backHref: string;
  current: number;
  numPages: number;
  mode: ReaderMode;
  container: HTMLElement | null;
  onGoTo: (page: number) => void;
  onMode: (mode: ReaderMode) => void;
  onShortcuts: () => void;
  onDownload: () => void;
  onShare: () => void;
  onReveal: () => void;
};

export function ReaderTopBar(props: TopBarProps) {
  const { visible, title, backHref, current, numPages, mode, container } = props;
  return (
    <div
      onFocusCapture={props.onReveal}
      className={cn(
        "absolute inset-x-0 top-0 z-20 border-b border-(--r-line) bg-(--r-bar) backdrop-blur-md",
        "pt-[env(safe-area-inset-top)] motion-safe:transition-transform motion-safe:duration-300",
        visible ? "translate-y-0" : "-translate-y-[calc(100%+4px)]",
      )}
    >
      <div aria-hidden="true" className="absolute inset-x-0 -bottom-px h-0.5">
        <div
          className="h-full rounded-r-full bg-(--r-accent) motion-safe:transition-[width] motion-safe:duration-300"
          style={{ width: `${numPages ? (current / numPages) * 100 : 0}%` }}
        />
      </div>
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-1 px-1.5 sm:gap-2 sm:px-4">
        <Link
          href={backHref}
          aria-label="Volver a la ficha del documento"
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-full hover:bg-(--r-soft)"
        >
          <ArrowLeft className="size-5" aria-hidden="true" />
        </Link>
        <div className="min-w-0 flex-1">
          <p className="hidden items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-(--r-muted) sm:flex">
            <StarsRing className="size-3.5 text-(--r-accent)" />
            Biblioteca JMV
          </p>
          <h1 className="truncate font-display text-base font-semibold leading-tight sm:text-lg">{title}</h1>
        </div>
        <GoToPage current={current} numPages={numPages} container={container} onGoTo={props.onGoTo} />
        <DropdownMenu.Root modal={false}>
          <DropdownMenu.Trigger asChild>
            <IconButton label="Más opciones">
              <MoreVertical className="size-5" aria-hidden="true" />
            </IconButton>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal container={container}>
            <DropdownMenu.Content align="end" sideOffset={6} className={cn(panel, "w-72")}>
              <DropdownMenu.Label className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-(--r-muted)">
                Modo de lectura
              </DropdownMenu.Label>
              <DropdownMenu.RadioGroup value={mode} onValueChange={(v) => props.onMode(v as ReaderMode)}>
                <DropdownMenu.RadioItem value="continuo" className={menuItem}>
                  <Rows3 className="size-4" aria-hidden="true" />
                  <span className="flex-1">Desplazamiento continuo</span>
                  <DropdownMenu.ItemIndicator>
                    <Check className="size-4 text-(--r-accent)" aria-hidden="true" />
                  </DropdownMenu.ItemIndicator>
                </DropdownMenu.RadioItem>
                <DropdownMenu.RadioItem value="pagina" className={menuItem}>
                  <Square className="size-4" aria-hidden="true" />
                  <span className="flex-1">Una página a la vez</span>
                  <DropdownMenu.ItemIndicator>
                    <Check className="size-4 text-(--r-accent)" aria-hidden="true" />
                  </DropdownMenu.ItemIndicator>
                </DropdownMenu.RadioItem>
              </DropdownMenu.RadioGroup>
              <DropdownMenu.Separator className="my-1.5 h-px bg-(--r-line)" />
              <DropdownMenu.Item className={menuItem} onSelect={props.onDownload}>
                <Download className="size-4" aria-hidden="true" />
                Descargar el PDF
              </DropdownMenu.Item>
              <DropdownMenu.Item className={menuItem} onSelect={props.onShare}>
                <Share2 className="size-4" aria-hidden="true" />
                Compartir
              </DropdownMenu.Item>
              <DropdownMenu.Item className={menuItem} asChild>
                <Link href={backHref}>
                  <FileText className="size-4" aria-hidden="true" />
                  Ver la ficha del documento
                </Link>
              </DropdownMenu.Item>
              <DropdownMenu.Item className={menuItem} asChild>
                <Link href="/biblioteca">
                  <BookOpenText className="size-4" aria-hidden="true" />
                  Ir a la biblioteca
                </Link>
              </DropdownMenu.Item>
              <DropdownMenu.Item className={menuItem} onSelect={props.onShortcuts}>
                <Keyboard className="size-4" aria-hidden="true" />
                Atajos y gestos
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </div>
  );
}

function GoToPage({
  current,
  numPages,
  container,
  onGoTo,
}: {
  current: number;
  numPages: number;
  container: HTMLElement | null;
  onGoTo: (page: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const inputId = useId();
  const parsed = Number(value);
  const valid = Number.isInteger(parsed) && parsed >= 1 && parsed <= numPages;

  return (
    <Popover.Root
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (o) setValue(String(current));
      }}
    >
      <Popover.Trigger asChild>
        <button
          type="button"
          aria-label={`Página ${current} de ${numPages}. Ir a otra página`}
          className="inline-flex min-h-11 shrink-0 items-center rounded-full px-3 text-sm font-semibold tabular-nums hover:bg-(--r-soft)"
        >
          {current}
          <span className="mx-1 font-normal text-(--r-muted)">/</span>
          {numPages}
        </button>
      </Popover.Trigger>
      <Popover.Portal container={container}>
        <Popover.Content align="end" sideOffset={6} className={cn(panel, "w-64 p-4")}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!valid) return;
              onGoTo(parsed);
              setOpen(false);
            }}
          >
            <label htmlFor={inputId} className="mb-2 block text-sm font-semibold">
              Ir a la página
            </label>
            <div className="flex gap-2">
              <input
                id={inputId}
                type="number"
                inputMode="numeric"
                min={1}
                max={numPages}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onFocus={(e) => e.currentTarget.select()}
                aria-describedby={`${inputId}-hint`}
                className="h-11 min-w-0 flex-1 rounded-xl border-2 border-(--r-line) bg-transparent px-3 text-base tabular-nums text-(--r-fg) focus:border-(--r-accent)"
              />
              <button
                type="submit"
                disabled={!valid}
                className="inline-flex h-11 items-center rounded-xl bg-(--r-accent) px-4 font-semibold text-(--r-paper) disabled:opacity-50 [[data-theme=noche]_&]:text-jmv-ink"
              >
                Ir
              </button>
            </div>
            <p id={`${inputId}-hint`} className="mt-2 text-xs text-(--r-muted)">
              Del 1 al {numPages}
            </p>
          </form>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

type BottomBarProps = {
  visible: boolean;
  current: number;
  numPages: number;
  zoom: number;
  minZoom: number;
  maxZoom: number;
  theme: ReaderTheme;
  canFullscreen: boolean;
  fullscreen: boolean;
  container: HTMLElement | null;
  onGoTo: (page: number) => void;
  onZoom: (dir: 1 | -1) => void;
  onZoomReset: () => void;
  onTheme: (theme: ReaderTheme) => void;
  onFullscreen: () => void;
  onDownload: () => void;
  onShare: () => void;
  onReveal: () => void;
};

export function ReaderBottomBar(props: BottomBarProps) {
  const { visible, current, numPages, zoom, theme, container } = props;
  const fill = numPages > 1 ? ((current - 1) / (numPages - 1)) * 100 : 100;
  const zoomPct = Math.round(zoom * 100);

  return (
    <div
      onFocusCapture={props.onReveal}
      className={cn(
        "absolute inset-x-0 bottom-0 z-20 border-t border-(--r-line) bg-(--r-bar) backdrop-blur-md",
        "pb-[env(safe-area-inset-bottom)] motion-safe:transition-transform motion-safe:duration-300",
        visible ? "translate-y-0" : "translate-y-[calc(100%+4px)]",
      )}
    >
      <div className="mx-auto max-w-3xl px-3 pt-1 sm:px-4">
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="w-8 text-right text-xs tabular-nums text-(--r-muted)">
            1
          </span>
          <input
            type="range"
            min={1}
            max={Math.max(1, numPages)}
            step={1}
            value={current}
            onChange={(e) => props.onGoTo(Number(e.target.value))}
            aria-label="Página"
            aria-valuetext={`Página ${current} de ${numPages}`}
            className="jmv-reader-range min-w-0 flex-1"
            style={{ ["--fill" as string]: `${fill}%` }}
          />
          <span aria-hidden="true" className="w-8 text-xs tabular-nums text-(--r-muted)">
            {numPages}
          </span>
        </div>
        <div className="flex items-center justify-between gap-1 pb-1.5">
          <div className="flex items-center">
            <IconButton label="Alejar" onClick={() => props.onZoom(-1)} disabled={zoom <= props.minZoom}>
              <Minus className="size-5" aria-hidden="true" />
            </IconButton>
            <button
              type="button"
              onClick={props.onZoomReset}
              aria-label={zoomPct === 100 ? "Zoom ajustado a la pantalla" : `Zoom al ${zoomPct} %. Volver a ajustar`}
              className="inline-flex min-h-11 w-14 items-center justify-center rounded-full text-xs font-semibold tabular-nums hover:bg-(--r-soft)"
            >
              {zoomPct === 100 ? "Ajustar" : `${zoomPct} %`}
            </button>
            <IconButton label="Acercar" onClick={() => props.onZoom(1)} disabled={zoom >= props.maxZoom}>
              <Plus className="size-5" aria-hidden="true" />
            </IconButton>
          </div>
          <div className="flex items-center">
            <ThemePicker theme={theme} container={container} onTheme={props.onTheme} />
            {props.canFullscreen && (
              <IconButton
                label={props.fullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
                onClick={props.onFullscreen}
              >
                {props.fullscreen ? (
                  <Minimize className="size-5" aria-hidden="true" />
                ) : (
                  <Maximize className="size-5" aria-hidden="true" />
                )}
              </IconButton>
            )}
            <IconButton label="Descargar el PDF" onClick={props.onDownload}>
              <Download className="size-5" aria-hidden="true" />
            </IconButton>
            <IconButton label="Compartir" onClick={props.onShare}>
              <Share2 className="size-5" aria-hidden="true" />
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  );
}

function ThemePicker({
  theme,
  container,
  onTheme,
}: {
  theme: ReaderTheme;
  container: HTMLElement | null;
  onTheme: (t: ReaderTheme) => void;
}) {
  const current = THEMES.find((t) => t.value === theme) ?? THEMES[0];
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <IconButton label={`Tema de lectura: ${current.label}`}>
          <Palette className="size-5" aria-hidden="true" />
        </IconButton>
      </Popover.Trigger>
      <Popover.Portal container={container}>
        <Popover.Content side="top" align="center" sideOffset={8} className={cn(panel, "w-60 p-3")}>
          <p id="lector-tema" className="mb-2 px-1 text-sm font-semibold">
            Tema de lectura
          </p>
          <div role="group" aria-labelledby="lector-tema" className="grid grid-cols-3 gap-2">
            {THEMES.map((t) => {
              const active = t.value === theme;
              return (
                <button
                  key={t.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onTheme(t.value)}
                  className={cn(
                    "flex min-h-11 flex-col items-center gap-1.5 rounded-xl border-2 px-1 py-2 text-xs font-medium",
                    active ? "border-(--r-accent)" : "border-transparent hover:bg-(--r-soft)",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className="flex size-8 items-center justify-center rounded-full font-display text-sm font-semibold ring-1 ring-black/15"
                    style={{ background: t.swatch, color: t.value === "noche" ? "#e2e8f0" : t.value === "sepia" ? "#3b2a14" : "#0f172a" }}
                  >
                    Aa
                  </span>
                  {t.label}
                </button>
              );
            })}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
