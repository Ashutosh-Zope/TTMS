// resetpassword.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5001/api";

export default function ResetPassword() {
  const [email, setEmail]         = useState("");
  const [code, setCode]           = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm]     = useState("");
  const [error, setError]         = useState("");
  const [success, setSuccess]     = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");

    if (newPassword !== confirm) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/users/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, newPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Reset failed");
      setSuccess("Your password has been reset! You can now log in.");
      // Optionally redirect after a delay:
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="form-container">
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        {error   && <p className="form-error">{error}</p>}
        {success && <p className="form-success">{success}</p>}

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Reset Code</label>
          <input
            type="text"
            placeholder="6-digit code"
            required
            value={code}
            onChange={e => setCode(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>New Password</label>
          <input
            type="password"
            placeholder="Enter new password"
            required
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            placeholder="Re-enter new password"
            required
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
          />
        </div>

        <button type="submit">Reset Password</button>
      </form>

      <div className="form-footer">
        <a onClick={() => navigate("/")} className="footer-link">
          Back to Log In
        </a>
      </div>
    </div>
  );
}