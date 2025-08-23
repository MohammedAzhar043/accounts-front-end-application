const Sidebar = ({ isOpen, setIsOpen, currentUser }) => {
  return (
    <aside
      className={`fixed inset-y-0 left-0 w-64 bg-gray-800 transform ${
        isOpen ? "translate-x-0" : "-translate-x-64"
      } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:w-64 z-50`}
    >
      <div className="p-4 text-2xl font-bold border-b border-gray-700">
        Accounting
      </div>
      <nav className="p-4 space-y-2">
        <a href="/dashboard" className="block rounded px-3 py-2 bg-gray-700">
          Dashboard
        </a>
        <a href="/chart-of-accounts" className="block rounded px-3 py-2 hover:bg-gray-700">
          Accounts
        </a>
        <a href="/transactions" className="block rounded px-3 py-2 hover:bg-gray-700">
          Transactions
        </a>
        <a href="/journal-entries" className="block rounded px-3 py-2 hover:bg-gray-700">
          Journal Entries
        </a>
        <a href="/reports" className="block rounded px-3 py-2 hover:bg-gray-700">
          Reports
        </a>
        {currentUser?.is_superuser && (
          <>
            <a href="/users" className="block rounded px-3 py-2 hover:bg-gray-700">
              Users
            </a>
            <a href="/roles" className="block rounded px-3 py-2 hover:bg-gray-700">
              Roles
            </a>
          </>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
