// src/components/ViewUsers.jsx
import React, { useEffect, useState } from "react";
import { useNavigate }                   from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5001/api";

export default function ViewUsers() {
  const [users, setUsers]           = useState([]);
  const [departments, setDepartments] = useState([]);
  const [menuOpen, setMenuOpen]   = useState(false);
  const navigate                  = useNavigate();
  const email                     = localStorage.getItem("userEmail");

  // Fetch users + departments
  useEffect(() => {
    if (!email) {
      navigate("/");
      return;
    }

    // 1. Users
    fetch(`${API_BASE}/users/users`)
      .then((r) => r.json())
      .then((data) => {
        console.log("👥 Fetched Users:", data);
        setUsers(data);
      })
      .catch(console.error);

    // 2. Departments
    fetch(`${API_BASE}/users/departments`)
      .then((r) => r.json())
      .then((data) => {
        console.log("🏷️ Fetched Departments:", data);
        setDepartments(data);
      })
      .catch(console.error);
  }, [email, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    navigate("/");
  };

  const promote = async (userEmail) => {
    if (!window.confirm(`Promote ${userEmail} to admin?`)) return;
    const res = await fetch(`${API_BASE}/users/promote/${userEmail}`, {
      method: "POST",
    });
    const data = await res.json();
    if (!res.ok) {
      alert(`Error: ${data.message}`);
    } else {
      alert(data.message);
      setUsers((u) => u.filter((x) => x.email !== userEmail));
    }
  };

  const updateDepartments = async (userEmail, newDeptIds) => {
    try {
      const res = await fetch(
        `${API_BASE}/users/departments/${userEmail}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ departmentIds: newDeptIds }),
        }
      );
      if (!res.ok) throw new Error("Failed updating departments");
      // Reflect change locally
      setUsers((u) =>
        u.map((x) =>
          x.email === userEmail ? { ...x, departmentIds: newDeptIds } : x
        )
      );
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
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

      {/* Main */}
      <div className="main">
        <div className="header-card">
          <h1>View Users</h1>
        </div>
        <div className="content-card">
          <div className="table-wrapper">
            <table className="tickets-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Created</th>
                  <th>Departments</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.email}>
                    <td>{u.email}</td>
                    <td>{u.name}</td>
                    <td>{u.phone}</td>
                    <td>{new Date(u.createdAt).toLocaleString()}</td>
                    <td>
                      <select
                        value={u.departmentIds?.[0] || ""}
                        onChange={e => updateDepartments(u.email, [e.target.value])}
                        style={{
                          minWidth: "150px",
                          padding: "0.5rem",
                          borderRadius: "8px",
                          border: "1px solid var(--border-light)",
                          backgroundColor: "var(--input-bg)"
                        }}
                      >
                        <option value="" disabled>
                          Select department…
                        </option>
                        {departments.map((d) => (
                          <option
                            key={d.departmentId}
                            value={d.departmentId}
                          >
                            {d.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <button
                        className="edit-btn"
                        onClick={() => promote(u.email)}
                      >
                        Promote to Admin
                      </button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center" }}>
                      No users found.
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