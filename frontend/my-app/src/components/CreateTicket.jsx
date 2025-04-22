// src/components/CreateTicket.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:5001/api"; // <-- match your backend port

export default function CreateTicket() {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [status, setStatus] = useState("open");
  const [tickets, setTickets] = useState([]);

  // Load existing tickets
  useEffect(() => {
    if (!userEmail) return navigate("/");
    fetch(`${API_BASE}/tickets/${userEmail}`)
      .then((r) => r.json())
      .then(setTickets)
      .catch((err) => console.error("Fetch tickets failed:", err));
  }, [userEmail, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title: subject,
      description,
      priority,
      status,
      userEmail,
    };

    try {
      const res = await fetch(`${API_BASE}/tickets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log("Create response status:", res.status, res.statusText);
      const data = await res.json();
      console.log("Create response body:", data);

      if (!res.ok) {
        // server responded but with an error code
        alert(`Error creating ticket: ${data.message || res.statusText}`);
        return;
      }

      // success: add to list
      setTickets((prev) => [
        {
          ticketId: data.ticketId,
          title: subject,
          description,
          priority,
          status,
        },
        ...prev,
      ]);
      // clear form
      setSubject("");
      setDescription("");
      setPriority("medium");
      setStatus("open");
    } catch (err) {
      // network error or JSON parse error
      console.error("Network or parsing error:", err);
      alert("Network error: could not create ticket.");
    }
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <button className="hamburger">☰</button>
        <nav>
          <ul>
            <li onClick={() => navigate("/dashboard")}>← Back to Dashboard</li>
            <li
              onClick={() => {
                localStorage.removeItem("userEmail");
                navigate("/");
              }}
            >
              Log Out ↗
            </li>
          </ul>
        </nav>
      </aside>

      <div className="separator" />

      <div className="main">
        <div className="form-container">
          <h2>Create Ticket</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Ticket Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Ticket Description</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                required
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="form-group">
              <label>Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
              >
                <option value="open">Open</option>
                <option value="in progress">In Progress</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <button type="submit">Submit Ticket</button>
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              style={{
                marginTop: "1rem",
                background: "#cccccc",
                color: "#333",
                width: "100%",
              }}
            >
              Cancel
            </button>
          </form>
        </div>

        <div className="content-card">
          <h2>Your Tickets</h2>
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
                {tickets.length ? (
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
                    <td
                      colSpan="6"
                      style={{ textAlign: "center", padding: "1rem" }}
                    >
                      No tickets yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
