import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../lib/api";

export default function StudentSkillsPage() {
  const { token } = useParams();

  const [student, setStudent] = useState(null);
  const [skills, setSkills] = useState([]);
  const [skill, setSkill] = useState("");
  const [level, setLevel] = useState("Beginner");

  const [matches, setMatches] = useState([]);
  const [assignedMentor, setAssignedMentor] = useState(null);
  const [loadingMatch, setLoadingMatch] = useState(false);

  const [step, setStep] = useState("form");
  const [suggestions, setSuggestions] = useState([]);

  const SKILLS = [
  // 💻 TECH
  "Java", "JavaScript", "Python", "C++", "C#", "TypeScript",
  "React", "Angular", "Next.js", "Node.js", "Spring Boot",
  "HTML", "CSS", "REST APIs", "GraphQL",
  "SQL", "PostgreSQL", "MySQL", "MongoDB",
  "Docker", "Kubernetes", "AWS", "Azure", "Google Cloud",
  "Git", "CI/CD", "Microservices", "Cybersecurity",
  "Machine Learning", "Data Analysis", "Data Science",
  "Artificial Intelligence", "Deep Learning",
  "Pandas", "NumPy", "TensorFlow", "PyTorch",

  // 📊 BUSINESS & MANAGEMENT
  "Project Management", "Business Analysis", "Strategic Planning",
  "Operations Management", "Risk Management",
  "Leadership", "Team Management", "Decision Making",
  "Entrepreneurship", "Change Management",
  "Supply Chain Management", "Logistics",
  "Procurement", "Quality Assurance",

  // 💰 FINANCE & ACCOUNTING
  "Accounting", "Financial Analysis", "Budgeting",
  "Forecasting", "Taxation", "Auditing",
  "Investment Analysis", "Banking",
  "Payroll Management", "Cost Accounting",

  // 📈 MARKETING & SALES
  "Digital Marketing", "SEO", "SEM", "Content Marketing",
  "Social Media Marketing", "Email Marketing",
  "Brand Management", "Market Research",
  "Sales", "Lead Generation", "CRM",
  "Customer Relationship Management",
  "Copywriting", "Advertising",

  // 🎨 DESIGN & CREATIVE
  "UI/UX Design", "Graphic Design", "Figma",
  "Adobe Photoshop", "Adobe Illustrator",
  "Video Editing", "Animation", "Photography",
  "Product Design", "Web Design",

  // 🏥 HEALTHCARE & MEDICAL
  "Patient Care", "Clinical Research",
  "Medical Coding", "Medical Billing",
  "Pharmacy", "Nursing", "Surgery Assistance",
  "Public Health", "Healthcare Management",
  "First Aid", "Emergency Response",

  // 🌱 AGRICULTURE & ENVIRONMENT
  "Agriculture", "Crop Management",
  "Soil Science", "Irrigation Systems",
  "Farm Management", "Agribusiness",
  "Sustainable Farming", "Horticulture",
  "Animal Husbandry", "Dairy Farming",
  "Environmental Science", "Forestry",
  "Fisheries", "Organic Farming",

  // ⚙️ ENGINEERING
  "Mechanical Engineering", "Electrical Engineering",
  "Civil Engineering", "Structural Design",
  "AutoCAD", "SolidWorks",
  "Robotics", "Embedded Systems",
  "Control Systems", "Manufacturing",

  // 📚 EDUCATION & TRAINING
  "Teaching", "Curriculum Development",
  "Instructional Design", "E-Learning",
  "Classroom Management", "Tutoring",
  "Research", "Academic Writing",

  // ⚖️ LAW & ADMINISTRATION
  "Legal Research", "Contract Management",
  "Compliance", "Public Administration",
  "Policy Analysis", "Documentation",

  // 🧠 SOFT SKILLS
  "Communication", "Problem Solving",
  "Critical Thinking", "Time Management",
  "Adaptability", "Creativity",
  "Collaboration", "Conflict Resolution",
  "Emotional Intelligence",

  // 🏨 HOSPITALITY & SERVICE
  "Customer Service", "Hospitality Management",
  "Event Planning", "Tourism Management",
  "Food Safety", "Catering",

  // 🏗️ CONSTRUCTION & TRADES
  "Construction Management", "Carpentry",
  "Plumbing", "Welding",
  "Site Management", "Blueprint Reading",

  // 🚚 TRANSPORT & LOGISTICS
  "Driving", "Fleet Management",
  "Warehouse Management",
  "Inventory Management",

  // 🛍️ RETAIL & E-COMMERCE
  "Retail Management", "Merchandising",
  "E-commerce", "Shopify",
  "Product Listing", "Customer Support",

  // 🔬 SCIENCE & LAB
  "Laboratory Skills", "Biotechnology",
  "Chemistry", "Physics",
  "Data Collection", "Experiment Design"
];

  /* ---------- LOAD STUDENT ---------- */
  useEffect(() => {
    if (!token) return;

    api.get(`/students/onboarding/${token}`)
      .then((res) => {
        if (!res) {
          alert("Student not loaded properly.");
          return;
        }
        setStudent(res);
      })
      .catch(() => {
        alert("Student not loaded properly.");
      });
  }, [token]);

  /* ---------- ADD SKILL (LOCAL ONLY) ---------- */
  const addSkill = () => {
    if (!skill) return;

    if (skills.some(s => s.skill.toLowerCase() === skill.toLowerCase())) {
      return;
    }

    setSkills(prev => [...prev, { skill, level }]);
    setSkill("");
    setSuggestions([]);
  };
  const handleSkillChange = (value) => {
  setSkill(value);

  if (!value) {
    setSuggestions([]);
    return;
  }

  const filtered = SKILLS
    .filter(s => s.toLowerCase().includes(value.toLowerCase()))
    .slice(0, 8); // limit results

  setSuggestions(filtered);
};

  /* ---------- REMOVE SKILL ---------- */
  const removeSkill = (index) => {
    setSkills(prev => prev.filter((_, i) => i !== index));
  };

  /* ---------- SAVE SKILLS + MATCH ---------- */
  const findMatches = async () => {
  try {
    if (skills.length === 0) return;

    setLoadingMatch(true);

    const res = await api.post(`/students/skills/${token}`, {
      skills: skills.map(s => s.skill)
    });

    setMatches([
      {
        name: res.mentor,
        id: res.mentorId, // 🔥 IMPORTANT
        score: 100
      }
    ]);

    setStep("match");

  } catch (err) {
    console.error(err);
    alert("Failed to find matches");
  } finally {
    setLoadingMatch(false);
  }
};

  /* ---------- CONFIRM ---------- */
  const confirmMentor = async () => {
  try {
    const best = matches[0];

    const studentId = student?.id || student?.studentId;

    await api.post("/match/assign", {
      studentId: studentId,
      mentorId: best.id // ✅ now exists
    });

    setAssignedMentor(best);
    setStep("done");

  } catch (err) {
    console.error(err);
    alert("Failed to assign mentor");
  }
};
  if (!student) return <p style={{ padding: 40 }}>Loading...</p>;

  /* ================= FORM ================= */
  /* ================= FORM ================= */
if (step === "form") {
  return (
    <div style={container}>
      <div style={card}>

        <div style={header}>
          <h2 style={title}>Build Your Skill Profile</h2>
          <span style={stepText}>Step 2 of 3</span>
        </div>

        <div style={progressContainer}>
          <div style={progressFill}></div>
        </div>

        <div style={inputRow}>

          {/* AUTOCOMPLETE */}
          <div style={{ position: "relative", flex: 1 }}>
            <input
              value={skill}
              onChange={(e) => handleSkillChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSkill();
                }
              }}
              placeholder="Type a skill (e.g. Java, Marketing, Agriculture)"
              style={input}
            />

            {suggestions.length > 0 && (
              <div style={dropdown}>
                {suggestions.map((s, i) => (
                  <div
                    key={i}
                    style={dropdownItem}
                    onClick={() => {
                      setSkill(s);
                      setSuggestions([]);
                    }}
                  >
                    {s}
                  </div>
                ))}
              </div>
            )}

            {skill && suggestions.length === 0 && (
              <div style={dropdown}>
                <div style={dropdownItem}>No skills found</div>
              </div>
            )}
          </div>

          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            style={select}
          >
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>

          <button
            style={{
              ...addBtn,
              opacity: !skill.trim() ? 0.5 : 1
            }}
            disabled={!skill.trim()}
            onClick={addSkill}
          >
            Add
          </button>

        </div>

        {skills.length === 0 && (
          <p style={empty}>No skills added yet.</p>
        )}

        {/* SKILLS */}
        <div style={skillsContainer}>
          {skills.map((s, i) => (
            <div key={i} style={skillChip}>
              <span>{s.skill}</span>
              <span style={levelBadge}>{s.level}</span>
              <button style={removeBtn} onClick={() => removeSkill(i)}>✕</button>
            </div>
          ))}
        </div>

        <button
          onClick={findMatches}
          disabled={loadingMatch || skills.length === 0}
          style={{
            ...submitBtn,
            opacity: skills.length === 0 ? 0.5 : 1
          }}
        >
          {loadingMatch ? "Matching..." : "Find My Mentor"}
        </button>

        <p style={note}>You can update your skills later</p>

      </div>
    </div>
  );
}

/* ================= MATCH ================= */
if (step === "match") {
  return (
    <div style={container}>
      <div style={card}>

        <div style={header}>
          <h2 style={title}>Recommended Mentor</h2>
          <span style={stepText}>Step 3 of 3</span>
        </div>

        <div style={progressContainer}>
          <div style={{ ...progressFill, width: "100%" }}></div>
        </div>

        {matches.length > 0 && (
          <div style={matchCard}>

            <h2>{matches[0].name}</h2>

            <p style={{ fontSize: 18, fontWeight: 600 }}>
              {matches[0].score}% Match
            </p>

            {/* 🔥 SCORE BAR */}
            <div style={scoreBar}>
              <div
                style={{
                  ...scoreFill,
                  width: `${matches[0].score}%`
                }}
              ></div>
            </div>

            {/* 🔥 WHY THIS MENTOR */}
            <p style={whyText}>
              Matches your skills:{" "}
              {skills.slice(0, 3).map(s => s.skill).join(", ")}
            </p>

          </div>
        )}

        <button style={submitBtn} onClick={confirmMentor}>
          Confirm Mentor
        </button>

      </div>
    </div>
  );
}

/* ================= DONE ================= */
if (step === "done") {
  return (
    <div style={container}>
      <div style={{ ...card, textAlign: "center" }}>

        <h2 style={{ color: "#10b981", marginBottom: 10 }}>
          🎉 Mentor Assigned Successfully!
        </h2>

        <h1>{assignedMentor.name}</h1>

        <p style={{ fontWeight: 600 }}>
          Match Score: {assignedMentor.score}%
        </p>

        <div style={successBox}>
          <p>📩 Your mentor will contact you shortly via email.</p>
          <p>⏳ Please check your inbox and spam folder.</p>
        </div>

        <p style={note}>
          You can always update your skills later for better matches.
        </p>

      </div>
    </div>
  );
}
}

/* ================= STYLES ================= */

const container = {
  minHeight: "100vh",
  background: "#f8fafc",
  display: "flex",
  justifyContent: "center",
  padding: "40px 20px"
};

const card = {
  width: "100%",
  maxWidth: "700px",
  background: "white",
  padding: "30px",
  borderRadius: "16px",
  boxShadow: "0 20px 50px rgba(0,0,0,0.08)",
  border: "1px solid #f1f5f9"
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: 20
};

const title = { fontSize: 22, fontWeight: 700 };

const stepText = { fontSize: 12, color: "#64748b" };

const progressContainer = {
  height: 6,
  background: "#e5e7eb",
  borderRadius: 999,
  marginBottom: 20
};

const progressFill = {
  height: "100%",
  width: "66%",
  background: "#2563eb",
  borderRadius: 999
};

const inputRow = { display: "flex", gap: 10 };

const input = {
  flex: 1,
  padding: 12,
  borderRadius: 10,
  border: "1px solid #e2e8f0"
};

const select = {
  padding: 12,
  borderRadius: 10,
  border: "1px solid #e2e8f0"
};

const addBtn = {
  background: "#2563eb",
  color: "white",
  padding: "12px 16px",
  borderRadius: 10,
  border: "none"
};

const skillTag = {
  display: "inline-flex",
  gap: 8,
  padding: "8px 12px",
  background: "#eef2ff",
  borderRadius: 999,
  margin: 5
};

const removeBtn = {
  border: "none",
  background: "transparent",
  color: "red",
  cursor: "pointer"
};

const empty = { color: "#64748b", marginTop: 10 };

const submitBtn = {
  width: "100%",
  background: "#4b0488",
  color: "white",
  padding: 14,
  borderRadius: 12,
  border: "none",
  marginTop: 20
};

const note = {
  textAlign: "center",
  fontSize: 12,
  color: "#051e41",
  marginTop: 10
};

const matchCard = {
  background: "#eef2ff",
  padding: 20,
  borderRadius: 12,
  textAlign: "center",
  marginBottom: 20
  
}
const dropdown = {
  position: "absolute",
  top: "100%",
  left: 0,
  right: 0,
  background: "#fff",
  border: "1px solid #e2e8f0",
  borderRadius: 10,
  marginTop: 5,
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  zIndex: 10,
  maxHeight: 200,
  overflowY: "auto"
};

const dropdownItem = {
  padding: "10px 14px",
  cursor: "pointer",
  borderBottom: "1px solid #f1f5f9"
};

const skillsContainer = {
  display: "flex",
  flexWrap: "wrap",
  gap: 10,
  marginTop: 15
};

const skillChip = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  background: "#f1f5ff",
  border: "1px solid #dbeafe",
  padding: "6px 10px",
  borderRadius: 999,
  fontSize: 14
};

const levelBadge = {
  background: "#2563eb",
  color: "#fff",
  padding: "2px 6px",
  borderRadius: 6,
  fontSize: 11
};
const scoreBar = {
  height: 8,
  background: "#e5e7eb",
  borderRadius: 999,
  marginTop: 10,
  marginBottom: 10
};

const scoreFill = {
  height: "100%",
  background: "#10b981",
  borderRadius: 999
};

const whyText = {
  fontSize: 13,
  color: "#475569",
  marginTop: 10
};

const successBox = {
  background: "#ecfdf5",
  border: "1px solid #10b981",
  padding: 15,
  borderRadius: 10,
  marginTop: 15,
  color: "#065f46"
};
