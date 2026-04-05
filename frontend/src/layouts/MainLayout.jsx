import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function MainLayout({ children }) {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("microinterns_user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("microinterns_user");
    navigate("/");
  };

  return (
    <div style={{ minHeight: "100vh", fontFamily: "Inter", background: "#f8fafc" }}>
      
      {/* NAVBAR */}
      <header style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "18px 80px",
        background: "white",
        borderBottom: "1px solid #e2e8f0",
        position: "sticky",
        top: 0,
        zIndex: 100
      }}>

        {/* LOGO */}
        <div
          style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          <img src={logo} alt="logo" style={{ height: 32 }} />
          <h2 style={{ fontWeight: 800 }}>MicroInterns</h2>
        </div>

        {/* MENU */}
        <div style={{ display: "flex", gap: 25, alignItems: "center" }}>

          {!token && (
            <>
              <span style={menuItem} onClick={() => navigate("/")}>Home</span>
              <span style={menuItem} onClick={() => navigate("/login")}>Login</span>
              <button style={primaryBtn} onClick={() => navigate("/signup")}>
                Get Started
              </button>
            </>
          )}

          {token && (
            <>
              <span style={menuItem} onClick={() => navigate("/")}>Home</span>
              <span style={menuItem} onClick={() => navigate("/dashboard")}>Dashboard</span>
              <span style={menuItem} onClick={() => navigate("/mentors")}>Mentors</span>

              <span style={{ fontWeight: 600, color: "#2563eb" }}>
                👤 {user?.name || "User"}
              </span>

              <button style={logoutBtn} onClick={handleLogout}>
                Logout
              </button>
            </>
          )}

        </div>
      </header>

      {/* PAGE CONTENT */}
      {children}
    </div>
  );
}

/* STYLES */
const menuItem = {
  cursor: "pointer",
  fontWeight: 600,
  color: "#334155"
};

const primaryBtn = {
  background: "#2563eb",
  color: "white",
  padding: "10px 16px",
  borderRadius: 8,
  border: "none",
  cursor: "pointer"
};

const logoutBtn = {
  background: "#ef4444",
  color: "white",
  padding: "8px 14px",
  borderRadius: 8,
  border: "none",
  cursor: "pointer"
};