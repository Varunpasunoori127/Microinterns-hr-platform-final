const API_URL = import.meta.env.VITE_API_URL?.trim() || "";

/* ================= TOKEN HELPERS ================= */

export const setToken = (token) => {
  localStorage.setItem("token", token);
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const clearToken = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("microinterns_user");
};

/* ================= API ================= */

const api = {

  get: async (url) => {
    const cleanUrl = url.trim();

    const res = await fetch(`${API_URL}${cleanUrl}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });

    const text = await res.text();

    if (!res.ok) {
      throw new Error(text || "GET failed");
    }

    return text ? JSON.parse(text) : {};
  },

  post: async (url, body) => {
    const cleanUrl = url.trim();

    const res = await fetch(`${API_URL}${cleanUrl}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify(body)
    });

    const text = await res.text();

    if (!res.ok) {
      throw new Error(text || "POST failed");
    }

    return text ? JSON.parse(text) : {};
  },

  del: async (url) => {
    const cleanUrl = url.trim();

    const res = await fetch(`${API_URL}${cleanUrl}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });

    const text = await res.text();

    if (!res.ok) {
      throw new Error(text || "DELETE failed");
    }

    return text ? JSON.parse(text) : {};
  }

};

export default api;