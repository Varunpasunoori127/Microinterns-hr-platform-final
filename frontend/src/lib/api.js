const API_URL = import.meta.env.VITE_API_URL;

/* ================= TOKEN HELPERS ================= */

// ✅ Save token
export const setToken = (token) => {
  localStorage.setItem("token", token);
};

// ✅ Get token
export const getToken = () => {
  return localStorage.getItem("token");
};

// ✅ Clear token (logout)
export const clearToken = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("microinterns_user"); // optional
};

/* ================= API ================= */

const api = {

  get: async (url) => {
    const res = await fetch(`${API_URL}${url}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });

    if (!res.ok) throw new Error("GET failed");

    return await res.json();
  },

  post: async (url, body) => {
    const res = await fetch(`${API_URL}${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) throw new Error("POST failed");

    return await res.json();
  },

  del: async (url) => {
    const res = await fetch(`${API_URL}${url}`, {
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