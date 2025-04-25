import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5001/api";

export default function AllTickets() {
  const [tickets, setTickets] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalTicket, setModalTicket] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const email = localStorage.getItem("userEmail");

  useEffect(() => {
    if (!email) {
      navigate("/");
      return;
    }

    fetch(`${API_BASE}/tickets/all`)
      .then((r) => r.json())
      .then((allTickets) => {
        console.log("Fetched Tickets:", allTickets);
        if (allTickets.length > 0) {
          console.log("Sample Ticket:", allTickets[0]);
        }

        const query = new URLSearchParams(location.search);
        const statusFilter = query.get("status");

        if (statusFilter === "active") {
          setTickets(
            allTickets.filter((t) => {
              const status = t.status?.toLowerCase();
              return status === "open" || status === "in progress";
            })
          );
        } else if (statusFilter === "closed") {
          setTickets(
            allTickets.filter((t) => t.status?.toLowerCase() === "closed")
          );
        } else {
          setTickets(allTickets);
        }
      })
      .catch(console.error);
  }, [email, navigate, location.search]);

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    navigate("/");
  };

  const low = tickets.filter((t) => t.priority?.toLowerCase() === "low");
  const medium = tickets.filter((t) => t.priority?.toLowerCase() === "medium");
  const high = tickets.filter((t) => t.priority?.toLowerCase() === "high");

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
              <li onClick={() => { setMenuOpen(false); navigate("/admin-dashboard"); }}>
                Dashboard ▶
              </li>
              <li onClick={() => { setMenuOpen(false); navigate("/all-tickets"); }}>
                View All Tickets ▶
              </li>
              <li onClick={() => { setMenuOpen(false); navigate("/view-users"); }}>
                View Users ▶
              </li>
              <li onClick={handleLogout}>Log Out ↗</li>
            </ul>
          )}
        </div>
      </aside>

      <div className="separator" />

      {/* Main content */}
      <div className="main">
        <div className="header-card">
          <h1>All Tickets</h1>
        </div>

        <div className="content-card">
          <div className="cards-grid-header">
            <div>Low</div>
            <div>Medium</div>
            <div>High</div>
          </div>

          <div className="cards-grid">
            <div>
              {low.map((t) => (
                <div
                  key={t.ticketId}
                  className="ticket-card"
                  onClick={() => setModalTicket(t)}
                >
                  <h3>{t.title}</h3>
                  <p>
                    <strong>Priority:</strong>{" "}
                    <span className="priority-badge low">low</span>
                  </p>
                  <p><strong>Status:</strong> {t.status}</p>
                </div>
              ))}
            </div>
            <div>
              {medium.map((t) => (
                <div
                  key={t.ticketId}
                  className="ticket-card"
                  onClick={() => setModalTicket(t)}
                >
                  <h3>{t.title}</h3>
                  <p>
                    <strong>Priority:</strong>{" "}
                    <span className="priority-badge medium">medium</span>
                  </p>
                  <p><strong>Status:</strong> {t.status}</p>
                </div>
              ))}
            </div>
            <div>
              {high.map((t) => (
                <div
                  key={t.ticketId}
                  className="ticket-card"
                  onClick={() => setModalTicket(t)}
                >
                  <h3>{t.title}</h3>
                  <p>
                    <strong>Priority:</strong>{" "}
                    <span className="priority-badge high">high</span>
                  </p>
                  <p><strong>Status:</strong> {t.status}</p>
                </div>
              ))}
            </div>

            {tickets.length === 0 && (
              <p style={{ gridColumn: "1 / -1", textAlign: "center" }}>
                No tickets yet.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalTicket && (
        <div className="modal-overlay" onClick={() => setModalTicket(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setModalTicket(null)}>
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
}
