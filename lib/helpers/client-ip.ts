import { BlockList, isIPv6 } from "node:net";

// IP del visitante en las rutas de Next. CF-Connecting-IP solo vale si la petición
// llegó desde Cloudflare: la última entrada de X-Forwarded-For la pone el proxy
// (Nginx Proxy Manager) con la IP que lo contactó, y debe ser de Cloudflare.

// Rangos publicados en https://www.cloudflare.com/ips/ (revisar si cambian)
const CLOUDFLARE_RANGES: [string, number, "ipv4" | "ipv6"][] = [
  ["173.245.48.0", 20, "ipv4"],
  ["103.21.244.0", 22, "ipv4"],
  ["103.22.200.0", 22, "ipv4"],
  ["103.31.4.0", 22, "ipv4"],
  ["141.101.64.0", 18, "ipv4"],
  ["108.162.192.0", 18, "ipv4"],
  ["190.93.240.0", 20, "ipv4"],
  ["188.114.96.0", 20, "ipv4"],
  ["197.234.240.0", 22, "ipv4"],
  ["198.41.128.0", 17, "ipv4"],
  ["162.158.0.0", 15, "ipv4"],
  ["104.16.0.0", 13, "ipv4"],
  ["104.24.0.0", 14, "ipv4"],
  ["172.64.0.0", 13, "ipv4"],
  ["131.0.72.0", 22, "ipv4"],
  ["2400:cb00::", 32, "ipv6"],
  ["2606:4700::", 32, "ipv6"],
  ["2803:f800::", 32, "ipv6"],
  ["2405:b500::", 32, "ipv6"],
  ["2405:8100::", 32, "ipv6"],
  ["2a06:98c0::", 29, "ipv6"],
  ["2c0f:f248::", 32, "ipv6"],
];

const cloudflare = new BlockList();
for (const [net, prefix, type] of CLOUDFLARE_RANGES) cloudflare.addSubnet(net, prefix, type);

const normalizeIp = (ip: string) => ip.trim().replace(/^::ffff:(?=\d+\.)/, "");

function isCloudflareIp(ip: string) {
  if (!ip) return false;
  try {
    return cloudflare.check(ip, isIPv6(ip) ? "ipv6" : "ipv4");
  } catch {
    return false;
  }
}

/** Cabeceras para que el límite del backend cuente por visitante y no por la IP de Next */
export function clientIpHeaders(request: Request): Record<string, string> {
  const xff = request.headers.get("x-forwarded-for") ?? "";
  const hops = xff.split(",").map(normalizeIp).filter(Boolean);
  const peer = hops.at(-1) ?? "";
  const cf = normalizeIp(request.headers.get("cf-connecting-ip") ?? "");
  const clientIp = cf && isCloudflareIp(peer) ? cf : peer;

  const headers: Record<string, string> = {};
  const key = process.env.INTERNAL_PROXY_KEY;
  if (key && clientIp) {
    headers["x-internal-key"] = key;
    headers["x-client-ip"] = clientIp;
    return headers;
  }
  // Sin clave: el backend vuelve a comprobar que la última entrada sea de Cloudflare
  if (xff) headers["x-forwarded-for"] = xff;
  if (cf && isCloudflareIp(peer)) headers["cf-connecting-ip"] = cf;
  return headers;
}
