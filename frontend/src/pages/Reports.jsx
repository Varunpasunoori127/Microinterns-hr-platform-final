import React from "react";

export default function Reports() {
  return (
    <div style={{padding:30}}>

      <h1>📊 Reports & Analytics</h1>

      <div style={card}>
        <h3>Total Students</h3>
        <p>120</p>
      </div>

      <div style={card}>
        <h3>Total Mentors</h3>
        <p>25</p>
      </div>

      <div style={card}>
        <h3>Matches Completed</h3>
        <p>85</p>
      </div>

    </div>
  );
}

const card={
  background:"white",
  padding:20,
  marginTop:15,
  borderRadius:10
};