import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./components/Login";
import SignUp from "./components/SignUp";
import ForgotPassword from "./components/ForgotPassword";
import UserDashboard from "./components/UserDashboard";
import CreateTicket from "./components/CreateTicket";
import EditTicket from "./components/EditTicket";

import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/create-ticket" element={<CreateTicket />} />
        <Route path="/edit-ticket/:ticketId" element={<EditTicket />} />
      </Routes>
    </Router>
  );
}

export default App;
