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

  const [step, setStep] = useState("form");

  /* ---------- LOAD STUDENT ---------- */
  useEffect(() => {
    if (!token) return;

    api.get(`/students/onboarding/${token}`)
      .then((res) => {
        console.log("Student loaded:", res);

        if (!res) {
          alert("Student not loaded properly.");
          return;
        }

        setStudent(res);
      })
      .catch(() => {
        alert("Student not loaded properly.");
      });
  }, [token]);

  /* ---------- HELPER: GET STUDENT ID SAFELY ---------- */
  const getStudentId = () => {
    return student?.id || student?.studentId;
  };

  /* ---------- ADD SKILL ---------- */
  const addSkill = async () => {
    const studentId = getStudentId();

    if (!skill || !studentId) {
      console.log("Missing studentId or skill");
      return;
    }

    if (skills.some(s => s.skill.toLowerCase() === skill.toLowerCase())) {
      return;
    }

    try {
      const res = await api.post("/student-skills", {
        studentId: studentId,
        skill,
        level
      });

      setSkills(prev => [...prev, res || { skill, level }]);
      setSkill("");

    } catch (err) {
      console.error("Add skill error:", err);
      alert("Failed to add skill");
    }
  };

  /* ---------- REMOVE SKILL ---------- */
  const removeSkill = (index) => {
    setSkills(prev => prev.filter((_, i) => i !== index));
  };

  /* ---------- FIND MATCH ---------- */
  const findMatches = async () => {
    const studentId = getStudentId();

    if (!studentId || skills.length === 0) return;

    try {
      setLoadingMatch(true);

      const data = await api.get(`/match/${studentId}`);
      setMatches(data || []);

      setStep("match");

    } catch (err) {
      console.error("Match error:", err);
      alert("Failed to find matches");
    } finally {
      setLoadingMatch(false);
    }
  };

  /* ---------- CONFIRM ---------- */
  const confirmMentor = async () => {
    const studentId = getStudentId();

    try {
      const best = matches[0];

      await api.post("/match/assign", {
        studentId: studentId,
        mentorId: best.id
      });

      setAssignedMentor(best);
      setStep("done");

    } catch (err) {
      console.error("Assign error:", err);
      alert("Failed to assign mentor");
    }
  };

  if (!student) return <p style={{ padding: 40 }}>Loading...</p>;

  /* ================= FORM ================= */
  if (step === "form") {
    return (
      <div style={container}>
        <div style={card}>

          <div style={header}>
            <h2 style={title}>Build Your Skill Profile</h2>
            <span style={stepText}>Step 2 of 3</span>
          </div>

          <div style={progressContainer}>
            <div style={progressFill}></div>
          </div>

          <div style={inputRow}>
            <input
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addSkill()}
              placeholder="e.g. Java, React, Python"
              style={input}
            />

            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              style={select}
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>

            <button style={addBtn} onClick={addSkill}>
              Add
            </button>
          </div>

          {skills.length === 0 && (
            <p style={empty}>No skills added yet.</p>
          )}

          <div>
            {skills.map((s, i) => (
              <div key={i} style={skillTag}>
                {s.skill} • {s.level}
                <button style={removeBtn} onClick={() => removeSkill(i)}>✕</button>
              </div>
            ))}
          </div>

          <button
            onClick={findMatches}
            disabled={loadingMatch || skills.length === 0}
            style={{
              ...submitBtn,
              opacity: skills.length === 0 ? 0.5 : 1
            }}
          >
            {loadingMatch ? "Matching..." : "Find My Mentor"}
          </button>

          <p style={note}>You can update your skills later</p>

        </div>
      </div>
    );
  }

  /* ================= MATCH ================= */
  if (step === "match") {
    return (
      <div style={container}>
        <div style={card}>

          <div style={header}>
            <h2 style={title}>Recommended Mentor</h2>
            <span style={stepText}>Step 3 of 3</span>
          </div>

          <div style={progressContainer}>
            <div style={{ ...progressFill, width: "100%" }}></div>
          </div>

          {matches.length > 0 && (
            <div style={matchCard}>
              <h2>{matches[0].name}</h2>
              <p>{matches[0].score}% Match</p>
            </div>
          )}

          <button style={submitBtn} onClick={confirmMentor}>
            Confirm Mentor
          </button>

        </div>
      </div>
    );
  }

  /* ================= DONE ================= */
  if (step === "done") {
    return (
      <div style={container}>
        <div style={{ ...card, textAlign: "center" }}>
          <h2 style={{ color: "#10b981" }}>🎉 You Are Assigned!</h2>
          <h1>{assignedMentor.name}</h1>
          <p>Match Score: {assignedMentor.score}%</p>
          <p style={note}>Your mentor will contact you soon 🚀</p>
        </div>
      </div>
    );
  }
}

/* ================= STYLES ================= */

const container = {
  minHeight: "100vh",
  background: "#f8fafc",
  display: "flex",
  justifyContent: "center",
  padding: "40px 20px"
};

const card = {
  width: "100%",
  maxWidth: "700px",
  background: "white",
  padding: "30px",
  borderRadius: "16px",
  boxShadow: "0 20px 50px rgba(0,0,0,0.08)",
  border: "1px solid #f1f5f9"
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: 20
};

const title = { fontSize: 22, fontWeight: 700 };

const stepText = { fontSize: 12, color: "#64748b" };

const progressContainer = {
  height: 6,
  background: "#e5e7eb",
  borderRadius: 999,
  marginBottom: 20
};

const progressFill = {
  height: "100%",
  width: "66%",
  background: "#2563eb",
  borderRadius: 999
};

const inputRow = { display: "flex", gap: 10 };

const input = {
  flex: 1,
  padding: 12,
  borderRadius: 10,
  border: "1px solid #e2e8f0"
};

const select = {
  padding: 12,
  borderRadius: 10,
  border: "1px solid #e2e8f0"
};

const addBtn = {
  background: "#2563eb",
  color: "white",
  padding: "12px 16px",
  borderRadius: 10,
  border: "none"
};

const skillTag = {
  display: "inline-flex",
  gap: 8,
  padding: "8px 12px",
  background: "#eef2ff",
  borderRadius: 999,
  margin: 5
};

const removeBtn = {
  border: "none",
  background: "transparent",
  color: "red",
  cursor: "pointer"
};

const empty = { color: "#64748b", marginTop: 10 };

const submitBtn = {
  width: "100%",
  background: "#4b0488",
  color: "white",
  padding: 14,
  borderRadius: 12,
  border: "none",
  marginTop: 20
};

const note = {
  textAlign: "center",
  fontSize: 12,
  color: "#051e41",
  marginTop: 10
};

const matchCard = {
  background: "#eef2ff",
  padding: 20,
  borderRadius: 12,
  textAlign: "center",
  marginBottom: 20
};