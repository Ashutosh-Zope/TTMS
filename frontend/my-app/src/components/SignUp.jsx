// src/components/SignUp.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5001/api";

const SignUp = () => {
  const [name, setName]           = useState("");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [phone, setPhone]         = useState("");
  const [departments, setDepts]   = useState([]);
  const [deptId, setDeptId]       = useState("");
  const navigate = useNavigate();

  // fetch departments on mount
  useEffect(() => {
    fetch(`${API_BASE}/users/departments`)
      .then((r) => r.json())
      .then(setDepts)
      .catch(console.error);
  }, []);

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/users/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          phone,
          departmentIds: deptId ? [deptId] : []
        }),
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        navigate("/");
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (err) {
      console.error("Signup fetch failed:", err);
      alert("An error occurred during sign up.");
    }
  };

  return (
    <div className="form-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignUp}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            placeholder="Enter Full Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
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
        <div className="form-group">
          <label>Phone</label>
          <input
            type="tel"
            placeholder="Enter Phone Number"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Department</label>
          <select
            value={deptId}
            onChange={(e) => setDeptId(e.target.value)}
            required
          >
            <option value="" disabled>
              Select department…
            </option>
            {departments.map((d) => (
              <option key={d.departmentId} value={d.departmentId}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Create Account</button>
      </form>
      <div className="form-footer">
        <a href="/">Already have an account? Log In</a>
      </div>
    </div>
  );
};

export default SignUp;
