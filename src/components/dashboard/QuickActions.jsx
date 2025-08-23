const QuickActions = () => {
  const actions = [
    { label: "Add Transaction", href: "/transactions", color: "blue" },
    { label: "Create Journal Entry", href: "/journal-entries/new", color: "green" },
    { label: "View Reports", href: "/reports", color: "purple" },
    { label: "Manage Accounts", href: "/chart-of-accounts", color: "gray" },
  ];

  return (
    <div className="mt-8 bg-gray-800 p-6 rounded-lg shadow">
      <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, idx) => (
          <a
            key={idx}
            href={action.href}
            className={`bg-${action.color}-500 hover:bg-${action.color}-600 text-white px-4 py-3 rounded-lg transition-colors text-center`}
          >
            {action.label}
          </a>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
