// src/components/AuthPage.jsx
import React from "react";
import Login from "./Login";
import SignUp from "./SignUp";

export default function AuthPage() {
  return (
    <div className="auth-container">
      {/* Left side: Login */}
      <div className="panel login-panel">
        <Login />
      </div>

      {/* Right side: Sign-Up */}
      <div className="panel signup-panel">
        <h2 className="signup-title">Sign Up</h2>
        {/* social buttons */}
        <button className="social-btn google">
          Continue with Google
        </button>
        <button className="social-btn linkedin">
          Continue with LinkedIn
        </button>
        {/* then your normal sign-up form */}
        <SignUp />
      </div>
    </div>
  );
}