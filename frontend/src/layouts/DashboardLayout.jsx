import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { clearToken } from "../lib/api";

export default function DashboardLayout() {
  const navigate = useNavigate();

  const signOut = () => {
    clearToken();
    localStorage.removeItem("microinterns_user");
    navigate("/");
  };

  return (
    <div className="container">
      {/* 🔥 DARK SIDEBAR ONLY */}
      <div style={sidebar}>
        <div style={logo}>MicroInterns</div>

        <div style={nav}>
          <NavItem label="Dashboard" onClick={() => navigate("/dashboard")} />
          <NavItem label="Students" onClick={() => navigate("/dashboard")} />
          <NavItem label="Mentors" onClick={() => navigate("/mentors")} />
          <NavItem label="Reports" onClick={() => navigate("/reports")} />
          <NavItem label="Settings" onClick={() => navigate("/settings")} />
        </div>

        <div style={logout} onClick={signOut}>
          Logout
        </div>
      </div>

      {/* 🔥 MAIN CONTENT */}
      <div style={main}>
        <Outlet />
      </div>
    </div>
  );
}

/* ---------- NAV ITEM ---------- */

function NavItem({ label, onClick }) {
  return (
    <div style={navItem} onClick={onClick}>
      {label}
    </div>
  );
}

/* ---------- STYLES ---------- */

const container = {
  display: "flex",
  minHeight: "100vh",
  background: "#f8fafc",
};

const sidebar = {
  width: 240,
  background: "#0f172a",
  color: "white",
  padding: 24,
  display: "flex",
  flexDirection: "column",
};

const logo = {
  fontSize: 20,
  fontWeight: 800,
  marginBottom: 30,
};

const nav = {
  display: "flex",
  flexDirection: "column",
  gap: 10,
};

const navItem = {
  padding: "10px 14px",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: 600,
  color: "#cbd5f5",
};

const logout = {
  marginTop: "auto",
  padding: "10px 14px",
  borderRadius: 8,
  background: "#1e293b",
  cursor: "pointer",
};

const main = {
  flex: 1,
  padding: 30,
};