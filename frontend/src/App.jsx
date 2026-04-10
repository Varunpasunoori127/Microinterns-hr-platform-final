import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

/* LAYOUTS */
import MainLayout from "./layouts/MainLayout.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";

/* PUBLIC PAGES */
import MainUI from "./pages/MainUI";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

/* DASHBOARD PAGES */
import Dashboard from "./pages/Dashboard";
import StudentDetails from "./pages/Studentdetails";
import MatchPage from "./pages/MatchPage";
import MentorPage from "./pages/MentorPage";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

/* ONBOARDING */
import OnboardingForm from "./pages/StudentOnboardingPage";
import StudentSkillsPage from "./pages/StudentSkillsPage";

function App() {

  const [loading, setLoading] = useState(true);

  console.log("CLIENT ID:", import.meta.env.VITE_GOOGLE_CLIENT_ID);

  /* 🔥 AUTO WAKE BACKEND (IMPORTANT) */
  useEffect(() => {
    fetch("https://microinterns-hr-platform-final.onrender.com")
      .then(() => {
        console.log("Backend awake ✅");
        setLoading(false);
      })
      .catch(() => {
        console.log("Waking backend...");
        setTimeout(() => setLoading(false), 2000);
      });
  }, []);

  /* 🔥 GLOBAL LOADING SCREEN */
  if (loading) {
    return (
      <div style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#f9fafb"
      }}>
        <h2 style={{ marginBottom: 10 }}>MicroInterns</h2>
        <p>Starting system... ⏳</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC + AUTH ROUTES */}
        <Route
          path="/"
          element={
            <MainLayout>
              <MainUI />
            </MainLayout>
          }
        />

        <Route
          path="/login"
          element={
            <MainLayout>
              <LoginPage />
            </MainLayout>
          }
        />

        <Route
          path="/signup"
          element={
            <MainLayout>
              <SignupPage />
            </MainLayout>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <MainLayout>
              <ForgotPasswordPage />
            </MainLayout>
          }
        />

        <Route
          path="/reset-password"
          element={
            <MainLayout>
              <ResetPasswordPage />
            </MainLayout>
          }
        />

        {/* ONBOARDING */}
        <Route path="/onboarding" element={<OnboardingForm />} />
        <Route path="/onboarding/:token" element={<OnboardingForm />} />
        <Route path="/skills/:token" element={<StudentSkillsPage />} />

        {/* PROTECTED ROUTES */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/student/:id" element={<StudentDetails />} />
          <Route path="/match/:studentId" element={<MatchPage />} />
          <Route path="/mentors" element={<MentorPage />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;