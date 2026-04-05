import React, { useState } from "react";
import api from "../lib/api";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await api.post("/auth/forgot-password", { email });
      setMessage("Reset link sent to your email");
    } catch {
      setMessage("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = {
    width: "100%",
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    outline: "none",
    fontSize: "14px",
    marginTop: "12px",
    background: "#f9fafb"
  };

  const buttonStyle = {
    width: "100%",
    padding: "14px",
    borderRadius: "12px",
    border: "none",
    background: "#2563eb",
    color: "white",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "18px"
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#eef2ff,#f8fafc)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 20
      }}
    >
      <div
        style={{
          width: 420,
          background: "white",
          borderRadius: 20,
          padding: "40px 36px",
          boxShadow: "0 20px 50px rgba(0,0,0,0.08)"
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: 20 }}>
          Forgot Password
        </h2>

        <p style={{ textAlign: "center", fontSize: 14, color: "#6b7280" }}>
          Enter your email and we’ll send you a reset link
        </p>

        <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>

          <input
            style={inputStyle}
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button style={buttonStyle} disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

        </form>

        {message && (
          <div
            style={{
              marginTop: 15,
              padding: "10px",
              borderRadius: 8,
              background: "#eef2ff",
              textAlign: "center",
              fontSize: 13
            }}
          >
            {message}
          </div>
        )}

        {/* 🔙 Back to login */}
        <div style={{ marginTop: 20, textAlign: "center" }}>
          <span
            style={{
              color: "#2563eb",
              cursor: "pointer",
              fontSize: 14
            }}
            onClick={() => navigate("/login")}
          >
            Back to login
          </span>
        </div>
      </div>
    </div>
  );
}