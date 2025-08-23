import { FaTrash, FaEdit, FaSpinner } from "react-icons/fa";

const AccountsTable = ({ accounts, accountCategories, onEdit, onDelete, deletingId }) => {
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
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="px-4 py-3 font-medium">Code</th>
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Category</th>
            <th className="px-4 py-3 font-medium">Normal Balance</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account) => (
            <tr key={account.id} className="border-b border-gray-700 hover:bg-gray-750">
              <td className="px-4 py-3 font-mono">{account.account_code}</td>
              <td className="px-4 py-3">
                <div>
                  <div className="font-medium">{account.account_name}</div>
                  {account.description && (
                    <div className="text-xs text-gray-400 mt-1">{account.description}</div>
                  )}
                </div>
              </td>
              <td className="px-4 py-3">
                <span className="px-2 py-1 text-xs rounded-full bg-blue-500 bg-opacity-20 text-white">
                  {accountCategories.find((c) => c.value === account.account_type)?.label}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 text-xs rounded-full text-white ${getBalanceClass(account.account_type)}`}>
                  {accountCategories.find((ac) => ac.value === account.account_type)?.normalBalance || "debit"}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 text-xs text-white rounded-full ${getStatusClass(account.is_active)}`}>
                  {account.is_active ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => onEdit(account)}
                    className="text-blue-400 hover:text-blue-300"
                    disabled={deletingId === account.id}
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => onDelete(account.id)}
                    className="text-red-400 hover:text-red-300 flex items-center"
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
  );
};

export default AccountsTable;
