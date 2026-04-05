import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function DashboardLayout() {
  const navigate = useNavigate();

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Inter" }}>
      
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, background: "#f8fafc", overflowY: "auto" }}>
        
        {/* TOPBAR */}
        <Topbar />

        {/* QUICK NAV (important for you) */}
        <div style={{ padding: "10px 30px" }}>
          <button
            onClick={() => navigate("/")}
            style={{
              background: "#2563eb",
              color: "white",
              padding: "8px 14px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer"
            }}
          >
            ← Back to Home
          </button>
        </div>

        {/* PAGE CONTENT */}
        <div style={{ padding: 30 }}>
          <Outlet />
        </div>

      </div>
    </div>
  );
}