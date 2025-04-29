// src/components/UserDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ChatModal from "./ChatModal";
import InsightsModal from "./InsightsModal"; // 🆕 New component

const API_BASE = "http://localhost:5001/api";

const UserDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const navigate = useNavigate();
  const email = localStorage.getItem("userEmail");
  const [name, setName] = useState("");

  useEffect(() => {
    if (!email) {
      navigate("/");
      return;
    }
    fetch(`${API_BASE}/tickets/${email}`)
      .then((res) => res.json())
      .then(setTickets)
      .catch(console.error);
  }, [email, navigate]);

  useEffect(() => {
    if (!email) return;
    fetch(`${API_BASE}/users/users`)
      .then((res) => res.json())
      .then((allUsers) => {
        const me = allUsers.find((u) => u.email === email);
        if (me) setName(me.name);
      })
      .catch(console.error);
  }, [email]);

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    navigate("/");
  };

  const handleInsightsClick = (ticket) => {
    setSelectedTicket(ticket);
    setShowInsights(true);
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="menu-container">
          <button
            className="hamburger"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
          {menuOpen && (
            <ul className="dropdown-menu">
              <li onClick={() => { setMenuOpen(false); navigate("/dashboard"); }}>
                Dashboard ▶
              </li>
              <li onClick={handleLogout}>Log Out ↗</li>
            </ul>
          )}
        </div>
      </aside>

      <div className="separator" />

      {/* Main */}
      <div className="main">
        <div className="header-card">
          <h1>Welcome, {name}</h1>
        </div>

        <div className="content-card">
          <button
            className="create-ticket-btn"
            onClick={() => navigate("/create-ticket")}
          >
            CREATE TICKET
          </button>

          {/* tickets table */}
          <div className="table-wrapper">
            <table className="tickets-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Subject</th>
                  <th>Description</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Action</th> {/* ✅ Edit + Insights */}
                </tr>
              </thead>
              <tbody>
                {tickets.length > 0 ? (
                  tickets.map((t) => (
                    <tr key={t.ticketId}>
                      <td>{t.ticketId}</td>
                      <td>{t.title}</td>
                      <td>{t.description}</td>
                      <td>{t.priority}</td>
                      <td>{t.status}</td>
                      <td>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <button
                            onClick={() => navigate(`/edit-ticket/${t.ticketId}`, { state: t })}
                            style={{
                              backgroundColor: "#fbbf24",
                              border: "none",
                              padding: "0.5rem 1rem",
                              borderRadius: "16px",
                              fontWeight: "600",
                              cursor: "pointer",
                              color: "#1f2937",
                              transition: "all 0.3s ease-in-out",
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = "#facc15"}
                            onMouseOut={(e) => e.target.style.backgroundColor = "#fbbf24"}
                          >
                            Edit
                          </button>

                          {/* 🆕 AI Insights Button */}
                          <button
                            onClick={() => handleInsightsClick(t)}
                            style={{
                              backgroundColor: "#7f5af0",
                              border: "none",
                              padding: "0.5rem 1.5rem",
                              borderRadius: "16px",
                              fontWeight: "600",
                              cursor: "pointer",
                              color: "#fff",
                              transition: "all 0.3s ease-in-out",
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = "#6246ea"}
                            onMouseOut={(e) => e.target.style.backgroundColor = "#7f5af0"}
                          >
                            AI Insights
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center" }}>
                      No tickets yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Floating Ask AI Button */}
      <button
        onClick={() => setShowChat(true)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          backgroundColor: "#7f5af0",
          color: "#fff",
          border: "none",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          fontSize: "1.5rem",
          cursor: "pointer",
          boxShadow: "0 8px 20px rgba(127, 90, 240, 0.3)",
          zIndex: 999,
        }}
      >
        💬
      </button>

      {/* Chat Modal */}
      {showChat && (
        <ChatModal onClose={() => setShowChat(false)} />
      )}

      {/* 🆕 Insights Modal */}
      {showInsights && selectedTicket && (
        <InsightsModal ticket={selectedTicket} onClose={() => setShowInsights(false)} />
      )}
    </div>
  );
};

export default UserDashboard;
