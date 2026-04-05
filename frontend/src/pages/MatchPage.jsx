import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../lib/api"; // ✅ IMPORTANT

export default function MatchPage() {
  const { studentId } = useParams();
  const navigate = useNavigate();

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState(""); // ✅ ADDED

  useEffect(() => {
    setLoading(true);
    setError("");

    api.get(`/match/${studentId}`) // ✅ FIXED
      .then((data) => {
        setMatches(data || []);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load matches");
      })
      .finally(() => setLoading(false));

  }, [studentId]);

  const assignMentor = (mentorId) => {

    setAssigning(true);
    setMessage("");
    setError("");

    api.post(`/match/assign?studentId=${studentId}&mentorId=${mentorId}`) // ✅ FIXED
      .then(() => {

        // ✅ SUCCESS MESSAGE (no alert)
        setMessage("Mentor assigned successfully!");

        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);

      })
      .catch((err) => {
        console.error(err);
        setError("Failed to assign mentor");
      })
      .finally(() => setAssigning(false));
  };

  return (
    <div style={{ padding: 30, background: "#f8fafc", minHeight: "100vh" }}>

      <h1>🎯 Mentor Matching</h1>

      {/* ✅ MESSAGE */}
      {message && (
        <div style={{
          background: "#ecfdf5",
          color: "#065f46",
          padding: 10,
          borderRadius: 6,
          marginBottom: 15
        }}>
          {message}
        </div>
      )}

      {loading && <p>Loading...</p>}

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      {!loading && matches.length === 0 && !error && (
        <p>No matches found</p>
      )}

      {matches.map((m, i) => (
        <div
          key={i}
          style={{
            background: "white",
            padding: 20,
            marginBottom: 15,
            borderRadius: 12,
          }}
        >
          <h2>
            #{i + 1} {m.mentor}
          </h2>

          <p>Expertise: {m.expertise}</p>

          <p style={{ color: "#16a34a" }}>
            Score: {m.score}%
          </p>

          {/* PROGRESS BAR */}
          <div
            style={{
              height: 8,
              background: "#ddd",
              borderRadius: 5,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${m.score}%`,
                height: "100%",
                background: "#22c55e",
              }}
            />
          </div>

          {/* SKILLS */}
          <p>✅ {m.matchedSkills?.join(", ") || "No match"}</p>

          <p style={{ color: "red" }}>
            ❌ {m.missingSkills?.join(", ") || "None"}
          </p>

          {/* ACTION BUTTON */}
          <button
            onClick={() => assignMentor(m.mentorId)}
            disabled={assigning}
            style={{
              marginTop: 10,
              background: "#2563eb",
              color: "white",
              padding: "8px 12px",
              borderRadius: 6,
              opacity: assigning ? 0.7 : 1,
              cursor: assigning ? "not-allowed" : "pointer",
            }}
          >
            {assigning ? "Assigning..." : "Assign Mentor"}
          </button>
        </div>
      ))}

    </div>
  );
}