// Texto iCalendar (RFC 5545) compartido por el .ics de un evento y el feed del Año Vicenciano.

/** Escapa TEXT según RFC 5545 §3.3.11 */
export function escapeText(text: string) {
  return text
    .replace(/\r\n?/g, "\n")
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

const encoder = new TextEncoder();

/** Pliega a 75 octetos (RFC 5545 §3.1) sin partir caracteres UTF-8 */
export function fold(line: string) {
  if (encoder.encode(line).length <= 75) return line;
  const parts: string[] = [];
  let current = "";
  let bytes = 0;
  // Las líneas de continuación empiezan con un espacio, que cuenta en sus 75 octetos
  let limit = 75;
  for (const char of line) {
    const size = encoder.encode(char).length;
    if (bytes + size > limit) {
      parts.push(current);
      current = "";
      bytes = 0;
      limit = 74;
    }
    current += char;
    bytes += size;
  }
  parts.push(current);
  return parts.join("\r\n ");
}

/** Une las líneas plegadas con CRLF, incluido el CRLF final */
export function joinLines(lines: string[]) {
  return lines.map(fold).join("\r\n") + "\r\n";
}
