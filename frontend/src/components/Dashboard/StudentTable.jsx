import { useNavigate } from "react-router-dom";

export default function StudentTable({ students, onReassign, onApprove }) {
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
      <h2 style={title}>Students</h2>

      <table style={table}>
        <thead>
          <tr>
            <th style={th}>Name</th>
            <th style={th}>Email</th>
            <th style={th}>Organisation</th>
            <th style={th}>Status</th>
            <th style={th}>Mentor</th> {/* 🔥 UPDATED */}
            <th style={th}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {students.map((s) => (
            <tr key={s.id} style={row}>

              <td style={td} onClick={() => navigate(`/student/${s.id}`)}>
                {s.name}
              </td>

              <td style={td}>{s.email}</td>

              <td style={td}>{s.org || s.organisation || "-"}</td>

              <td style={td}>
                <span style={badge(s.status)}>
                  {s.status || "N/A"}
                </span>
              </td>

              {/* 🔥 MENTOR COLUMN */}
              <td style={td}>
                {s.caseOwner?.name ? (
                  <span style={mentorBadge}>{s.caseOwner.name}</span>
                ) : (
                  <span style={unassigned}>Not Assigned</span>
                )}
              </td>

              <td style={td}>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>

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

                  {/* 🔥 APPROVE BUTTON */}
                  {s.status === "MATCHED" && onApprove && (
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

/* 🎨 STYLES */

const card = {
  background: "white",
  padding: 20,
  borderRadius: 12,
  boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
};

const title = {
  fontSize: 20,
  fontWeight: 700,
  marginBottom: 20,
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
};

const th = {
  textAlign: "left",
  padding: "12px 10px",
  color: "#475569",
  fontWeight: 700,
  borderBottom: "1px solid #e2e8f0",
};

const td = {
  padding: "12px 10px",
  borderBottom: "1px solid #f1f5f9",
  color: "#334155",
};

const row = {
  transition: "0.2s",
};

const badge = (status) => ({
  padding: "5px 10px",
  borderRadius: 8,
  fontSize: 12,
  fontWeight: 600,
  background:
    status === "ACTIVE"
      ? "#dcfce7"
      : status === "MATCHED"
      ? "#dbeafe"
      : "#fef3c7",
  color:
    status === "ACTIVE"
      ? "#166534"
      : status === "MATCHED"
      ? "#1e40af"
      : "#92400e",
});

const mentorBadge = {
  padding: "5px 10px",
  background: "#e0e7ff",
  color: "#3730a3",
  borderRadius: 8,
  fontWeight: 600,
  fontSize: 12,
};

const unassigned = {
  padding: "5px 10px",
  background: "#f1f5f9",
  color: "#64748b",
  borderRadius: 8,
  fontWeight: 600,
  fontSize: 12,
};

const btnPrimary = {
  background: "#2563eb",
  color: "white",
  border: "none",
  padding: "6px 10px",
  borderRadius: 6,
  cursor: "pointer",
  fontSize: 12,
};

const btnSecondary = {
  background: "#e2e8f0",
  border: "none",
  padding: "6px 10px",
  borderRadius: 6,
  cursor: "pointer",
  fontSize: 12,
};

const btnDanger = {
  background: "#ef4444",
  color: "white",
  border: "none",
  padding: "6px 10px",
  borderRadius: 6,
  cursor: "pointer",
  fontSize: 12,
};

const btnApprove = {
  background: "#10b981",
  color: "white",
  border: "none",
  padding: "6px 10px",
  borderRadius: 6,
  cursor: "pointer",
  fontSize: 12,
};