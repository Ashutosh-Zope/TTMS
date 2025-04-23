import React, { useEffect, useState } from "react";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5001/api";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);

  // fetch all users once on mount
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
      // remove promoted user from the list
      setUsers((u) => u.filter((x) => x.email !== email));
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
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => promote(u.email)}
                    >
                      Promote to Admin
                    </button>
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