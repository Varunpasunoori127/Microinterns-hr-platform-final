const API = import.meta.env.VITE_API_URL;

export const studentService = {
  getAll: async () => {
    const res = await fetch(`${API}/students`);
    return res.json();
  },

  getById: async (id) => {
    const res = await fetch(`${API}/students/${id}`);
    return res.json();
  },

  addStudent: async (data) => {
    const res = await fetch(`${API}/students`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  updateStudent: async (id, data) => {
    const res = await fetch(`${API}/students/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  deleteStudent: async (id) => {
    const res = await fetch(`${API}/students/${id}`, {
      method: "DELETE",
    });
    return res.json();
  },
};