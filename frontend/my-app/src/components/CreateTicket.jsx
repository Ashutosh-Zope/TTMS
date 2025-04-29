// frontend/src/components/CreateTicket.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5001/api";

export default function CreateTicket() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [status, setStatus] = useState("open");
  const [attachments, setAttachments] = useState([]); 

  const navigate = useNavigate();

  const handleFiles = (e) => {
    setAttachments(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const ticketData = {
        title,
        description,
        priority,
        status,
        userEmail: localStorage.getItem("userEmail"),
        createdAt: new Date().toISOString(),
      };

      const res = await fetch(`${API_BASE}/tickets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ticketData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Could not create ticket");
      }
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <div className="form-container">
      <h2>Create Ticket</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-group">
          <label>Ticket Subject</label>
          <input
            type="text"
            value={title}
            required
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Ticket Description</label>
          <textarea
            value={description}
            required
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
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
          >
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div className="form-group">
          <label>Attachments</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFiles}
          />
        </div>

        <button type="submit">Submit Ticket</button>
        <button type="button" onClick={() => navigate(-1)} className="cancel">
          Cancel
        </button>
      </form>
    </div>
  );
}
