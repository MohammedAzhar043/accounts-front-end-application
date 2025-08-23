const DashboardCards = ({ stats }) => {
  const cards = [
    { label: "Total Accounts", value: stats.totalAccounts, color: "blue" },
    { label: "Total Transactions", value: stats.totalTransactions, color: "green" },
    { label: "Journal Entries", value: stats.totalJournalEntries, color: "purple" },
  ];

  return (
    <div className="grid gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card, idx) => (
        <div key={idx} className="bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className={`p-3 rounded-full bg-${card.color}-500 bg-opacity-20`}>
              <div className={`w-6 h-6 text-${card.color}-400`}>⬤</div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">{card.label}</p>
              <p className="text-2xl font-semibold">{card.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;
