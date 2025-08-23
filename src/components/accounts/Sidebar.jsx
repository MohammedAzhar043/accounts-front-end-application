const Sidebar = ({ isOpen, handleNavigation, currentUser }) => {
  return (
    <aside
      className={`fixed inset-y-0 left-0 w-64 bg-gray-800 transform ${
        isOpen ? "translate-x-0" : "-translate-x-64"
      } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:w-64 z-40`}
    >
      <div className="p-4 text-2xl font-bold border-b border-gray-700">Accounting</div>
      <nav className="p-4 space-y-2">
        <button onClick={() => handleNavigation("/dashboard")} className="block rounded px-3 py-2 hover:bg-gray-700 w-full text-left">
          Dashboard
        </button>
        <button onClick={() => handleNavigation("/chart-of-accounts")} className="block rounded px-3 py-2 bg-gray-700 w-full text-left">
          Accounts
        </button>
        <button onClick={() => handleNavigation("/transactions")} className="block rounded px-3 py-2 hover:bg-gray-700 w-full text-left">
          Transactions
        </button>
        <button onClick={() => handleNavigation("/journal-entries")} className="block rounded px-3 py-2 hover:bg-gray-700 w-full text-left">
          Journal Entries
        </button>
        <button onClick={() => handleNavigation("/reports")} className="block rounded px-3 py-2 hover:bg-gray-700 w-full text-left">
          Reports
        </button>
        {currentUser?.is_superuser && (
          <>
            <button onClick={() => handleNavigation("/users")} className="block rounded px-3 py-2 hover:bg-gray-700 w-full text-left">
              Users
            </button>
            <button onClick={() => handleNavigation("/roles")} className="block rounded px-3 py-2 hover:bg-gray-700 w-full text-left">
              Roles
            </button>
          </>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
