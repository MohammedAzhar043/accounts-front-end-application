import { useState, useEffect } from "react";
import { accountingService } from "../api/services";
import { toast } from "react-hot-toast";

export const useAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [accountTypeFilter, setAccountTypeFilter] = useState("all");

  const accountCategories = [
    { value: "Asset", label: "Assets", normalBalance: "debit" },
    { value: "Liability", label: "Liabilities", normalBalance: "credit" },
    { value: "Equity", label: "Equity", normalBalance: "credit" },
    { value: "Revenue", label: "Revenue", normalBalance: "credit" },
    { value: "Expense", label: "Expenses", normalBalance: "debit" },
  ];

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

  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {
    let filtered = [...accounts];

    if (searchTerm) {
      filtered = filtered.filter(
        (account) =>
          account.account_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          account.account_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (account.description &&
            account.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (accountTypeFilter !== "all") {
      filtered = filtered.filter((account) => account.account_type === accountTypeFilter);
    }

    setFilteredAccounts(filtered);
  }, [accounts, searchTerm, accountTypeFilter]);

  return {
    accounts,
    filteredAccounts,
    loading,
    searchTerm,
    setSearchTerm,
    accountTypeFilter,
    setAccountTypeFilter,
    fetchAccounts,
    accountCategories,
  };
};
