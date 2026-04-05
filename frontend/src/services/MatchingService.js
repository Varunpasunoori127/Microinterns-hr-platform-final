const API = "http://localhost:8080";

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