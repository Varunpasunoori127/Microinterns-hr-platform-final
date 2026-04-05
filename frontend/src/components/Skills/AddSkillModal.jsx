import { useState } from "react";

export default function AddSkillModal({ onSubmit, onClose }) {
  const [skill, setSkill] = useState("");
  const [level, setLevel] = useState("Beginner");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ skill, level });
  };

  return (
    <div style={overlay}>
      <div style={modal}>
        <h2 style={{ fontWeight: 700 }}>Add Skill</h2>

        <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
          <label style={label}>Skill Name</label>
          <input
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            style={input}
            required
          />

          <label style={label}>Skill Level</label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            style={input}
          >
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>

          <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
            <button type="submit" style={primaryBtn}>
              Add Skill
            </button>
            <button type="button" style={cancelBtn} onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* STYLES */
const overlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modal = {
  background: "white",
  padding: 30,
  borderRadius: 12,
  width: 400,
  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
};

const label = {
  display: "block",
  marginBottom: 6,
  fontWeight: 600,
  color: "#334155",
};

const input = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 8,
  border: "1px solid #cbd5e1",
  marginBottom: 15,
};

const primaryBtn = {
  background: "#2563eb",
  color: "white",
  padding: "10px 16px",
  borderRadius: 8,
  border: "none",
  cursor: "pointer",
  fontWeight: 600,
};

const cancelBtn = {
  background: "#e2e8f0",
  color: "#334155",
  padding: "10px 16px",
  borderRadius: 8,
  border: "none",
  cursor: "pointer",
  fontWeight: 600,
};