import React, { useState, useEffect } from "react";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5001/api";

const SignUp = ({ switchToLogin }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [departments, setDepartments] = useState([]);
  const [deptId, setDeptId] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/users/departments`)
      .then((res) => res.json())
      .then(setDepartments)
      .catch(console.error);
  }, []);

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
        body: JSON.stringify({ name, email, password, phone, departmentIds: deptId ? [deptId] : [] }),
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
      {/* Form starts immediately without social buttons */}
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
        <select
          value={deptId}
          onChange={(e) => setDeptId(e.target.value)}
          required
          style={styles.input}
        >
          <option value="" disabled>Select department…</option>
          {departments.map((dept) => (
            <option key={dept.departmentId} value={dept.departmentId}>{dept.name}</option>
          ))}
        </select>

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
