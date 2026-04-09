import React from "react";
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

  console.log("CLIENT ID:", import.meta.env.VITE_GOOGLE_CLIENT_ID);

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

        {/* ✅ ONBOARDING (NO NAVBAR — CLEAN UI) */}
        <Route path="/onboarding" element={<OnboardingForm />} />
        <Route path="/onboarding/:token" element={<OnboardingForm />} />
        <Route path="/skills/:token" element={<StudentSkillsPage />} />

        {/* 🔒 PROTECTED DASHBOARD ROUTES */}
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