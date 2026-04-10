import SkillMatchBadge from "./SkillMatchBadge";

export default function MentorCard({ mentor, onAssign }) {
  return (
    <div style={card}>
      <h3 style={name}>{mentor.mentor}</h3>
      <p style={expertise}>{mentor.expertise}</p>

      {/* SCORE */}
      <div style={scoreBox}>
        <span style={scoreText}>{mentor.score}% Match</span>
      </div>

      {/* MATCHED SKILLS */}
      <div style={{ marginTop: 15 }}>
        <h4 style={subTitle}>Matched Skills</h4>
        {mentor.matchedSkills.length === 0 && (
          <p style={empty}>No matched skills</p>
        )}
        {mentor.matchedSkills.map((s, i) => (
          <SkillMatchBadge key={i} skill={s} matched={true} />
        ))}
      </div>

      {/* MISSING SKILLS */}
      <div style={{ marginTop: 15 }}>
        <h4 style={subTitle}>Missing Skills</h4>
        {mentor.missingSkills.length === 0 && (
          <p style={empty}>No missing skills</p>
        )}
        {mentor.missingSkills.map((s, i) => (
          <SkillMatchBadge key={i} skill={s} matched={false} />
        ))}
      </div>

      {/* ASSIGN BUTTON */}
      <button style={assignBtn} onClick={() => onAssign(mentor.mentorId)}>
        Assign Mentor
      </button>
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

const name = {
  fontSize: 20,
  fontWeight: 700,
  marginBottom: 4,
};

const expertise = {
  color: "#64748b",
  marginBottom: 10,
};

const scoreBox = {
  background: "#e0f2fe",
  padding: "6px 12px",
  borderRadius: 8,
  width: "fit-content",
};

const scoreText = {
  color: "#075985",
  fontWeight: 700,
};

const subTitle = {
  fontWeight: 700,
  marginBottom: 6,
};

const empty = {
  color: "#94a3b8",
  fontSize: 14,
};

const assignBtn = {
  marginTop: 20,
  background: "#2563eb",
  color: "white",
  padding: "10px 16px",
  borderRadius: 8,
  border: "none",
  cursor: "pointer",
  fontWeight: 600,
};