import React, { useState, useEffect } from "react";
import api, { setToken } from "../lib/api";
import { useNavigate, useLocation } from "react-router-dom";
import GoogleLoginForm from "../components/Auth/GoogleLoginForm.jsx";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const successMessage = location.state?.message;

  const [loginType, setLoginType] = useState("hr");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState(null);
  const [debug, setDebug] = useState(""); // 🔥 DEBUG STATE
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state?.message) {
      window.history.replaceState({}, document.title);
    }
    setLoginType("hr");
    setError(null);
  }, [location]);

  function changeLoginType(type) {
    setLoginType(type);
    setEmail("");
    setPassword("");
    setError(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    setError(null);
    setDebug(""); // clear debug
    setLoading(true);

    try {
      const data = await api.post("/auth/login", { email, password });

      // 🔥 SHOW RESPONSE ON SCREEN
      setDebug(JSON.stringify(data));

      if (data?.error) {
        setError(data.error);
        return;
      }

      if (!data?.token) {
        setError("Invalid email or password.");
        return;
      }

      // ✅ SAVE TOKEN
      setToken(data.token);
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", "HR");
      localStorage.setItem("microinterns_user", JSON.stringify(data));

      navigate("/dashboard", { replace: true });

    } catch (err) {
      setDebug("ERROR: " + err.message);
      setError("Login failed. Please try again.");
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
          MicroInterns Login
        </h2>

        {successMessage && (
          <p style={{ color: "green", textAlign: "center" }}>
            {successMessage}
          </p>
        )}

        {/* LOGIN TYPE */}
        <div style={{ display: "flex", justifyContent: "center", gap: 30 }}>
          <label>
            <input
              type="radio"
              checked={loginType === "hr"}
              onChange={() => changeLoginType("hr")}
            /> HR
          </label>

          <label>
            <input
              type="radio"
              checked={loginType === "student"}
              onChange={() => changeLoginType("student")}
            /> Intern
          </label>
        </div>

        {/* HR LOGIN */}
        {loginType === "hr" && (
          <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>

            <input
              style={inputStyle}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
              }}
            />

            <input
              style={inputStyle}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
            />

            <button type="submit" style={buttonStyle} disabled={loading}>
              {loading ? "Signing in..." : "Login"}
            </button>

            <div style={{ textAlign: "center", marginTop: 12 }}>
              <span
                style={{
                  color: "#6b7280",
                  cursor: "pointer",
                  fontSize: 13
                }}
                onClick={() => navigate("/forgot-password")}
              >
                Forgot your password?
              </span>
            </div>

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

            {/* 🔥 DEBUG BOX */}
            {debug && (
              <div
                style={{
                  marginTop: 12,
                  padding: "10px",
                  background: "#e0f2fe",
                  borderRadius: 8,
                  fontSize: 12,
                 
                }}
              >
                DEBUG: {debug}
              </div>
            )}

          </form>
        )}

        {/* INTERN LOGIN */}
        {loginType === "student" && (
          <div style={{ marginTop: 25, textAlign: "center" }}>
            <GoogleLoginForm />
            <p style={{ fontSize: 13, color: "#6b7280", marginTop: 12 }}>
              Use your Google account to continue
            </p>
          </div>
        )}

        {/* SIGNUP */}
        <div style={{ marginTop: 25, textAlign: "center" }}>
          {loginType === "hr" && (
            <p style={{ fontSize: 14, color: "#374151" }}>
              Don’t have an account?{" "}
              <span
                onClick={() => navigate("/signup")}
                style={{
                  color: "#2563eb",
                  cursor: "pointer",
                  fontWeight: 500
                }}
              >
                Sign up
              </span>
            </p>
          )}
        </div>

      </div>
    </div>
  );
}