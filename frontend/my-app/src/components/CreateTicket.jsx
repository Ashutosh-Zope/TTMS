// frontend/my-app/src/components/CreateTicket.jsx
import React, { useState } from "react";

const CreateTicket = () => {
  const [subject, setSubject] = useState("");
  const [severity, setSeverity] = useState("low");
  const [department, setDepartment] = useState("support");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // prepare form data
    const formData = new FormData();
    formData.append("subject", subject);
    formData.append("severity", severity);
    formData.append("department", department);
    formData.append("description", description);
    if (file) formData.append("attachment", file);

    try {
      const res = await fetch("http://localhost:5001/api/tickets", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        alert(`Ticket created: ${data.ticketId}`);
        // reset form
        setSubject("");
        setSeverity("low");
        setDepartment("support");
        setDescription("");
        setFile(null);
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred creating the ticket.");
    }
  };

  return (
    <div className="form-container">
      <h2>Create New Ticket</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-group">
          <label>Ticket Subject</label>
          <input
            type="text"
            placeholder="Enter subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Ticket Severity</label>
          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        <div className="form-group">
          <label>Target Department</label>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          >
            <option value="support">Support</option>
            <option value="engineering">Engineering</option>
            <option value="sales">Sales</option>
            <option value="hr">Human Resources</option>
          </select>
        </div>

        <div className="form-group">
          <label>Description (brief)</label>
          <textarea
            placeholder="Enter a brief description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            required
          />
        </div>

        <div className="form-group">
          <label>Attach File</label>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        </div>

        <button type="submit">Submit Ticket</button>
      </form>
    </div>
  );
};

export default CreateTicket;
