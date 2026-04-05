import React, { useState } from "react";
import api from "../lib/api";
import { useNavigate } from "react-router-dom";

export default function SignupPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      await api.post("/auth/signup", { name, email, password });

      setSuccess("Account created successfully!");

      setTimeout(() => {
        navigate("/login", {
          state: {
            message: "Account created successfully. Please login."
          }
        });
      }, 1200);

    } catch (err) {
      if (err.response?.status === 409) {
        setError("Email already exists.");
      } else {
        setError("Signup failed. Please try again.");
      }
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
        <h2 style={{ textAlign: "center", marginBottom: 25 }}>
          Create Account
        </h2>

        <form onSubmit={handleSubmit} style={{ marginTop: 10 }}>

          <input
            style={inputStyle}
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError(null);
            }}
            required
          />

          <input
            style={inputStyle}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(null);
            }}
            required
          />

          <input
            style={inputStyle}
            type="password"
            placeholder="Password (min 8 characters)"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(null);
            }}
            required
          />

          <button style={buttonStyle} disabled={loading}>
            {loading ? "Creating account..." : "Sign Up"}
          </button>

          {error && (
            <div
              style={{
                marginTop: 12,
                padding: "10px",
                background: "#fee2e2",
                color: "#b91c1c",
                borderRadius: 8,
                fontSize: 13,
                textAlign: "center"
              }}
            >
              {error}
            </div>
          )}

          {success && (
            <div
              style={{
                marginTop: 12,
                padding: "10px",
                background: "#dcfce7",
                color: "#166534",
                borderRadius: 8,
                fontSize: 13,
                textAlign: "center"
              }}
            >
              {success}
            </div>
          )}
        </form>

        {/* BACK TO LOGIN */}
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