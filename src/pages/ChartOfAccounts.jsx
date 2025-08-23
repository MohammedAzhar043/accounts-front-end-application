// src/components/accounts/ChartOfAccounts.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import { FaPlus, FaSpinner } from "react-icons/fa";

import Sidebar from "../components/accounts/Sidebar";
import Filters from "../components/accounts/Filters";
import AccountsTable from "../components/accounts/AccountsTable";
import AccountModal from "../components/accounts/AccountModal";

import { useAccounts } from "../hooks/useAccounts";
import { accountingService } from "../api/services";

const ChartOfAccounts = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, logout } = useAuth();

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

  const {
    accounts,
    filteredAccounts,
    loading,
    searchTerm,
    setSearchTerm,
    accountTypeFilter,
    setAccountTypeFilter,
    fetchAccounts,
    accountCategories,
  } = useAccounts();

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
      await fetchAccounts(); // Refresh list
    } catch (error) {
      console.error("Failed to save account:", error);
      toast.error(`Failed to ${editingAccount ? "update" : "create"} account`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAccount = async (id) => {
    if (!window.confirm("Are you sure you want to delete this account?")) return;
    try {
      setDeletingId(id);
      await accountingService.deleteAccount(id);
      toast.success("Account deleted successfully");
      await fetchAccounts(); // Refresh list
    } catch (error) {
      console.error("Failed to delete account:", error);
      toast.error("Failed to delete account");
    } finally {
      setDeletingId(null);
    }
  };

  const handleNavigation = (path) => {
    setNavigating(true);
    setTimeout(() => {
      window.location.href = path;
    }, 500);
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Global Loading Overlay (navigation) */}
      {navigating && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="flex flex-col items-center">
            <FaSpinner className="animate-spin text-4xl text-blue-500 mb-2" />
            <p>Loading...</p>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <Sidebar
        isOpen={isOpen}
        handleNavigation={handleNavigation}
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

          {/* Filters */}
          <Filters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            accountTypeFilter={accountTypeFilter}
            setAccountTypeFilter={setAccountTypeFilter}
            accountCategories={accountCategories}
            accounts={accounts}
            filteredAccounts={filteredAccounts}
            loading={loading}
          />

          {/* Accounts Table / Empty States */}
          <div className="bg-gray-800 p-6 rounded-lg shadow">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <FaSpinner className="animate-spin text-4xl text-blue-500" />
              </div>
            ) : filteredAccounts.length > 0 ? (
              <AccountsTable
                accounts={filteredAccounts}
                accountCategories={accountCategories}
                onEdit={handleEditAccount}
                onDelete={handleDeleteAccount}
                deletingId={deletingId}
              />
            ) : (
              <div className="text-center py-8 text-gray-100">
                {accounts.length === 0 ? (
                  <div>
                    <p className="mb-4">
                      No accounts found. Create your first account to get started.
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
      <AccountModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        submitting={submitting}
        editingAccount={editingAccount}
        accountCategories={accountCategories}
      />

      {/* Overlay for mobile sidebar */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default ChartOfAccounts;
