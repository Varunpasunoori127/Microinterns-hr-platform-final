import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentTable from "../components/Dashboard/StudentTable";
import AddStudentForm from "../components/Dashboard/AddStudentForm";
import api, { clearToken } from "../lib/api";

/* ---------- STAT CARD ---------- */

function StatCard({ title, value }) {
  return (
    <div
      style={{
        background: "white",
        padding: 24,
        borderRadius: 12,
        border: "1px solid #eef2f6",
        boxShadow: "0 8px 24px rgba(0,0,0,0.04)"
      }}
    >
      <div style={{ color: "#64748b", fontSize: 13 }}>{title}</div>

      <div
        style={{
          fontSize: 28,
          fontWeight: 800,
          marginTop: 6
        }}
      >
        {value}
      </div>
    </div>
  );
}

/* ---------- SIDEBAR ITEM ---------- */

function NavItem({ label, active }) {
  return (
    <div
      style={{
        padding: "10px 14px",
        borderRadius: 8,
        cursor: "pointer",
        fontWeight: 600,
        background: active ? "#2563eb" : "transparent",
        color: active ? "white" : "#cbd5f5"
      }}
    >
      {label}
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [statusMsg, setStatusMsg] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadStudents = () => {
    setLoading(true);

    api
      .get("/students")
      .then((data) => setStudents(data || []))
      .catch((err) => {
        console.error(err);
        setStatusMsg({
          type: "error",
          msg: "Failed to load students"
        });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleReassign = async (studentId) => {
    const toUserId = window.prompt("Enter target HR user id");
    if (!toUserId) return;

    try {
      await api.put(
        `/students/${studentId}/reassign?toUserId=${encodeURIComponent(
          toUserId
        )}`
      );

      loadStudents();

      setStatusMsg({
        type: "success",
        msg: "Student reassigned successfully"
      });
    } catch {
      setStatusMsg({
        type: "error",
        msg: "Reassign failed"
      });
    }

    setTimeout(() => setStatusMsg(null), 3000);
  };
  const handleApprove = async (studentId) => {
  try {
    await api.post(`/students/approve/${studentId}`);

    loadStudents();

    setStatusMsg({
      type: "success",
      msg: "Student approved successfully"
    });
  } catch {
    setStatusMsg({
      type: "error",
      msg: "Approval failed"
    });
  }

  setTimeout(() => setStatusMsg(null), 3000);
};

  const signOut = () => {
    clearToken();
    localStorage.removeItem("microinterns_user");
    navigate("/");
  };

  const user = (() => {
    try {
      const raw = localStorage.getItem("microinterns_user");
      if (raw) {
        const obj = JSON.parse(raw);
        return obj.name || obj.email.split("@")[0];
      }
    } catch {}
    return "HR";
  })();

  const total = students.length;
  const pending = students.filter((s) =>
    s.status?.toLowerCase().includes("pend")
  ).length;
  const active = students.filter((s) =>
    s.status?.toLowerCase().includes("active")
  ).length;
  const completed = students.filter((s) =>
    s.status?.toLowerCase().includes("complete")
  ).length;

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Inter" }}>
      {/* ---------- SIDEBAR ---------- */}
      <div
        style={{
          width: 250,
          background: "#0f172a",
          color: "white",
          padding: 24
        }}
      >
        <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 30 }}>
          MicroInterns
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <NavItem label="Dashboard" active />
          <NavItem label="Students" />
          <NavItem label="Settings" />

          <div
            onClick={signOut}
            style={{
              marginTop: 20,
              cursor: "pointer",
              padding: "10px 14px",
              borderRadius: 8,
              background: "#1e293b"
            }}
          >
            Logout
          </div>
        </div>
      </div>

      {/* ---------- MAIN AREA ---------- */}
      <div
        style={{
          flex: 1,
          background: "#f8fafc",
          display: "flex",
          flexDirection: "column"
        }}
      >
        {/* ---------- HEADER ---------- */}
        <header
          style={{
            background: "white",
            padding: "18px 30px",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <div>
            <div style={{ fontSize: 20, fontWeight: 800 }}>Dashboard</div>
            <div style={{ fontSize: 13, color: "#94a3b8" }}>
              Welcome back, {user}
            </div>
          </div>

          <button
            onClick={() => navigate("/")}
            style={{
              background: "#2563eb",
              color: "white",
              border: "none",
              padding: "10px 18px",
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: 600
            }}
          >
            ← Back to Site
          </button>
        </header>

        {/* ---------- CONTENT ---------- */}
        <div
          style={{
            padding: 30,
            maxWidth: 1200,
            margin: "0 auto",
            width: "100%"
          }}
        >
          {/* STAT CARDS */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
              gap: 20,
              marginBottom: 30
            }}
          >
            <StatCard title="Total Students" value={total} />
            <StatCard title="Pending" value={pending} />
            <StatCard title="Active" value={active} />
            <StatCard title="Completed" value={completed} />
          </div>

          {/* STUDENT MANAGEMENT */}
          <div
            style={{
              background: "white",
              borderRadius: 12,
              padding: 24,
              boxShadow: "0 10px 28px rgba(0,0,0,0.04)"
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20
              }}
            >
              <h2 style={{ margin: 0 }}>Student Management</h2>

              <button
                onClick={() => setShowAddForm(true)}
                style={{
                  background: "#2563eb",
                  color: "white",
                  border: "none",
                  padding: "10px 18px",
                  borderRadius: 8,
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                + Add Student
              </button>
            </div>

            {statusMsg && (
              <div
                style={{
                  marginBottom: 16,
                  padding: "10px 14px",
                  borderRadius: 6,
                  background:
                    statusMsg.type === "success" ? "#ecfdf5" : "#fef2f2",
                  color:
                    statusMsg.type === "success" ? "#065f46" : "#991b1b"
                }}
              >
                {statusMsg.msg}
              </div>
            )}

            {/* ADD STUDENT MODAL */}
            {showAddForm && (
              <AddStudentForm
                onSubmit={async (form) => {
                  await api.post("/students", form);
                  loadStudents();
                  setShowAddForm(false);
                }}
                onClose={() => setShowAddForm(false)}
              />
            )}

            {/* LOADING + EMPTY STATE */}
            {loading && <p>Loading students...</p>}

            {!loading && students.length === 0 && (
              <p style={{ color: "#64748b" }}>
                No students yet. Click "Add Student" to begin.
              </p>
            )}

            {!loading && students.length > 0 && (
              <StudentTable
                students={students}
                onReassign={handleReassign}
                onApprove={handleApprove}
    
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}