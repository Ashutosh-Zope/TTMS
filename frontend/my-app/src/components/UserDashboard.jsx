import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const navigate = useNavigate();
  const email = localStorage.getItem("userEmail");

  useEffect(() => {
    if (!email) return navigate("/");
    fetch(`http://localhost:5001/api/tickets/${email}`)
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
      <aside className="sidebar">
        <button className="hamburger">☰</button>
        <nav>
          <ul>
            <li className="active">Dashboard ▶</li>
            <li onClick={handleLogout}>Log Out ↗</li>
          </ul>
        </nav>
      </aside>

      <div className="separator" />

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
};

export default UserDashboard;
