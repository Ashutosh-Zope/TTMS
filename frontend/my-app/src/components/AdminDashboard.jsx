import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";
import StatCard from "./StatCard";
import ChartCard from "./ChartCard";
import "./admin.css"; 

export default function AdminDashboard() {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
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
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    document.body.style.background = "linear-gradient(to bottom right, #7ee8fa, #eec0c6)";
  }, []);
  

  const allTickets = tickets.length;
  const activeTickets = tickets.filter(t => t.status === "open" || t.status === "in progress").length;
  const resolvedTickets = tickets.filter(t => t.status === "closed").length;
  const userCount = users.length;

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

  const COLORS = ["#0e7490", "#22c55e", "#f43f5e"];

  const handleCardClick = (type) => {
    if (type === "all") navigate("/all-tickets");
    else if (type === "active") navigate("/all-tickets?status=active");
    else if (type === "resolved") navigate("/all-tickets?status=closed");
    else if (type === "users") navigate("/view-users");
  };

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      <Sidebar open={sidebarOpen} toggle={() => setSidebarOpen(!sidebarOpen)} onLogout={handleLogout} isAdmin={true} />

      <div className="dashboard-main" style={{ background: "transparent" }}>
        <div className="header-card">
          <h1>Admin Dashboard</h1>
        </div>

        <div className="stats-grid">
          <StatCard title="All Tickets" value={allTickets} onClick={() => handleCardClick("all")} />
          <StatCard title="Active Tickets" value={activeTickets} onClick={() => handleCardClick("active")} />
          <StatCard title="Resolved Tickets" value={resolvedTickets} onClick={() => handleCardClick("resolved")} />
          <StatCard title="Users" value={userCount} onClick={() => handleCardClick("users")} />
        </div>

        <div className="charts-grid">
          <ChartCard title="Ticket Status" data={statusData} colors={COLORS} />
          <ChartCard title="Ticket Priority" data={priorityData} colors={COLORS} />
        </div>
      </div>
    </div>
  );
  
}
