import { api } from "./apiService";

export const getDashboard = () => api.get("/dashboard");
