import { useState } from "react";
import { useParams } from "react-router-dom";

export default function StudentSkillsPage() {

  const { token } = useParams();

  const [skills, setSkills] = useState([
    { skill: "", level: "" }
  ]);

  const [submitted, setSubmitted] = useState(false);
  const [mentor, setMentor] = useState("");

  const addSkill = () => {
    setSkills([...skills, { skill: "", level: "" }]);
  };

  const updateSkill = (index, key, value) => {
    const updated = [...skills];
    updated[index][key] = value;
    setSkills(updated);
  };

  const submitSkills = async () => {
    const res = await fetch(`http://localhost:8080/students/skills/${token}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(skills)
    });

    const data = await res.json();

    setMentor(data.mentor);
    setSubmitted(true);
  };

  // 🎉 MATCHING RESULT SCREEN
  if (submitted) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={styles.successTitle}>🎉 You're Matched!</h2>

          <p style={styles.text}>
            Based on your skills, we’ve matched you with:
          </p>

          <h3 style={styles.mentor}>{mentor}</h3>

          <p style={styles.subText}>
            Please wait while our HR team reviews and approves your assignment.
          </p>

          <div style={styles.badge}>⏳ Pending Approval</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        <h2 style={styles.title}>Add Your Skills</h2>

        <p style={styles.desc}>
          Help us match you with the best mentor by adding your skills and experience level.
        </p>

        {skills.map((s, i) => (
          <div key={i} style={styles.row}>
            <input
              style={styles.input}
              placeholder="e.g. Java, React, Python"
              onChange={(e) => updateSkill(i, "skill", e.target.value)}
            />

            <select
              style={styles.select}
              onChange={(e) => updateSkill(i, "level", e.target.value)}
            >
              <option value="">Level</option>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>
        ))}

        <button style={styles.addBtn} onClick={addSkill}>
          + Add Another Skill
        </button>

        <button style={styles.submitBtn} onClick={submitSkills}>
          Submit Skills
        </button>

      </div>
    </div>
  );
}

/* 🎨 PROFESSIONAL STYLES */
const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #eef2ff, #f8fafc)",
    padding: "20px"
  },

  card: {
    background: "#fff",
    padding: "30px",
    borderRadius: "16px",
    width: "100%",
    maxWidth: "500px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
  },

  title: {
    fontSize: "26px",
    marginBottom: "10px",
    fontWeight: "600"
  },

  desc: {
    fontSize: "14px",
    color: "#555",
    marginBottom: "20px"
  },

  row: {
    display: "flex",
    gap: "10px",
    marginBottom: "12px"
  },

  input: {
    flex: 1,
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    outline: "none"
  },

  select: {
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    outline: "none"
  },

  addBtn: {
    width: "100%",
    padding: "12px",
    marginTop: "10px",
    borderRadius: "10px",
    border: "none",
    background: "#e0e7ff",
    color: "#1e40af",
    cursor: "pointer"
  },

  submitBtn: {
    width: "100%",
    padding: "14px",
    marginTop: "15px",
    borderRadius: "12px",
    border: "none",
    background: "#2563eb",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer"
  },

  successTitle: {
    fontSize: "24px",
    fontWeight: "600",
    marginBottom: "10px"
  },

  mentor: {
    fontSize: "22px",
    color: "#2563eb",
    margin: "15px 0"
  },

  text: {
    color: "#444"
  },

  subText: {
    color: "#666",
    fontSize: "14px"
  },

  badge: {
    marginTop: "20px",
    background: "#fef3c7",
    padding: "10px",
    borderRadius: "10px",
    textAlign: "center",
    fontWeight: "500"
  }
};