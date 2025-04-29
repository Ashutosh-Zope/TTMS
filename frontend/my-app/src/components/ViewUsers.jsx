// src/components/ViewUsers.jsx
import React, { useEffect, useState } from "react";
<<<<<<< HEAD
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
=======
import { useNavigate }                   from "react-router-dom";
>>>>>>> upstream/main

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5001/api";

export default function ViewUsers() {
<<<<<<< HEAD
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const navigate = useNavigate();
  const email = localStorage.getItem("userEmail");

=======
  const [users, setUsers]           = useState([]);
  const [departments, setDepartments] = useState([]);
  const [menuOpen, setMenuOpen]   = useState(false);
  const navigate                  = useNavigate();
  const email                     = localStorage.getItem("userEmail");

  // Fetch users + departments
>>>>>>> upstream/main
  useEffect(() => {
    if (!email) {
      navigate("/");
      return;
    }
<<<<<<< HEAD
    fetchUsers();
=======

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
>>>>>>> upstream/main
  }, [email, navigate]);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE}/users/users`);
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch users.");
    }
  };

  const promoteUser = async (userEmail) => {
    if (!window.confirm(`Promote ${userEmail} to Admin?`)) return;
    try {
      const res = await fetch(`${API_BASE}/users/promote/${userEmail}`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Promoted successfully!");
        fetchUsers();
      } else {
        toast.error(data.message || "Failed to promote.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error during promotion.");
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
        toast.error(`Error: ${data.message}`);
      } else {
        toast.success(data.message);
        fetchUsers();
      }
    } catch (error) {
      console.error("Delete user error:", error);
      toast.error("Failed to delete user. Try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    navigate("/");
  };

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
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
<<<<<<< HEAD
    <div style={pageWrapperStyle}>
      {/* Sidebar with logout! */}
      <div style={sidebarWrapperStyle}>
        <Sidebar onLogout={handleLogout} isAdmin={true} />
      </div>
=======
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
>>>>>>> upstream/main

      {/* Main content */}
      <div style={contentWrapperStyle}>
        <div style={cardStyle}>
          <h1 style={titleStyle}>View Users</h1>

          <div style={{ overflowX: "auto" }}>
            <table style={tableStyle}>
              <thead style={theadStyle}>
                <tr>
<<<<<<< HEAD
                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>Phone</th>
                  <th style={thStyle}>Created</th>
                  <th style={thStyle}>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.length > 0 ? (
                  currentUsers.map((u) => (
                    <tr key={u.email}>
                      <td style={tdStyle}>{u.name}</td>
                      <td style={tdStyle}>{u.phone}</td>
                      <td style={tdStyle}>
                        {u.createdAt ? new Date(u.createdAt).toLocaleString() : "Invalid Date"}
                      </td>
                      <td style={{ ...tdStyle, textAlign: "center" }}>
                        <button style={promoteButtonStyle} onClick={() => promoteUser(u.email)}>
                          Promote
                        </button>
                        <button
                          style={{ ...promoteButtonStyle, backgroundColor: "#dc3545", marginLeft: "10px" }}
                          onClick={() => deleteUser(u.email)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>
=======
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
>>>>>>> upstream/main
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div style={paginationWrapperStyle}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                style={{
                  ...pageButtonStyle,
                  backgroundColor: currentPage === page ? "#3b4cca" : "#ffffff",
                  color: currentPage === page ? "#ffffff" : "#3b4cca",
                  fontWeight: currentPage === page ? "bold" : "normal",
                  borderColor: "#3b4cca",
                }}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
<<<<<<< HEAD
}

// Same styles as before (no change)


// Styles (same you already had)
const pageWrapperStyle = { minHeight: "100vh", width: "100vw", background: "linear-gradient(to right, #d7f0f7, #c2e9f5)", display: "flex", margin: "0", padding: "0" };
const sidebarWrapperStyle = { width: "300px", background: "white", minHeight: "100vh", boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)", position: "fixed", top: 0, left: 0 };
const contentWrapperStyle = { marginLeft: "300px", flex: 1, padding: "50px", display: "flex", justifyContent: "center", alignItems: "flex-start" };
const cardStyle = { width: "100%", maxWidth: "1500px", background: "#fff", borderRadius: "10px", padding: "25px", boxShadow: "0px 5px 15px rgba(0,0,0,0.2)", height: "100%" };
const titleStyle = { textAlign: "center", marginBottom: "20px", fontSize: "26px", fontWeight: "bold", color: "#333" };
const tableStyle = { width: "100%", borderCollapse: "collapse", overflowX: "auto" };
const theadStyle = { backgroundColor: "#f2f2f2" };
const thStyle = { padding: "10px 12px", borderBottom: "2px solid #ddd", textAlign: "left", fontWeight: "bold", fontSize: "15px" };
const tdStyle = { padding: "10px 12px", borderBottom: "1px solid #eee", fontSize: "14px" };
const promoteButtonStyle = { backgroundColor: "#007bff", color: "white", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", transition: "background-color 0.3s" };
const paginationWrapperStyle = { marginTop: "30px", display: "flex", justifyContent: "center", alignItems: "center", flexWrap: "wrap", gap: "10px", flexDirection: "row" };
const pageButtonStyle = { width: "40px", height: "40px", borderRadius: "16px", border: "2px solid #3b4cca", backgroundColor: "white", color: "#3b4cca", fontWeight: "bold", fontSize: "16px", display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer", transition: "0.3s all ease" };
=======
}
>>>>>>> upstream/main
