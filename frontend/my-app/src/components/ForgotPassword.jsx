import React, { useState } from "react";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5001/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/users/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Forgot-password fetch failed:", error);
      alert("An error occurred while resetting password.");
    }
  };

  return (
    <div className="form-container">
      <h2>Forgot Password</h2>
      <form onSubmit={handleForgotPassword}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button type="submit">Reset Password</button>
      </form>
      <div className="form-footer">
        <a href="/">Back to Login</a>
      </div>
    </div>
  );
};

export default ForgotPassword;
