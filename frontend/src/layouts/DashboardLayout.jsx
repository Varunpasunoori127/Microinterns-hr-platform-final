import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { clearToken } from "../lib/api";

export default function DashboardLayout() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const signOut = () => {
    clearToken();
    localStorage.removeItem("microinterns_user");
    navigate("/");
  };

  return (
    <div style={{ ...container, flexDirection: isMobile ? "column" : "row" }}>
      
      {/* 🔥 TOPBAR FOR MOBILE */}
      {isMobile && (
        <div style={mobileTopbar}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={menuBtn}>
            ☰
          </button>
          <div style={{ fontWeight: 700 }}>MicroInterns</div>
        </div>
      )}

      {/* 🔥 SIDEBAR */}
      {(sidebarOpen || !isMobile) && (
        <div
          style={{
            ...sidebar,
            position: isMobile ? "absolute" : "relative",
            width: isMobile ? "70%" : 240,
            height: isMobile ? "100%" : "auto",
            zIndex: 1000,
          }}
        >
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
      )}

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

const mobileTopbar = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "12px 16px",
  background: "#0f172a",
  color: "white",
};

const menuBtn = {
  fontSize: 20,
  background: "none",
  border: "none",
  color: "white",
  cursor: "pointer",
};

const sidebar = {
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
  padding: 20,
};