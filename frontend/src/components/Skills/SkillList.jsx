export default function SkillList({ skills }) {
  return (
    <div style={card}>
      <h2 style={title}>Skills</h2>

      {skills.length === 0 && (
        <p style={{ color: "#64748b" }}>No skills added yet.</p>
      )}

      <ul style={{ marginTop: 10 }}>
        {skills.map((s, index) => (
          <li key={index} style={skillItem}>
            <span>{s.skill}</span>
            <span style={levelBadge(s.level)}>{s.level}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* STYLES */
const card = {
  width: "100%",
  maxWidth: "700px",
  margin: "auto",
  padding: "20px",
  borderRadius: "16px",
};

const title = {
  fontSize: 20,
  fontWeight: 700,
  marginBottom: 10,
};

const skillItem = {
  display: "flex",
  justifyContent: "space-between",
  padding: "10px 0",
  borderBottom: "1px solid #f1f5f9",
  fontWeight: 500,
};

const levelBadge = (level) => ({
  padding: "4px 10px",
  borderRadius: 8,
  background:
    level === "Advanced"
      ? "#fee2e2"
      : level === "Intermediate"
      ? "#fef9c3"
      : "#e0f2fe",
  color:
    level === "Advanced"
      ? "#991b1b"
      : level === "Intermediate"
      ? "#854d0e"
      : "#075985",
  fontWeight: 600,
});