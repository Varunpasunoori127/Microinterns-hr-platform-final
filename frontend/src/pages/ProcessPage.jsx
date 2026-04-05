import React from 'react';
import { Link } from 'react-router-dom';

export default function ProcessPage() {
  return (
    <div style={{ minHeight: '100vh', padding: 24, background: '#f8fafc' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={{ margin: 0 }}>Onboarding Process</h1>
        <nav style={{ display: 'flex', gap: 12 }}>
          <Link to="/home">Home</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/flowchart">Flowchart</Link>
        </nav>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
        <div style={{ background: 'white', padding: 20, borderRadius: 8 }}>
          <h2>Process overview</h2>
          <ol>
            <li>Receive candidate application</li>
            <li>HR reviews and creates student record</li>
            <li>Assign internship case and mentor</li>
            <li>Track progress and capture evaluations</li>
            <li>Complete verification and archive</li>
          </ol>
        </div>
        <aside style={{ background: 'white', padding: 16, borderRadius: 8 }}>
          <h3 style={{ marginTop: 0 }}>Resources</h3>
          <p>Open the process diagram for a detailed visual: <a href="/docs/MicroInterns Onboarding and Offboarding Process.png" target="_blank" rel="noreferrer">process image</a></p>
        </aside>
      </div>
    </div>
  );
}
