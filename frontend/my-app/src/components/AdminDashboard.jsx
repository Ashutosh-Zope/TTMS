// src/components/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const ticketRes = await axios.get("http://localhost:5001/api/tickets/all");
      const userRes = await axios.get("http://localhost:5001/api/users/users");
      setTickets(ticketRes.data);
      setUsers(userRes.data);
    } catch (err) {
      console.error("Error fetching data", err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000); // auto-refresh
    return () => clearInterval(interval);
  }, []);

  const allTickets = tickets.length;
  const activeTickets = tickets.filter(t => t.status === "open" || t.status === "in progress").length;
  const resolvedTickets = tickets.filter(t => t.status === "closed").length;
  const userCount = users.length;

  const handleCardClick = (filterType) => {
    if (filterType === "all") navigate("/all-tickets");
    else if (filterType === "active") navigate("/all-tickets?status=active");
    else if (filterType === "resolved") navigate("/all-tickets?status=closed");
    else if (filterType === "users") navigate("/view-users");
  };

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    navigate("/");
  };

  const statusData = [
    { name: "Open", value: tickets.filter(t => t.status === "open").length },
    { name: "In Progress", value: tickets.filter(t => t.status === "in progress").length },
    { name: "Closed", value: tickets.filter(t => t.status === "closed").length },
  ];

  const priorityData = [
    { name: "High", value: tickets.filter(t => t.priority === "high").length },
    { name: "Medium", value: tickets.filter(t => t.priority === "medium").length },
    { name: "Low", value: tickets.filter(t => t.priority === "low").length },
  ];

  const COLORS = ["#4f46e5", "#10b981", "#ef4444"]; // modern palette

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="menu-container">
          <button className="hamburger" onClick={() => {}} aria-label="Toggle menu">☰</button>
          <ul className="dropdown-menu">
            <li onClick={() => navigate("/admin-dashboard")}>Dashboard ▶</li>
            <li onClick={() => navigate("/all-tickets")}>View All Tickets ▶</li>
            <li onClick={() => navigate("/view-users")}>View Users ▶</li>
            <li onClick={handleLogout}>Log Out ↗</li>
          </ul>
        </div>
      </aside>

      <main className="dashboard-main">
        <div className="header-card">
          <h1>Admin Dashboard</h1>
        </div>

        <div className="stats-grid">
          <div className="stat-card" onClick={() => handleCardClick("all")}>
            <h3>All Tickets</h3>
            <p>{allTickets}</p>
          </div>
          <div className="stat-card" onClick={() => handleCardClick("active")}>
            <h3>Active Tickets</h3>
            <p>{activeTickets}</p>
          </div>
          <div className="stat-card" onClick={() => handleCardClick("resolved")}>
            <h3>Resolved Tickets</h3>
            <p>{resolvedTickets}</p>
          </div>
          <div className="stat-card" onClick={() => handleCardClick("users")}>
            <h3>Users</h3>
            <p>{userCount}</p>
          </div>
        </div>

        <div className="charts-flex">
          <div className="chart-card slide-in">
            <h3>Active Ticket Status</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  isAnimationActive={true}
                  animationDuration={900}
                  animationEasing="ease-out"
                  label
                >
                  {statusData.map((_, index) => (
                    <Cell
                      key={`status-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      style={{ filter: "drop-shadow(0 0 4px rgba(0,0,0,0.1))" }}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card slide-in">
            <h3>Tickets by Priority</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  isAnimationActive={true}
                  animationDuration={900}
                  animationEasing="ease-out"
                  label
                >
                  {priorityData.map((_, index) => (
                    <Cell
                      key={`priority-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      style={{ filter: "drop-shadow(0 0 4px rgba(0,0,0,0.1))" }}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
}
