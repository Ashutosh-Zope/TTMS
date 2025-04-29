// src/components/ViewUsers.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5001/api";

export default function ViewUsers() {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  // const [menuOpen, setMenuOpen] = useState(false);
  const usersPerPage = 10;
  const navigate = useNavigate();
  const email = localStorage.getItem("userEmail");

  useEffect(() => {
    if (!email) {
      navigate("/");
      return;
    }
    fetchUsers();
    fetchDepartments();
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

  const fetchDepartments = async () => {
    try {
      const res = await fetch(`${API_BASE}/users/departments`);
      const data = await res.json();
      setDepartments(data);
    } catch (error) {
      console.error(error);
    }
  };

  const promoteUser = async (userEmail) => {
  if (!window.confirm(`Promote ${userEmail} to Admin?`)) return;
  try {
    const res = await fetch(`${API_BASE}/users/promote/${encodeURIComponent(userEmail)}`, {
      method: "POST",
    });
    const data = await res.json();
    if (res.ok) {
      toast.success(data.message || "Promoted successfully!");
      fetchUsers(); // Refresh the user list after promotion
    } else {
      toast.error(data.message || "Failed to promote.");
    }
  } catch (error) {
    console.error("Promote user error:", error);
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
      fetchUsers(); // Refresh list
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

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div style={pageWrapperStyle}>
      {/* Sidebar */}
      <div style={sidebarWrapperStyle}>
        <Sidebar onLogout={handleLogout} isAdmin={true} />
      </div>

      <div style={contentWrapperStyle}>
        <div style={cardStyle}>
          <h1 style={titleStyle}>View Users</h1>

          <div style={{ overflowX: "auto" }}>
            <table style={tableStyle}>
              <thead style={theadStyle}>
                <tr>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>Phone</th>
                  <th style={thStyle}>Created</th>
                  <th style={thStyle}>Departments</th>
                  <th style={thStyle}>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.length > 0 ? (
                  currentUsers.map((u) => (
                    <tr key={u.email}>
                      <td style={tdStyle}>{u.email}</td>
                      <td style={tdStyle}>{u.name}</td>
                      <td style={tdStyle}>{u.phone}</td>
                      <td style={tdStyle}>
                        {u.createdAt ? new Date(u.createdAt).toLocaleString() : "Invalid Date"}
                      </td>
                      <td style={tdStyle}>
                        <select
                          value={u.departmentIds?.[0] || ""}
                          onChange={e => updateDepartments(u.email, [e.target.value])}
                          style={{ padding: "5px", borderRadius: "6px" }}
                        >
                          <option value="" disabled>Select department…</option>
                          {departments.map((d) => (
                            <option key={d.departmentId} value={d.departmentId}>
                              {d.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td style={tdStyle}>
  <div style={{ position: "relative", display: "inline-block" }}>
    <button
      style={dropdownButtonStyle}
      onClick={() =>
        setUsers(prev =>
          prev.map(user =>
            user.email === u.email
              ? { ...user, showDropdown: !user.showDropdown }
              : { ...user, showDropdown: false }
          )
        )
      }
    >
      Actions ⌄
    </button>
    {u.showDropdown && (
      <div style={dropdownMenuStyle}>
        <button style={dropdownItemStyle} onClick={() => promoteUser(u.email)}>Promote</button>
        <button style={{ ...dropdownItemStyle, color: "#dc3545" }} onClick={() => deleteUser(u.email)}>Delete</button>
      </div>
    )}
  </div>
</td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
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
}

// 🎨 Styles
const pageWrapperStyle = {
  minHeight: "100vh",
  width: "100vw",
  background: "linear-gradient(to right, #d7f0f7, #c2e9f5)",
  display: "flex",
  margin: "0",
  padding: "0",
};

const sidebarWrapperStyle = {
  width: "300px",
  background: "white",
  minHeight: "100vh",
  boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
  position: "fixed",
  top: 0,
  left: 0,
};

const contentWrapperStyle = {
  marginLeft: "300px",
  flex: 1,
  padding: "50px",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
};

const cardStyle = {
  width: "100%",
  maxWidth: "1500px",
  background: "#fff",
  borderRadius: "10px",
  padding: "25px",
  boxShadow: "0px 5px 15px rgba(0,0,0,0.2)",
  height: "100%",
};

const titleStyle = {
  textAlign: "center",
  marginBottom: "20px",
  fontSize: "26px",
  fontWeight: "bold",
  color: "#333",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  overflowX: "auto",
};

const theadStyle = {
  backgroundColor: "#f2f2f2",
};

const thStyle = {
  padding: "10px 12px",
  borderBottom: "2px solid #ddd",
  textAlign: "left",
  fontWeight: "bold",
  fontSize: "15px",
};

const tdStyle = {
  padding: "10px 12px",
  borderBottom: "1px solid #eee",
  fontSize: "14px",
};

const promoteButtonStyle = {
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  padding: "8px 16px",
  borderRadius: "6px",
  cursor: "pointer",
  transition: "background-color 0.3s",
};

const paginationWrapperStyle = {
  marginTop: "30px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "10px",
  flexDirection: "row",
};

const pageButtonStyle = {
  width: "40px",
  height: "40px",
  borderRadius: "16px",
  border: "2px solid #3b4cca",
  backgroundColor: "white",
  color: "#3b4cca",
  fontWeight: "bold",
  fontSize: "16px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  cursor: "pointer",
  transition: "0.3s all ease",
};

const dropdownButtonStyle = {
  backgroundColor: "#3b4cca",
  color: "white",
  border: "none",
  padding: "6px 14px",
  borderRadius: "6px",
  cursor: "pointer",
};

const dropdownMenuStyle = {
  position: "absolute",
  top: "110%",
  right: 0,
  backgroundColor: "#fff",
  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  borderRadius: "6px",
  zIndex: 10,
  display: "flex",
  flexDirection: "column",
  width: "130px",
};

const dropdownItemStyle = {
  padding: "10px",
  background: "white",
  border: "none",
  textAlign: "left",
  fontSize: "14px",
  cursor: "pointer",
  borderBottom: "1px solid #eee",
};


