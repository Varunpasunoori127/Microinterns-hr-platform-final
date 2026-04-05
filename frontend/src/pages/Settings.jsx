import React from "react";

export default function Settings() {
  return (
    <div style={{padding:30}}>

      <h1>⚙️ Settings</h1>

      <div style={{marginTop:20}}>
        <h3>Profile</h3>
        <p>Name: HR Admin</p>
        <p>Email: admin@microinterns.com</p>
      </div>

      <div style={{marginTop:20}}>
        <h3>Security</h3>
        <button>Change Password</button>
      </div>

    </div>
  );
}