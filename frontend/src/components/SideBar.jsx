import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Sidebar() {
  const base = {
    padding: "12px 18px",
    display: "flex",
    alignItems: "center",
    gap: 12,
    fontWeight: 600,
    color: "#334155",
    textDecoration: "none",
    borderRadius: 8,
    marginBottom: 6
  };

  const active = {
    background: "#e0e7ff",
    color: "#1e40af"
  };

  return (
    <div style={{
      width: 240,
      background: "white",
      borderRight: "1px solid #e2e8f0",
      padding: 20,
      display: "flex",
      flexDirection: "column",
      height: "100vh"
    }}>

      {/* LOGO */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 30 }}>
        <img src={logo} alt="logo" style={{ height: 32 }} />
        <h2 style={{ fontWeight: 800 }}>MicroInterns</h2>
      </div>

      {/* NAV LINKS */}
      <NavLink to="/dashboard" style={base} activeStyle={active}>
        🏠 Dashboard
      </NavLink>

      <NavLink to="/mentors" style={base} activeStyle={active}>
        👨‍🏫 Mentors
      </NavLink>

      <NavLink to="/reports" style={base} activeStyle={active}>
        📊 Reports
      </NavLink>

      <NavLink to="/settings" style={base} activeStyle={active}>
        ⚙️ Settings
      </NavLink>

    </div>
  );
}