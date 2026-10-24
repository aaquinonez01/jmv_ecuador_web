import { getAxiosClient } from "@/config/axios.config";
import type {
  ContactMessageItem,
  ContactMessageOrigen,
  ContactMessagesResponse,
} from "@/types/contact-message";

export async function getContactMessagesAPI(params: {
  limit?: number;
  offset?: number;
  leido?: boolean;
  origen?: ContactMessageOrigen;
}): Promise<ContactMessagesResponse> {
  const api = getAxiosClient();
  const { data } = await api.get("/contact-messages", {
    params: {
      limit: params.limit,
      offset: params.offset,
      leido: params.leido === undefined ? undefined : String(params.leido),
      origen: params.origen,
    },
  });
  return data as ContactMessagesResponse;
}

export async function markContactMessageAPI(
  id: string,
  leido: boolean
): Promise<ContactMessageItem> {
  const api = getAxiosClient();
  const { data } = await api.patch(`/contact-messages/${id}/leido`, { leido });
  return data as ContactMessageItem;
}

export async function deleteContactMessageAPI(id: string) {
  const api = getAxiosClient();
  const { data } = await api.delete(`/contact-messages/${id}`);
  return data as { message: string };
}
