import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../lib/api";

export default function MatchPage() {
  const { studentId } = useParams();
  const navigate = useNavigate();

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");

    api.get(`/match/${studentId}`)
      .then((data) => {
        setMatches(data || []);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load matches");
      })
      .finally(() => setLoading(false));

  }, [studentId]);

  // 🔥 FIXED ASSIGN FUNCTION
  const assignMentor = (mentorId) => {

    if (!mentorId) {
      alert("Invalid mentor");
      return;
    }

    setAssigning(true);
    setMessage("");
    setError("");

    api.post("/match/assign", {
      studentId: Number(studentId),
      mentorId: Number(mentorId)
    })
      .then(() => {
        setMessage("✅ Mentor assigned successfully!");

        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      })
      .catch((err) => {
        console.error(err);
        setError("❌ Failed to assign mentor");
      })
      .finally(() => setAssigning(false));
  };

  return (
    <div style={{ padding: 30, background: "#f8fafc", minHeight: "100vh" }}>

      <h1>🎯 Mentor Matching</h1>

      {/* SUCCESS MESSAGE */}
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
        <p style={{ color: "red" }}>{error}</p>
      )}

      {!loading && matches.length === 0 && !error && (
        <p>No matches found</p>
      )}

      {matches.map((m, i) => {

        const color =
          m.score >= 70 ? "#10b981" :
          m.score >= 40 ? "#f59e0b" :
          "#ef4444";

        return (
          <div
            key={i}
            style={{
              background: "white",
              padding: 20,
              marginBottom: 15,
              borderRadius: 12,
              border: i === 0 ? "2px solid #10b981" : "1px solid #e5e7eb"
            }}
          >
            <h2>
              #{i + 1} {m.name}
              {i === 0 && (
                <span style={{
                  marginLeft: 10,
                  background: "#10b981",
                  color: "white",
                  padding: "3px 8px",
                  borderRadius: 6,
                  fontSize: 12
                }}>
                  ⭐ Best Match
                </span>
              )}
            </h2>

            <p>Expertise: {m.expertise}</p>

            <p style={{ color, fontWeight: 600 }}>
              Score: {m.score}%
            </p>

            {/* PROGRESS BAR */}
            <div style={{
              height: 8,
              background: "#ddd",
              borderRadius: 5,
              overflow: "hidden"
            }}>
              <div style={{
                width: `${m.score}%`,
                height: "100%",
                background: color
              }} />
            </div>

            {/* EXPLANATION */}
            <p style={{ marginTop: 10 }}>
              <b>Why this mentor?</b><br />

              {m.score >= 70 && "Strong skill match with high alignment."}
              {m.score >= 40 && m.score < 70 && "Moderate match with partial overlap."}
              {m.score < 40 && "Low match with limited overlap."}
            </p>

            {/* ACTION */}
            <button
              onClick={() => assignMentor(m.id)}  // 🔥 FIXED (id not mentorId)
              disabled={assigning}
              style={{
                marginTop: 10,
                background: "#2563eb",
                color: "white",
                padding: "8px 12px",
                borderRadius: 6,
                opacity: assigning ? 0.7 : 1,
                cursor: assigning ? "not-allowed" : "pointer"
              }}
            >
              {assigning ? "Assigning..." : "Assign Mentor"}
            </button>
          </div>
        );
      })}

    </div>
  );
}