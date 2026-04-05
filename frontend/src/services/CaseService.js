const API = "http://localhost:8080";

export const caseService = {
  getTimeline: async (studentId) => {
    const res = await fetch(`${API}/timeline/${studentId}`);
    return res.json();
  },

  addEvent: async (studentId, event) => {
    const res = await fetch(`${API}/timeline/${studentId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event }),
    });
    return res.json();
  },

  updateOwner: async (studentId, owner) => {
    const res = await fetch(`${API}/case/${studentId}/owner`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ owner }),
    });
    return res.json();
  },
};