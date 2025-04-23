// src/components/AdminDashboard.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="menu-container">
          <button
            className="hamburger"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
          {menuOpen && (
            <ul className="dropdown-menu">
              <li
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/admin-dashboard");
                }}
              >
                Dashboard ▶
              </li>
              <li
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/all-tickets");
                }}
              >
                View All Tickets ▶
              </li>
              <li
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/view-users");
                }}
              >
                View Users ▶
              </li>
              <li onClick={handleLogout}>Log Out ↗</li>
            </ul>
          )}
        </div>
      </aside>

      <div className="separator" />

      {/* Main Content */}
      <div className="main">
        <div className="header-card">
          <h1>Admin Dashboard</h1>
        </div>
        <div className="content-card chart-container">
          {/* Sample Donut Chart */}
          <svg width="200" height="200" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="80" fill="#e5e7eb" />
            <path
              d="M100,100 L100,20 A80,80 0 0,1 180,100 z"
              fill="#7f5af0"
            />
            <path
              d="M100,100 L180,100 A80,80 0 0,1 144.3,175.2 z"
              fill="#6246ea"
            />
            <path
              d="M100,100 L144.3,175.2 A80,80 0 0,1 20,100 z"
              fill="#e63946"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}