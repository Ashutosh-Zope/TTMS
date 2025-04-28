import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";


export default function Sidebar({ open, toggle, onLogout, isAdmin = true }) {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(true); // default open

  return (
    <aside className="sidebar">
      <h1> NexTicket </h1>
      {/* Logo */}
      <div className="sidebar-logo">
      <img src="/logo/logo.png" alt="Logo" />
      </div>

      {/* Menu title */}
      <div 
        className="menu-title" 
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        Menu {dropdownOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </div>

      {/* Dropdown items */}
      {dropdownOpen && (
        <ul className="sidebar-menu">
          <li onClick={() => navigate(isAdmin ? "/admin-dashboard" : "/dashboard")}>Dashboard</li>
          {isAdmin && (
            <>
              <li onClick={() => navigate("/all-tickets")}>All Tickets</li>
              <li onClick={() => navigate("/view-users")}>View Users</li>
            </>
          )}
          <li onClick={onLogout}>Logout</li>
        </ul>
      )}
    </aside>
  );
}
