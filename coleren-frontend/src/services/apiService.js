import { auth } from "../../firebase";

const BASE_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = async () => {
  const user = await new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      resolve(user);
    });
  });

  const token = await user?.getIdToken();

  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const publicHeaders = {
  "Content-Type": "application/json",
};

export const api = {
  get: async (endpoint) => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}${endpoint}`, { headers });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  post: async (endpoint, body) => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  publicPost: async (endpoint, body) => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: publicHeaders,
      body: JSON.stringify(body),
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  patch: async (endpoint, body) => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(body),
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },
};
