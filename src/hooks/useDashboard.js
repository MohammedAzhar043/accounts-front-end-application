import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { accountingService } from "../api/services";
import { toast } from "react-hot-toast";

export const useDashboard = () => {
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
      const [accountsRes, transactionsRes, journalEntriesRes, recentRes] =
        await Promise.all([
          accountingService.getChartOfAccounts(),
          accountingService.getTransactions(),
          accountingService.getJournalEntries(),
          accountingService.getTransactions({ limit: 5 }),
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

  return { isOpen, setIsOpen, currentUser, logout, stats, recentTransactions };
};
