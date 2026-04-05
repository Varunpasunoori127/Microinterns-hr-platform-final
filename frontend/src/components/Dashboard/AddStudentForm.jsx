import { useState } from "react";

export default function AddStudentForm({ onSubmit, onClose }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    organisation: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔥 basic validation
    if (!form.name || !form.email || !form.organisation) {
      setError("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // 🔥 support async submit
      await onSubmit(form);

      // ✅ close modal after success
      onClose();

    } catch (err) {
      setError("Failed to add student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={overlay} onClick={onClose}>
      <div style={modal} onClick={(e) => e.stopPropagation()}>
        
        <h2 style={{ fontWeight: 700 }}>Add New Student</h2>

        <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>

          <label style={label}>Full Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            style={input}
            placeholder="Enter full name"
          />

          <label style={label}>Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            style={input}
            placeholder="Enter email"
          />

          <label style={label}>Organisation</label>
          <input
            name="organisation"
            value={form.organisation}
            onChange={handleChange}
            style={input}
            placeholder="Enter organisation"
          />

          {/* 🔴 ERROR MESSAGE */}
          {error && (
            <div style={errorBox}>
              {error}
            </div>
          )}

          <div style={{ marginTop: 20, display: "flex", gap: 10 }}>

            <button type="submit" style={primaryBtn} disabled={loading}>
              {loading ? "Adding..." : "Add Student"}
            </button>

            <button
              type="button"
              style={cancelBtn}
              onClick={onClose}
            >
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

const errorBox = {
  background: "#fee2e2",
  color: "#b91c1c",
  padding: 10,
  borderRadius: 8,
  fontSize: 13,
  marginBottom: 10,
};