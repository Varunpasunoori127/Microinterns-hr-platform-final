import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

export default function GoogleLoginButton() {
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

      // ✅ Save user data
      localStorage.setItem("microinterns_user", JSON.stringify(data));

      // ✅ Redirect correctly
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
        justifyContent: "center",
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