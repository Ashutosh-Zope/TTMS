// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Auth
import AuthPage from "./components/AuthPage";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword"; 

// User
import UserDashboard from "./components/UserDashboard";
import CreateTicket from "./components/CreateTicket";
import EditTicket from "./components/EditTicket";

// Admin
import AdminDashboard from "./components/AdminDashboard";
import AllTickets from "./components/AllTickets";
import ViewUsers from "./components/ViewUsers";

import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* Split‐screen login/sign‐up */}
        <Route path="/" element={<AuthPage />} />

        {/* Stand‐alone routes in case you need them */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* User flows */}
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/create-ticket" element={<CreateTicket />} />
        <Route path="/edit-ticket/:ticketId" element={<EditTicket />} />

        {/* Admin flows */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/all-tickets" element={<AllTickets />} />
        <Route path="/view-users" element={<ViewUsers />} />
      </Routes>
    </Router>
  );
}

export default App; 