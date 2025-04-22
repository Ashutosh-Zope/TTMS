import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

const EditTicket = () => {
  const { ticketId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const email = localStorage.getItem("userEmail");

  // get initial values either from state or from server
  const init = location.state || {};
  const [subject, setSubject] = useState(init.title || "");
  const [description, setDescription] = useState(init.description || "");
  const [priority, setPriority] = useState(init.priority || "medium");
  const [status, setStatus] = useState(init.status || "open");

  useEffect(() => {
    if (!location.state) {
      fetch(`http://localhost:5001/api/tickets/${email}`)
        .then((res) => res.json())
        .then((items) => {
          const t = items.find((x) => x.ticketId === ticketId);
          if (t) {
            setSubject(t.title);
            setDescription(t.description);
            setPriority(t.priority);
            setStatus(t.status);
          }
        })
        .catch(console.error);
    }
  }, [location.state, ticketId, email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title: subject,
      description,
      priority,
      status,
    };
    try {
      const res = await fetch(`http://localhost:5001/api/tickets/${ticketId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(`Error: ${data.message}`);
        return;
      }
      alert("Ticket updated!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Could not update ticket");
    }
  };

  return (
    <div className="form-container">
      <h2>Edit Ticket</h2>
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

        <button type="submit">Update Ticket</button>
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          style={{
            marginTop: "1rem",
            background: "#ccc",
            color: "#333",
            width: "100%",
          }}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EditTicket;
