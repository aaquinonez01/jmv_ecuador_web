"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Accordion, Dialog } from "radix-ui";
import { ChevronDown, Heart, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { isChromelessPath } from "@/lib/site";

export type NavItem = {
  name: string;
  href?: string;
  children?: { name: string; href: string }[];
};

type Props = {
  navigation: NavItem[];
  logo: ReactNode;
};

// Header azul de marca con texto blanco (8.4:1) y acentos dorados
// (jmv-gold-text sobre jmv-blue = 4.7:1). El dorado #D98F06 con texto blanco
// daba 2.7:1 y además ocultaba la franja dorada del logo.

function normalize(path: string) {
  return path !== "/" && path.endsWith("/") ? path.slice(0, -1) : path;
}

/** Página exacta: aria-current="page" */
function isCurrent(pathname: string, href: string) {
  return normalize(pathname) === normalize(href);
}

/** Sección activa (incluye subrutas): sólo estilo visual */
function isInSection(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function HeaderClient({ navigation, logo }: Props) {
  const pathname = usePathname() ?? "/";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const baseId = useId();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Al navegar se cierran el menú móvil y los submenús
  useEffect(() => {
    setIsMenuOpen(false);
    setOpenSubmenu(null);
  }, [pathname]);

  // Clic/toque fuera del submenú de escritorio
  useEffect(() => {
    if (!openSubmenu) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setOpenSubmenu(null);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [openSubmenu]);

  if (isChromelessPath(pathname)) {
    return null;
  }

  const sectionActive = (item: NavItem) =>
    item.href
      ? isInSection(pathname, item.href)
      : (item.children ?? []).some((c) => isInSection(pathname, c.href));

  const activeAccordion = navigation.find((i) => i.children && sectionActive(i))?.name;

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full bg-jmv-blue text-white transition-shadow duration-300",
        scrolled ? "shadow-xl shadow-black/20" : "shadow-none",
      )}
    >
      <div className="mx-auto w-full px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-2 sm:h-20 sm:gap-4">
          {logo}

          {/* Navegación de escritorio */}
          <nav ref={navRef} aria-label="Principal" className="hidden lg:block">
            <ul className="flex items-center gap-0.5 xl:gap-1">
              {navigation.map((item) => {
                const active = sectionActive(item);
                if (!item.children) {
                  const current = isCurrent(pathname, item.href!);
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href!}
                        aria-current={current ? "page" : undefined}
                        className={cn(
                          "relative flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold text-white/90 hover:bg-white/10 hover:text-white xl:px-4",
                          active &&
                            "text-white after:absolute after:inset-x-3 after:bottom-1 after:h-0.5 after:rounded-full after:bg-jmv-gold-text xl:after:inset-x-4",
                        )}
                      >
                        {item.name}
                      </Link>
                    </li>
                  );
                }

                const panelId = `${baseId}-${item.name}`;
                const isOpen = openSubmenu === item.name;
                const close = () => setOpenSubmenu(null);
                const onBlur = (e: FocusEvent<HTMLLIElement>) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node | null)) close();
                };
                const onKeyDown = (e: KeyboardEvent<HTMLLIElement>) => {
                  if (e.key === "Escape" && isOpen) {
                    e.stopPropagation();
                    close();
                    (e.currentTarget.querySelector("button") as HTMLButtonElement | null)?.focus();
                  }
                };

                return (
                  <li
                    key={item.name}
                    className="relative"
                    onMouseEnter={() => setOpenSubmenu(item.name)}
                    onMouseLeave={close}
                    onBlur={onBlur}
                    onKeyDown={onKeyDown}
                  >
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpenSubmenu(isOpen ? null : item.name)}
                      className={cn(
                        "relative flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold text-white/90 hover:bg-white/10 hover:text-white xl:px-4",
                        (active || isOpen) && "text-white",
                        active &&
                          "after:absolute after:inset-x-3 after:bottom-1 after:h-0.5 after:rounded-full after:bg-jmv-gold-text xl:after:inset-x-4",
                      )}
                    >
                      {item.name}
                      <ChevronDown
                        aria-hidden
                        className={cn(
                          "ml-1 h-4 w-4 transition-transform duration-200",
                          isOpen && "rotate-180",
                        )}
                      />
                    </button>

                    {/* pt-2 mantiene el hover al bajar el puntero hacia el panel */}
                    <div id={panelId} hidden={!isOpen} className="absolute left-0 top-full w-60 pt-2">
                      <ul
                        data-surface="light"
                        className="rounded-xl border border-slate-200 bg-white py-2 shadow-2xl"
                      >
                        {item.children.map((child) => {
                          const current = isCurrent(pathname, child.href);
                          return (
                            <li key={child.href}>
                              <Link
                                href={child.href}
                                aria-current={current ? "page" : undefined}
                                className={cn(
                                  "flex min-h-11 items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-jmv-blue/10 hover:text-jmv-blue",
                                  current && "bg-jmv-blue/5 font-semibold text-jmv-blue",
                                )}
                              >
                                <span
                                  aria-hidden
                                  className={cn(
                                    "h-1.5 w-1.5 rounded-full",
                                    current ? "bg-jmv-gold" : "bg-slate-300",
                                  )}
                                />
                                {child.name}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/unete"
              aria-current={isCurrent(pathname, "/unete") ? "page" : undefined}
              className="hidden min-h-11 items-center whitespace-nowrap rounded-lg bg-jmv-gold px-5 text-sm font-bold text-jmv-ink shadow-md hover:bg-jmv-gold-text sm:inline-flex"
            >
              Únete
            </Link>

            {/* Menú móvil: Radix Dialog a pantalla completa (foco atrapado, Escape) */}
            <Dialog.Root open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <Dialog.Trigger
                aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-white hover:bg-white/10 lg:hidden"
              >
                <Menu className="h-6 w-6" aria-hidden />
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Content
                  aria-describedby={undefined}
                  className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-jmv-blue text-white lg:hidden data-[state=open]:animate-in data-[state=open]:fade-in-0"
                >
                  <Dialog.Title className="sr-only">Menú de navegación</Dialog.Title>
                  <div className="flex h-16 shrink-0 items-center justify-between gap-2 px-3 sm:h-20 sm:px-4 md:px-6">
                    {logo}
                    <Dialog.Close
                      aria-label="Cerrar menú"
                      className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-white hover:bg-white/10"
                    >
                      <X className="h-6 w-6" aria-hidden />
                    </Dialog.Close>
                  </div>

                  <nav aria-label="Principal" className="flex flex-1 flex-col px-4 pb-8 pt-2 sm:px-6">
                    <Accordion.Root
                      type="single"
                      collapsible
                      defaultValue={activeAccordion}
                      asChild
                    >
                      <ul className="flex-1 divide-y divide-white/10">
                        {navigation.map((item) => {
                          if (!item.children) {
                            const current = isCurrent(pathname, item.href!);
                            return (
                              <li key={item.name}>
                                <Link
                                  href={item.href!}
                                  aria-current={current ? "page" : undefined}
                                  onClick={() => setIsMenuOpen(false)}
                                  className={cn(
                                    "flex min-h-14 items-center rounded-lg px-3 text-lg font-semibold text-white/90 hover:bg-white/10 hover:text-white",
                                    sectionActive(item) && "text-jmv-gold-text",
                                  )}
                                >
                                  {item.name}
                                </Link>
                              </li>
                            );
                          }
                          return (
                            <Accordion.Item key={item.name} value={item.name} asChild>
                              <li>
                                <Accordion.Header asChild>
                                  <div>
                                    <Accordion.Trigger
                                      className={cn(
                                        "group flex min-h-14 w-full items-center justify-between rounded-lg px-3 text-left text-lg font-semibold text-white/90 hover:bg-white/10 hover:text-white",
                                        sectionActive(item) && "text-jmv-gold-text",
                                      )}
                                    >
                                      {item.name}
                                      <ChevronDown
                                        aria-hidden
                                        className="h-6 w-6 opacity-80 transition-transform duration-200 group-data-[state=open]:rotate-180"
                                      />
                                    </Accordion.Trigger>
                                  </div>
                                </Accordion.Header>
                                <Accordion.Content asChild>
                                  <ul className="mb-3 ml-3 border-l-2 border-jmv-gold-text/40 pl-3">
                                    {item.children.map((child) => {
                                      const current = isCurrent(pathname, child.href);
                                      return (
                                        <li key={child.href}>
                                          <Link
                                            href={child.href}
                                            aria-current={current ? "page" : undefined}
                                            onClick={() => setIsMenuOpen(false)}
                                            className={cn(
                                              "flex min-h-12 items-center rounded-md px-3 text-base text-white/85 hover:bg-white/10 hover:text-white",
                                              current && "font-semibold text-jmv-gold-text",
                                            )}
                                          >
                                            {child.name}
                                          </Link>
                                        </li>
                                      );
                                    })}
                                  </ul>
                                </Accordion.Content>
                              </li>
                            </Accordion.Item>
                          );
                        })}
                      </ul>
                    </Accordion.Root>

                    <Link
                      href="/unete"
                      onClick={() => setIsMenuOpen(false)}
                      className="mt-6 flex min-h-14 w-full items-center justify-center rounded-xl bg-jmv-gold px-6 text-lg font-bold text-jmv-ink shadow-lg hover:bg-jmv-gold-text"
                    >
                      <Heart className="mr-2 h-5 w-5" aria-hidden />
                      Únete a JMV
                    </Link>
                  </nav>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
        </div>
      </div>
    </header>
  );
}
