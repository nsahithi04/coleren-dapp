import { api } from "./apiService";

export const updateSettings = async (data) => {
  const res = await api.patch("/profiles/settings", data);
  return res.data;
};
