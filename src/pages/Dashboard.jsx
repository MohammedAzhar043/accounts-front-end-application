import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { accountingService } from "../api/services";
import { toast } from "react-hot-toast";

const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const [stats, setStats] = useState({
    totalAccounts: 0,
    totalTransactions: 0,
    totalJournalEntries: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch all data in parallel
      const [accountsRes, transactionsRes, journalEntriesRes, recentRes] = await Promise.all([
        accountingService.getChartOfAccounts(),
        accountingService.getTransactions(),
        accountingService.getJournalEntries(),
        accountingService.getTransactions({ limit: 5 })
      ]);

      setStats({
        totalAccounts: accountsRes.data.length,
        totalTransactions: transactionsRes.data.length,
        totalJournalEntries: journalEntriesRes.data.length,
      });

      setRecentTransactions(recentRes.data);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      toast.error("Failed to load dashboard data");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-gray-800 transform ${
          isOpen ? "translate-x-0" : "-translate-x-64"
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:w-64 z-50`}
      >
        <div className="p-4 text-2xl font-bold border-b border-gray-700">
          Accounting
        </div>
        <nav className="p-4 space-y-2">
          <a href="/dashboard" className="block rounded px-3 py-2 bg-gray-700">
            Dashboard
          </a>
          <a href="/chart-of-accounts" className="block rounded px-3 py-2 hover:bg-gray-700">
            Accounts
          </a>
          <a href="/transactions" className="block rounded px-3 py-2 hover:bg-gray-700">
            Transactions
          </a>
          <a href="/journal-entries" className="block rounded px-3 py-2 hover:bg-gray-700">
            Journal Entries
          </a>
          <a href="/reports" className="block rounded px-3 py-2 hover:bg-gray-700">
            Reports
          </a>
          {currentUser?.is_superuser && (
            <>
              <a href="/users" className="block rounded px-3 py-2 hover:bg-gray-700">
                Users
              </a>
              <a href="/roles" className="block rounded px-3 py-2 hover:bg-gray-700">
                Roles
              </a>
            </>
          )}
        </nav>
      </aside>

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
          <h2 className="text-2xl font-semibold mb-6">Welcome, {currentUser?.username} 👋</h2>

          {/* Dashboard Cards */}
          <div className="grid gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-gray-800 p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-500 bg-opacity-20">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Total Accounts</p>
                  <p className="text-2xl font-semibold">{stats.totalAccounts}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-500 bg-opacity-20">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Total Transactions</p>
                  <p className="text-2xl font-semibold">{stats.totalTransactions}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-500 bg-opacity-20">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Journal Entries</p>
                  <p className="text-2xl font-semibold">{stats.totalJournalEntries}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Transactions Table */}
          <div className="bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-bold mb-4">Recent Transactions</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">Description</th>
                    <th className="px-4 py-2">Type</th>
                    <th className="px-4 py-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.length > 0 ? (
                    recentTransactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b border-gray-700">
                        <td className="px-4 py-2">
                          {new Date(transaction.transaction_date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2">{transaction.description}</td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            transaction.type === 'debit' 
                              ? 'bg-red-500 bg-opacity-20 text-red-400' 
                              : 'bg-green-500 bg-opacity-20 text-green-400'
                          }`}>
                            {transaction.type}
                          </span>
                        </td>
                        <td className="px-4 py-2">${transaction.amount}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-4 py-4 text-center text-gray-500">
                        No transactions found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <a
                href="/transactions/new"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg transition-colors text-center"
              >
                Add Transaction
              </a>
              <a
                href="/journal-entries/new"
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg transition-colors text-center"
              >
                Create Journal Entry
              </a>
              <a
                href="/reports"
                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-3 rounded-lg transition-colors text-center"
              >
                View Reports
              </a>
              <a
                href="/chart-of-accounts"
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg transition-colors text-center"
              >
                Manage Accounts
              </a>
            </div>
          </div>
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