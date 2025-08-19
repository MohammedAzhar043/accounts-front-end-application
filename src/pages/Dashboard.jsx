import React, { useState } from "react";

const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-gray-800 transform ${
          isOpen ? "translate-x-0" : "-translate-x-64"
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:w-64`}
      >
        <div className="p-4 text-2xl font-bold border-b border-gray-700">
          Accounting
        </div>
        <nav className="p-4 space-y-2">
          <a href="/dashboard" className="block rounded px-3 py-2 hover:bg-gray-700">
            Dashboard
          </a>
          <a href="/accounts" className="block rounded px-3 py-2 hover:bg-gray-700">
            Accounts
          </a>
          <a href="/transactions" className="block rounded px-3 py-2 hover:bg-gray-700">
            Transactions
          </a>
          <a href="/journal_entries" className="block rounded px-3 py-2 hover:bg-gray-700">
            Journal Entries
          </a>
          <a href="/reports" className="block rounded px-3 py-2 hover:bg-gray-700">
            Reports
          </a>
          <a href="/users" className="block rounded px-3 py-2 hover:bg-gray-700">
            Users
          </a>
          <a href="/roles" className="block rounded px-3 py-2 hover:bg-gray-700">
            Roles
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Topbar */}
        <header className="flex items-center justify-between bg-gray-800 p-4 shadow">
          <button
            className="lg:hidden text-gray-300"
            onClick={() => setIsOpen(!isOpen)}
          >
            ☰
          </button>
          <h1 className="text-xl font-bold">Dashboard</h1>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
            className="rounded-md bg-red-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-400 focus:outline-2 focus:outline-red-500"
          >
            Logout
          </button>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6">
          <h2 className="text-2xl font-semibold mb-4">Welcome, Azhar 👋</h2>

          {/* Dashboard Cards */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-bold">Total Accounts</h3>
              <p className="mt-2 text-3xl">12</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-bold">Total Transactions</h3>
              <p className="mt-2 text-3xl">154</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-bold">Pending Approvals</h3>
              <p className="mt-2 text-3xl">3</p>
            </div>
          </div>

          {/* Recent Transactions Table */}
          <div className="mt-8 bg-gray-800 p-6 rounded-lg shadow overflow-x-auto">
            <h3 className="text-lg font-bold mb-4">Recent Transactions</h3>
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Account</th>
                  <th className="px-4 py-2">Type</th>
                  <th className="px-4 py-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-700">
                  <td className="px-4 py-2">2025-08-18</td>
                  <td className="px-4 py-2">Cash</td>
                  <td className="px-4 py-2">Credit</td>
                  <td className="px-4 py-2">$500</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="px-4 py-2">2025-08-17</td>
                  <td className="px-4 py-2">Bank</td>
                  <td className="px-4 py-2">Debit</td>
                  <td className="px-4 py-2">$1200</td>
                </tr>
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
