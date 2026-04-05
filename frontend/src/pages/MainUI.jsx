import React from "react";
import { useNavigate } from "react-router-dom";

import logo from "../assets/logo.png";
import hero from "../assets/hero.png";
import onboarding from "../assets/onboarding.png";
import ownership from "../assets/ownership.png";
import documents from "../assets/documents.png";
import tracking from "../assets/tracking.png";
import dashboard from "../assets/dashboard.png";

import matching from "../assets/Matchmaking.png";
import mentor from "../assets/Mentor.png";
import skills from "../assets/Skills.png";

export default function MainUI() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("microinterns_user"));
  const token = localStorage.getItem("token");

  const goProtected = (path) => {
    if (!token) {
      navigate("/login", { state: { message: "Please login to continue" } });
    } else {
      navigate(path);
    }
  };

  const scrollTo = (id) => {
    document.getElementById(id).scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "#f8fafc" }}>

      {/* HERO */}
      <section style={heroSection}>
        <div style={{ maxWidth: 560 }}>
          <h1 style={heroTitle}>
            Smart Internship <br />
            <span style={{ color: "#2563eb" }}>Management Platform</span>
          </h1>

          <p style={heroText}>
            MicroInterns is a smart internship management platform designed to streamline onboarding, automate mentor matching, and track student progress efficiently.
          </p>

          <div>
            <button
              style={heroBtn}
              onClick={() => navigate(token ? "/dashboard" : "/login")}
            >
              {token ? "Go to Dashboard →" : "Get Started →"}
            </button>

            <button
              style={{ ...heroBtn, background: "#16a34a", marginLeft: 10 }}
              onClick={() => goProtected("/match/1")}
            >
              {token ? "Start Matching →" : "Login to Match →"}
            </button>
          </div>
        </div>

        <img src={hero} alt="hero" style={{ width: 420 }} />
      </section>

      {/* TRUST */}
      <section style={trustSection}>
        <h3>Trusted for modern internship management</h3>
        <p>Built for universities, HR teams, and students</p>
      </section>

      {/* FEATURES */}
      <section id="features" style={featureSection}>
        <h2 style={sectionTitle}>Everything You Need</h2>

        <div style={featureGrid}>
          <FeatureCard icon={onboarding} title="Digital Onboarding"
            text="Streamline intern onboarding with structured forms and automation."
            onClick={() => navigate("/onboarding")} />

          <FeatureCard icon={ownership} title="Case Ownership"
            text="Assign HR managers and track responsibility clearly."
            onClick={() => goProtected("/dashboard")} />

          <FeatureCard icon={documents} title="Secure Documents"
            text="Upload and manage sensitive documents securely."
            onClick={() => goProtected("/dashboard")} />

          <FeatureCard icon={tracking} title="Progress Tracking"
            text="Monitor each stage of the internship lifecycle."
            onClick={() => goProtected("/dashboard")} />

          <FeatureCard icon={matching} title="Mentor Matching"
            text="Match students with mentors based on skills."
            onClick={() => goProtected("/dashboard")} />

          <FeatureCard icon={mentor} title="Mentor Management"
            text="Add and manage mentors."
            onClick={() => goProtected("/mentors")} />

          <FeatureCard icon={skills} title="Skill Analysis"
            text="Identify skill gaps and growth."
            onClick={() => goProtected("/reports")} />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" style={howSection}>
        <h2 style={sectionTitle}>How It Works</h2>

        <div style={stepsGrid}>
          <Step title="1. Add Students" text="HR creates student profiles and sends onboarding links." />
          <Step title="2. Complete Onboarding" text="Students submit their details and documents." />
          <Step title="3. Match with Mentors" text="System recommends best mentors based on skills." />
          <Step title="4. Track Progress" text="Monitor internship lifecycle from dashboard." />
        </div>
      </section>

      {/* DASHBOARD PREVIEW */}
      <section style={dashboardSection}>
        <h2 style={sectionTitle}>Powerful Dashboard</h2>
        <p style={{ color: "#64748b" }}>Manage everything from one central place</p>

        <img
          src={dashboard}
          alt="dashboard"
          style={{ width: "80%", marginTop: 30, borderRadius: 12 }}
        />
      </section>

      {/* CTA */}
      <section style={ctaSection}>
        <h2>Transform Internship Management</h2>
        <p>
          Centralise onboarding, mentor allocation, and performance tracking in one intelligent platform.
        </p>

        <button
          style={heroBtn}
          onClick={() => navigate(token ? "/dashboard" : "/signup")}
        >
          {token ? "Open Dashboard →" : "Create Account →"}
        </button>
      </section>

      {/* FOOTER */}
      <footer style={footer}>
        <p>© 2026 MicroInterns. All rights reserved.</p>
      </footer>
    </div>
  );
}

/* COMPONENTS */

function FeatureCard({ icon, title, text, onClick }) {
  const [hover, setHover] = React.useState(false);

  return (
    <div
      onClick={onClick}
      style={{
        ...featureCard,
        transform: hover ? "translateY(-6px)" : "none",
        boxShadow: hover
          ? "0 15px 35px rgba(0,0,0,0.08)"
          : "0 6px 18px rgba(0,0,0,0.04)"
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <img src={icon} style={{ height: 55 }} />
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

function Step({ title, text }) {
  return (
    <div style={stepCard}>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

/* STYLES */

const heroSection = {
  display: "flex",
  justifyContent: "space-between",
  padding: "120px 80px"
};

const heroTitle = {
  fontSize: 48,
  fontWeight: 800
};

const heroText = {
  margin: "20px 0",
  color: "#475569"
};

const heroBtn = {
  background: "#2563eb",
  color: "white",
  padding: "12px 20px",
  borderRadius: 8,
  border: "none",
  cursor: "pointer",
  marginTop: 10
};

const trustSection = {
  textAlign: "center",
  padding: 40,
  color: "#64748b"
};

const featureSection = {
  padding: "100px 80px"
};

const featureGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
  gap: 30
};

const featureCard = {
  background: "white",
  padding: 25,
  borderRadius: 14,
  cursor: "pointer",
  transition: "0.2s"
};

const howSection = {
  padding: "100px 80px",
  background: "#f1f5f9"
};

const stepsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
  gap: 20
};

const stepCard = {
  background: "white",
  padding: 20,
  borderRadius: 10
};

const dashboardSection = {
  padding: "100px 80px",
  textAlign: "center"
};

const ctaSection = {
  textAlign: "center",
  padding: 80,
  background: "#0f172a",
  color: "white"
};

const footer = {
  textAlign: "center",
  padding: 40
};

const sectionTitle = {
  fontSize: 32,
  fontWeight: 700,
  textAlign: "center"
};