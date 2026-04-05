import { useParams, useNavigate } from "react-router-dom";
import CaseTimeline from "../components/timeline/CaseTimeline";


export default function StudentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div style={{ padding: 30 }}>
      <h1>👤 Student Details</h1>

      {/* later you can fetch and show student info here */}
      <CaseTimeline events={timelineData} />


      <button
        style={{
          marginTop: 20,
          padding: "10px 15px",
          background: "#2563eb",
          color: "white",
          borderRadius: 8,
          cursor: "pointer",
        }}
        onClick={() => navigate(`/match/${id}`)}
      >
        Find Mentor →
      </button>
    </div>
  );
}