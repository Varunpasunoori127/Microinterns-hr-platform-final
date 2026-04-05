import React from 'react';
import { Link } from 'react-router-dom';

export default function FlowchartPage() {
  return (
    <div style={{ minHeight: '100vh', padding: 24, background: '#f8fafc' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={{ margin: 0 }}>Onboarding Flowchart</h1>
        <nav style={{ display: 'flex', gap: 12 }}>
          <Link to="/home">Home</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/archive">Archive</Link>
        </nav>
      </header>

      <main style={{ display: 'flex', gap: 20 }}>
        <section style={{ flex: 1 }}>
          <div style={{ background: 'white', padding: 20, borderRadius: 8, boxShadow: '0 1px 4px rgba(2,6,23,0.06)' }}>
            <p style={{ marginTop: 0 }}>This page represents the onboarding/offboarding flowchart used by MicroInterns HR. For a visual reference the repository contains the original image files under the `docs/` folder.</p>
            <p>You can open the image file <code>docs/MicroInterns Onboarding and Offboarding Flowchart Update.png</code> in your editor to view the exact diagram.</p>
          </div>
        </section>
        <aside style={{ width: 320 }}>
          <div style={{ background: 'white', padding: 16, borderRadius: 8 }}>
            <h3 style={{ marginTop: 0 }}>Quick links</h3>
            <ul>
              <li><a href="/docs/MicroInterns Onboarding and Offboarding Flowchart Update.png" target="_blank" rel="noreferrer">Open flowchart image</a></li>
              <li><a href="/docs/MicroInterns Onboarding and Offboarding Process.png" target="_blank" rel="noreferrer">Open process image</a></li>
            </ul>
          </div>
        </aside>
      </main>
    </div>
  );
}
