import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../lib/api";

export default function StudentDetails() {

  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get(`/students/${id}`)
      .then(res => {
        console.log("API RESPONSE:", res); // ✅ FIXED
        setData(res); // ✅ FIXED
      })
      .catch(() => alert("Failed to load"));
  }, [id]);

  if (!data) return <p>Loading...</p>;

  const student = data.student || data;

  const fields = [
    { key: "phone", label: "Mobile Number" },
    { key: "dob", label: "Date of Birth" },
    { key: "nationality", label: "Nationality" },
    { key: "gender", label: "Gender" },

    { key: "address", label: "Address" },
    { key: "city", label: "City" },
    { key: "postcode", label: "Postcode" },

    { key: "university", label: "University" },
    { key: "course", label: "Course" },
    { key: "year", label: "Year of Study" },
    { key: "educationDetails", label: "Education Details" }, // ✅ FIXED

    { key: "rightToWork", label: "Right to Work" },

    { key: "emergencyContactName", label: "Emergency Contact Name" },
    { key: "emergencyContactPhone", label: "Emergency Phone" },
    { key: "emergencyContactRelation", label: "Relation" },

    { key: "bankName", label: "Bank Name" },
    { key: "bankAccountNumber", label: "Account Number" },
    { key: "sortCode", label: "Sort Code" },
    { key: "ifscCode", label: "IFSC Code" }
  ];

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        <h2 style={styles.name}>{student.name || "—"}</h2>
        <p style={styles.email}>{student.email || "—"}</p>

        <div style={styles.status}>
          Status: <b>{student.onboardingStatus || "N/A"}</b>
        </div>

        <div style={styles.grid}>
          {fields.map(f => (
            <div key={f.key} style={styles.field}>
              <div style={styles.label}>{f.label}</div>
              <div style={styles.value}>
                {student[f.key] ? student[f.key] : "—"}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: 30,
    background: "#f8fafc",
    minHeight: "100vh"
  },

  card: {
    background: "white",
    padding: 25,
    borderRadius: 12,
    boxShadow: "0 10px 30px rgba(0,0,0,0.05)"
  },

  name: {
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 5
  },

  email: {
    color: "#64748b",
    marginBottom: 10
  },

  status: {
    marginTop: 10,
    background: "#e0f2fe",
    padding: 10,
    borderRadius: 6
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 15,
    marginTop: 20
  },

  field: {
    background: "#f8fafc",
    padding: 12,
    borderRadius: 8
  },

  label: {
    fontSize: 13,
    color: "#64748b"
  },

  value: {
    fontWeight: 600
  }
};