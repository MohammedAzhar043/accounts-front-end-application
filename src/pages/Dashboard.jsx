
import React, { useState, useEffect } from "react";
import { useDashboard } from "../hooks/useDashboard";
import Sidebar from "../components/dashboard/Sidebar";
import DashboardCards from "../components/dashboard/DashboardCards";
import RecentTransactions from "../components/dashboard/RecentTransactions";
import QuickActions from "../components/dashboard/QuickActions";
import { FaSpinner } from "react-icons/fa";

const Dashboard = () => {
  const { isOpen, setIsOpen, currentUser, logout, stats, recentTransactions } =
    useDashboard();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Show spinner for 1.5 seconds every time dashboard mounts
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <FaSpinner className="animate-spin text-5xl text-blue-500" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <Sidebar
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        currentUser={currentUser}
      />

      {/* Main Content */}
      <div className="flex flex-1 flex-col lg:ml-0">
        {/* Topbar */}
        <header className="flex items-center justify-between bg-gray-800 p-4 shadow">
          <button
            className="lg:hidden text-gray-300"
            onClick={() => setIsOpen(!isOpen)}
          >
            ☰
          </button>
          <h1 className="text-xl font-bold">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span>Welcome, {currentUser?.username}</span>
            <button
              onClick={logout}
              className="rounded-md bg-red-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-400 focus:outline-2 focus:outline-red-500"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6">
          {/* <h2 className="text-2xl font-semibold mb-6">
            Welcome, {currentUser?.username} 👋
          </h2> */}

          <DashboardCards stats={stats} />
          <RecentTransactions recentTransactions={recentTransactions} />
          <QuickActions />
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Dashboard;
