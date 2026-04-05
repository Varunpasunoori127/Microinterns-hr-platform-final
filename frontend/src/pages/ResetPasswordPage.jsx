import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../lib/api";

export default function ResetPassword() {

  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await api.post(`/auth/reset-password/${token}`, {
        newPassword: password
      });

      setMessage("Password updated successfully");

      setTimeout(() => navigate("/login"), 1500);

    } catch (err) {
      setMessage(
        err.response?.data?.error || "Invalid or expired link"
      );
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(135deg,#eef2ff,#f8fafc)"
    }}>
      <div style={{
        width: 420,
        background: "white",
        padding: 30,
        borderRadius: 16,
        boxShadow: "0 20px 50px rgba(0,0,0,0.08)"
      }}>
        <h2 style={{ textAlign: "center" }}>Reset Password</h2>

        <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>

          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            required
            style={{
              width:"100%",
              padding:12,
              borderRadius:10,
              border:"1px solid #e5e7eb",
              marginBottom:12
            }}
          />

          <button style={{
            width:"100%",
            padding:12,
            borderRadius:10,
            background:"#2563eb",
            color:"white"
          }}>
            Reset Password
          </button>
        </form>

        {message && (
          <p style={{ textAlign:"center", marginTop:12 }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}