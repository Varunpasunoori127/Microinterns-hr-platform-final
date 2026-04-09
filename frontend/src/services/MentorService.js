const API = import.meta.env.VITE_API_URL;

export const mentorService = {
  getAll: async () => {
    const res = await fetch(`${API}/mentors`);
    return res.json();
  },

  addMentor: async (data) => {
    const res = await fetch(`${API}/mentors`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  deleteMentor: async (id) => {
    const res = await fetch(`${API}/mentors/${id}`, {
      method: "DELETE",
    });
    return res.json();
  },
};