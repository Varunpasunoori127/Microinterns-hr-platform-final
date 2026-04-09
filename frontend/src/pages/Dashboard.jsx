import React, { useEffect, useState } from "react";
import StudentTable from "../components/Dashboard/StudentTable";
import AddStudentForm from "../components/Dashboard/AddStudentForm";
import api from "../lib/api";

/* ---------- STAT CARD ---------- */

function StatCard({ title, value }) {
  return (
    <div style={statCard}>
      <div style={{ color: "#64748b", fontSize: 13 }}>{title}</div>
      <div style={{ fontSize: 28, fontWeight: 800 }}>{value}</div>
    </div>
  );
}

export default function Dashboard() {
  

  const [students, setStudents] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [mentors, setMentors] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState("");

  const [matches, setMatches] = useState([]);
  const [toast, setToast] = useState("");

  /* ---------- LOAD ---------- */

  const loadStudents = async () => {
  try {
    const data = await api.get("/students");

    console.log("RAW DATA:", data);

    const fixed = data.map(s => ({
      ...s,
      onboardingStatus: s.onboardingStatus || s.status,
      mentor: s.mentor || s.caseOwner || null // 🔥 KEY FIX
    }));

    setStudents(fixed);

  } catch (err) {
    console.error(err);
  }
};
  

  const loadMentors = async () => {
    try {
      const res = await api.get("/mentors");
      setMentors(res || []);
    } catch {
      setMentors([]);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  /* ---------- OPEN MODAL ---------- */

  const openStudent = async (id) => {
    try {
      const res = await api.get(`/students/${id}`);
      setSelectedStudent(res);
      setShowModal(true);

      await loadMentors();

      let matchRes = [];
      try {
        matchRes = await api.get(`/match/${id}`);
        setMatches(matchRes || []);
      } catch {
        setMatches([]);
      }

      if (matchRes.length > 0) {
        setSelectedMentor(matchRes[0].id);
      }

    } catch {
      setToast("❌ Failed to load student");
    }
  };

  /* ---------- ACTIONS ---------- */

  const assignMentor = async () => {
  try {
    await api.post("/match/assign", {
      studentId: selectedStudent.student.id,
      mentorId: selectedMentor,
    });

    setToast("🎉 Mentor Assigned");

    // 🔥 THIS WAS MISSING
    await loadStudents();

    // 🔥 CLOSE MODAL AFTER UPDATE
    setTimeout(() => {
      setShowModal(false);
    }, 500);

  } catch (err) {
    console.error(err);
    setToast("❌ Assign failed");
  }
};

  const approveStudent = async () => {
  try {
    await api.post(`/students/approve/${selectedStudent.student.id}`);

    setToast("✅ Student Approved");

    loadStudents();

    // 🔥 CLOSE MODAL
    setTimeout(() => {
      setShowModal(false);
    }, 500);

  } catch (err) {
    console.error(err);
    setToast("❌ Failed to approve");
  }
};

   const deleteStudent = async () => {
  try {
    const studentId = selectedStudent?.student?.id;

    if (!studentId) {
      setToast("❌ Invalid student ID");
      return;
    }

    await api.del(`/students/${studentId}`);

    setToast("🗑️ Student Deleted!");

    setShowModal(false);
    loadStudents();

  } catch (err) {
    console.error(err);
    setToast("❌ Delete failed");
  }
};

  /* ---------- COUNTS ---------- */

  const total = students.length;
  const pending = students.filter((s) => s.onboardingStatus?.includes("PEND")).length;
  const active = students.filter((s) => s.onboardingStatus?.includes("ACTIVE")).length;
  const completed = students.filter((s) => s.onboardingStatus?.includes("COMP")).length;

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", padding: 30 }}>

      {/* STATS */}
      <div style={statsGrid}>
        <StatCard title="Total Students" value={total} />
        <StatCard title="Pending" value={pending} />
        <StatCard title="Active" value={active} />
        <StatCard title="Completed" value={completed} />
      </div>

      {/* TABLE */}
      <div style={{ marginTop: 30 }}>
        <button onClick={() => setShowAddForm(true)}>+ Add Student</button>

        {showAddForm && (
  <AddStudentForm
    onSubmit={async (form) => {
      try {
        const res = await api.post("/students", form);

        console.log("TOKEN RESPONSE:", res); // ✅ SEE TOKEN

        // 🔥 AUTO REDIRECT TO SKILLS PAGE
        if (res?.onboardingToken) {
          window.open(`/skills/${res.onboardingToken}`, "_blank");
        }

        loadStudents();
        setShowAddForm(false);

      } catch (err) {
        console.error(err);
        setToast("❌ Failed to add student");
      }
    }}
    onClose={() => setShowAddForm(false)}
  />
)}

        <StudentTable students={students} onView={openStudent} />
      </div>

      {/* MODAL */}
      {showModal && selectedStudent && (
  <div style={overlay}>
    <div style={modal}>

      <div style={header}>
        <div>
          <h2>{selectedStudent.student.name}</h2>
           <small>{selectedStudent.student.email || "No Email"}</small>
        </div>
        <button onClick={() => setShowModal(false)}>✕</button>
      </div>

      <div style={statusBox}>
        Status: <b>{selectedStudent.student.onboardingStatus?.replaceAll("_"," ")}</b>
      </div>

      {/* 🔥 CLEAN STRUCTURED DETAILS */}
      <div style={{ marginTop: 20 }}>
        <h3>Student Details</h3>

        <Section title="Personal Information">
          <Detail label="Phone" value={selectedStudent.student.phone} />
          <Detail label="Date of Birth" value={selectedStudent.student.dob} />
          <Detail label="Nationality" value={selectedStudent.student.nationality} />
          <Detail label="Gender" value={selectedStudent.student.gender} />
        </Section>

        <Section title="Address">
          <Detail label="Address" value={selectedStudent.student.address} />
          <Detail label="City" value={selectedStudent.student.city} />
          <Detail label="Postcode" value={selectedStudent.student.postcode} />
        </Section>

        <Section title="Education">
          <Detail label="University" value={selectedStudent.student.university} />
          <Detail label="Course" value={selectedStudent.student.course} />
          <Detail label="Year" value={selectedStudent.student.year} />
          <Detail label="Deatils" value={selectedStudent.student.educationDetails}/>
        </Section>

        <Section title="Work Eligibility">
          <Detail label="Right to Work" value={selectedStudent.student.rightToWork} />
          <Detail label="Work Experience" value={selectedStudent.student.workExperience}/>
        </Section>

        <Section title="Emergency Contact">
          <Detail label="Name" value={selectedStudent.student.emergencyContactName} />
          <Detail label="Phone" value={selectedStudent.student.emergencyContactPhone} />
          <Detail label="Relation" value={selectedStudent.student.emergencyContactRelation}/>
        </Section>

        <Section title="Bank Details">
          <Detail label="Bank" value={selectedStudent.student.bankName} />
          <Detail label="Account Number" value={selectedStudent.student.bankAccountNumber} />
          <Detail label="Sort Code" value={selectedStudent.student.sortCode} />
          <Detail label="IFSC Code" value={selectedStudent.student.ifscCode} />
        </Section>
      </div>

      {/* MATCHES */}
      <div style={{ marginTop: 20 }}>
        <h3>Recommended Mentors</h3>

        {matches.map((m) => (
          <div key={m.id} style={matchCard}>
            <strong>{m.name}</strong> — {m.score}%
          </div>
        ))}
      </div>

      {/* ASSIGN */}
      <div style={{ marginTop: 20 }}>
        <select
          value={selectedMentor}
          onChange={(e) => setSelectedMentor(Number(e.target.value))}
          style={input}
        >
          <option value="">Select Mentor</option>
          {mentors.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>

        <button onClick={assignMentor} style={btnPrimary}>
          Assign Mentor
        </button>
      </div>

      {/* ACTIONS */}
      <div style={actionRow}>
        <button onClick={approveStudent} style={btnSuccess}>
          Approve Student
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            deleteStudent();
          }}
          style={btnDanger}
        >
          Delete Student
        </button>
      </div>

    </div>
  </div>
)}

      {toast && <div style={toastStyle}>{toast}</div>}
    </div>
  );
}

/* ---------- STYLES ---------- */
function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h4 style={{
        marginBottom: 8,
        fontSize: 16,
        fontWeight: 700,
        color: "#111827"
      }}>
        {title}
      </h4>

      <div style={detailsGrid}>
        {children}
      </div>
    </div>
  );
}

const statsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
  gap: 20
};

const statCard = {
  background: "white",
  padding: 20,
  borderRadius: 12
};

const overlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};

const modal = {
  background: "white",
  padding: 20,
  borderRadius: 12,
  width: "700px",
  maxHeight: "90vh",   // 🔥 important
  overflowY: "auto"    // 🔥 enables scroll
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  position: "sticky",
  top: 0,
  background: "white",
  zIndex: 10,
  paddingBottom: 10
};
const statusBox = {
  background: "#e0f2fe",
  padding: 10,
  borderRadius: 6,
  marginTop: 10
};

const matchCard = {
  background: "#eef2ff",
  padding: 10,
  borderRadius: 6,
  marginTop: 5
};

const input = {
  width: "100%",
  padding: 10,
  marginTop: 10
};

const btnPrimary = {
  marginTop: 10,
  padding: 10,
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: 6
};

const btnSuccess = {
  background: "#10b981",
  color: "white",
  padding: 10,
  border: "none",
  borderRadius: 6
};

const btnDanger = {
  background: "#ef4444",
  color: "white",
  padding: 10,
  border: "none",
  borderRadius: 6
};

const actionRow = {
  display: "flex",
  gap: 12,
  marginTop: 20
};

const toastStyle = {
  position: "fixed",
  bottom: 20,
  right: 20,
  background: "#111827",
  color: "white",
  padding: "12px 20px",
  borderRadius: 8,
  fontWeight: 600
};
function Detail({ label, value }) {
  return (
    <div style={detailCard}>
      <div style={{ fontSize: 12, color: "#64748b" }}>{label}</div>
      <div style={{ fontWeight: 600 }}>
        {value ? value : "Not provided"}
      </div>
    </div>
  );
}
const detailsGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 12,
  marginTop: 10
};

const detailCard = {
  background: "#f8fafc",
  padding: 12,
  borderRadius: 8,
  border: "1px solid #e2e8f0"
};