// Parser del texto de los Estatutos (Markdown con convenciones fijas).
// Lo usan la página pública y la vista previa del admin. Sin dependencias de
// React ni de Next: se puede probar con node.
//
//   # Título del documento
//   > Preámbulo o carta de aprobación (párrafos separados por "> " vacío)
//   ## Capítulo I · Identidad
//   ### Artículo 1 · Constitución
//   1.1 Numeral en una sola línea
//   Texto suelto: párrafo
//   - Viñeta
//     - Subviñeta (dos espacios)
//   *cursiva*

export interface StatuteListItem {
  text: string;
  children?: StatuteListItem[];
}

export type StatuteBlock =
  | { type: "numeral"; label: string; text: string }
  | { type: "p"; text: string }
  | { type: "list"; items: StatuteListItem[] };

export interface StatuteArticle {
  /** "5", tal como aparece en el encabezado */
  number: string;
  title: string;
  /** Ancla: "articulo-5" */
  id: string;
  blocks: StatuteBlock[];
}

export interface StatuteChapter {
  /** Ancla: "capitulo-i" */
  id: string;
  /** "I" */
  numeral: string;
  title: string;
  articles: StatuteArticle[];
}

export interface ParsedStatutes {
  title: string;
  preamble: string[];
  chapters: StatuteChapter[];
  closing?: string;
}

export interface StatuteIssue {
  /** Línea del texto (1 = primera), si aplica */
  line?: number;
  message: string;
}

const TITLE_RE = /^#\s+(.+)$/;
const CHAPTER_RE = /^##\s+cap[ií]tulo\s+([ivxlcdm]+|\d+)\b\s*(?:[·:.\-–—]\s*)?(.*)$/i;
const ARTICLE_RE = /^###\s+art[ií]culo\s+(\d+[a-z]?)\b\s*(?:[·:.\-–—]\s*)?(.*)$/i;
const NUMERAL_RE = /^(\d+(?:\.\d+)+)\.?\s+(.+)$/;
const BULLET_RE = /^(\s*)(?:[-•–]|\*(?=\s))\s+(.*)$/;
const QUOTE_RE = /^\s*>\s?(.*)$/;
const CLOSING_RE = /^estatutos\s+aprobad/i;

export function articleAnchor(number: string) {
  return `articulo-${number.toLowerCase()}`;
}

export function chapterAnchor(numeral: string) {
  return `capitulo-${numeral.toLowerCase() || "0"}`;
}

function clean(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

function uniqueId(base: string, used: Set<string>) {
  let id = base;
  for (let n = 2; used.has(id); n++) id = `${base}-${n}`;
  used.add(id);
  return id;
}

interface ParseState {
  doc: ParsedStatutes;
  chapter: StatuteChapter | null;
  article: StatuteArticle | null;
  used: Set<string>;
  /** Párrafo del preámbulo que se está armando */
  quote: string[];
  /** Pila de viñetas abiertas (una por nivel de sangría) */
  listStack: StatuteListItem[][];
}

function flushQuote(state: ParseState) {
  if (state.quote.length) {
    state.doc.preamble.push(clean(state.quote.join(" ")));
    state.quote = [];
  }
}

function ensureArticle(state: ParseState): StatuteArticle {
  if (state.article) return state.article;
  // Texto sin artículo: se agrupa en un artículo sin número para no perderlo
  const chapter = ensureChapter(state);
  const article: StatuteArticle = {
    number: "",
    title: "",
    id: uniqueId(`${chapter.id}-texto`, state.used),
    blocks: [],
  };
  chapter.articles.push(article);
  state.article = article;
  return article;
}

function ensureChapter(state: ParseState): StatuteChapter {
  if (state.chapter) return state.chapter;
  const chapter: StatuteChapter = {
    id: uniqueId(chapterAnchor(""), state.used),
    numeral: "",
    title: "",
    articles: [],
  };
  state.doc.chapters.push(chapter);
  state.chapter = chapter;
  return chapter;
}

function pushBullet(state: ParseState, indent: number, text: string) {
  const article = ensureArticle(state);
  const last = article.blocks[article.blocks.length - 1];
  if (!(last && last.type === "list" && state.listStack[0] === last.items)) {
    const items: StatuteListItem[] = [];
    article.blocks.push({ type: "list", items });
    state.listStack = [items];
  }
  // Dos espacios por nivel; nunca se baja más de un nivel de golpe
  const stack = state.listStack;
  let level = Math.min(Math.floor(indent / 2), stack.length);
  if (level === stack.length) {
    const parentList = stack[level - 1];
    const parent = parentList[parentList.length - 1];
    if (parent) {
      parent.children = parent.children ?? [];
      stack.push(parent.children);
    } else {
      level -= 1;
    }
  }
  stack.length = level + 1;
  stack[level].push({ text: clean(text) });
}

/** Convierte el texto Markdown de los estatutos en una estructura navegable. */
export function parseStatutes(md: string): ParsedStatutes {
  const state: ParseState = {
    doc: { title: "", preamble: [], chapters: [] },
    chapter: null,
    article: null,
    used: new Set(),
    quote: [],
    listStack: [],
  };

  const lines = (md ?? "").replace(/\r\n?/g, "\n").replace(/\t/g, "  ").split("\n");

  for (const raw of lines) {
    const line = raw.replace(/\s+$/, "");
    const trimmed = line.trim();

    // Las líneas vacías no cortan una lista: una viñeta tras un espacio sigue en ella
    if (!trimmed) continue;

    // Preámbulo: solo antes del primer capítulo o artículo
    const quote = QUOTE_RE.exec(line);
    if (quote && !state.chapter && !state.article) {
      const text = quote[1].trim();
      if (text) state.quote.push(text);
      else flushQuote(state);
      continue;
    }
    flushQuote(state);

    const chapter = CHAPTER_RE.exec(trimmed);
    if (chapter) {
      const numeral = chapter[1].toUpperCase();
      state.chapter = {
        id: uniqueId(chapterAnchor(numeral), state.used),
        numeral,
        title: clean(chapter[2]),
        articles: [],
      };
      state.doc.chapters.push(state.chapter);
      state.article = null;
      state.listStack = [];
      continue;
    }

    const article = ARTICLE_RE.exec(trimmed);
    if (article) {
      const number = article[1];
      state.article = {
        number,
        title: clean(article[2]),
        id: uniqueId(articleAnchor(number), state.used),
        blocks: [],
      };
      ensureChapter(state).articles.push(state.article);
      state.listStack = [];
      continue;
    }

    const title = TITLE_RE.exec(trimmed);
    if (title && !state.doc.title && !state.chapter) {
      state.doc.title = clean(title[1]);
      continue;
    }
    // Otros encabezados (####, ## sin "Capítulo"): se tratan como párrafo sin las almohadillas
    const text = trimmed.replace(/^#{1,6}\s+/, "");

    const bullet = BULLET_RE.exec(line);
    if (bullet) {
      pushBullet(state, bullet[1].length, bullet[2]);
      continue;
    }
    state.listStack = [];

    // Antes del primer capítulo, el texto suelto también es preámbulo
    if (!state.chapter && !state.article) {
      state.doc.preamble.push(clean(text));
      continue;
    }

    const numeral = NUMERAL_RE.exec(text);
    if (numeral) {
      ensureArticle(state).blocks.push({ type: "numeral", label: numeral[1], text: clean(numeral[2]) });
      continue;
    }
    ensureArticle(state).blocks.push({ type: "p", text: clean(text) });
  }
  flushQuote(state);

  // La línea de cierre ("Estatutos aprobados el…") va aparte, al final
  const lastChapter = state.doc.chapters[state.doc.chapters.length - 1];
  const lastArticle = lastChapter?.articles[lastChapter.articles.length - 1];
  const lastBlock = lastArticle?.blocks[lastArticle.blocks.length - 1];
  if (lastArticle && lastBlock?.type === "p" && CLOSING_RE.test(lastBlock.text)) {
    state.doc.closing = lastBlock.text;
    lastArticle.blocks.pop();
  }

  return state.doc;
}

/** "1 artículo", "45 artículos" */
export function countLabel(n: number, singular: string, plural: string) {
  return `${n} ${n === 1 ? singular : plural}`;
}

/** Todos los artículos en orden */
export function allArticles(doc: ParsedStatutes): StatuteArticle[] {
  return doc.chapters.flatMap((c) => c.articles);
}

/** Avisos para el editor del admin: no impiden guardar */
export function validateStatutes(md: string): StatuteIssue[] {
  const issues: StatuteIssue[] = [];
  const lines = (md ?? "").replace(/\r\n?/g, "\n").split("\n");
  const articleLines = new Map<string, number[]>();
  const numeralLines = new Map<string, number[]>();
  let currentArticle: string | null = null;
  let hasTitle = false;
  let hasChapter = false;

  lines.forEach((raw, i) => {
    const lineNo = i + 1;
    const trimmed = raw.trim();
    if (!trimmed) return;
    if (TITLE_RE.test(trimmed) && !hasChapter) {
      hasTitle = true;
      return;
    }
    if (CHAPTER_RE.test(trimmed)) {
      hasChapter = true;
      const m = CHAPTER_RE.exec(trimmed)!;
      if (!clean(m[2])) issues.push({ line: lineNo, message: `El capítulo ${m[1].toUpperCase()} no tiene título.` });
      return;
    }
    const article = ARTICLE_RE.exec(trimmed);
    if (article) {
      currentArticle = article[1];
      articleLines.set(currentArticle, [...(articleLines.get(currentArticle) ?? []), lineNo]);
      if (!hasChapter) issues.push({ line: lineNo, message: `El artículo ${currentArticle} está antes del primer capítulo.` });
      if (!clean(article[2])) issues.push({ line: lineNo, message: `El artículo ${currentArticle} no tiene título.` });
      return;
    }
    if (/^#{2,6}\s/.test(trimmed)) {
      issues.push({
        line: lineNo,
        message: "Encabezado no reconocido. Usa «## Capítulo I · Título» o «### Artículo 1 · Título».",
      });
      return;
    }
    const numeral = NUMERAL_RE.exec(trimmed);
    if (numeral && currentArticle) {
      const label = numeral[1];
      numeralLines.set(label, [...(numeralLines.get(label) ?? []), lineNo]);
      if (label.split(".")[0] !== currentArticle) {
        issues.push({ line: lineNo, message: `El numeral ${label} está dentro del artículo ${currentArticle}.` });
      }
    }
    if ((trimmed.match(/\*/g)?.length ?? 0) % 2 === 1 && !BULLET_RE.test(raw)) {
      issues.push({ line: lineNo, message: "Hay un asterisco sin cerrar: la cursiva va entre *dos asteriscos*." });
    }
  });

  if (!hasTitle) issues.unshift({ message: "Falta el título del documento: empieza con «# Estatutos…»." });
  if (articleLines.size === 0) {
    issues.unshift({ message: "No hay artículos. Cada uno empieza con «### Artículo 1 · Título»." });
  }
  for (const [number, at] of articleLines) {
    if (at.length > 1) issues.push({ line: at[1], message: `El artículo ${number} aparece ${at.length} veces (líneas ${at.join(", ")}).` });
  }
  for (const [label, at] of numeralLines) {
    if (at.length > 1) issues.push({ line: at[1], message: `El numeral ${label} se repite (líneas ${at.join(", ")}).` });
  }
  return issues.sort((a, b) => (a.line ?? 0) - (b.line ?? 0));
}

// --- Texto en línea y búsqueda -------------------------------------------------

export interface InlineSegment {
  text: string;
  em?: boolean;
}

/** Separa las *cursivas*; un asterisco suelto se deja como texto */
export function parseInline(text: string): InlineSegment[] {
  const segments: InlineSegment[] = [];
  const re = /\*([^*\n]+?)\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) segments.push({ text: text.slice(last, m.index) });
    segments.push({ text: m[1], em: true });
    last = m.index + m[0].length;
  }
  if (last < text.length) segments.push({ text: text.slice(last) });
  return segments;
}

/** Texto sin marcas de cursiva */
export function plainText(text: string) {
  return parseInline(text)
    .map((s) => s.text)
    .join("");
}

/** Minúsculas y sin tildes, carácter a carácter (conserva la longitud) */
export function normalizeForSearch(value: string) {
  let out = "";
  for (const ch of value) {
    const n = ch.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
    out += n.length === 1 ? n : ch.length === 1 ? (n[0] ?? ch) : ch;
  }
  return out;
}

/** Rangos [inicio, fin) donde aparece la búsqueda, ignorando tildes y mayúsculas */
export function matchRanges(text: string, query: string): [number, number][] {
  const q = normalizeForSearch(query.trim());
  if (!q) return [];
  const hay = normalizeForSearch(text);
  const ranges: [number, number][] = [];
  let from = 0;
  for (;;) {
    const at = hay.indexOf(q, from);
    if (at === -1) break;
    ranges.push([at, at + q.length]);
    from = at + q.length;
  }
  return ranges;
}

/** Texto plano de un artículo (para buscar y contar coincidencias) */
export function articleSearchText(article: StatuteArticle): string[] {
  const parts = [article.number ? `Artículo ${article.number}` : "", article.title];
  const walk = (items: StatuteListItem[]) => {
    for (const item of items) {
      parts.push(plainText(item.text));
      if (item.children) walk(item.children);
    }
  };
  for (const block of article.blocks) {
    if (block.type === "list") walk(block.items);
    else parts.push(block.type === "numeral" ? `${block.label} ${plainText(block.text)}` : plainText(block.text));
  }
  return parts.filter(Boolean);
}

export function countMatches(article: StatuteArticle, query: string) {
  return articleSearchText(article).reduce((sum, part) => sum + matchRanges(part, query).length, 0);
}
