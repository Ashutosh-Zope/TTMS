import React, { useEffect, useState } from "react";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5001/api";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/users`)
      .then((res) => res.json())
      .then(setUsers)
      .catch(console.error);
  }, []);

  const promote = async (email) => {
    if (!window.confirm(`Promote ${email} to admin?`)) return;
    const res = await fetch(`${API_BASE}/users/promote/${email}`, {
      method: "POST",
    });
    const data = await res.json();
    if (!res.ok) {
      alert(`Error: ${data.message}`);
    } else {
      alert(data.message);
      setUsers((u) => u.filter((x) => x.email !== email));
    }
  };

  const handleDelete = async (email) => {
    if (!window.confirm(`Are you sure you want to delete ${email}?`)) return;
    try {
      const res = await fetch(`${API_BASE}/users/${encodeURIComponent(email)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      alert("User deleted.");
      setUsers((prev) => prev.filter((u) => u.email !== email));
    } catch (err) {
      alert("Failed to delete user: " + err.message);
    }
  };

  return (
    <div className="page-wrapper">
      <h2>View Users</h2>
      <div className="table-wrapper">
        <table className="tickets-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Created At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((u) => (
                <tr key={u.email}>
                  <td>{u.email}</td>
                  <td>{u.name}</td>
                  <td>{u.phone}</td>
                  <td>{new Date(u.createdAt).toLocaleString()}</td>
                  <td style={{ position: "relative" }}>
                    <button
                      onClick={() =>
                        setDropdownVisible(dropdownVisible === u.email ? null : u.email)
                      }
                      style={styles.actionButton}
                    >
                      Actions ⌄
                    </button>

                    {dropdownVisible === u.email && (
                      <div style={styles.dropdownMenu}>
                        <button
                          style={styles.dropdownItem}
                          onClick={() => promote(u.email)}
                        >
                          Promote to Admin
                        </button>
                        <button
                          style={styles.dropdownItem}
                          onClick={() => handleDelete(u.email)}
                        >
                          Delete User
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "1rem" }}>
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  dropdownMenu: {
    position: "absolute",
    top: "100%",
    right: 0,
    backgroundColor: "white",
    border: "1px solid #ddd",
    borderRadius: "6px",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
    zIndex: 10,
  },
  dropdownItem: {
    padding: "0.5rem 1rem",
    width: "100%",
    border: "none",
    backgroundColor: "white",
    cursor: "pointer",
    fontSize: "0.9rem",
    textAlign: "left",
  },
  actionButton: {
    padding: "0.4rem 0.8rem",
    border: "none",
    borderRadius: "6px",
    color: "white",
    backgroundColor: "#3b82f6",
    fontWeight: "600",
    cursor: "pointer",
  },
};
