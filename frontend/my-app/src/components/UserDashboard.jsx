// frontend/my-app/src/components/UserDashboard.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./UserDashboard.css"; // adjust if your CSS filename differs

const UserDashboard = () => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    // fetch user tickets here, e.g.:
    // fetch(`http://localhost:5001/api/tickets/${userEmail}`)
    //   .then(res => res.json())
    //   .then(setTickets)
    //   .catch(console.error);
  }, []);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Your Tickets</h1>
        <Link to="/create-ticket">
          <button className="dashboard-create-button">Create Ticket</button>
        </Link>
      </header>

      <section className="ticket-list">
        {tickets.length === 0 ? (
          <p>No tickets found. Click “Create Ticket” to open one.</p>
        ) : (
          tickets.map((ticket) => (
            <div key={ticket.ticketId} className="ticket-card">
              <h3>{ticket.title}</h3>
              <p>Severity: {ticket.priority}</p>
              <p>Status: {ticket.status}</p>
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default UserDashboard;
