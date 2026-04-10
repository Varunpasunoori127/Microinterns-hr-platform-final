import { useNavigate } from "react-router-dom";

export default function StudentTable({ students, onReassign, onApprove, onView }) {
  const navigate = useNavigate();

  if (!students || students.length === 0) {
    return (
      <div style={card}>
        <h2 style={title}>Students</h2>
        <p style={{ color: "#64748b" }}>
          No students available. Add a student to begin.
        </p>
      </div>
    );
  }

  return (
    <div style={card}>
      {/* HEADER */}
      <div style={header}>
        <h2 style={title}>Students</h2>
        <span style={count}>{students.length} records</span>
      </div>

      <table style={table}>
        <thead>
          <tr>
            <th style={th}>Name</th>
            <th style={th}>Email</th>
            <th style={th}>University</th> {/* ✅ CHANGED */}
            <th style={th}>Status</th>
            <th style={th}>Mentor</th>
            <th style={th}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {students.map((s, index) => (
            <tr
              key={s.id}
              style={{
                ...row,
                background: index % 2 === 0 ? "#ffffff" : "#fafafa",
              }}
              onClick={() => onView && onView(s.id)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.03)";
              }}
            >
              <td style={{ ...td, fontWeight: 600 }}>
                {s.name}
              </td>

              <td style={td}>{s.email || "—"}</td>

              {/* ✅ NEW UNIVERSITY + COURSE DISPLAY */}
              <td style={td}>
                <div style={{ fontWeight: 500 }}>
                  {s.university || "—"}
                </div>
                {s.course && (
                  <div style={{ fontSize: 12, color: "#64748b" }}>
                    {s.course}
                  </div>
                )}
              </td>

              <td style={td}>
                <span style={badge(s.onboardingStatus)}>
                  {(s.onboardingStatus || "N/A").replaceAll("_", " ")}
                </span>
              </td>

              <td style={td}>
                {s.mentor?.name ? (
                  <span style={mentorBadge}>{s.mentor.name}</span>
                ) : (
                  <span style={unassigned}>Not Assigned</span>
                )}
              </td>

              <td
                style={{ ...td, borderRadius: "0 12px 12px 0" }}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={{display: "flex",  gap: 8, alignItems: "center", justifyContent: "flex-start"}}>
              
                  <button
                    style={btnSecondary}
                    onClick={() => navigate(`/student/${s.id}`)}
                  >
                    View
                  </button>

                  <button
                    style={btnPrimary}
                    onClick={() => navigate(`/match/${s.id}`)}
                  >
                    Match
                  </button>

                  {onReassign && (
                    <button
                      style={btnDanger}
                      onClick={() => onReassign(s.id)}
                    >
                      Reassign
                    </button>
                  )}

                  {s.onboardingStatus === "MATCHED" && onApprove && (
                    <button
                      style={btnApprove}
                      onClick={() => onApprove(s.id)}
                    >
                      Approve
                    </button>
                  )}

                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
/* ---------- STYLES ---------- */

const card = {
  width: "100%",
  maxWidth: "700px",
  margin: "auto",
  padding: "20px",
  borderRadius: "16px",
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 16,
};

const count = {
  fontSize: 13,
  color: "#64748b",
};

const title = {
  fontSize: 18,
  fontWeight: 700,
};

const table = {
  width: "100%",
  borderCollapse: "separate",
  borderSpacing: "0 10px",
};

const th = {
  textAlign: "left",
  padding: "10px 14px",
  color: "#64748b",
  fontWeight: 600,
  fontSize: 13,
};

const td = {
  padding: "14px 16px",
  background: "white",
  borderTop: "1px solid #f1f5f9",
  borderBottom: "1px solid #f1f5f9",
  fontSize: 14,
  color: "#334155",
};

const row = {
  transition: "all 0.2s ease",
  cursor: "pointer",
  boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
};

const badge = (status) => {
  if (!status) return baseBadge;

  if (status.includes("COMPLETE")) return greenBadge;
  if (status.includes("MATCH")) return blueBadge;
  if (status.includes("PENDING")) return yellowBadge;
  if (status.includes("PROGRESS")) return orangeBadge;

  return baseBadge;
};

const baseBadge = {
  padding: "6px 12px",
  borderRadius: 999,
  background: "#e5e7eb",
  color: "#374151",
  fontSize: 12,
  fontWeight: 600,
};

const greenBadge = {
  ...baseBadge,
  background: "#dcfce7",
  color: "#166534",
};

const blueBadge = {
  ...baseBadge,
  background: "#dbeafe",
  color: "#1e40af",
};

const yellowBadge = {
  ...baseBadge,
  background: "#fef3c7",
  color: "#92400e",
};

const orangeBadge = {
  ...baseBadge,
  background: "#ffedd5",
  color: "#c2410c",
};

const mentorBadge = {
  padding: "6px 12px",
  background: "#e0e7ff",
  color: "#3730a3",
  borderRadius: 999,
  fontWeight: 600,
  fontSize: 12,
};

const unassigned = {
  padding: "6px 12px",
  background: "#f1f5f9",
  color: "#64748b",
  borderRadius: 999,
  fontWeight: 600,
  fontSize: 12,
};

/* BUTTONS */

const baseBtn = {
  padding: "6px 12px",
  borderRadius: 8,
  fontSize: 12,
  fontWeight: 600,
  border: "none",
  cursor: "pointer",
};

const btnPrimary = {
  ...baseBtn,
  background: "#2563eb",
  color: "white",
};

const btnSecondary = {
  ...baseBtn,
  background: "#f1f5f9",
  color: "#334155",
};

const btnDanger = {
  ...baseBtn,
  background: "#ef4444",
  color: "white",
};

const btnApprove = {
  ...baseBtn,
  background: "#10b981",
  color: "white",
};