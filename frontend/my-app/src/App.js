// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import ForgotPassword from "./components/ForgotPassword";
import CreateTicket from "./components/CreateTicket";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* ─── Nav Bar ───────────────────────────────────────────── */}
        <nav className="nav-bar">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/create-ticket" className="nav-link">
            <button className="nav-button">Create Ticket</button>
          </Link>
        </nav>

        {/* ─── Route Definitions ─────────────────────────────────── */}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/create-ticket" element={<CreateTicket />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
