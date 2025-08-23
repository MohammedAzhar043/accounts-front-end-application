const RecentTransactions = ({ recentTransactions }) => {
  return (
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
                    {new Date(transaction.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">{transaction.description}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 text-xs rounded-full text-white ${
                        transaction.transaction_type === "debit"
                          ? "bg-red-500 bg-opacity-20 text-red-400"
                          : "bg-green-500 bg-opacity-20 text-green-400"
                      }`}
                    >
                      {transaction.transaction_type}
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
  );
};

export default RecentTransactions;
