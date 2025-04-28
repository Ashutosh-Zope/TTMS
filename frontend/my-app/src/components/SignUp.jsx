import React, { useState } from "react";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5001/api";

const SignUp = ({ switchToLogin }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    try {
      const response = await fetch(`${API_BASE}/users/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone }),
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        window.location.href = "/";
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Signup fetch failed:", error);
      alert("An error occurred during sign up.");
    }
  };

  return (
    <>
      {/* Social Buttons */}
      <div style={styles.socialIcons}>
        <a href="https://accounts.google.com" target="_blank" rel="noopener noreferrer">
          <button style={{ ...styles.iconButton, backgroundColor: "#db4437" }}>
            <span style={styles.iconText}>G+</span>
          </button>
        </a>
        <a href="https://www.linkedin.com/login" target="_blank" rel="noopener noreferrer">
          <button style={{ ...styles.iconButton, backgroundColor: "#0077b5" }}>
            <span style={styles.iconText}>in</span>
          </button>
        </a>
      </div>

      <p style={styles.orText}>or use your email for registration:</p>

      <form onSubmit={handleSignUp} style={styles.form}>
        <input
          type="text"
          placeholder="Name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={styles.input}
        />
        <input
          type="tel"
          placeholder="Phone"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={styles.input}
        />
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
        <input
          type="password"
          placeholder="Confirm Password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.submitButton}>
          SIGN UP
        </button>

        <p style={styles.switchText}>
          Already have an account?{" "}
          <span style={styles.switchLink} onClick={switchToLogin}>
            Sign In
          </span>
        </p>
      </form>
    </>
  );
};

const styles = {
  socialIcons: {
    display: "flex",
    gap: "20px",
    marginBottom: "10px",
  },
  iconButton: {
    width: "40px",
    height: "50px",
    borderRadius: "50%",
    border: "none",
    backgroundColor: "#ccc",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
  },
  iconText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: "18px",
  },
  orText: {
    fontSize: "12px",
    marginBottom: "20px",
    color: "#777",
  },
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
    marginTop: "10px",
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

export default SignUp;
