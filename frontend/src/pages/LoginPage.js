import React, { useEffect } from "react";
import './LoginPage.css';

const LoginPage = () => {
  const handleGoogleLogin = async (response) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: response.credential }),
      });

      const data = await res.json();

      if (data.token) {
        localStorage.setItem("token", data.token);

        const decodedToken = JSON.parse(atob(data.token.split(".")[1]));

        if (decodedToken.role === "admin") {
          window.location.href = "/admin";
        } else {
          alert("⛔ Access Denied: You do not have admin privileges.");
        }
      } else {
        alert("❌ Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Google Login Error:", error);
      alert("❌ An unexpected error occurred during login.");
    }
  };

  useEffect(() => {
    const initializeGoogleButton = () => {
      if (window.google?.accounts) {
        window.google.accounts.id.initialize({
          client_id: "890174912323-ehq52mrde95htt1q0j7c36no7cqua86h.apps.googleusercontent.com",
          callback: handleGoogleLogin,
        });

        window.google.accounts.id.renderButton(
          document.getElementById("googleSignInDiv"),
          { theme: "outline", size: "large" }
        );
      } else {
        setTimeout(initializeGoogleButton, 100);
      }
    };

    initializeGoogleButton();
  }, []);

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2>🔐 Admin Access</h2>
        <p>Please sign in with your authorized Google account to continue.</p>
        <div id="googleSignInDiv"></div>
      </div>
    </div>
  );
};

export default LoginPage;
