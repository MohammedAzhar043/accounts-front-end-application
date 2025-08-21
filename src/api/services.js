import api from "./api";

export const accountingService = {
  // Chart of Accounts
  getChartOfAccounts: (params) => api.get("/chart-of-accounts", { params }),
  getAccount: (id) => api.get(`/chart-of-accounts/${id}`),
  createAccount: (data) => api.post("/chart-of-accounts", data),
  updateAccount: (id, data) => api.put(`/chart-of-accounts/${id}`, data),
  deleteAccount: (id) => api.delete(`/chart-of-accounts/${id}`),

  // Transactions
  getTransactions: (params) => api.get("/transactions", { params }),
  getTransaction: (id) => api.get(`/transactions/${id}`),
  createTransaction: (data) => api.post("/transactions", data),
  updateTransaction: (id, data) => api.put(`/transactions/${id}`, data),
  deleteTransaction: (id) => api.delete(`/transactions/${id}`),

  // Journal Entries
  getJournalEntries: (params) => api.get("/journal-entries", { params }),
  getJournalEntry: (id) => api.get(`/journal-entries/${id}`),
  createJournalEntry: (data) => api.post("/journal-entries", data),
  updateJournalEntry: (id, data) => api.put(`/journal-entries/${id}`, data),
  deleteJournalEntry: (id) => api.delete(`/journal-entries/${id}`),

  // Reports
  getTrialBalance: (asOfDate) => 
    api.get(`/reports/trial-balance?as_of_date=${asOfDate}`),
  getIncomeStatement: (startDate, endDate) => 
    api.get(`/reports/income-statement?start_date=${startDate}&end_date=${endDate}`),
  getBalanceSheet: (asOfDate) => 
    api.get(`/reports/balance-sheet?as_of_date=${asOfDate}`),
};

export const authService = {
  login: (credentials) => api.post("/login", credentials),
  getMe: () => api.get("/me"),
  changePassword: (data) => api.post("/change-password", data),
  refreshToken: (refreshToken) => api.post("/refresh", { refresh_token: refreshToken }),
};

export const userService = {
  getUsers: (params) => api.get("/users", { params }),
  getUser: (id) => api.get(`/users/${id}`),
  createUser: (data) => api.post("/users", data),
  updateUser: (id, data) => api.put(`/users/${id}`, data),
  deleteUser: (id) => api.delete(`/users/${id}`),
};