import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5001/api";

const Login = ({ switchToSignUp }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        alert(`Error: ${data.message}`);
        return;
      }

      // ✅ Save user info cleanly
      localStorage.setItem("userEmail", data.userId);
      localStorage.setItem("userRole", data.role);

      // ✅ Redirect based on role
      if (data.role === "admin") {
        navigate("/admin-dashboard");
      } else if (data.role === "user") {
        navigate("/dashboard");
      } else {
        console.warn("Unknown role detected:", data.role);
        alert("Unknown role. Please contact support.");
      }
    } catch (err) {
      console.error("Login failed:", err);
      alert("An error occurred during login. Please try again.");
    }
  };

  return (
    <form onSubmit={handleLogin} style={styles.form}>
      <input
        type="email"
        placeholder="Email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={styles.input}
      />
      <input
        type="password"
        placeholder="Password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={styles.input}
      />
      <button type="submit" style={styles.submitButton}>
        SIGN IN
      </button>

      <p style={styles.switchText}>
        Don’t have an account?{" "}
        <span style={styles.switchLink} onClick={switchToSignUp}>
          Sign Up
        </span>
      </p>
    </form>
  );
};

const styles = {
  form: {
    width: "50%",
    display: "flex",
    flexDirection: "column",
  },
  input: {
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  submitButton: {
    backgroundColor: "#00796b",
    color: "#ffffff",
    padding: "12px",
    border: "none",
    borderRadius: "20px",
    fontWeight: "bold",
    fontSize: "14px",
    marginTop: "5px",
    cursor: "pointer",
  },
  switchText: {
    fontSize: "12px",
    marginTop: "15px",
    textAlign: "center",
    color: "#333",
  },
  switchLink: {
    color: "#00796b",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default Login;
