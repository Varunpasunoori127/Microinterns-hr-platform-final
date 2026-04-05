import { useState } from "react";
import api from "../lib/api";

export default function MentorPage() {

  const [name, setName] = useState("");
  const [expertise, setExpertise] = useState("");
  const [message, setMessage] = useState("");

  const addMentor = async () => {
    if (!name || !expertise) {
      setMessage("⚠️ Please fill all fields");
      return;
    }

    try {
      await api.post("/mentors", { name, expertise });

      setMessage("✅ Mentor added successfully");
      setName("");
      setExpertise("");
    } catch {
      setMessage("❌ Failed to add mentor");
    }
  };

  return (
    <div style={styles.container}>

      <div style={styles.card}>

        <h1 style={styles.title}>👨‍🏫 Mentor Management</h1>

        <p style={styles.subtitle}>
          Add mentors and define their expertise to enable smart student matching.
        </p>

        {message && <div style={styles.alert}>{message}</div>}

        <div style={styles.form}>

          <input
            style={styles.input}
            placeholder="Mentor Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            style={styles.input}
            placeholder="Expertise (React, Java, AI...)"
            value={expertise}
            onChange={(e) => setExpertise(e.target.value)}
          />

          <button style={styles.button} onClick={addMentor}>
            + Add Mentor
          </button>

        </div>

      </div>

    </div>
  );
}

/* 🎨 MODERN STYLES */

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg,#eef2ff,#f8fafc)"
  },

  card: {
    background: "white",
    padding: 40,
    borderRadius: 16,
    width: "100%",
    maxWidth: 500,
    boxShadow: "0 12px 30px rgba(0,0,0,0.1)"
  },

  title: {
    fontSize: 28,
    fontWeight: 700,
    marginBottom: 10
  },

  subtitle: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 20
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: 12
  },

  input: {
    padding: 14,
    borderRadius: 10,
    border: "1px solid #e2e8f0",
    fontSize: 14,
    outline: "none"
  },

  button: {
    marginTop: 10,
    padding: 14,
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: 12,
    fontWeight: 600,
    cursor: "pointer"
  },

  alert: {
    padding: 10,
    borderRadius: 8,
    background: "#ecfdf5",
    color: "#065f46",
    marginBottom: 10
  }
};