import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { accountingService } from "../api/services";
import { toast } from "react-hot-toast";
import { FaTrash, FaEdit, FaSearch, FaPlus, FaSpinner } from "react-icons/fa";

const Transactions = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [accountFilter, setAccountFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState({
    startDate: "",
    endDate: ""
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [formData, setFormData] = useState({
    account_id: "",
    transaction_type: "debit",
    amount: "",
    description: "",
    reference: "",
    journal_entry_id: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [navigating, setNavigating] = useState(false);

  // Transaction types
  const transactionTypes = [
    { value: "debit", label: "Debit" },
    { value: "credit", label: "Credit" }
  ];

  useEffect(() => {
    fetchTransactions();
    fetchAccounts();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [transactions, searchTerm, typeFilter, accountFilter, dateFilter]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      
      // Build query params based on filters
      const params = {};
      if (typeFilter !== "all") params.transaction_type = typeFilter;
      if (accountFilter !== "all") params.account_id = accountFilter;
      if (dateFilter.startDate) params.start_date = dateFilter.startDate;
      if (dateFilter.endDate) params.end_date = dateFilter.endDate;
      
      const response = await accountingService.getTransactions(params);
      setTransactions(response.data || []);
    } catch (error) {
      console.error("Failed to load transactions:", error);
      toast.error("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  const fetchAccounts = async () => {
    try {
      const response = await accountingService.getChartOfAccounts();
      // Check if response has a data property that contains the array
      setAccounts(response.data || response);
    } catch (error) {
      console.error("Failed to load accounts:", error);
      toast.error("Failed to load accounts");
      setAccounts([]); // Ensure it's always an array
    }
  };

  const filterTransactions = () => {
    let filtered = [...transactions];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (transaction) =>
          transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          transaction.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (getAccountName(transaction.account_id) || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTransactions(filtered);
  };

  const handleCreateTransaction = () => {
    setEditingTransaction(null);
    setFormData({
      account_id: "",
      transaction_type: "debit",
      amount: "",
      description: "",
      reference: "",
      journal_entry_id: ""
    });
    setIsModalOpen(true);
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      account_id: transaction.account_id,
      transaction_type: transaction.transaction_type,
      amount: transaction.amount,
      description: transaction.description,
      reference: transaction.reference || "",
      journal_entry_id: transaction.journal_entry_id || ""
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      
      // Prepare the data to send
      const dataToSend = {
        ...formData,
        amount: parseFloat(formData.amount),
        account_id: parseInt(formData.account_id),
        journal_entry_id: formData.journal_entry_id ? parseInt(formData.journal_entry_id) : null
      };
      
      // For new transactions, add created_at with current date
      if (!editingTransaction) {
        dataToSend.created_at = new Date().toISOString();
      }

      if (editingTransaction) {
        await accountingService.updateTransaction(editingTransaction.id, dataToSend);
        toast.success("Transaction updated successfully");
      } else {
        await accountingService.createTransaction(dataToSend);
        toast.success("Transaction created successfully");
      }
      setIsModalOpen(false);
      fetchTransactions(); // Refresh the list
    } catch (error) {
      console.error("Failed to save transaction:", error);
      toast.error(`Failed to ${editingTransaction ? "update" : "create"} transaction`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?"))
      return;

    try {
      setDeletingId(id);
      await accountingService.deleteTransaction(id);
      toast.success("Transaction deleted successfully");
      fetchTransactions(); // Refresh the list
    } catch (error) {
      console.error("Failed to delete transaction:", error);
      toast.error("Failed to delete transaction");
    } finally {
      setDeletingId(null);
    }
  };

  const handleNavigation = (path) => {
    setNavigating(true);
    // Simulate navigation delay
    setTimeout(() => {
      window.location.href = path;
    }, 500);
  };

  const getAccountName = (accountId) => {
    const account = accounts.find(a => a.id === accountId);
    return account ? `${account.account_code} - ${account.account_name}` : "Unknown Account";
  };

  const getTypeClass = (type) => {
    return type === "debit" 
      ? "bg-blue-500 bg-opacity-20 text-blue-400" 
      : "bg-green-500 bg-opacity-20 text-green-400";
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleDateFilterChange = (e) => {
    const { name, value } = e.target;
    setDateFilter(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyDateFilter = () => {
    fetchTransactions(); // Refetch with date filters
  };

  const clearDateFilter = () => {
    setDateFilter({
      startDate: "",
      endDate: ""
    });
    fetchTransactions(); // Refetch without date filters
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Global Loading Overlay */}
      {navigating && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="flex flex-col items-center">
            <FaSpinner className="animate-spin text-4xl text-blue-500 mb-2" />
            <p>Loading...</p>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-gray-800 transform ${
          isOpen ? "translate-x-0" : "-translate-x-64"
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:w-64 z-40`}
      >
        <div className="p-4 text-2xl font-bold border-b border-gray-700">
          Accounting
        </div>
        <nav className="p-4 space-y-2">
          <button
            onClick={() => handleNavigation("/dashboard")}
            className="block rounded px-3 py-2 hover:bg-gray-700 w-full text-left"
          >
            Dashboard
          </button>
          <button
            onClick={() => handleNavigation("/chart-of-accounts")}
            className="block rounded px-3 py-2 hover:bg-gray-700 w-full text-left"
          >
            Accounts
          </button>
          <button
            onClick={() => handleNavigation("/transactions")}
            className="block rounded px-3 py-2 bg-gray-700 w-full text-left"
          >
            Transactions
          </button>
          <button
            onClick={() => handleNavigation("/journal-entries")}
            className="block rounded px-3 py-2 hover:bg-gray-700 w-full text-left"
          >
            Journal Entries
          </button>
          <button
            onClick={() => handleNavigation("/reports")}
            className="block rounded px-3 py-2 hover:bg-gray-700 w-full text-left"
          >
            Reports
          </button>
          {currentUser?.is_superuser && (
            <>
              <button
                onClick={() => handleNavigation("/users")}
                className="block rounded px-3 py-2 hover:bg-gray-700 w-full text-left"
              >
                Users
              </button>
              <button
                onClick={() => handleNavigation("/roles")}
                className="block rounded px-3 py-2 hover:bg-gray-700 w-full text-left"
              >
                Roles
              </button>
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
          <h1 className="text-xl font-bold">Transactions</h1>
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
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h2 className="text-2xl font-semibold mb-4 md:mb-0">
              Transaction History
            </h2>
            <button
              onClick={handleCreateTransaction}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
              disabled={loading}
            >
              {loading ? (
                <FaSpinner className="animate-spin mr-2" />
              ) : (
                <FaPlus className="mr-2" />
              )}
              New Transaction
            </button>
          </div>

          {/* Filters and Search */}
          <div className="bg-gray-800 p-4 rounded-lg shadow mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label
                  htmlFor="search"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Search
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="search"
                    placeholder="Search transactions..."
                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    disabled={loading}
                  />
                  <FaSearch className="absolute left-3 top-3 text-gray-400" />
                </div>
              </div>
              <div>
                <label
                  htmlFor="typeFilter"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Type
                </label>
                <select
                  id="typeFilter"
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  disabled={loading}
                >
                  <option value="all">All Types</option>
                  {transactionTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="accountFilter"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Account
                </label>
                <select
                  id="accountFilter"
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={accountFilter}
                  onChange={(e) => setAccountFilter(e.target.value)}
                  disabled={loading}
                >
                  <option value="all">All Accounts</option>
                  {accounts && accounts.map && accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.account_code} - {account.account_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-end ">
                <span className="text-sm text-gray-400">
                  Showing {filteredTransactions.length} of {transactions.length}{" "}
                  transactions
                </span>
              </div>
            </div>
            
            {/* Date Filter */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-700">
              <div>
                <label
                  htmlFor="startDate"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={dateFilter.startDate}
                  onChange={handleDateFilterChange}
                  disabled={loading}
                />
              </div>
              <div>
                <label
                  htmlFor="endDate"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={dateFilter.endDate}
                  onChange={handleDateFilterChange}
                  disabled={loading}
                />
              </div>
              <div className="flex items-end space-x-2">
                <button
                  onClick={applyDateFilter}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                  disabled={loading}
                >
                  Apply Filter
                </button>
                <button
                  onClick={clearDateFilter}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                  disabled={loading}
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="bg-gray-800 p-6 rounded-lg shadow">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <FaSpinner className="animate-spin text-4xl text-blue-500" />
              </div>
            ) : filteredTransactions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="px-4 py-3 font-medium">Date</th>
                      <th className="px-4 py-3 font-medium">Description</th>
                      <th className="px-4 py-3 font-medium">Account</th>
                      <th className="px-4 py-3 font-medium">Type</th>
                      <th className="px-4 py-3 font-medium">Amount</th>
                      <th className="px-4 py-3 font-medium">Reference</th>
                      <th className="px-4 py-3 font-medium">Journal Entry ID</th>
                      <th className="px-4 py-3 font-medium text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((transaction) => (
                      <tr
                        key={transaction.id}
                        className="border-b border-gray-700 hover:bg-gray-750"
                      >
                        <td className="px-4 py-3">
                          {formatDate(transaction.created_at)}
                        </td>
                        <td className="px-4 py-3">
                          {transaction.description}
                        </td>
                        <td className="px-4 py-3">
                          {getAccountName(transaction.account_id)}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 text-white rounded-full ${getTypeClass(
                              transaction.transaction_type
                            )}`}
                          >
                            {transaction.transaction_type}
                          </span>
                        </td>
                        <td className={`px-4 py-3 font-medium ${
                          transaction.transaction_type === "credit" 
                            ? "text-green-400" 
                            : "text-blue-400"
                        }`}>
                          {formatCurrency(transaction.amount)}
                        </td>
                        <td className="px-4 py-3 text-gray-400">
                          {transaction.reference || "-"}
                        </td>
                        <td className="px-4 py-3 text-gray-400">
                          {transaction.journal_entry_id || "-"}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleEditTransaction(transaction)}
                              className="text-blue-400 hover:text-blue-300"
                              title="Edit"
                              disabled={deletingId === transaction.id}
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDeleteTransaction(transaction.id)}
                              className="text-red-400 hover:text-red-300 flex items-center"
                              title="Delete"
                              disabled={deletingId === transaction.id}
                            >
                              {deletingId === transaction.id ? (
                                <FaSpinner className="animate-spin" />
                              ) : (
                                <FaTrash />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-100">
                {transactions.length === 0 ? (
                  <div>
                    <p className="mb-4">
                      No transactions found. Create your first transaction to get
                      started.
                    </p>
                    <button
                      onClick={handleCreateTransaction}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Create Transaction
                    </button>
                  </div>
                ) : (
                  "No transactions match your search criteria."
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Transaction Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">
                {editingTransaction ? "Edit Transaction" : "Create New Transaction"}
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Account
                    </label>
                    <select
                      required
                      className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.account_id}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          account_id: e.target.value,
                        })
                      }
                      disabled={submitting}
                    >
                      <option value="">Select Account</option>
                      {accounts && accounts.map && accounts.map((account) => (
                        <option key={account.id} value={account.id}>
                          {account.account_code} - {account.account_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Type
                    </label>
                    <select
                      required
                      className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.transaction_type}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          transaction_type: e.target.value,
                        })
                      }
                      disabled={submitting}
                    >
                      {transactionTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Amount
                    </label>
                    <input
                      type="number"
                      required
                      step="0.01"
                      min="0"
                      className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.amount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          amount: e.target.value,
                        })
                      }
                      disabled={submitting}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Description
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      disabled={submitting}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Reference
                    </label>
                    <input
                      type="text"
                      className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.reference}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          reference: e.target.value,
                        })
                      }
                      disabled={submitting}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Journal Entry ID
                    </label>
                    <input
                      type="number"
                      className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.journal_entry_id}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          journal_entry_id: e.target.value,
                        })
                      }
                      disabled={submitting}
                      placeholder="Optional"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    className="px-4 py-2 text-gray-300 hover:text-white"
                    onClick={() => setIsModalOpen(false)}
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center justify-center min-w-[80px]"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <FaSpinner className="animate-spin" />
                    ) : editingTransaction ? (
                      "Update"
                    ) : (
                      "Create"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Overlay for mobile sidebar */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Transactions;