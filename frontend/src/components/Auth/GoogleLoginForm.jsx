import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

export default function GoogleLoginButton() {
  console.log("CLIENT ID:", import.meta.env.VITE_GOOGLE_CLIENT_ID);
  console.log("ORIGIN:", window.location.origin);
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    try {
      const credential = credentialResponse.credential;

      if (!credential) {
        console.error("No credential received from Google");
        return;
      }

      // Send credential to backend
      const response = await fetch(`${import.meta.env.VITE_API_URL}/student-auth/google`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ credential })
      });

      if (!response.ok) {
        console.error("Backend error:", response.status);
        return;
      }

      const data = await response.json();

      // Save user locally
      localStorage.setItem(
        "microinterns_user",
        JSON.stringify({
          email: data.email,
          name: data.name
        })
      );

      // Navigation logic
      if (!data.onboardingCompleted && data.onboardingToken) {
        navigate(`/onboarding/${data.onboardingToken}`);
      } else {
        navigate("/dashboard");
      }

    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => console.log("Google Login Failed")}
      useOneTap={false}
    />
  );
}

<div style={{
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "20px"
}}></div>
