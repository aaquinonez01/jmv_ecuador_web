export type ContactMessageOrigen = "contacto" | "unete";

export interface ContactMessageItem {
  id: string;
  nombre: string;
  email: string;
  asunto: string;
  mensaje: string;
  telefono?: string | null;
  ciudad?: string | null;
  origen: ContactMessageOrigen;
  leido: boolean;
  createdAt: string;
}

export interface ContactMessagesResponse {
  total: number;
  noLeidos: number;
  limit: number;
  offset: number;
  items: ContactMessageItem[];
}
