import React, { useState } from "react";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5001/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        // store for subsequent pages
        localStorage.setItem("userEmail", data.userId);
        window.location.href = "/dashboard";
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Login fetch failed:", error);
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
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Log In</button>
      </form>
      <div className="form-footer">
        <a href="/signup">Create an account</a>
        <a href="/forgot-password">Forgot Password?</a>
      </div>
    </div>
  );
};

export default Login;
