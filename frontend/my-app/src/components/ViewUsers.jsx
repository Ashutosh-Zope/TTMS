import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5001/api";

export default function ViewUsers() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const navigate = useNavigate();
  const email = localStorage.getItem("userEmail");

  useEffect(() => {
    if (!email) {
      navigate("/");
      return;
    }
    fetchUsers();
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

  return (
    <div style={pageWrapperStyle}>
      {/* Sidebar */}
      <div style={sidebarWrapperStyle}>
        <Sidebar />
      </div>

      {/* Main content */}
      <div style={contentWrapperStyle}>
        <div style={cardStyle}>
          {/* Header */}
          <h1 style={titleStyle}>View Users</h1>

          {/* Table */}
          <div style={{ overflowX: "auto" }}>
            <table style={tableStyle}>
              <thead style={theadStyle}>
                <tr>
                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>Phone</th>
                  <th style={thStyle}>Created</th>
                  <th style={thStyle}>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((u) => (
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
                    </td>
                  </tr>
                ))}
                {currentUsers.length === 0 && (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>
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
  height:"100%"
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
