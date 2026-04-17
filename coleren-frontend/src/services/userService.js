import { api } from "./apiService";

export const createUser = (data) => api.post("/users", data);
export const getUser = () => api.get("/users/user");
export const getMyProfile = () => api.get("/profiles/me");
export const updateMyProfile = (data) => api.patch("/profiles/me", data);
export const createProfile = (data) => api.post("/profiles/create", data);
export const updateOnboarding = (data) =>
  api.patch("/profiles/onboarding", data);
