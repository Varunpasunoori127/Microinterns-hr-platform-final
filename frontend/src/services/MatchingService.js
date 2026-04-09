const API = import.meta.env.VITE_API_URL;

export const matchingService = {
  getMatches: async (studentId) => {
    const res = await fetch(`${API}/match/${studentId}`);
    return res.json();
  },

  assignMentor: async (studentId, mentorId) => {
    const res = await fetch(`${API}/assign/${studentId}/${mentorId}`, {
      method: "POST",
    });
    return res.json();
  },
};