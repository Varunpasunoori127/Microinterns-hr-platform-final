export default function CaseTimeline({ events }) {
  return (
    <div style={card}>
      <h2 style={title}>Case Timeline</h2>

      {events.length === 0 && (
        <p style={{ color: "#64748b" }}>No timeline events yet.</p>
      )}

      <div style={{ marginTop: 20 }}>
        {events.map((e, index) => (
          <div key={index} style={item}>
            <div style={dot}></div>

            <div>
              <p style={eventText}>{e.event}</p>
              <p style={time}>{formatDate(e.timestamp)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* HELPERS */
function formatDate(ts) {
  const d = new Date(ts);
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* STYLES */
const card = {
  background: "white",
  padding: 20,
  borderRadius: 12,
  boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
};

const title = {
  fontSize: 20,
  fontWeight: 700,
  marginBottom: 10,
};

const item = {
  display: "flex",
  alignItems: "flex-start",
  gap: 12,
  marginBottom: 20,
  position: "relative",
};

const dot = {
  width: 12,
  height: 12,
  background: "#2563eb",
  borderRadius: "50%",
  marginTop: 4,
};

const eventText = {
  fontWeight: 600,
  color: "#1e293b",
};

const time = {
  fontSize: 13,
  color: "#64748b",
  marginTop: 2,
};