import { Mail, MessageCircle, Phone } from "lucide-react";
import { whatsappLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

/** Convierte un teléfono ecuatoriano (09…, +593…, 593…) a E.164 sin "+" */
export function toE164Ec(phone: string): string | null {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return null;
  if (digits.startsWith("593")) return digits;
  if (digits.startsWith("0") && digits.length >= 9) return `593${digits.slice(1)}`;
  return digits.length >= 9 ? digits : null;
}

interface ContactoLinksProps {
  telefono?: string | null;
  email?: string | null;
  /** Nombre del grupo o persona, para el mensaje de WhatsApp */
  nombre?: string;
  className?: string;
}

// Teléfono, WhatsApp y correo como enlaces reales (tel:, wa.me, mailto:)
export default function ContactoLinks({ telefono, email, nombre, className }: ContactoLinksProps) {
  const e164 = telefono ? toE164Ec(telefono) : null;
  if (!telefono && !email) return null;

  const linkClass =
    "inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-sm text-slate-200 underline-offset-4 hover:bg-white/10 hover:text-white hover:underline";

  return (
    <ul className={cn("flex flex-wrap gap-x-2 gap-y-1", className)}>
      {telefono && (
        <li>
          <a href={e164 ? `tel:+${e164}` : `tel:${telefono}`} className={linkClass}>
            <Phone className="h-4 w-4 text-jmv-gold-text" aria-hidden />
            <span className="sr-only">Llamar al </span>
            {telefono}
          </a>
        </li>
      )}
      {e164 && (
        <li>
          <a
            href={whatsappLink(
              nombre ? `Hola, quisiera información sobre ${nombre} de JMV.` : "Hola, quisiera información sobre JMV.",
              e164,
            )}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            <MessageCircle className="h-4 w-4 text-jmv-gold-text" aria-hidden />
            WhatsApp
            <span className="sr-only"> (se abre en una pestaña nueva)</span>
          </a>
        </li>
      )}
      {email && (
        <li>
          <a href={`mailto:${email}`} className={cn(linkClass, "break-all")}>
            <Mail className="h-4 w-4 shrink-0 text-jmv-gold-text" aria-hidden />
            <span className="sr-only">Escribir a </span>
            {email}
          </a>
        </li>
      )}
    </ul>
  );
}
