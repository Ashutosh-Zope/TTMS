// src/components/UserDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5001/api";

const UserDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalTicket, setModalTicket] = useState(null);
  const navigate = useNavigate();
  const email = localStorage.getItem("userEmail");

  useEffect(() => {
    if (!email) {
      navigate("/");
      return;
    }
    // Load only this user's tickets
    fetch(`${API_BASE}/tickets/${email}`)
      .then((res) => res.json())
      .then(setTickets)
      .catch(console.error);
  }, [email, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    navigate("/");
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
              <li
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/dashboard");
                }}
              >
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
          <h1>Welcome, {email.split("@")[0]}</h1>
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
                  <th>Action</th>
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
                        <button
                          className="edit-btn"
                          onClick={() =>
                            navigate(`/edit-ticket/${t.ticketId}`, { state: t })
                          }
                        >
                          Edit
                        </button>
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

      {/* Detail Modal */}
      {modalTicket && (
        <div className="modal-overlay" onClick={() => setModalTicket(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-btn"
              onClick={() => setModalTicket(null)}
            >
              ×
            </button>
            <h2>Ticket Details</h2>
            <p><strong>ID:</strong> {modalTicket.ticketId}</p>
            <p><strong>Subject:</strong> {modalTicket.title}</p>
            <p><strong>Description:</strong> {modalTicket.description}</p>
            <p>
              <strong>Priority:</strong>{" "}
              <span className={`priority-badge ${modalTicket.priority}`}>
                {modalTicket.priority}
              </span>
            </p>
            <p><strong>Status:</strong> {modalTicket.status}</p>
            <div style={{ marginTop: "1rem" }}>
              <button
                className="edit-btn"
                onClick={() => {
                  setModalTicket(null);
                  navigate(`/edit-ticket/${modalTicket.ticketId}`, {
                    state: modalTicket,
                  });
                }}
              >
                Edit Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;