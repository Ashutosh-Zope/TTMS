import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5001/api";

export default function AllTickets() {
  const [, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [ticketsPerPage] = useState(10);
  const [modalTicket, setModalTicket] = useState(null);
  const [priorityFilter, setPriorityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const navigate = useNavigate();
  const email = localStorage.getItem("userEmail");

  useEffect(() => {
    if (!email) {
      navigate("/");
      return;
    }
    fetch(`${API_BASE}/tickets/all`)
      .then((r) => r.json())
      .then((data) => {
        setTickets(data);
        setFilteredTickets(data);
      })
      .catch(console.error);
  }, [email, navigate]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortedTickets = () => {
    let sortableTickets = [...filteredTickets];

    if (priorityFilter) {
      sortableTickets = sortableTickets.filter(
        (ticket) => ticket.priority?.toLowerCase() === priorityFilter
      );
    }
    if (statusFilter) {
      sortableTickets = sortableTickets.filter(
        (ticket) => ticket.status?.toLowerCase() === statusFilter
      );
    }
    if (searchTerm) {
  sortableTickets = sortableTickets.filter((ticket) =>
    ticket.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );
}


    if (sortConfig.key) {
      sortableTickets.sort((a, b) => {
        const aValue = (a[sortConfig.key] || "").toString().toLowerCase();
        const bValue = (b[sortConfig.key] || "").toString().toLowerCase();
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return sortableTickets;
  };

  const sortedTickets = getSortedTickets();
  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = sortedTickets.slice(indexOfFirstTicket, indexOfLastTicket);
  const totalPages = Math.ceil(sortedTickets.length / ticketsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleUpdate = (ticket) => {
  const role = localStorage.getItem("userRole");
  const path = `/edit-ticket/${ticket.ticketId}`;
  navigate(path, { state: ticket });
};

  const handleDelete = async (ticketId) => {
  if (!window.confirm("Are you sure you want to delete this ticket?")) return;

  try {
    const res = await fetch(`${API_BASE}/tickets/${ticketId}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Delete failed");

    // Remove deleted ticket from state
    setFilteredTickets(prev => prev.filter(ticket => ticket.ticketId !== ticketId));
    alert("Ticket deleted successfully");
  } catch (err) {
    console.error(err);
    alert("Failed to delete ticket");
  }
};



  const renderSortArrow = (key) => {
    if (sortConfig.key !== key) return null;
    if (sortConfig.direction === "asc") return " ▲";
    if (sortConfig.direction === "desc") return " ▼";
  };

  const handleLogout = () => {
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userRole");
  navigate("/");
  };
  
  const [openDropdownId, setOpenDropdownId] = useState(null);

  return (
    <div style={styles.pageWrapper}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <Sidebar onLogout={handleLogout} isAdmin={localStorage.getItem("userRole") === "admin"} />

      </div>

      {/* Main Content */}
      <main style={styles.mainContent}>
        <h1 style={styles.title}>Ticket Management</h1>

        {/* Filters */}
        <section style={styles.filterSection}>
          <select value={priorityFilter} onChange={(e) => { setPriorityFilter(e.target.value); setCurrentPage(1); }} style={styles.select}>
            <option value="">Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }} style={styles.select}>
            <option value="">Status</option>
            <option value="open">Open</option>
            <option value="in progress">In Progress</option>
            <option value="closed">Closed</option>
          </select>

          <input
  type="text"
  placeholder="Search by title..."
  value={searchTerm}
  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
  style={styles.searchInput}
/>

        </section>

        {/* Table */}
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader} onClick={() => handleSort('ticketId')}>Ticket ID{renderSortArrow('ticketId')}</th>
                <th style={styles.tableHeader} onClick={() => handleSort('title')}>Title{renderSortArrow('title')}</th>
                <th style={styles.tableHeader} onClick={() => handleSort('priority')}>Priority{renderSortArrow('priority')}</th>
                <th style={styles.tableHeader} onClick={() => handleSort('status')}>Status{renderSortArrow('status')}</th>
                <th style={styles.tableHeader} onClick={() => handleSort('createdAt')}>Created At{renderSortArrow('createdAt')}</th>
                <th style={styles.tableHeader}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentTickets.map(ticket => (
                <tr key={ticket.ticketId}>
                  <td style={styles.cell}>
                    <span style={styles.link} onClick={() => setModalTicket(ticket)}>
                      {ticket.ticketId}
                    </span>
                  </td>
                  <td style={styles.cell}>{ticket.title || "N/A"}</td>
                  <td style={styles.cell}>
                    <span style={{ ...styles.priorityBadge, ...priorityBadgeStyle(ticket.priority) }}>
                      {ticket.priority || "N/A"}
                    </span>
                  </td>
                  <td style={styles.cell}>{ticket.status || "N/A"}</td>
                  <td style={styles.cell}>{ticket.createdAt?.slice(0, 10) || "N/A"}</td>
                  <td style={styles.cell}>
  <div style={{ position: "relative", display: "inline-block" }}>
    <button
      style={styles.actionButton}
      onClick={() =>
        setOpenDropdownId(openDropdownId === ticket.ticketId ? null : ticket.ticketId)
      }
    >
      ⋮
    </button>

    {openDropdownId === ticket.ticketId && (
      <div style={styles.dropdownMenu}>
        <button
          style={styles.dropdownItem}
          onClick={() => handleUpdate(ticket)}
        >
          Edit
        </button>
        <button
          style={{ ...styles.dropdownItem, color: "red" }}
          onClick={() => handleDelete(ticket.ticketId)}
        >
          Delete
        </button>
      </div>
    )}
  </div>
</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={styles.pagination}>
          {Array.from({ length: totalPages }, (_, idx) => (
            <button
              key={idx}
              onClick={() => paginate(idx + 1)}
              style={{
                ...styles.pageButton,
                ...(currentPage === idx + 1 ? styles.activePage : {})
              }}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        {/* Modal */}
        {modalTicket && (
          <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
              <h2>Ticket Details</h2>
              <p><b>ID:</b> {modalTicket.ticketId}</p>
              <p><b>Title:</b> {modalTicket.title}</p>
              <p><b>Priority:</b> {modalTicket.priority}</p>
              <p><b>Status:</b> {modalTicket.status}</p>
              <p><b>Created At:</b> {modalTicket.createdAt?.slice(0, 10)}</p>
              <button style={styles.closeButton} onClick={() => setModalTicket(null)}>Close</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// 🎨 Styles
const styles = {
  pageWrapper: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f1f5f9",
  },
  sidebar: {
    width: "250px",
    backgroundColor: "white",
    boxShadow: "2px 0 10px rgba(0,0,0,0.1)",
  },
  mainContent: {
    flex: 1,
    padding: "2rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "600",
    marginBottom: "1.5rem",
    color: "#1e293b",
  },
  filterSection: {
    display: "flex",
    gap: "1rem",
    marginBottom: "1.5rem",
    width: "100%",
    maxWidth: "1200px",
    flexWrap: "wrap",
    backgroundColor: "white",
    padding: "1rem",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  select: {
    flex: 1,
    padding: "0.6rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  searchInput: {
    flex: 2,
    padding: "0.6rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  tableWrapper: {
    width: "100%",
    maxWidth: "1200px",
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  tableHeader: {
    backgroundColor: "#1d4ed8",
    color: "white",
    padding: "0.8rem",
    textAlign: "center",
    fontSize: "0.9rem",
    cursor: "pointer",
  },
  cell: {
    padding: "0.8rem",
    textAlign: "center",
    fontSize: "0.9rem",
    borderBottom: "1px solid #eee",
  },
  link: {
    color: "#3b82f6",
    cursor: "pointer",
    textDecoration: "underline",
  },
  updateButton: {
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    padding: "0.4rem 0.8rem",
    borderRadius: "6px",
    cursor: "pointer",
  },
  pagination: {
  marginTop: "2rem",
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  gap: "0.4rem",
  flexWrap: "nowrap",
},
  pageButton: {
  padding: "4px 10px",
  minWidth: "auto",
  height: "30px",
  borderRadius: "6px",
  border: "1px solid #3b82f6",
  backgroundColor: "white",
  color: "#3b82f6",
  fontWeight: "500",
  fontSize: "14px",
  cursor: "pointer",
  transition: "all 0.2s ease-in-out",
},
  activePage: {
    backgroundColor: "#3b82f6",
    color: "white",
    border: "1px solid #3b82f6",
  },
  modalOverlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: "2rem",
    borderRadius: "12px",
    width: "90%",
    maxWidth: "450px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
  },
  closeButton: {
    marginTop: "1rem",
    backgroundColor: "#ef4444",
    color: "white",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "8px",
    cursor: "pointer",
  },
  priorityBadge: {
    display: "inline-block",
    padding: "0.3rem 0.6rem",
    borderRadius: "8px",
    fontSize: "0.8rem",
    fontWeight: "500",
  },
  
  actionButton: {
  backgroundColor: "#3b82f6",
  color: "white",
  border: "none",
  padding: "5px 10px",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "16px",
},

dropdownMenu: {
  position: "absolute",
  top: "100%",
  right: 0,
  backgroundColor: "#fff",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
  borderRadius: "6px",
  zIndex: 100,
  display: "flex",
  flexDirection: "column",
},

dropdownItem: {
  padding: "8px 12px",
  backgroundColor: "white",
  border: "none",
  textAlign: "left",
  cursor: "pointer",
  fontSize: "14px",
  minWidth: "100px",
},

};

const priorityBadgeStyle = (priority) => ({
  backgroundColor: priority === "low" ? "#22c55e" : priority === "medium" ? "#facc15" : "#ef4444",
  color: priority === "medium" ? "black" : "white",
});
