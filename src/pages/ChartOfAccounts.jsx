import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { accountingService } from "../api/services";
import { toast } from "react-hot-toast";
import { FaTrash, FaEdit, FaSearch, FaPlus, FaSpinner } from "react-icons/fa";

const ChartOfAccounts = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [accountTypeFilter, setAccountTypeFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [formData, setFormData] = useState({
    account_code: "",
    account_name: "",
    account_type: "",
    parent_account_id: null,
    description: "",
    is_active: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [navigating, setNavigating] = useState(false);

  // Account categories with their types
  const accountCategories = [
    { value: "Asset", label: "Assets", normalBalance: "debit" },
    { value: "Liability", label: "Liabilities", normalBalance: "credit" },
    { value: "Equity", label: "Equity", normalBalance: "credit" },
    { value: "Revenue", label: "Revenue", normalBalance: "credit" },
    { value: "Expense", label: "Expenses", normalBalance: "debit" },
  ];

  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {
    filterAccounts();
  }, [accounts, searchTerm, accountTypeFilter]);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await accountingService.getChartOfAccounts();
      setAccounts(response.data);
    } catch (error) {
      console.error("Failed to load accounts:", error);
      toast.error("Failed to load accounts");
    } finally {
      setLoading(false);
    }
  };

  const filterAccounts = () => {
    let filtered = [...accounts];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (account) =>
          account.account_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          account.account_code
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (account.description &&
            account.description
              .toLowerCase()
              .includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by account type
    if (accountTypeFilter !== "all") {
      filtered = filtered.filter(
        (account) => account.account_type === accountTypeFilter
      );
    }

    setFilteredAccounts(filtered);
  };

  const handleCreateAccount = () => {
    setEditingAccount(null);
    setFormData({
      account_code: "",
      account_name: "",
      account_type: "",
      parent_account_id: null,
      description: "",
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const handleEditAccount = (account) => {
    setEditingAccount(account);
    setFormData({
      account_code: account.account_code,
      account_name: account.account_name,
      account_type: account.account_type,
      parent_account_id: account.parent_account_id || null,
      description: account.description || "",
      is_active: account.is_active,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      if (editingAccount) {
        await accountingService.updateAccount(editingAccount.id, formData);
        toast.success("Account updated successfully");
      } else {
        await accountingService.createAccount(formData);
        toast.success("Account created successfully");
      }
      setIsModalOpen(false);
      fetchAccounts(); // Refresh the list
    } catch (error) {
      console.error("Failed to save account:", error);
      toast.error(`Failed to ${editingAccount ? "update" : "create"} account`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAccount = async (id) => {
    if (!window.confirm("Are you sure you want to delete this account?"))
      return;

    try {
      setDeletingId(id);
      await accountingService.deleteAccount(id);
      toast.success("Account deleted successfully");
      fetchAccounts(); // Refresh the list
    } catch (error) {
      console.error("Failed to delete account:", error);
      toast.error("Failed to delete account");
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

  const getCategoryLabel = (categoryValue) => {
    const category = accountCategories.find((ac) => ac.value === categoryValue);
    return category ? category.label : categoryValue;
  };

  const getBalanceClass = (accountType) => {
    const category = accountCategories.find((ac) => ac.value === accountType);
    const balanceType = category ? category.normalBalance : "debit";

    return balanceType === "debit"
      ? "bg-green-500 bg-opacity-20 text-green-400"
      : "bg-red-500 bg-opacity-20 text-red-400";
  };

  const getStatusClass = (isActive) => {
    return isActive
      ? "bg-green-500 bg-opacity-20 text-green-400"
      : "bg-gray-500 bg-opacity-20 text-gray-400";
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
            className="block rounded px-3 py-2 bg-gray-700 w-full text-left"
          >
            Accounts
          </button>
          <button
            onClick={() => handleNavigation("/transactions")}
            className="block rounded px-3 py-2 hover:bg-gray-700 w-full text-left"
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
          <h1 className="text-xl font-bold">Chart of Accounts</h1>
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
              Chart of Accounts
            </h2>
            <button
              onClick={handleCreateAccount}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
              disabled={loading}
            >
              {loading ? (
                <FaSpinner className="animate-spin mr-2" />
              ) : (
                <FaPlus className="mr-2" />
              )}
              New Account
            </button>
          </div>

          {/* Filters and Search */}
          <div className="bg-gray-800 p-4 rounded-lg shadow mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    placeholder="Search accounts..."
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
                  Account Type
                </label>
                <select
                  id="typeFilter"
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={accountTypeFilter}
                  onChange={(e) => setAccountTypeFilter(e.target.value)}
                  disabled={loading}
                >
                  <option value="all">All Types</option>
                  {accountCategories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <span className="text-sm text-gray-400">
                  Showing {filteredAccounts.length} of {accounts.length}{" "}
                  accounts
                </span>
              </div>
            </div>
          </div>

          {/* Accounts Table */}
          <div className="bg-gray-800 p-6 rounded-lg shadow">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <FaSpinner className="animate-spin text-4xl text-blue-500" />
              </div>
            ) : filteredAccounts.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="px-4 py-3 font-medium">Code</th>
                      <th className="px-4 py-3 font-medium">Name</th>
                      <th className="px-4 py-3 font-medium">Category</th>
                      <th className="px-4 py-3 font-medium">Normal Balance</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAccounts.map((account) => (
                      <tr
                        key={account.id}
                        className="border-b border-gray-700 hover:bg-gray-750"
                      >
                        <td className="px-4 py-3 font-mono">
                          {account.account_code}
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <div className="font-medium">
                              {account.account_name}
                            </div>
                            {account.description && (
                              <div className="text-xs text-gray-400 mt-1">
                                {account.description}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 text-xs rounded-full bg-blue-500 bg-opacity-20 text-white">
                            {getCategoryLabel(account.account_type)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 text-xs rounded-full   text-white ${getBalanceClass(
                              account.account_type
                            )}`}
                          >
                            {accountCategories.find(
                              (ac) => ac.value === account.account_type
                            )?.normalBalance || "debit"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 text-xs   text-white rounded-full ${getStatusClass(
                              account.is_active
                            )}`}
                          >
                            {account.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleEditAccount(account)}
                              className="text-blue-400 hover:text-blue-300"
                              title="Edit"
                              disabled={deletingId === account.id}
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDeleteAccount(account.id)}
                              className="text-red-400 hover:text-red-300 flex items-center"
                              title="Delete"
                              disabled={deletingId === account.id}
                            >
                              {deletingId === account.id ? (
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
                {accounts.length === 0 ? (
                  <div>
                    <p className="mb-4">
                      No accounts found. Create your first account to get
                      started.
                    </p>
                    <button
                      onClick={handleCreateAccount}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Create Account
                    </button>
                  </div>
                ) : (
                  "No accounts match your search criteria."
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Account Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">
                {editingAccount ? "Edit Account" : "Create New Account"}
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Account Code
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.account_code}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          account_code: e.target.value,
                        })
                      }
                      disabled={submitting}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Account Name
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.account_name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          account_name: e.target.value,
                        })
                      }
                      disabled={submitting}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Category
                    </label>
                    <select
                      required
                      className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.account_type}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          account_type: e.target.value,
                        })
                      }
                      disabled={submitting}
                    >
                      <option value="">Select Category</option>
                      {accountCategories.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Description
                    </label>
                    <textarea
                      className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="3"
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
                      Status
                    </label>
                    <select
                      className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.is_active}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          is_active: e.target.value === "true",
                        })
                      }
                      disabled={submitting}
                    >
                      <option value={true}>Active</option>
                      <option value={false}>Inactive</option>
                    </select>
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
                    ) : editingAccount ? (
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

export default ChartOfAccounts;