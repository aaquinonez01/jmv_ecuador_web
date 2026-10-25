// Fuentes de una fecha: las URLs se muestran como enlaces con su dominio.

const isUrl = (part: string) => /^https?:\/\//.test(part);

function hostLabel(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export default function SourceList({ source }: { source: string }) {
  const parts = source
    .split(";")
    .map((p) => p.trim())
    .filter(Boolean);

  // Si un dominio se repite, se numera para que cada enlace tenga un nombre distinto
  const hosts = parts.filter(isUrl).map(hostLabel);
  const seen = new Map<string, number>();
  const labels = parts.map((part) => {
    if (!isUrl(part)) return part;
    const host = hostLabel(part);
    const n = (seen.get(host) ?? 0) + 1;
    seen.set(host, n);
    return hosts.filter((h) => h === host).length > 1 ? `${host} (${n})` : host;
  });

  return (
    <p className="[overflow-wrap:anywhere]">
      <span className="font-semibold text-fg-muted">{parts.length > 1 ? "Fuentes:" : "Fuente:"}</span>{" "}
      {parts.map((part, i) => (
        <span key={i}>
          {i > 0 && " · "}
          {isUrl(part) ? (
            <a
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block py-3 underline decoration-fg/40 underline-offset-4 hover:text-fg hover:decoration-fg"
            >
              {labels[i]}
              <span className="sr-only"> (se abre en una pestaña nueva)</span>
            </a>
          ) : (
            part
          )}
        </span>
      ))}
    </p>
  );
}
