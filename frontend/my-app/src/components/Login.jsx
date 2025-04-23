// src/components/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5001/api";

const Login = () => {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const navigate                = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (!response.ok) {
        alert(`Error: ${data.message}`);
        return;
      }
      localStorage.setItem("userEmail", data.userId);
      localStorage.setItem("userRole", data.role);
      if (data.role === "admin") navigate("/admin-dashboard");
      else                navigate("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
      alert("An error occurred during login.");
    }
  };

  return (
    <div className="form-container">
      <h2>Log In</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter Email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter Password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Log In</button>
      </form>

      {/* only forgot-password link now */}
      <div className="form-footer">
        <a href="/forgot-password">Forgot Password?</a>
      </div>
    </div>
  );
};

export default Login;