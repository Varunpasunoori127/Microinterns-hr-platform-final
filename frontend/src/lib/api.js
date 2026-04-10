const API_URL = import.meta.env.VITE_API_URL?.trim();

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
    const cleanUrl = url.trim(); // 🔥 FIX

    console.log("GET URL:", `${API_URL}${cleanUrl}`);

    const res = await fetch(`${API_URL}${cleanUrl}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });

    if (!res.ok) throw new Error("GET failed");

    return await res.json();
  },

  post: async (url, body) => {
    const cleanUrl = url.trim(); // 🔥 FIX

    console.log("POST URL:", `${API_URL}${cleanUrl}`);

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

    return JSON.parse(text);
  },

  del: async (url) => {
    const cleanUrl = url.trim(); // 🔥 FIX

    console.log("DELETE URL:", `${API_URL}${cleanUrl}`);

    const res = await fetch(`${API_URL}${cleanUrl}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });

    if (!res.ok) throw new Error("DELETE failed");

    return await res.json();
  }

};

export default api;