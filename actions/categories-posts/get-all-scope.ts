"SWuse server";

import { getAxiosClient } from "@/config/axios.config";

export const getAllScope = async () => {
  const response = await getAxiosClient().get("/category-post/scopes");
  return response.data;
};
