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

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/student-auth/google`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ credential }),
        }
      );

      if (!response.ok) {
        console.error("Backend error:", response.status);
        return;
      }

      const data = await response.json();

      console.log("LOGIN RESPONSE:", data);

      /* 🔥 SAVE TOKEN (FIXED) */
      if (data.token) {
        localStorage.setItem("token", data.token);
      } else {
        console.error("Token missing from backend response");
        return;
      }

      /* 🔥 SAVE USER INFO */
      localStorage.setItem(
        "microinterns_user",
        JSON.stringify({
          email: data.email,
          name: data.name,
        })
      );

      /* 🔥 REDIRECT LOGIC */
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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
        width: "100%",
        marginTop: "20px",
      }}
    >
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => console.log("Google Login Failed")}
        useOneTap={false}
        theme="outline"
        size="large"
        text="continue_with"
        shape="pill"
      />
    </div>
  );
}