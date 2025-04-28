import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5001/api";

export default function ViewUsers() {
  const [users, setUsers] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null); // 👈 new
  const navigate = useNavigate();
  const email = localStorage.getItem("userEmail");

  // Fetch all users
  useEffect(() => {
    if (!email) {
      navigate("/");
      return;
    }

    fetch(`${API_BASE}/users/users`)
      .then((r) => r.json())
      .then((data) => {
        console.log("👥 Fetched Users:", data);
        setUsers(data);
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

  const deleteUser = async (userEmail) => {
  if (!window.confirm(`Are you sure you want to delete ${userEmail}?`)) return;
  
  try {
    const res = await fetch(`${API_BASE}/users/${encodeURIComponent(userEmail)}`, {
      method: "DELETE",
    });
    const data = await res.json();
    
    if (!res.ok) {
      alert(`Error: ${data.message}`);
    } else {
      alert(data.message);
      setUsers((prevUsers) => prevUsers.filter((user) => user.email !== userEmail));
    }
  } catch (error) {
    console.error("Delete user error:", error);
    alert("Failed to delete user. Try again.");
  }
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
                  <th>Actions</th>
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
                      <div className="dropdown-action">
                        <button
                          className="action-btn"
                          onClick={() => setActiveDropdown(activeDropdown === u.email ? null : u.email)}
                        >
                          Actions ▼
                        </button>
                        {activeDropdown === u.email && (
                          <div className="dropdown-content">
                            <button onClick={() => promote(u.email)}>Promote to Admin</button>
                            <button onClick={() => deleteUser(u.email)}>Delete User</button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center" }}>
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
