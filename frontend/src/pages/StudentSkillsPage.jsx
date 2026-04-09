import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../lib/api";

export default function StudentSkillsPage() {
  const { token } = useParams();

  const [student, setStudent] = useState(null);
  const [skills, setSkills] = useState([]);
  const [skill, setSkill] = useState("");
  const [level, setLevel] = useState("Beginner");

  const [matches, setMatches] = useState([]);
  const [assignedMentor, setAssignedMentor] = useState(null);
  const [loadingMatch, setLoadingMatch] = useState(false);

  /* ---------- LOAD STUDENT ---------- */
  useEffect(() => {
    if (!token) return;

    api.get(`/students/onboarding/${token}`)
      .then((res) => {
        if (!res || !res.id) {
          alert("Student not loaded properly.");
          return;
        }
        setStudent(res);
      })
      .catch(() => {
        alert("Student not loaded properly.");
      });
  }, [token]);

  /* ---------- ADD SKILL ---------- */
  const addSkill = async () => {
    if (!skill || !student?.id) return;

    // 🔥 prevent duplicates
    if (skills.some(s => s.skill.toLowerCase() === skill.toLowerCase())) {
      return;
    }

    try {
      const res = await api.post("/student-skills", {
        studentId: student.id,
        skill,
        level
      });

      setSkills(prev => [...prev, res || { skill, level }]);
      setSkill("");
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------- REMOVE SKILL ---------- */
  const removeSkill = (index) => {
    setSkills(prev => prev.filter((_, i) => i !== index));
  };

  /* ---------- MATCH ---------- */
  const finish = async () => {
    try {
      if (!student?.id || skills.length === 0) return;

      setLoadingMatch(true);

      const data = await api.get(`/match/${student.id}`);
      setMatches(data || []);

      if (data && data.length > 0) {
        const best = data[0];

        await api.post("/match/assign", {
          studentId: student.id,
          mentorId: best.id
        });

        setAssignedMentor(best);
      }

    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMatch(false);
    }
  };

  if (!student) return <p style={{ padding: 40 }}>Loading...</p>;

  return (
    <div style={styles.container}>

      {/* HEADER */}
      <h1 style={styles.title}>🚀 Build Your Skill Profile</h1>
      <p style={styles.subtitle}>
        Add your skills to get matched with the best mentor
      </p>

      {/* COUNT */}
      <p style={styles.count}>{skills.length} skill(s) added</p>

      {/* INPUT CARD */}
      <div style={styles.card}>
        <div style={styles.inputRow}>
          <input
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addSkill()}
            placeholder="e.g. Java, React, Python"
            style={styles.input}
          />

          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            style={styles.select}
          >
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>

          <button style={styles.addBtn} onClick={addSkill}>
            Add
          </button>
        </div>
      </div>

      {/* SKILLS */}
      <div style={styles.skillsWrap}>
        {skills.map((s, i) => (
          <div key={i} style={styles.skillChip}>
            {s.skill} • {s.level}
            <span style={styles.remove} onClick={() => removeSkill(i)}>✕</span>
          </div>
        ))}
      </div>

      {/* MATCH BUTTON */}
      <button
        onClick={finish}
        disabled={loadingMatch || skills.length === 0}
        style={{
          ...styles.finishBtn,
          opacity: skills.length === 0 ? 0.5 : 1
        }}
      >
        {loadingMatch ? "Matching..." : "Find My Mentor"}
      </button>

      {/* MATCH RESULTS */}
      {matches.length > 0 && (
        <div style={styles.matchCard}>
          <h2>🎯 Top Matches</h2>

          {matches.map((m, i) => (
            <div key={i} style={styles.matchItem}>
              <div>
                <strong>{m.name}</strong>
              </div>
              <span style={styles.score}>{m.score}%</span>
            </div>
          ))}
        </div>
      )}

      {/* SUCCESS */}
      {assignedMentor && (
        <div style={styles.successCard}>
          <h2>🎉 Mentor Assigned</h2>
          <h1>{assignedMentor.name}</h1>
          <p>Match Score: {assignedMentor.score}%</p>

          <p style={styles.successText}>
            🎯 You’ve been successfully matched. Your mentor will contact you soon.
          </p>
        </div>
      )}
    </div>
  );
}

/* ---------- STYLES ---------- */

const styles = {
  container: {
    maxWidth: 800,
    margin: "auto",
    padding: 40,
    fontFamily: "Inter, sans-serif"
  },

  title: {
    fontSize: 30,
    fontWeight: 700
  },

  subtitle: {
    color: "#64748b",
    marginBottom: 10
  },

  count: {
    fontSize: 13,
    color: "#94a3b8",
    marginBottom: 20
  },

  card: {
    background: "white",
    padding: 20,
    borderRadius: 12,
    boxShadow: "0 10px 30px rgba(0,0,0,0.05)"
  },

  inputRow: {
    display: "flex",
    gap: 10
  },

  input: {
    flex: 1,
    padding: 12,
    border: "1px solid #d1d5db",
    borderRadius: 6
  },

  select: {
    padding: 12,
    borderRadius: 6
  },

  addBtn: {
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "12px 18px",
    borderRadius: 6,
    cursor: "pointer"
  },

  skillsWrap: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    marginTop: 20
  },

  skillChip: {
    background: "#e0f2fe",
    padding: "8px 12px",
    borderRadius: 20,
    fontSize: 13,
    display: "flex",
    alignItems: "center"
  },

  remove: {
    marginLeft: 8,
    cursor: "pointer",
    color: "#ef4444",
    fontWeight: 700
  },

  finishBtn: {
    marginTop: 30,
    width: "100%",
    padding: 14,
    background: "#16a34a",
    color: "white",
    border: "none",
    borderRadius: 8,
    fontSize: 16,
    cursor: "pointer"
  },

  matchCard: {
    marginTop: 40,
    padding: 20,
    background: "#f8fafc",
    borderRadius: 10
  },

  matchItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: 12,
    borderBottom: "1px solid #e5e7eb"
  },

  score: {
    fontWeight: 700,
    color: "#2563eb"
  },

  successCard: {
    marginTop: 40,
    padding: 30,
    background: "#ecfdf5",
    borderRadius: 12,
    textAlign: "center"
  },

  successText: {
    color: "#059669",
    fontWeight: 600
  }
};