import { Routes, Route, useLocation } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Navbar from "../components/Navbar";
import ProtectedRoute from "../components/ProtectedRoute";
import ChartOfAccounts from "../pages/ChartOfAccounts";
import Transactions from "../pages/Transactions";
import Reports from "../pages/Reports";
import { useState } from "react";

const Layout = () => {
  const location = useLocation();
  

  // Hide navbar on dashboard and accounting pages
  const hideNavbar =
    location.pathname === "/dashboard" ||
    location.pathname.startsWith("/chart-of-accounts") ||
    location.pathname.startsWith("/transactions") ||
    location.pathname.startsWith("/reports") ||
    location.pathname.startsWith("/journal-entries");

  return (
    <>
    
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard  />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chart-of-accounts"
          element={
            <ProtectedRoute>
              <ChartOfAccounts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <Transactions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

export default Layout;
