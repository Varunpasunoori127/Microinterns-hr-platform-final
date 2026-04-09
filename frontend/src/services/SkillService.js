const API = import.meta.env.VITE_API_URL;

export const skillService = {
  getSkills: async (studentId) => {
    const res = await fetch(`${API}/skills/${studentId}`);
    return res.json();
  },

  addSkill: async (studentId, data) => {
    const res = await fetch(`${API}/skills/${studentId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  deleteSkill: async (skillId) => {
    const res = await fetch(`${API}/skills/delete/${skillId}`, {
      method: "DELETE",
    });
    return res.json();
  },
};